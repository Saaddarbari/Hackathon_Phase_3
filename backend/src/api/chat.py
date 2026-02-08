"""
Chat API Endpoint

This module implements the single chat endpoint for Phase III.

Constitutional Compliance:
- Single endpoint: POST /api/{user_id}/chat
- All user interactions flow through this endpoint
- Server remains stateless across requests
- Conversation history reconstructed from database on every request
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from datetime import datetime
import logging
import os

from src.api.schemas.chat import ChatRequest, ChatResponse
from src.api.dependencies import get_current_user, get_db
from src.models.user import User
from src.models.conversation import Conversation
from src.models.message import Message
from src.services.agent import AgentService
from src.mcp.server import MCPServer
from src.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


def get_agent_service(db: AsyncSession = Depends(get_db)) -> AgentService:
    """
    Dependency to create Agent service instance.

    Constitutional Compliance:
    - Agent service is stateless
    - Created fresh for each request
    """
    cohere_api_key = settings.cohere_api_key
    if not cohere_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cohere API key not configured"
        )

    mcp_server = MCPServer(db_session=db)
    return AgentService(
        cohere_api_key=cohere_api_key,
        mcp_server=mcp_server,
        db_session=db
    )


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: UUID,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    agent: AgentService = Depends(get_agent_service)
) -> ChatResponse:
    """
    Single chat endpoint for all user interactions.

    Constitutional Compliance - Stateless Conversation Cycle:
    1. Receive user message
    2. Fetch conversation history from database
    3. Append new user message to history
    4. Run AI agent with MCP tools
    5. Persist assistant response to database
    6. Return response to client

    The server MUST NOT retain any memory between requests.

    Args:
        user_id: User UUID from path parameter
        request: Chat request with message and optional conversation_id
        current_user: Authenticated user from dependency
        db: Database session
        agent: Agent service instance

    Returns:
        ChatResponse with assistant's response and conversation ID

    Raises:
        HTTPException: If user is not authorized or request fails
    """
    logger.info(f"Chat request from user {user_id}: {request.message[:50]}...")

    # Verify user is authorized (user_id matches authenticated user)
    if current_user.id != user_id:
        logger.warning(f"Unauthorized chat attempt: user {current_user.id} tried to access user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's chat"
        )

    try:
        # Step 1: Get or create conversation
        conversation_id = request.conversation_id
        if conversation_id:
            # Load existing conversation
            conversation = await db.get(Conversation, conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found"
                )
            logger.info(f"Continuing conversation {conversation_id}")
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            db.add(conversation)
            await db.commit()
            await db.refresh(conversation)
            conversation_id = conversation.id
            logger.info(f"Created new conversation {conversation_id}")

        # Step 2: Fetch conversation history from database
        conversation_history = await agent.load_conversation_history(conversation_id)

        # Step 3: Persist user message to database
        user_message = Message(
            conversation_id=conversation_id,
            role="user",
            content=request.message,
            timestamp=datetime.utcnow()
        )
        db.add(user_message)
        await db.commit()
        logger.info(f"Persisted user message to conversation {conversation_id}")

        # Step 4: Execute agent with MCP tools
        assistant_response = await agent.execute_agent(
            user_message=request.message,
            conversation_history=conversation_history,
            user_id=user_id
        )

        # Step 5: Persist assistant response to database
        assistant_message = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=assistant_response,
            timestamp=datetime.utcnow()
        )
        db.add(assistant_message)

        # Update conversation updated_at timestamp
        conversation.updated_at = datetime.utcnow()
        db.add(conversation)

        await db.commit()
        logger.info(f"Persisted assistant response to conversation {conversation_id}")

        # Step 6: Return response to client
        return ChatResponse(
            response=assistant_response,
            conversation_id=conversation_id,
            timestamp=assistant_message.timestamp
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        import traceback
        print(f"Error processing chat request: {e}")
        print(traceback.format_exc())
        logger.error(f"Error processing chat request: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred processing your message. Please try again."
        )
