#!/usr/bin/env python3
"""
Entry point for running the QSR Automation Backend API
"""

if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"🚀 Starting QSR Backend API...")
    print(f"📍 Server: http://{host}:{port}")
    print(f"📚 Docs: http://{host}:{port}/docs")
    print(f"🔧 Debug Mode: {debug}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )