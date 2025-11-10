from fastapi import APIRouter, HTTPException, status
from app.models import KissflowResponse, ItemRequest, ErrorResponse
from app.services.kissflow_service import kissflow_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/qsr", tags=["QSR"])


@router.post("/fetch-data", response_model=KissflowResponse)
async def fetch_qsr_data(request: ItemRequest):
    """
    Fetch QSR data from Kissflow for a given item ID.
    Returns mock data if Kissflow credentials are not configured.
    """
    try:
        logger.info(f"Received request to fetch data for item: {request.item_id}")
        
        # Validate item ID format
        if not request.item_id.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item ID is required"
            )
        
        if not request.item_id.startswith("KFF-"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Item ID format. Must start with 'KFF-'"
            )
        
        # Check if using mock data
        if not kissflow_service.has_credentials:
            logger.info("Using mock data - Kissflow credentials not configured")
        
        # Fetch data from Kissflow (or mock data)
        result = kissflow_service.fetch_qsr_data(request.item_id)
        
        logger.info(f"Successfully processed request for item: {request.item_id}")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error processing request for item {request.item_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch data: {str(e)}"
        )


@router.get("/status")
async def get_status():
    """
    Get backend status including credential configuration
    """
    return {
        "status": "healthy",
        "service": "QSR Backend API",
        "version": "1.0.0",
        "kissflow_configured": kissflow_service.has_credentials,
        "data_source": "kissflow" if kissflow_service.has_credentials else "mock"
    }

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "QSR Backend API",
        "version": "1.0.0"
    }