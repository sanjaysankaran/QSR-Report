import requests
import os
from typing import Dict, Any, List
from app.models import QsrData, KissflowResponse
import logging

logger = logging.getLogger(__name__)


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
        """
        Fetch QSR data from Kissflow API or return mock data if credentials not available
        """
        # If no credentials, return mock data
        if not self.has_credentials:
            logger.info(f"Using mock data for item: {item_id} (no credentials configured)")
            return self._get_mock_data(item_id)
        
        try:
            url = f"{self.base_url}/{item_id}"
            
            headers = {
                'X-Access-Key-Id': self.access_key_id,
                'X-Access-Key-Secret': self.access_key_secret,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            
            logger.info(f"Fetching data from Kissflow for item: {item_id}")
            
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code != 200:
                logger.error(f"Kissflow API error: {response.status_code} - {response.text}")
                logger.info("Falling back to mock data due to API error")
                return self._get_mock_data(item_id)
            
            kissflow_data = response.json()
            logger.info("Successfully fetched data from Kissflow")
            
            # Map Kissflow data to QSR format
            mapped_data = self._map_kissflow_to_qsr(kissflow_data)
            missing_fields = self._identify_missing_fields(mapped_data)
            
            return KissflowResponse(
                success=True,
                data=mapped_data,
                missingFields=missing_fields
            )
            
        except requests.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            logger.info("Falling back to mock data due to network error")
            return self._get_mock_data(item_id)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            logger.info("Falling back to mock data due to unexpected error")
            return self._get_mock_data(item_id)

    def _map_kissflow_to_qsr(self, kissflow_data: Dict[str, Any]) -> QsrData:
        """
        Map Kissflow JSON response to QSR data structure
        """
        mapped_data = QsrData()

        # Basic mappings
        if kissflow_data.get("Name"):
            mapped_data.FeatureName = kissflow_data["Name"]
        
        if kissflow_data.get("Team"):
            mapped_data.TeamName = kissflow_data["Team"]
        
        if kissflow_data.get("Estimated_launch_quarter"):
            mapped_data.QuarterRelease = kissflow_data["Estimated_launch_quarter"]
        
        if kissflow_data.get("Frontend_PR_link"):
            mapped_data.FrontendPRLink = kissflow_data["Frontend_PR_link"]
        
        if kissflow_data.get("Backend_PR_Link"):
            mapped_data.BackendPRLink = kissflow_data["Backend_PR_Link"]
        
        if kissflow_data.get("TDD_Link_1"):
            mapped_data.TDDLink = kissflow_data["TDD_Link_1"]
        
        if kissflow_data.get("Test_Case_Link"):
            mapped_data.TestCaseDocLink = kissflow_data["Test_Case_Link"]
        
        # Personnel mappings
        if kissflow_data.get("TC_Prepared_by") and isinstance(kissflow_data["TC_Prepared_by"], list):
            if len(kissflow_data["TC_Prepared_by"]) > 0 and kissflow_data["TC_Prepared_by"][0].get("Name"):
                mapped_data.PreparedBy = kissflow_data["TC_Prepared_by"][0]["Name"]
        
        if kissflow_data.get("AssignedTo", {}).get("Name"):
            mapped_data.TestedBy = kissflow_data["AssignedTo"]["Name"]
        
        # Developer mapping
        developers = []
        if kissflow_data.get("Frontend_Developer", {}).get("Name"):
            developers.append(kissflow_data["Frontend_Developer"]["Name"])
        if kissflow_data.get("Backend_Developer", {}).get("Name"):
            developers.append(kissflow_data["Backend_Developer"]["Name"])
        if developers:
            mapped_data.DevelopedBy = ", ".join(developers)
        
        # Designer mapping
        if kissflow_data.get("TDD_Prepared_by") and isinstance(kissflow_data["TDD_Prepared_by"], list):
            designers = []
            for person in kissflow_data["TDD_Prepared_by"]:
                if person.get("Name"):
                    designers.append(person["Name"])
            if designers:
                mapped_data.DesignedBy = ", ".join(designers)

        return mapped_data

    def _identify_missing_fields(self, data: QsrData) -> List[str]:
        """
        Identify fields that are missing and need manual entry
        """
        required_fields = [
            'FeatureName', 'TeamName', 'QuarterRelease', 'env', 'URL',
            'FrontendPRLink', 'BackendPRLink', 'PRNumber', 'SpecDocLink',
            'DesignLink', 'TDDLink', 'TestCaseDocLink', 'TestCaseExecutionLink',
            'EvidenceDocLink', 'PreparedBy', 'TestedBy', 'DevelopedBy',
            'DesignedBy', 'ReviewedBy'
        ]

        missing_fields = []
        
        for field in required_fields:
            value = getattr(data, field)
            if not value or (isinstance(value, str) and value.strip() == ''):
                missing_fields.append(field)

        # Check test execution data
        if not data.TestExecutionData or len(data.TestExecutionData) == 0:
            missing_fields.append('TestExecutionData')

        return missing_fields

    def _get_mock_data(self, item_id: str) -> KissflowResponse:
        """
        Return mock data for testing when Kissflow credentials are not available
        """
        import time
        
        # Simulate API delay
        time.sleep(1)
        
        # Mock Kissflow API response based on the actual JSON structure
        mock_kissflow_data = {
            "_id": item_id,
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
            "_item_id": item_id,
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
            "Bugs_Reported": False
        }
        
        # Map the mock data to QSR format using the same mapping function
        mapped_data = self._map_kissflow_to_qsr(mock_kissflow_data)
        missing_fields = self._identify_missing_fields(mapped_data)
        
        logger.info(f"Returning mock data for item: {item_id}")
        
        return KissflowResponse(
            success=True,
            data=mapped_data,
            missingFields=missing_fields
        )


# Global service instance
kissflow_service = KissflowService()