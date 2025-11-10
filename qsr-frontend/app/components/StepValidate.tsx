import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { QsrData, TestBuild, Defect } from '@/app/types';

interface StepValidateProps {
  data: QsrData;
  missingFields: string[];
  onUpdateData: (updatedData: QsrData) => void;
  onValidate: () => void;
  isValidating: boolean;
}

const StepValidate: React.FC<StepValidateProps> = ({ data, missingFields, onUpdateData, onValidate, isValidating }) => {
  const handleFieldChange = (field: keyof QsrData, value: any) => {
    const updatedData = { ...data, [field]: value };
    onUpdateData(updatedData);
  };

  const handleTestBuildChange = (index: number, field: keyof TestBuild, value: any) => {
    const testBuilds = [...(data.TestExecutionData || [])];
    testBuilds[index] = { ...testBuilds[index], [field]: value };
    
    const build = testBuilds[index];
    if (build.totalPassed !== undefined && build.totalExecuted !== undefined && build.totalExecuted > 0) {
      build.passPercentage = Math.round((build.totalPassed / build.totalExecuted) * 100);
      build.totalFailed = build.totalExecuted - build.totalPassed;
      build.failPercentage = Math.round((build.totalFailed / build.totalExecuted) * 100);
    }
    
    onUpdateData({ ...data, TestExecutionData: testBuilds });
  };

  const addTestBuild = () => {
    const newBuild: TestBuild = {
      buildNumber: (data.TestExecutionData?.length || 0) + 1,
      totalDesigned: 0,
      totalExecuted: 0,
      totalPassed: 0,
      totalFailed: 0,
      passPercentage: 0,
      failPercentage: 0,
      defectsFound: 0,
    };
    onUpdateData({
      ...data,
      TestExecutionData: [...(data.TestExecutionData || []), newBuild],
    });
  };

  const removeTestBuild = (index: number) => {
    const testBuilds = [...(data.TestExecutionData || [])];
    testBuilds.splice(index, 1);
    testBuilds.forEach((build, idx) => {
      build.buildNumber = idx + 1;
    });
    onUpdateData({ ...data, TestExecutionData: testBuilds });
  };

  const handleDefectChange = (index: number, field: keyof Defect, value: any) => {
    const defects = [...(data.DefectData || [])];
    defects[index] = { ...defects[index], [field]: value };
    onUpdateData({ ...data, DefectData: defects });
  };

  const addDefect = () => {
    const newDefect: Defect = {
      defectId: '',
      status: 'Open',
      severity: 'Medium',
    };
    onUpdateData({
      ...data,
      DefectData: [...(data.DefectData || []), newDefect],
    });
  };

  const removeDefect = (index: number) => {
    const defects = [...(data.DefectData || [])];
    defects.splice(index, 1);
    onUpdateData({ ...data, DefectData: defects });
  };

  const isMissingField = (field: string) => {
    // Check if field is missing based on current data state
    if (field === 'TestExecutionData') {
      return !data.TestExecutionData || data.TestExecutionData.length === 0;
    }
    if (field === 'DefectData') {
      return !data.DefectData || data.DefectData.length === 0;
    }
    // For regular fields, check if the value is empty or undefined
    const value = data[field as keyof QsrData];
    return !value || (typeof value === 'string' && value.trim() === '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Data Validation & Manual Entry</h3>
        
        <div className="space-y-8">
          {/* Core Report Information */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">📋</span> Core Report Information
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name {isMissingField('TeamName') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.TeamName || ''}
                  onChange={(e) => handleFieldChange('TeamName', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('TeamName') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Feature Name {isMissingField('FeatureName') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.FeatureName || ''}
                  onChange={(e) => handleFieldChange('FeatureName', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('FeatureName') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter feature name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quarter Release {isMissingField('QuarterRelease') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.QuarterRelease || ''}
                  onChange={(e) => handleFieldChange('QuarterRelease', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('QuarterRelease') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="e.g., Q3 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Environment {isMissingField('env') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.env || ''}
                  onChange={(e) => handleFieldChange('env', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('env') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter environment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Application URL {isMissingField('URL') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.URL || ''}
                  onChange={(e) => handleFieldChange('URL', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('URL') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PR Number {isMissingField('PRNumber') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.PRNumber || ''}
                  onChange={(e) => handleFieldChange('PRNumber', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('PRNumber') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter PR number"
                />
              </div>
            </div>
          </div>

          {/* Document & Artifact Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">🔗</span> Document & Artifact Links
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frontend PR Link {isMissingField('FrontendPRLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.FrontendPRLink || ''}
                  onChange={(e) => handleFieldChange('FrontendPRLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('FrontendPRLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backend PR Link {isMissingField('BackendPRLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.BackendPRLink || ''}
                  onChange={(e) => handleFieldChange('BackendPRLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('BackendPRLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spec Document Link {isMissingField('SpecDocLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.SpecDocLink || ''}
                  onChange={(e) => handleFieldChange('SpecDocLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('SpecDocLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Design Document Link {isMissingField('DesignLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.DesignLink || ''}
                  onChange={(e) => handleFieldChange('DesignLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('DesignLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  TDD Link {isMissingField('TDDLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.TDDLink || ''}
                  onChange={(e) => handleFieldChange('TDDLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('TDDLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Case Doc Link {isMissingField('TestCaseDocLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.TestCaseDocLink || ''}
                  onChange={(e) => handleFieldChange('TestCaseDocLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('TestCaseDocLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Case Execution Link {isMissingField('TestCaseExecutionLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.TestCaseExecutionLink || ''}
                  onChange={(e) => handleFieldChange('TestCaseExecutionLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('TestCaseExecutionLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Evidence Doc Link {isMissingField('EvidenceDocLink') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="url"
                  value={data.EvidenceDocLink || ''}
                  onChange={(e) => handleFieldChange('EvidenceDocLink', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('EvidenceDocLink') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Document URL"
                />
              </div>
            </div>
          </div>

          {/* Personnel / Audit Information */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">👥</span> Personnel / Audit Information
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prepared By {isMissingField('PreparedBy') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.PreparedBy || ''}
                  onChange={(e) => handleFieldChange('PreparedBy', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('PreparedBy') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tested By {isMissingField('TestedBy') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.TestedBy || ''}
                  onChange={(e) => handleFieldChange('TestedBy', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('TestedBy') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Developed By {isMissingField('DevelopedBy') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.DevelopedBy || ''}
                  onChange={(e) => handleFieldChange('DevelopedBy', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('DevelopedBy') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Name(s)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Designed By {isMissingField('DesignedBy') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.DesignedBy || ''}
                  onChange={(e) => handleFieldChange('DesignedBy', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('DesignedBy') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Name(s)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reviewed By {isMissingField('ReviewedBy') && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={data.ReviewedBy || ''}
                  onChange={(e) => handleFieldChange('ReviewedBy', e.target.value)}
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isMissingField('ReviewedBy') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                  }`}
                  placeholder="Name"
                />
              </div>
            </div>
          </div>

          {/* Test Execution Data */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">🧪</span> Test Execution Data
            </h4>
            {data.TestExecutionData?.map((build, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-md font-medium text-blue-400">Build {build.buildNumber} / Cycle {build.buildNumber}</h5>
                  <button
                    type="button"
                    onClick={() => removeTestBuild(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Total Designed</label>
                    <input
                      type="number"
                      value={build.totalDesigned || ''}
                      onChange={(e) => handleTestBuildChange(index, 'totalDesigned', parseInt(e.target.value) || 0)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Total Executed</label>
                    <input
                      type="number"
                      value={build.totalExecuted || ''}
                      onChange={(e) => handleTestBuildChange(index, 'totalExecuted', parseInt(e.target.value) || 0)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Total Passed</label>
                    <input
                      type="number"
                      value={build.totalPassed || ''}
                      onChange={(e) => handleTestBuildChange(index, 'totalPassed', parseInt(e.target.value) || 0)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={build.startDate || ''}
                      onChange={(e) => handleTestBuildChange(index, 'startDate', e.target.value)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={build.endDate || ''}
                      onChange={(e) => handleTestBuildChange(index, 'endDate', e.target.value)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Defects Found</label>
                    <input
                      type="number"
                      value={build.defectsFound || ''}
                      onChange={(e) => handleTestBuildChange(index, 'defectsFound', parseInt(e.target.value) || 0)}
                      className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
                {build.passPercentage !== undefined && (
                  <div className="mt-2 text-xs text-gray-400">
                    Pass Rate: {build.passPercentage}% | Fail Rate: {build.failPercentage}%
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTestBuild}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add Another Build</span>
            </button>
          </div>

          {/* Defect Information */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="mr-2">🐛</span> Defect Information
              <span className="ml-2 text-sm text-gray-400 font-normal">(Optional)</span>
            </h4>
            {data.DefectData?.map((defect, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid gap-3 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Defect ID</label>
                      <input
                        type="text"
                        value={defect.defectId}
                        onChange={(e) => handleDefectChange(index, 'defectId', e.target.value)}
                        className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                        placeholder="DEF-001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                      <select
                        value={defect.status}
                        onChange={(e) => handleDefectChange(index, 'status', e.target.value)}
                        className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Severity</label>
                      <select
                        value={defect.severity}
                        onChange={(e) => handleDefectChange(index, 'severity', e.target.value)}
                        className="w-full rounded bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-white"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDefect(index)}
                    className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addDefect}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add Another Defect</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onValidate}
            disabled={isValidating}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? 'Validating...' : 'Validate Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepValidate;