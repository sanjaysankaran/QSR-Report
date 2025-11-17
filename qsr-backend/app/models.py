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
    title: Optional[str] = None
    description: Optional[str] = None
    status: str  # 'Open' | 'Closed' | 'In Progress' | 'Resolved'
    severity: str  # 'Critical' | 'High' | 'Medium' | 'Low'
    priority: Optional[str] = None  # 'P1' | 'P2' | 'P3' | 'P4'
    assignedTo: Optional[str] = None
    reportedBy: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    resolvedAt: Optional[str] = None
    testCaseId: Optional[str] = None
    cycle: Optional[int] = None
    environment: Optional[str] = None
    reproductionSteps: Optional[str] = None
    expectedResult: Optional[str] = None
    actualResult: Optional[str] = None


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


# New models for Test Execution APIs
class Feature(BaseModel):
    id: str
    name: str
    description: str
    totalCycles: int
    totalTestCases: int
    createdAt: str
    updatedAt: str


class TestRunSummary(BaseModel):
    id: str
    name: str
    description: str
    status: str
    cycle: int
    startDate: str
    endDate: str
    createdBy: str
    assignedTo: str
    createdAt: str
    completedAt: Optional[str] = None
    updatedAt: str


class TestStatistics(BaseModel):
    totalTests: int
    executed: int
    passed: int
    failed: int
    skipped: int
    outOfScope: int
    passRate: float


class BugsByPriority(BaseModel):
    critical: int
    high: int
    medium: int
    low: int


class BugsByStatus(BaseModel):
    open: int
    in_progress: int
    fixed: int


class BugSummary(BaseModel):
    total: int
    fixed: int
    notFixed: int
    byPriority: BugsByPriority
    byStatus: BugsByStatus


class BugDetail(BaseModel):
    id: str
    bugId: str
    title: str
    priority: str
    status: str
    createdAt: str


class TestCase(BaseModel):
    id: str
    title: str
    status: str
    executedAt: str
    comments: str
    bugId: Optional[str] = None
    evidenceUrl: Optional[str] = None


class TestRunResponse(BaseModel):
    run: TestRunSummary
    feature: Dict[str, Any]
    statistics: TestStatistics
    bugs: BugSummary
    bugDetails: List[BugDetail]
    testCases: List[TestCase]
    metadata: Dict[str, Any]


class FeatureCycle(BaseModel):
    cycle: int
    runId: str
    runName: str
    date: str
    startDate: str
    endDate: str
    passRate: float
    totalTests: int
    passed: int
    failed: int
    bugsFound: int
    bugsFixed: int
    totalDefects: int


class FeatureCyclesResponse(BaseModel):
    feature: Dict[str, Any]
    cycles: List[FeatureCycle]


class FeaturesResponse(BaseModel):
    features: List[Feature]
    total: int
    metadata: Dict[str, Any]