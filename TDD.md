# Technical Design Document (TDD) - QSR Automation Portal

This document outlines the technical architecture and implementation plan for the Quality Summary Report (QSR) Automation Portal.

---

## 1. High-Level Architecture

The application follows a **frontend-backend architecture** with a FastAPI backend serving as a proxy to the Kissflow API to resolve CORS issues.

```
+------------------------+          +--------------------+          +-----------------+
|                        |          |                    |          |                 |
|   Next.js Frontend     |--(1)---->|  FastAPI Backend   |--(2)---->|  Kissflow API   |
| (User Interface)       |          | (API Proxy +       |          | (Data Source)   |
|                        |<--(4)----|  Business Logic)   |<--(3)----|                 |
+------------------------+          +--------------------+          +-----------------+
```

**Data Flow:**
1.  The user provides a Kissflow **Item ID** and clicks "Fetch Data".
2.  Frontend calls the FastAPI backend at `POST /api/v1/qsr/fetch-data` with the Item ID.
3.  Backend authenticates with Kissflow API using stored credentials (`X-Access-Key-Id` and `X-Access-Key-Secret`).
4.  Backend receives the response, maps the data to QSR fields, identifies `missingFields`, and returns to frontend.
5.  If there are `missingFields`, the frontend displays the manual entry form and the process pauses, awaiting user input.
6.  The user fills the required fields and proceeds to generate the report.
7.  The user selects an **Export Format** and clicks "Download Report". The frontend generates the document client-side (both PDF and DOCX) and triggers the download.

**Advantages of Backend Architecture:**
- ✅ **CORS Resolution**: No more browser CORS errors
- ✅ **Security**: API credentials stored server-side only
- ✅ **Mock Data Fallback**: Automatic fallback when credentials unavailable
- ✅ **Error Handling**: Centralized error handling and logging
- ✅ **Rate Limiting**: Can implement rate limiting if needed

---

## 2. Frontend Architecture (Next.js)

The frontend will be a single-page application built with Next.js and React, using TypeScript for type safety and Tailwind CSS for styling.

### 2.1 Component Structure

The UI will be broken down into the following key components:

-   **`QsrGeneratorPage.tsx` (Main Page):**
    -   The primary component that holds the application state.
    -   Manages the overall layout (header, preview panel, config panel).
    -   Contains the core logic for the entire generation workflow.
-   **`ConfigPanel.tsx` (Right Panel):**
    -   Contains the input field for the Kissflow **Item ID**.
    -   Renders the `MissingFieldsForm.tsx` component when needed.
    -   Contains the **"Generate Report"** button.
    -   Contains the **"Export Format"** dropdown and the disabled/enabled **"Download Report"** button.
-   **`MissingFieldsForm.tsx`:**
    -   Dynamically generates input fields based on the data returned from the backend.
    -   Appears only when the API response indicates that some fields are missing.
-   **`PreviewPanel.tsx` (Left Panel):**
    -   Displays a rich HTML preview of the live-generated QSR report.

### 2.2 State Management

We will use React's built-in `useState` hook to manage the application's state. The main state object in `QsrGeneratorPage.tsx` will look like this:

```typescript
interface QsrState {
  isLoading: boolean;
  reportData: Record<string, any> | null;
  missingFields: string[];
  error: string | null;
  isReportComplete: boolean;
}
```

### 2.3 API Integration

The frontend integrates with the **FastAPI backend** instead of directly calling Kissflow:

**Backend API Endpoint:**
The frontend performs a `POST` request to the FastAPI backend with the Item ID.
- **Backend URL:** `http://localhost:8000/api/v1/qsr/fetch-data`
- **Request Body:** `{ "item_id": "KFF-0111" }`
- **Response:** `{ "success": boolean, "data": QsrData, "missingFields": string[] }`

**Authentication & Security:**
- Frontend only needs the backend URL in environment variables
- All Kissflow credentials are stored securely in the backend `.env` file
- No sensitive credentials exposed to the browser
- Backend handles all authentication with Kissflow API

---

## 3. Backend Architecture (FastAPI)

### 3.1 Backend Components

The FastAPI backend consists of the following components:

- **`app/main.py`**: FastAPI application setup, CORS configuration, and global exception handling
- **`app/models.py`**: Pydantic models for request/response validation
- **`app/routers/qsr.py`**: API endpoints for QSR data operations
- **`app/services/kissflow_service.py`**: Kissflow API integration and data mapping logic

### 3.2 API Endpoints

**Health & Status:**
- `GET /health` - Basic health check
- `GET /api/v1/qsr/status` - Detailed status including credential configuration

**QSR Operations:**
- `POST /api/v1/qsr/fetch-data` - Fetch and process QSR data from Kissflow

### 3.3 Data Processing & Mapping

The following table shows how fields from the Kissflow JSON response are mapped to the QSR template placeholders. The **backend** handles this mapping in `kissflow_service.py`. Fields not present in the response will be added to the `missingFields` array for manual entry.

| QSR Placeholder               | Kissflow JSON Field                               | Notes                                                     |
| ----------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| `{FeatureName}`               | `Name`                                            |                                                           |
| `{TeamName}`                  | `Team`                                            |                                                           |
| `{Quarter release}`           | `Estimated_launch_quarter`                        |                                                           |
| `{Frontend PR link}`          | `Frontend_PR_link`                                |                                                           |
| `{Backend PR link}`           | `Backend_PR_Link`                                 |                                                           |
| `{TDD link}`                  | `TDD_Link_1`                                      |                                                           |
| `{Test case Doc link}`        | `Test_Case_Link`                                  |                                                           |
| `Prepared By`                 | `TC_Prepared_by[0].Name`                          | Assumes the first person in the array is the preparer.    |
| `Tested By`                   | `AssignedTo.Name`                                 | Assumes the current assignee is the tester.               |
| `Developed By`                | `Frontend_Developer.Name`, `Backend_Developer.Name` | Combine both names.                                       |
| `Designed By`                 | `TDD_Prepared_by` (array of names)                | Combine all names from the array.                         |
| **Missing Fields**            | N/A                                               | The following fields are not in the JSON and must be manually entered: `{env}`, `{URL}`, `{PR number}`, `{spec doc link}`, `{design link}`, `{Test case execution link}`, `{evidence doc link}`, `Reviewed By`, and all Test Execution/Defect data. |

### 3.4 Backend Service Implementation

The backend implements the Kissflow integration service:

```python
# app/services/kissflow_service.py
class KissflowService:
    def __init__(self):
        self.base_url = os.getenv("KISSFLOW_BASE_URL")
        self.access_key_id = os.getenv("KISSFLOW_ACCESS_KEY_ID")
        self.access_key_secret = os.getenv("KISSFLOW_ACCESS_KEY_SECRET")
        
        # Check if credentials are available
        self.has_credentials = all([self.base_url, self.access_key_id, self.access_key_secret])
        
        if not self.has_credentials:
            logger.warning("Kissflow credentials not configured. Will use mock data.")

    def fetch_qsr_data(self, item_id: str) -> KissflowResponse:
        # If no credentials, return mock data
        if not self.has_credentials:
            return self._get_mock_data(item_id)
        
        # Make request to Kissflow API
        url = f"{self.base_url}/{item_id}"
        headers = {
            'X-Access-Key-Id': self.access_key_id,
            'X-Access-Key-Secret': self.access_key_secret,
            'Content-Type': 'application/json',
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code != 200:
            # Fallback to mock data on API error
            return self._get_mock_data(item_id)
        
        kissflow_data = response.json()
        
        # Map Kissflow fields to QSR fields
        mapped_data = self._map_kissflow_to_qsr(kissflow_data)
        missing_fields = self._identify_missing_fields(mapped_data)
        
        return KissflowResponse(
            success=True,
            data=mapped_data,
            missingFields=missing_fields
        )
```

### 3.5 Frontend API Service

The frontend implements a simplified service to call the backend:

```typescript
// services/kissflowService.ts
export async function fetchQsrData(itemId: string): Promise<KissflowResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const url = `${backendUrl}/api/v1/qsr/fetch-data`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `Failed to fetch data: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    // Fallback to mock data if backend is not available
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Backend not available, falling back to mock data');
      return mockFetchQsrData(itemId);
    }
    
    throw error;
  }
}
```

---

## 4. Document Generation Strategy

Both document formats will be generated entirely on the client-side:

### 4.1 PDF (.pdf)
- **Location:** Frontend (Client-Side)
- **Implementation:** The rich HTML from the live preview panel will be passed to a client-side library like `html2pdf.js` to generate and trigger the download of the PDF.

### 4.2 DOCX (.docx)
- **Location:** Frontend (Client-Side)  
- **Implementation:** Use a client-side library like `docx` (browser-compatible) to generate DOCX files directly in the browser. The library will construct the document programmatically using the complete report data and trigger the download.

---

## 5. Dependencies

### 5.1 Frontend Dependencies
- `react`, `next`: Core framework
- `typescript`: Type safety
- `tailwindcss`: For styling
- `lucide-react`: UI icons
- `html2pdf.js`: For client-side PDF generation
- `docx`: For client-side DOCX generation (browser-compatible)
- `file-saver`: For downloading generated files
- Native `fetch`: For backend API calls

### 5.2 Backend Dependencies
- `fastapi`: Web framework for building APIs
- `uvicorn`: ASGI server for running FastAPI
- `pydantic`: Data validation using Python type annotations
- `requests`: HTTP library for calling Kissflow API
- `python-multipart`: For handling form data
- `python-dotenv`: For loading environment variables

### 5.3 Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Backend (.env) - Required for production:**
```env
KISSFLOW_BASE_URL=https://work.kissflow.com/case/2/AcFlqmVfTZ1X_CP008/Kissflow_Product_Features/view/Apps_Team
KISSFLOW_ACCESS_KEY_ID=your-access-key-id
KISSFLOW_ACCESS_KEY_SECRET=your-access-key-secret
HOST=0.0.0.0
PORT=8000
DEBUG=True
FRONTEND_URL=http://localhost:3000
```

**Backend (.env) - Optional for development:**
- If no `.env` file is provided, backend automatically uses mock data
- Allows development without requiring Kissflow credentials

### 5.4 Security Improvements Achieved

✅ **Credential Security**: 
- API keys stored server-side only
- No sensitive credentials in browser environment

✅ **CORS Resolution**: 
- Backend handles all cross-origin requests
- No browser CORS configuration needed

✅ **Error Handling**: 
- Centralized error handling in backend
- Graceful fallback to mock data

✅ **Development Experience**: 
- Works with or without credentials
- Mock data for testing and development
