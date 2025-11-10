from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class TestBuild(BaseModel):
    buildNumber: int
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    totalDesigned: Optional[int] = None
    totalExecuted: Optional[int] = None
    totalPassed: Optional[int] = None
    totalFailed: Optional[int] = None
    passPercentage: Optional[float] = None
    failPercentage: Optional[float] = None
    defectsFound: Optional[int] = None


class Defect(BaseModel):
    defectId: str
    status: str  # 'Open' | 'Closed' | 'In Progress' | 'Resolved'
    severity: str  # 'Critical' | 'High' | 'Medium' | 'Low'


class QsrData(BaseModel):
    FeatureName: Optional[str] = None
    TeamName: Optional[str] = None
    QuarterRelease: Optional[str] = None
    env: Optional[str] = None
    URL: Optional[str] = None
    FrontendPRLink: Optional[str] = None
    BackendPRLink: Optional[str] = None
    PRNumber: Optional[str] = None
    SpecDocLink: Optional[str] = None
    DesignLink: Optional[str] = None
    TDDLink: Optional[str] = None
    TestCaseDocLink: Optional[str] = None
    TestCaseExecutionLink: Optional[str] = None
    EvidenceDocLink: Optional[str] = None
    RTMDocLink: Optional[str] = None
    PreparedBy: Optional[str] = None
    TestedBy: Optional[str] = None
    DevelopedBy: Optional[str] = None
    DesignedBy: Optional[str] = None
    ReviewedBy: Optional[str] = None
    TestExecutionData: Optional[List[TestBuild]] = None
    DefectData: Optional[List[Defect]] = None


class KissflowResponse(BaseModel):
    success: bool
    data: QsrData
    missingFields: List[str]


class ItemRequest(BaseModel):
    item_id: str


class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int