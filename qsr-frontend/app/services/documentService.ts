import { QsrData, TestBuild, DefectSummary } from '@/app/types';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, TextRun, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

declare global {
  interface Window {
    html2pdf: any;
  }
}

export const generateReportHTML = (data: QsrData): string => {
  console.log('generateReportHTML called with data:', data);
  
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const defectSummary = calculateDefectSummary(data);
  
  console.log('Current date for HTML:', currentDate);
  console.log('Defect summary for HTML:', defectSummary);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 100%; 
          margin: 0; 
          padding: 15px; 
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 2px solid #3498db; 
          padding-bottom: 10px; 
          word-wrap: break-word;
          font-size: 18px;
        }
        h2 { 
          color: #34495e; 
          margin-top: 30px; 
          word-wrap: break-word;
          font-size: 16px;
        }
        h3 { 
          color: #7f8c8d; 
          word-wrap: break-word;
          font-size: 14px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          table-layout: fixed;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: left; 
          word-wrap: break-word;
          overflow-wrap: break-word;
          font-size: 12px;
        }
        th { background-color: #f2f2f2; font-weight: bold; }
        .section { margin-bottom: 25px; }
        .metadata { 
          background-color: #f9f9f9; 
          padding: 12px; 
          border-radius: 5px;
          word-wrap: break-word;
        }
        a { 
          color: #3498db; 
          text-decoration: none; 
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        a:hover { text-decoration: underline; }
        p { 
          word-wrap: break-word;
          overflow-wrap: break-word;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>TEST SUMMARY REPORT</h1>
      
      <div class="section">
        <h2>1. Purpose</h2>
        <p>The purpose of this Test Summary Report (TSR) is to demonstrate the establishment of the qualified state of the Apps system, summarize overall the activities as outlined in the associated Test Plan (TP) including result and conclusion of the testing & validation activities performed for implementing/upgrading the Kissflow application.</p>
      </div>
      
      <div class="section">
        <h2>2. Scope</h2>
        <p>The scope of the <strong>${data.TeamName || 'N/A'}</strong> squad release is limited to the items specified in the <strong>${data.FeatureName || 'N/A'}</strong> feature under description of change section.</p>
      </div>
      
      <div class="section">
        <h2>3. Environmental Details</h2>
        <p><strong>Pesagi Env:</strong> ${data.env || 'N/A'}<br/>
        <strong>TST Env:</strong> ${data.env || 'N/A'}</p>
      </div>
      
      <div class="section">
        <h2>4. System Risk Assessment Summary</h2>
        <h3>AUDIT LOG</h3>
        <table>
          <tr><td><strong>Prepared By</strong></td><td>${data.PreparedBy || 'N/A'}</td></tr>
          <tr><td><strong>Tested By</strong></td><td>${data.TestedBy || 'N/A'}</td></tr>
          <tr><td><strong>Developed By</strong></td><td>${data.DevelopedBy || 'N/A'}</td></tr>
          <tr><td><strong>Designed By</strong></td><td>${data.DesignedBy || 'N/A'}</td></tr>
          <tr><td><strong>Reviewed By</strong></td><td>${data.ReviewedBy || 'N/A'}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Test Summary Report for ${data.FeatureName || 'N/A'} feature</h2>
        
        <h3>GENERAL INFORMATION</h3>
        <div class="metadata">
          <p><strong>Test Level:</strong> System Testing &nbsp;&nbsp;&nbsp;&nbsp; <strong>Summary Date:</strong> ${currentDate}</p>
          <p><strong>Application:</strong> Pesagi URL: ${data.URL || 'N/A'} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Priority:</strong> High</p>
          <p><strong>Frontend PR:</strong> <a href="${data.FrontendPRLink || '#'}">${data.FrontendPRLink || 'N/A'}</a></p>
          <p><strong>Backend PR:</strong> <a href="${data.BackendPRLink || '#'}">${data.BackendPRLink || 'N/A'}</a></p>
          <p><strong>PBR Numbers:</strong> ${data.PRNumber || 'N/A'}</p>
        </div>
        
        <h3>FEATURE ARTIFACTS</h3>
        <p>
          <strong>Spec Document:</strong> <a href="${data.SpecDocLink}">${data.SpecDocLink || 'NA'}</a><br/>
          <strong>Design Document:</strong> <a href="${data.DesignLink}">${data.DesignLink || 'NA'}</a><br/>
          <strong>TDD Document:</strong> <a href="${data.TDDLink}">${data.TDDLink || 'NA'}</a>
        </p>
        
        <h3>TEST DELIVERABLES & REUSABLE ASSETS</h3>
        <p>
          <strong>Test Case Document:</strong> <a href="${data.TestCaseDocLink}">${data.TestCaseDocLink || 'NA'}</a><br/>
          <strong>Test Case Execution Document:</strong> <a href="${data.TestCaseExecutionLink}">${data.TestCaseExecutionLink || 'NA'}</a><br/>
          <strong>Evidence Document:</strong> <a href="${data.EvidenceDocLink}">${data.EvidenceDocLink || 'NA'}</a><br/>
          <strong>RTM:</strong> ${data.RTMDocLink ? `<a href="${data.RTMDocLink}">${data.RTMDocLink}</a>` : 'NA (optional)'}
        </p>
      </div>
      
      <div class="section">
        <h2>Test Execution Summary</h2>
        <p>The table below summarizes the overall test results for the builds that were tested for <strong>${data.FeatureName || 'N/A'}</strong> feature during <strong>${data.QuarterRelease || 'N/A'}</strong>.</p>
        
        <table>
          <thead>
            <tr>
              <th>Builds/Build Date</th>
              <th>Total Designed Test Cases</th>
              <th>Total Test Cases Executed</th>
              <th>No. Of Test Cases Passed</th>
              <th>% Of Passed Test Cases</th>
              <th>No. Of Test Cases Failed</th>
              <th>% Of Failed Test Cases</th>
              <th>Defects Found</th>
            </tr>
          </thead>
          <tbody>
            ${data.TestExecutionData?.map((build, index) => `
              <tr>
                <td>Build ${build.buildNumber} / Cycle ${build.buildNumber}<br/>${build.startDate || ''} - ${build.endDate || ''}</td>
                <td>${build.totalDesigned || 0}</td>
                <td>${build.totalExecuted || 0}</td>
                <td>${build.totalPassed || 0}</td>
                <td>${build.passPercentage || 0}%</td>
                <td>${build.totalFailed || 0}</td>
                <td>${build.failPercentage || 0}%</td>
                <td>${build.defectsFound || 0}</td>
              </tr>
            `).join('') || '<tr><td colspan="8">No test execution data available</td></tr>'}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Defect Report</h2>
        <table>
          <thead>
            <tr>
              <th>Severity Level Of Defect</th>
              <th>Total No. Of Defects Found In The Test Level</th>
              <th>Total No. Of Defects Closed At The End Of The Test Level</th>
              <th>Total No. Of Defects Open At The End Of The Test Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Critical</td>
              <td>${defectSummary.Critical.total || '-'}</td>
              <td>${defectSummary.Critical.closed || '-'}</td>
              <td>${defectSummary.Critical.open || '-'}</td>
            </tr>
            <tr>
              <td>High</td>
              <td>${defectSummary.High.total || '-'}</td>
              <td>${defectSummary.High.closed || '-'}</td>
              <td>${defectSummary.High.open || '-'}</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td>${defectSummary.Medium.total || '-'}</td>
              <td>${defectSummary.Medium.closed || '-'}</td>
              <td>${defectSummary.Medium.open || '-'}</td>
            </tr>
            <tr>
              <td>Low</td>
              <td>${defectSummary.Low.total || '-'}</td>
              <td>${defectSummary.Low.closed || '-'}</td>
              <td>${defectSummary.Low.open || '-'}</td>
            </tr>
          </tbody>
        </table>
        
        <h3>Defect Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Defect ID</th>
              <th>Status</th>
              <th>Severity Level of Defect</th>
            </tr>
          </thead>
          <tbody>
            ${data.DefectData?.map(defect => `
              <tr>
                <td>${defect.defectId}</td>
                <td>${defect.status}</td>
                <td>${defect.severity}</td>
              </tr>
            `).join('') || '<tr><td colspan="3">No defects reported</td></tr>'}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Approvals</h2>
        <table>
          <thead>
            <tr>
              <th>TITLE</th>
              <th>NAME</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Test Lead</td><td></td><td></td><td></td></tr>
            <tr><td>Test Manager</td><td></td><td></td><td></td></tr>
            <tr><td>Technical Manager</td><td></td><td></td><td></td></tr>
            <tr><td>Project Manager</td><td></td><td></td><td></td></tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
};

function calculateDefectSummary(data: QsrData): DefectSummary {
  const summary: DefectSummary = {
    Critical: { total: 0, closed: 0, open: 0 },
    High: { total: 0, closed: 0, open: 0 },
    Medium: { total: 0, closed: 0, open: 0 },
    Low: { total: 0, closed: 0, open: 0 },
  };

  data.DefectData?.forEach(defect => {
    const severity = defect.severity;
    summary[severity].total++;
    if (defect.status === 'Closed' || defect.status === 'Resolved') {
      summary[severity].closed++;
    } else {
      summary[severity].open++;
    }
  });

  return summary;
}

export async function generatePDF(data: QsrData): Promise<void> {
  try {
    console.log('=== PDF GENERATION START ===');
    console.log('Input data:', data);
    
    // Generate HTML content
    const htmlContent = generateReportHTML(data);
    console.log('HTML generated, length:', htmlContent.length);
    
    // Directly generate PDF without preview
    await generatePDFFromHTML(htmlContent, data);
    
  } catch (error) {
    console.error('Error in generatePDF:', error);
    throw error;
  }
}

async function generatePDFFromHTML(htmlContent: string, data: QsrData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log('=== STARTING PDF GENERATION FROM HTML ===');
      
      // Load html2pdf if not already loaded
      if (!window.html2pdf) {
        console.log('Loading html2pdf library...');
        const script = document.createElement('script');
        script.src = 'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js';
        
        script.onload = () => {
          console.log('html2pdf library loaded successfully');
          performPDFGeneration();
        };
        
        script.onerror = () => {
          console.error('Failed to load html2pdf library');
          reject(new Error('Failed to load html2pdf library'));
        };
        
        document.head.appendChild(script);
      } else {
        console.log('html2pdf already available');
        performPDFGeneration();
      }
      
      function performPDFGeneration() {
        try {
          // Create element for PDF generation
          const element = document.createElement('div');
          element.innerHTML = htmlContent;
          element.style.width = '190mm'; // Reduced width to fit within A4 margins
          element.style.maxWidth = '190mm';
          element.style.fontFamily = 'Arial, sans-serif';
          element.style.fontSize = '12px';
          element.style.lineHeight = '1.4';
          element.style.color = '#000';
          element.style.backgroundColor = '#fff';
          element.style.wordWrap = 'break-word';
          element.style.overflowWrap = 'break-word';
          element.style.boxSizing = 'border-box';
          
          // Configure options
          const options = {
            margin: [10, 10, 10, 10],
            filename: `QSR_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
              compress: true
            }
          };
          
          console.log('PDF options:', options);
          console.log('Starting html2pdf conversion...');
          
          // Generate PDF
          window.html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
              console.log('✅ PDF generated and downloaded successfully!');
              resolve();
            })
            .catch((error: any) => {
              console.error('❌ html2pdf conversion failed:', error);
              reject(error);
            });
            
        } catch (error) {
          console.error('❌ Error in performPDFGeneration:', error);
          reject(error);
        }
      }
      
    } catch (error) {
      console.error('❌ Error in generatePDFFromHTML:', error);
      reject(error);
    }
  });
}

export async function generateDOCX(data: QsrData): Promise<void> {
  console.log('Generating DOCX with data:', data);
  
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const defectSummary = calculateDefectSummary(data);
  
  console.log('Current date:', currentDate);
  console.log('Defect summary:', defectSummary);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "TEST SUMMARY REPORT",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        
        new Paragraph({
          text: "1. Purpose",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: "The purpose of this Test Summary Report (TSR) is to demonstrate the establishment of the qualified state of the Apps system, summarize overall the activities as outlined in the associated Test Plan (TP) including result and conclusion of the testing & validation activities performed for implementing/upgrading the Kissflow application.",
        }),
        
        new Paragraph({
          text: "2. Scope",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "The scope of the " }),
            new TextRun({ text: data.TeamName || 'N/A', bold: true }),
            new TextRun({ text: " squad release is limited to the items specified in the " }),
            new TextRun({ text: data.FeatureName || 'N/A', bold: true }),
            new TextRun({ text: " feature under description of change section." }),
          ],
        }),
        
        new Paragraph({
          text: "3. Environmental Details",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Pesagi Env: ", bold: true }),
            new TextRun({ text: data.env || 'N/A' }),
            new TextRun({ text: "\nTST Env: ", bold: true }),
            new TextRun({ text: data.env || 'N/A' }),
          ],
        }),
        
        new Paragraph({
          text: "4. System Risk Assessment Summary",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: "AUDIT LOG",
          heading: HeadingLevel.HEADING_3,
        }),
        
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Prepared By", bold: true })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: data.PreparedBy || 'N/A' })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Tested By", bold: true })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: data.TestedBy || 'N/A' })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Developed By", bold: true })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: data.DevelopedBy || 'N/A' })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Designed By", bold: true })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: data.DesignedBy || 'N/A' })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Reviewed By", bold: true })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: data.ReviewedBy || 'N/A' })],
                }),
              ],
            }),
          ],
        }),
        
        new Paragraph({ text: "" }),
        new Paragraph({
          text: "Approvals",
          heading: HeadingLevel.HEADING_2,
        }),
        
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "TITLE", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "NAME", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "STATUS", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "DATE", bold: true })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Test Lead" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Test Manager" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Technical Manager" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Project Manager" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
                new TableCell({ children: [new Paragraph({ text: "" })] }),
              ],
            }),
          ],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBlob(doc);
  console.log('DOCX buffer size:', buffer.size);
  
  const filename = `QSR_${data.FeatureName?.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
  console.log('DOCX filename:', filename);
  
  saveAs(buffer, filename);
  console.log('DOCX saved successfully');
}