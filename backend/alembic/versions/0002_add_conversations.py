"""Add conversations table

Revision ID: 0002_add_conversations
Revises: 0001
Create Date: 2026-02-08 15:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers, used by Alembic.
revision = '0002_add_conversations'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create conversations table."""
    op.create_table(
        'conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('user.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    # Create index on user_id for fast conversation lookups by user
    op.create_index('ix_conversations_user_id', 'conversations', ['user_id'])


def downgrade() -> None:
    """Drop conversations table."""
    op.drop_index('ix_conversations_user_id', table_name='conversations')
    op.drop_table('conversations')
