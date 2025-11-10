export interface QsrData {
  FeatureName?: string;
  TeamName?: string;
  QuarterRelease?: string;
  env?: string;
  URL?: string;
  FrontendPRLink?: string;
  BackendPRLink?: string;
  PRNumber?: string;
  SpecDocLink?: string;
  DesignLink?: string;
  TDDLink?: string;
  TestCaseDocLink?: string;
  TestCaseExecutionLink?: string;
  EvidenceDocLink?: string;
  RTMDocLink?: string;
  PreparedBy?: string;
  TestedBy?: string;
  DevelopedBy?: string;
  DesignedBy?: string;
  ReviewedBy?: string;
  TestExecutionData?: TestBuild[];
  DefectData?: Defect[];
  
}

export interface TestBuild {
  buildNumber: number;
  startDate?: string;
  endDate?: string;
  totalDesigned?: number;
  totalExecuted?: number;
  totalPassed?: number;
  totalFailed?: number;
  passPercentage?: number;
  failPercentage?: number;
  defectsFound?: number;
}

export interface Defect {
  defectId: string;
  status: 'Open' | 'Closed' | 'In Progress' | 'Resolved';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface KissflowResponse {
  success: boolean;
  data: QsrData;
  missingFields: string[];
}

export interface DefectSummary {
  Critical: { total: number; closed: number; open: number };
  High: { total: number; closed: number; open: number };
  Medium: { total: number; closed: number; open: number };
  Low: { total: number; closed: number; open: number };
}

export type Step = 'fetch' | 'validate' | 'generate' | 'export';

export interface StepStatus {
  fetch: 'pending' | 'success' | 'error';
  validate: 'pending' | 'success' | 'error';
  generate: 'pending' | 'success' | 'error';
  export: 'pending' | 'success' | 'error';
}