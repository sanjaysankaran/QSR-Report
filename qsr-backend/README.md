# QSR Automation Backend API

A FastAPI backend service that handles Kissflow API integration for the QSR (Quality Summary Report) automation system.

## Features

- **Kissflow API Integration**: Proxy requests to Kissflow API to avoid CORS issues
- **Data Mapping**: Maps Kissflow data structure to QSR format
- **Field Validation**: Identifies missing fields for manual entry
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for frontend integration

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

**Option A: With Kissflow Credentials (Production)**
Edit `.env` with your actual Kissflow credentials:

```env
# Kissflow API Configuration
KISSFLOW_BASE_URL=https://work.kissflow.com/case/2/AcFlqmVfTZ1X_CP008/Kissflow_Product_Features/view/Apps_Team
KISSFLOW_ACCESS_KEY_ID=your-actual-access-key-id
KISSFLOW_ACCESS_KEY_SECRET=your-actual-access-key-secret

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Option B: Without Credentials (Development with Mock Data)**
You can run the backend without any Kissflow credentials - it will automatically use mock data:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# No Kissflow credentials needed - will use mock data
```

### 3. Run the Server

#### Development Mode
```bash
python run.py
```

#### Production Mode
```bash
pip install gunicorn
gunicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
- **GET** `/health` - Health check endpoint
- **GET** `/` - Root endpoint with API info
- **GET** `/api/v1/qsr/status` - Get backend status and data source info

### QSR Data
- **POST** `/api/v1/qsr/fetch-data` - Fetch QSR data from Kissflow (or mock data)

#### Request Body
```json
{
  "item_id": "KFF-0111"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "FeatureName": "Flow Lock - Concurrent edit prevention",
    "TeamName": "Apps",
    "QuarterRelease": "Q3 2025",
    // ... other QSR fields
  },
  "missingFields": ["env", "URL", "PRNumber", ...]
}
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
qsr-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app configuration
│   ├── models.py            # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── qsr.py           # QSR API endpoints
│   └── services/
│       ├── __init__.py
│       └── kissflow_service.py  # Kissflow API integration
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── run.py                  # Development server entry point
└── README.md              # This file
```

## Development

### Adding New Endpoints

1. Create or modify files in `app/routers/`
2. Add new models in `app/models.py` if needed
3. Register routers in `app/main.py`

### Logging

The application uses Python's built-in logging. Logs include:
- Request/response information
- Error details
- Kissflow API interactions

### Error Handling

- HTTP 400: Invalid request (e.g., malformed Item ID)
- HTTP 500: Server errors (e.g., Kissflow API failures)
- Automatic fallback and retry logic where appropriate

## Deployment

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "run.py"]
```

### Environment Variables for Production

Ensure these are set in your production environment:
- `KISSFLOW_ACCESS_KEY_ID`
- `KISSFLOW_ACCESS_KEY_SECRET`
- `FRONTEND_URL` (your production frontend URL)
- `HOST=0.0.0.0`
- `PORT=8000`
- `DEBUG=False`