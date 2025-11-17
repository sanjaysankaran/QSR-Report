import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any
from app.models import Defect

logger = logging.getLogger(__name__)


class DefectService:
    def __init__(self):
        self.mock_defects = self._generate_mock_defects()

    def _generate_mock_defects(self) -> Dict[str, List[Defect]]:
        """Generate comprehensive mock defect data for different features"""
        base_date = datetime.now()

        return {
            # Flow Lock - Concurrent edit prevention (KFF-0111)
            "67309a1b2c3d4e5f60718293": [
                Defect(
                    defectId="FL-001",
                    title="Flow lock not acquired when multiple users edit simultaneously",
                    description="When two users try to edit the same flow at the same time, both are able to access edit mode without proper locking mechanism",
                    status="Closed",
                    severity="High",
                    priority="P1",
                    assignedTo="Roshini R S",
                    reportedBy="Sankaran Baskaran",
                    createdAt=(base_date - timedelta(days=45)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=40)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=40)).isoformat() + "Z",
                    testCaseId="TC-FL-001",
                    cycle=1,
                    environment="TST",
                    reproductionSteps="1. Open flow in two browser tabs\n2. Start editing in both tabs\n3. Make changes simultaneously\n4. Save in both tabs",
                    expectedResult="Second user should be blocked with 'Flow is being edited' message",
                    actualResult="Both users can edit and save, causing data conflicts"
                ),
                Defect(
                    defectId="FL-002",
                    title="Lock indicator not visible in dark mode",
                    description="The flow lock indicator UI is not visible when using dark theme, making users unaware of lock status",
                    status="Closed",
                    severity="Medium",
                    priority="P2",
                    assignedTo="Rashmi Subramani",
                    reportedBy="Sankaran Baskaran",
                    createdAt=(base_date - timedelta(days=42)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=35)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=35)).isoformat() + "Z",
                    testCaseId="TC-FL-012",
                    cycle=1,
                    environment="Pesagi",
                    reproductionSteps="1. Switch to dark mode\n2. Open a flow being edited by another user\n3. Check for lock indicator",
                    expectedResult="Lock indicator should be clearly visible with appropriate contrast",
                    actualResult="Lock indicator blends with dark background and is not visible"
                ),
                Defect(
                    defectId="FL-003",
                    title="Lock timeout not working correctly",
                    description="Flow locks are not automatically released after the configured timeout period",
                    status="Closed",
                    severity="Medium",
                    priority="P2",
                    assignedTo="Roshini R S",
                    reportedBy="Sankaran Baskaran",
                    createdAt=(base_date - timedelta(days=40)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=32)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=32)).isoformat() + "Z",
                    testCaseId="TC-FL-008",
                    cycle=1,
                    environment="TST",
                    reproductionSteps="1. Start editing a flow\n2. Leave browser idle for 30 minutes\n3. Try to edit from another user",
                    expectedResult="Lock should be automatically released after 30 minutes",
                    actualResult="Lock persists indefinitely until browser is closed"
                ),
                Defect(
                    defectId="FL-004",
                    title="Lock not released on browser crash",
                    description="When browser crashes while editing, the flow lock is not automatically released",
                    status="Open",
                    severity="High",
                    priority="P1",
                    assignedTo="Roshini R S",
                    reportedBy="Sankaran Baskaran",
                    createdAt=(base_date - timedelta(days=15)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=10)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-FL-015",
                    cycle=2,
                    environment="TST",
                    reproductionSteps="1. Start editing a flow\n2. Force close browser or kill browser process\n3. Try to edit from another user/browser",
                    expectedResult="Lock should be released after detecting browser disconnect",
                    actualResult="Lock remains active, blocking all other users from editing"
                ),
                Defect(
                    defectId="FL-005",
                    title="Minor UI alignment issue in lock popup",
                    description="Lock notification popup has minor text alignment issues on mobile devices",
                    status="Open",
                    severity="Low",
                    priority="P3",
                    assignedTo="Rashmi Subramani",
                    reportedBy="Sankaran Baskaran",
                    createdAt=(base_date - timedelta(days=8)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=5)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-FL-020",
                    cycle=3,
                    environment="Pesagi",
                    reproductionSteps="1. Access flow on mobile browser\n2. Try to edit locked flow\n3. Observe popup layout",
                    expectedResult="Popup text should be properly aligned and readable",
                    actualResult="Text appears slightly misaligned on smaller screens"
                )
            ],

            # FM Logistics - Notification System (KFF-0219)
            "67309a1b2c3d4e5f60718294": [
                Defect(
                    defectId="FML-001",
                    title="Email notifications not sent for logistics updates",
                    description="Email notifications for logistics process updates are not being delivered to stakeholders",
                    status="Closed",
                    severity="Critical",
                    priority="P1",
                    assignedTo="Backend Team",
                    reportedBy="QA Team",
                    createdAt=(base_date - timedelta(days=50)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=45)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=45)).isoformat() + "Z",
                    testCaseId="TC-FML-003",
                    cycle=1,
                    environment="Draco",
                    reproductionSteps="1. Submit logistics request\n2. Approve request\n3. Check email notifications",
                    expectedResult="Stakeholders should receive email notifications for status changes",
                    actualResult="No email notifications are sent"
                ),
                Defect(
                    defectId="FML-002",
                    title="Bounce issue in notification delivery",
                    description="Notification delivery fails with bounce errors for certain email domains",
                    status="In Progress",
                    severity="High",
                    priority="P1",
                    assignedTo="Infrastructure Team",
                    reportedBy="QA Team",
                    createdAt=(base_date - timedelta(days=35)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=5)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-FML-007",
                    cycle=2,
                    environment="Draco",
                    reproductionSteps="1. Set recipient with external domain email\n2. Trigger notification\n3. Check delivery status",
                    expectedResult="Notifications should be delivered successfully to all domains",
                    actualResult="Delivery fails with bounce errors for some external domains"
                ),
                Defect(
                    defectId="FML-003",
                    title="SMS notification formatting issues",
                    description="SMS notifications contain unformatted HTML content and are not user-friendly",
                    status="Open",
                    severity="Medium",
                    priority="P2",
                    assignedTo="Backend Team",
                    reportedBy="QA Team",
                    createdAt=(base_date - timedelta(days=20)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=15)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-FML-012",
                    cycle=3,
                    environment="TST",
                    reproductionSteps="1. Enable SMS notifications\n2. Trigger logistics update\n3. Check received SMS content",
                    expectedResult="SMS should contain plain text, properly formatted content",
                    actualResult="SMS contains HTML tags and is difficult to read"
                )
            ],

            # User Dashboard - Widget System (KFF-0001)
            "67309a1b2c3d4e5f60718295": [
                Defect(
                    defectId="UD-001",
                    title="Widget drag and drop not working in Safari",
                    description="Dashboard widgets cannot be rearranged using drag and drop functionality in Safari browser",
                    status="Closed",
                    severity="Medium",
                    priority="P2",
                    assignedTo="Frontend Team",
                    reportedBy="QA Team",
                    createdAt=(base_date - timedelta(days=30)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=25)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=25)).isoformat() + "Z",
                    testCaseId="TC-UD-005",
                    cycle=1,
                    environment="Pesagi",
                    reproductionSteps="1. Open dashboard in Safari\n2. Try to drag a widget to new position\n3. Observe behavior",
                    expectedResult="Widget should move smoothly to new position",
                    actualResult="Widget does not respond to drag operations"
                ),
                Defect(
                    defectId="UD-002",
                    title="Custom widget configuration not saved",
                    description="Custom widget settings are lost after page refresh or browser restart",
                    status="Open",
                    severity="High",
                    priority="P1",
                    assignedTo="Frontend Team",
                    reportedBy="QA Team",
                    createdAt=(base_date - timedelta(days=12)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=8)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-UD-015",
                    cycle=2,
                    environment="TST",
                    reproductionSteps="1. Customize widget settings\n2. Save configuration\n3. Refresh page or restart browser",
                    expectedResult="Widget settings should persist after page reload",
                    actualResult="All customizations are lost and revert to defaults"
                )
            ],

            # API Authentication Module (KFF-0123)
            "67309a1b2c3d4e5f60718296": [
                Defect(
                    defectId="API-001",
                    title="JWT token expiry not handled gracefully",
                    description="Application does not handle JWT token expiration properly, causing unexpected logouts",
                    status="Closed",
                    severity="High",
                    priority="P1",
                    assignedTo="Backend Team",
                    reportedBy="Security Team",
                    createdAt=(base_date - timedelta(days=60)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=55)).isoformat() + "Z",
                    resolvedAt=(base_date - timedelta(days=55)).isoformat() + "Z",
                    testCaseId="TC-API-003",
                    cycle=1,
                    environment="TST",
                    reproductionSteps="1. Login with valid credentials\n2. Wait for token to expire\n3. Make API call",
                    expectedResult="User should be redirected to login with proper error message",
                    actualResult="Application shows generic error without proper logout"
                ),
                Defect(
                    defectId="API-002",
                    title="Rate limiting not enforced for public APIs",
                    description="Public API endpoints do not enforce rate limiting, potentially allowing abuse",
                    status="In Progress",
                    severity="Medium",
                    priority="P2",
                    assignedTo="Security Team",
                    reportedBy="Penetration Testing Team",
                    createdAt=(base_date - timedelta(days=25)).isoformat() + "Z",
                    updatedAt=(base_date - timedelta(days=10)).isoformat() + "Z",
                    resolvedAt=None,
                    testCaseId="TC-API-008",
                    cycle=3,
                    environment="Pesagi",
                    reproductionSteps="1. Make rapid consecutive API calls to public endpoint\n2. Monitor response codes and timing",
                    expectedResult="API should enforce rate limiting and return 429 status when exceeded",
                    actualResult="Unlimited requests are allowed without any rate limiting"
                )
            ]
        }

    def get_defects_by_feature(self, feature_id: str) -> List[Defect]:
        """Get all defects for a specific feature"""
        return self.mock_defects.get(feature_id, [])

    def get_defects_by_kissflow_id(self, kissflow_item_id: str) -> List[Defect]:
        """Map Kissflow Item ID to defects"""
        kissflow_mapping = {
            "KFF-0111": "67309a1b2c3d4e5f60718293",  # Flow Lock
            "KFF-0219": "67309a1b2c3d4e5f60718294",  # FM Logistics
            "KFF-0001": "67309a1b2c3d4e5f60718295",  # User Dashboard
            "KFF-0123": "67309a1b2c3d4e5f60718296",  # API Authentication
        }

        feature_id = kissflow_mapping.get(kissflow_item_id, "67309a1b2c3d4e5f60718293")
        return self.get_defects_by_feature(feature_id)

    def get_defect_summary(self, feature_id: str) -> Dict[str, Any]:
        """Get defect summary statistics for a feature"""
        defects = self.get_defects_by_feature(feature_id)

        summary = {
            "total": len(defects),
            "byStatus": {
                "Open": 0,
                "Closed": 0,
                "In Progress": 0,
                "Resolved": 0
            },
            "bySeverity": {
                "Critical": 0,
                "High": 0,
                "Medium": 0,
                "Low": 0
            },
            "byPriority": {
                "P1": 0,
                "P2": 0,
                "P3": 0,
                "P4": 0
            }
        }

        for defect in defects:
            summary["byStatus"][defect.status] += 1
            summary["bySeverity"][defect.severity] += 1
            if defect.priority:
                summary["byPriority"][defect.priority] += 1

        # Calculate derived stats
        summary["fixed"] = summary["byStatus"]["Closed"] + summary["byStatus"]["Resolved"]
        summary["open"] = summary["total"] - summary["fixed"]

        return summary

    def get_defects_by_cycle(self, feature_id: str, cycle: int) -> List[Defect]:
        """Get defects found in a specific test cycle"""
        defects = self.get_defects_by_feature(feature_id)
        return [d for d in defects if d.cycle == cycle]


# Global service instance
defect_service = DefectService()