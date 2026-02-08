FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r /usr/local/lib/python3.11/site-packages -r /usr/local/bin -p /app/requirements.txt

# Copy application code
COPY src/ ./src

# Expose port (default 8000, can be overridden by PORT env var)
EXPOSE ${PORT:-8000}

# Run the application
CMD uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8000}
