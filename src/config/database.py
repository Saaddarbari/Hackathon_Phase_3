from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from typing import AsyncGenerator
from src.config.settings import settings

# Create async engine for PostgreSQL
database_url = str(settings.database_url)
# Ensure async driver is used (convert if needed)
# Ensure async driver is used (convert if needed)
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://")

# Clean up URL for asyncpg compatibility
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
parsed = urlparse(database_url)
query = parse_qs(parsed.query)
query.pop('sslmode', None)
query.pop('channel_binding', None)

# Add ssl=require if it was a neon url (common for this project)
if "neon.tech" in database_url:
    query['ssl'] = ['require']

new_query = urlencode(query, doseq=True)
database_url = urlunparse(parsed._replace(query=new_query))

engine = create_async_engine(
    database_url,
    echo=False,  # Set to True for SQL query debugging
    future=True,
)

# Create async session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    async with async_session_maker() as session:
        yield session


async def init_db():
    """Initialize database (create all tables)."""
    from sqlmodel import SQLModel
    from src.models import user, todo

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
