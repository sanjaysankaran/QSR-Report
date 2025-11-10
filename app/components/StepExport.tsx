import React from 'react';
import { Download, RefreshCw, FileText } from 'lucide-react';
import { QsrData, TestBuild, Defect, DefectSummary } from '@/app/types';

interface StepExportProps {
  reportData: QsrData;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onGenerateNew: () => void;
}

const StepExport: React.FC<StepExportProps> = ({ 
  reportData, 
  onDownloadPDF, 
  onDownloadDOCX,
  onGenerateNew 
}) => {
  const calculateDefectSummary = (): DefectSummary => {
    const summary: DefectSummary = {
      Critical: { total: 0, closed: 0, open: 0 },
      High: { total: 0, closed: 0, open: 0 },
      Medium: { total: 0, closed: 0, open: 0 },
      Low: { total: 0, closed: 0, open: 0 },
    };

    reportData.DefectData?.forEach(defect => {
      const severity = defect.severity;
      summary[severity].total++;
      if (defect.status === 'Closed' || defect.status === 'Resolved') {
        summary[severity].closed++;
      } else {
        summary[severity].open++;
      }
    });

    return summary;
  };

  const getTotalMetrics = () => {
    let totalDesigned = 0;
    let totalExecuted = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    reportData.TestExecutionData?.forEach(build => {
      totalDesigned += build.totalDesigned || 0;
      totalExecuted += build.totalExecuted || 0;
      totalPassed += build.totalPassed || 0;
      totalFailed += build.totalFailed || 0;
    });

    const passRate = totalExecuted > 0 ? Math.round((totalPassed / totalExecuted) * 100) : 0;
    const totalDefects = reportData.DefectData?.length || 0;
    const openDefects = reportData.DefectData?.filter(d => d.status === 'Open' || d.status === 'In Progress').length || 0;

    return { totalDesigned, totalExecuted, totalPassed, totalFailed, passRate, totalDefects, openDefects };
  };

  const metrics = getTotalMetrics();
  const defectSummary = calculateDefectSummary();
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Report Preview */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl">
          <div className="border-b border-gray-700 p-4">
            <h3 className="text-xl font-semibold text-white">Report Preview</h3>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            <div id="report-preview" className="prose prose-invert max-w-none">
              <h1 className="text-2xl font-bold text-white mb-4">TEST SUMMARY REPORT</h1>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">1. Purpose</h2>
                <p className="text-gray-300">
                  The purpose of this Test Summary Report (TSR) is to demonstrate the establishment of the qualified state of the Apps system, 
                  summarize overall the activities as outlined in the associated Test Plan (TP) including result and conclusion of the testing & 
                  validation activities performed for implementing/upgrading the Kissflow application.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">2. Scope</h2>
                <p className="text-gray-300">
                  The scope of the <strong>{reportData.TeamName}</strong> squad release is limited to the items specified in the 
                  <strong> {reportData.FeatureName}</strong> feature under description of change section.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">3. Environmental Details</h2>
                <p className="text-gray-300">
                  <strong>Pesagi Env:</strong> {reportData.env}<br />
                  <strong>TST Env:</strong> {reportData.env}
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">4. Audit Log</h2>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 text-gray-400">Prepared By</td>
                      <td className="py-2 text-white">{reportData.PreparedBy}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 text-gray-400">Tested By</td>
                      <td className="py-2 text-white">{reportData.TestedBy}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 text-gray-400">Developed By</td>
                      <td className="py-2 text-white">{reportData.DevelopedBy}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 text-gray-400">Designed By</td>
                      <td className="py-2 text-white">{reportData.DesignedBy}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 text-gray-400">Reviewed By</td>
                      <td className="py-2 text-white">{reportData.ReviewedBy}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">5. General Information</h2>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Summary Date:</strong> {currentDate}</p>
                  <p><strong>Application:</strong> Pesagi URL: {reportData.URL}</p>
                  <p><strong>Priority:</strong> High</p>
                  <p><strong>Frontend PR:</strong> <a href={reportData.FrontendPRLink} className="text-blue-400 hover:underline">{reportData.FrontendPRLink}</a></p>
                  <p><strong>Backend PR:</strong> <a href={reportData.BackendPRLink} className="text-blue-400 hover:underline">{reportData.BackendPRLink}</a></p>
                  <p><strong>PBR Numbers:</strong> {reportData.PRNumber}</p>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">6. Test Execution Summary</h2>
                <p className="text-gray-300 mb-3">
                  The table below summarizes the overall test results for the builds that were tested for 
                  <strong> {reportData.FeatureName}</strong> feature during <strong>{reportData.QuarterRelease}</strong>.
                </p>
                
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-2 py-1 text-left text-gray-300">Build/Date</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Designed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Executed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Passed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">% Passed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Failed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">% Failed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Defects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.TestExecutionData?.map((build, index) => (
                      <tr key={index}>
                        <td className="border border-gray-700 px-2 py-1 text-gray-300">
                          Build {build.buildNumber}
                          {build.startDate && build.endDate && (
                            <span className="block text-xs text-gray-500">
                              {build.startDate} - {build.endDate}
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.totalDesigned}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.totalExecuted}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.totalPassed}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.passPercentage}%</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.totalFailed}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.failPercentage}%</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{build.defectsFound}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-3">7. Defect Report</h2>
                
                <table className="w-full border-collapse text-sm mb-4">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-2 py-1 text-left text-gray-300">Severity</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Total Found</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Closed</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(defectSummary).map(([severity, counts]) => (
                      <tr key={severity}>
                        <td className="border border-gray-700 px-2 py-1 text-gray-300">{severity}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{counts.total || '-'}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{counts.closed || '-'}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{counts.open || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="text-lg font-medium text-gray-300 mb-2">Defect Summary</h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Defect ID</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Status</th>
                      <th className="border border-gray-700 px-2 py-1 text-center text-gray-300">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.DefectData?.map((defect, index) => (
                      <tr key={index}>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{defect.defectId}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{defect.status}</td>
                        <td className="border border-gray-700 px-2 py-1 text-center text-white">{defect.severity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Download Options & Summary */}
      <div className="space-y-6">
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Download Options</h3>
          
          <div className="space-y-3">
            <button
              onClick={onDownloadPDF}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Download PDF</span>
            </button>
            
            <button
              onClick={onDownloadDOCX}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Download DOCX</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
            <button
              onClick={onGenerateNew}
              className="w-full flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Generate New Report</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Report Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Test Cases</span>
              <span className="text-lg font-semibold text-white">{metrics.totalExecuted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Passed</span>
              <span className="text-lg font-semibold text-green-400">{metrics.totalPassed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Failed</span>
              <span className="text-lg font-semibold text-red-400">{metrics.totalFailed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Pass Rate</span>
              <span className="text-lg font-semibold text-blue-400">{metrics.passRate}%</span>
            </div>
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Defects</span>
                <span className="text-lg font-semibold text-white">{metrics.totalDefects}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">Open Defects</span>
                <span className="text-lg font-semibold text-yellow-400">{metrics.openDefects}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepExport;