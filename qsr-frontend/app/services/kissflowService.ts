import { KissflowResponse, QsrData } from '@/app/types';

function mapKissflowToQsr(kissflowData: any): QsrData {
  const mappedData: QsrData = {};

  if (kissflowData.Name) {
    mappedData.FeatureName = kissflowData.Name;
  }
  
  if (kissflowData.Team) {
    mappedData.TeamName = kissflowData.Team;
  }
  
  if (kissflowData.Estimated_launch_quarter) {
    mappedData.QuarterRelease = kissflowData.Estimated_launch_quarter;
  }
  
  if (kissflowData.Frontend_PR_link) {
    mappedData.FrontendPRLink = kissflowData.Frontend_PR_link;
  }
  
  if (kissflowData.Backend_PR_Link) {
    mappedData.BackendPRLink = kissflowData.Backend_PR_Link;
  }
  
  if (kissflowData.TDD_Link_1) {
    mappedData.TDDLink = kissflowData.TDD_Link_1;
  }
  
  if (kissflowData.Test_Case_Link) {
    mappedData.TestCaseDocLink = kissflowData.Test_Case_Link;
  }
  
  if (kissflowData.TC_Prepared_by && Array.isArray(kissflowData.TC_Prepared_by) && kissflowData.TC_Prepared_by[0]?.Name) {
    mappedData.PreparedBy = kissflowData.TC_Prepared_by[0].Name;
  }
  
  if (kissflowData.AssignedTo?.Name) {
    mappedData.TestedBy = kissflowData.AssignedTo.Name;
  }
  
  const developers: string[] = [];
  if (kissflowData.Frontend_Developer?.Name) {
    developers.push(kissflowData.Frontend_Developer.Name);
  }
  if (kissflowData.Backend_Developer?.Name) {
    developers.push(kissflowData.Backend_Developer.Name);
  }
  if (developers.length > 0) {
    mappedData.DevelopedBy = developers.join(', ');
  }
  
  if (kissflowData.TDD_Prepared_by && Array.isArray(kissflowData.TDD_Prepared_by)) {
    const designers = kissflowData.TDD_Prepared_by
      .map((person: any) => person.Name || person)
      .filter(Boolean);
    if (designers.length > 0) {
      mappedData.DesignedBy = designers.join(', ');
    }
  }

  return mappedData;
}

function identifyMissingFields(data: QsrData): string[] {
  const requiredFields = [
    'FeatureName',
    'TeamName',
    'QuarterRelease',
    'env',
    'URL',
    'FrontendPRLink',
    'BackendPRLink',
    'PRNumber',
    'SpecDocLink',
    'DesignLink',
    'TDDLink',
    'TestCaseDocLink',
    'TestCaseExecutionLink',
    'EvidenceDocLink',
    'PreparedBy',
    'TestedBy',
    'DevelopedBy',
    'DesignedBy',
    'ReviewedBy',
  ];

  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field as keyof QsrData]) {
      missingFields.push(field);
    }
  }

  if (!data.TestExecutionData || data.TestExecutionData.length === 0) {
    missingFields.push('TestExecutionData');
  }

  // DefectData is now optional - not adding to missing fields

  return missingFields;
}

export async function fetchQsrData(itemId: string): Promise<KissflowResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const url = `${backendUrl}/api/v1/qsr/fetch-data`;
    
    console.log('Fetching from backend URL:', url);
    console.log('Item ID:', itemId);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemId
      }),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Backend API error:', errorData);
      throw new Error(errorData.detail || errorData.message || `Failed to fetch data: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Backend response data:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error fetching QSR data from backend:', error);
    
    // Fallback to mock data if backend is not available
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Backend not available, falling back to mock data');
      return mockFetchQsrData(itemId);
    }
    
    throw error;
  }
}

export function mockFetchQsrData(itemId: string): Promise<KissflowResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Kissflow API response based on the actual JSON structure
      const mockKissflowData = {
        "_id": "KFF-0111",
        "Name": "[ Enhancement ][ App ] :  Flow Lock - Concurrent edit prevention",
        "_created_by": {
          "_id": "UsRb8oInnN4Rf",
          "Name": "Abdul Raghmaan K",
          "Kind": "User"
        },
        "_modified_by": {
          "_id": "Us7w_cRKhwOP",
          "Name": "Sankaran Baskaran",
          "Kind": "User"
        },
        "_created_at": "2025-07-10T08:04:19Z",
        "_modified_at": "2025-09-04T04:04:43Z",
        "_flow_name": "Kissflow Product Features",
        "_item_id": "KFF-0111",
        "AssignedTo": {
          "_id": "Us7w_cRKhwOP",
          "Name": "Sankaran Baskaran",
          "Kind": "User"
        },
        "_status_name": "TST",
        "_priority_name": "High",
        "Title_1": "Flow Lock - Concurrent edit prevention",
        "Description_1": "When multiple users work on a single flow, flow meta is getting overridden. Planning to introduce flow lock similar to process form builder outside of Apps.",
        "Work_type": "Enhancement",
        "TDD_Link_1": "https://coda.io/d/Engineering-Docs_ddWl30dEZao/Technical-Design-Document_suhbp8Px#Recently-Added_tuOVp5CP/r336&view=full",
        "TDD_Prepared_by": [
          {
            "_id": "Us7Fl4YvVlsI",
            "Name": "Roshini R S",
            "Kind": "User"
          },
          {
            "_id": "Us2G2k5nWTZZR",
            "Name": "Rashmi Subramani",
            "Kind": "User"
          }
        ],
        "Backend_PR_Link": "https://github.com/OrangeScape/kissflow-xg/pull/18089",
        "Frontend_PR_link": "https://github.com/OrangeScape/kf-xg-frontend/pull/11421",
        "Frontend_Developer": {
          "_id": "Us2G2k5nWTZZR",
          "Name": "Rashmi Subramani",
          "Kind": "User"
        },
        "Backend_Developer": {
          "_id": "Us7Fl4YvVlsI",
          "Name": "Roshini R S",
          "Kind": "User"
        },
        "Test_Case_Link": "https://docs.google.com/spreadsheets/d/1izR25BXTYRfvNvXCDZJ5TmpZ2INGkjRFyOW9JItewE4/edit?gid=0#gid=0",
        "TC_Prepared_by": [
          {
            "_id": "Us7w_cRKhwOP",
            "Name": "Sankaran Baskaran",
            "Kind": "User"
          }
        ],
        "Epic": "App",
        "Estimated_launch_quarter": "Q3 2025",
        "Team": "Apps",
        "Required_Stakeholders": [
          "Design",
          "Backend",
          "Frontend",
          "QA",
          "Content",
          "PM"
        ],
        "Bugs_Reported": false
      };
      
      // Map the mock data to QSR format using the same mapping function
      const mappedData = mapKissflowToQsr(mockKissflowData);
      const missingFields = identifyMissingFields(mappedData);
      
      resolve({
        success: true,
        data: mappedData,
        missingFields,
      });
    }, 1500);
  });
}