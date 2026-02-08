"""Add messages table

Revision ID: 0003_add_messages
Revises: 0002_add_conversations
Create Date: 2026-02-08 15:31:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers, used by Alembic.
revision = '0003_add_messages'
down_revision = '0002_add_conversations'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create messages table."""
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('conversations.id'), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('tool_calls', postgresql.JSON(), nullable=True),
    )

    # Create indexes for fast message queries
    op.create_index('ix_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('ix_messages_timestamp', 'messages', ['timestamp'])


def downgrade() -> None:
    """Drop messages table."""
    op.drop_index('ix_messages_timestamp', table_name='messages')
    op.drop_index('ix_messages_conversation_id', table_name='messages')
    op.drop_table('messages')
