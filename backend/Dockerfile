# Use a slim Python image to minimize size
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements file
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

#  Remove unnecessary caches after installing dependencies to keep the image clean.
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY backend/app.py .
COPY backend/utils.py .

# Expose the port (optional, for documentation)
EXPOSE 8000

# Command to run the application with hot reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
