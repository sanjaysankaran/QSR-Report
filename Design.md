# QSR Automation - UI/UX Design Specification

This document outlines the user interface (UI) and user experience (UX) flow of the QSR Automation portal, as implemented in `NewDesign.html`.

## 1. Overall Design Philosophy

The application adopts a modern, dark-themed "glass morphism" design. Key characteristics include:
- **Theme:** Dark background with blurred, semi-transparent elements.
- **Effects:** Glowing highlights on interactive elements and progress bars to provide visual feedback.
- **Layout:** A clean, single-page application structured as a multi-step wizard.
- **Responsiveness:** The layout is responsive, adapting to different screen sizes using a grid system.

---

## 2. UI Component Breakdown

The interface is composed of several distinct sections, each corresponding to a step in the report generation workflow.

### 2.1 Header
A sticky header at the top of the page provides consistent branding and context.
- **Left Side:** Application icon, title (`QSR Automation`), and subtitle (`Quality Summary Report Generator`).
- **Right Side:** "Powered by Kissflow" attribution, version number, and a settings icon.

### 2.2 Automation Progress Bar
This component is always visible and tracks the user's progress through the workflow.
- **Title:** "Automation Progress".
- **Status Text:** A dynamic label indicating the current state (e.g., "Ready to Start", "Fetching Data...", "Complete!").
- **Progress Bar:** A visual bar that fills as the user completes each step.
- **Step Indicators:** Four distinct status markers for each stage:
  1.  **Fetch Data**
  2.  **Validate**
  3.  **Generate**
  4.  **Export**
  Each marker changes color (pending, success, error) to reflect the status of the step.

---

## 3. Workflow Steps

The application guides the user through a 4-step process.

### Step 1: Fetch Data from Kissflow
This is the initial screen the user interacts with.
- **Input:** A single text field for the user to enter the **Kissflow Item ID**.
- **Primary Action:** A **"Fetch Data"** button to initiate the process.
- **Information Panel:** A section detailing the types of data that will be automatically fetched (e.g., Feature Info, Document Links, Test Data).
- **Status Feedback:** A dedicated area appears after clicking "Fetch" to show the status of the API call (e.g., "Connecting...", "Data fetched successfully!", "Failed to fetch data").

![Step 1](./Screen%201.png)

### Step 2: Data Validation & Manual Entry
This step appears after data has been successfully fetched. It's a comprehensive form allowing the user to review the fetched data and manually input any missing information. The form is divided into logical sections:
- **Core Report Information:** Fields for Team Name, Feature Name, Quarter, Environment, etc.
- **Document & Artifact Links:** Input fields for all relevant URLs (Frontend/Backend PRs, Spec, TDD, Test Cases, etc.).
- **Personnel / Audit Information:** Fields for the names of individuals who prepared, tested, developed, designed, and reviewed the feature.
- **Test Execution Data:**
    - A repeatable section for each test build/cycle.
    - Each section contains inputs for `Total Designed`, `Total Executed`, and `Passed` test cases.
    - An **"Add Another Build"** button allows for dynamic entry of multiple test cycles.
- **Defect Information:**
    - A repeatable section for each defect.
    - Each section contains inputs for `Defect ID`, `Status` (dropdown), and `Severity` (dropdown).
    - An **"Add Another Defect"** button allows for dynamic entry of multiple defects.
- **Primary Action:** A **"Validate Data"** button at the bottom to confirm all data is correct and proceed to the next step.

![Step 2](./Screen%202.png)

### Step 3: Generate Report
This step focuses on configuring and initiating the final report generation.
- **Generation Options:** Checkboxes allowing the user to select the desired output formats:
    - PDF Document
    - Word Document (.docx)
- **Primary Action:** A **"Generate Report"** button, which has a pulsing glow effect to draw attention.
- **Status Panel:** A real-time status tracker for the generation process, showing the state of:
    - Processing Data
    - Calculating Metrics
    - Generating Template
    - Creating Downloads

![Step 3](./Screen%203.png)

### Step 4: Report Preview & Export
The final step where the user can review and download the generated report.
- **Report Preview:** A large, scrollable pane on the left displays the generated report in a clean, readable HTML format.
- **Download Options:** A panel on the right with distinct buttons to download the report in each of the selected formats (Markdown, PDF, DOCX).
- **Quick Actions:** Buttons for secondary actions like "Edit Report", "Share Link", and "Generate New".
- **Report Summary:** A concise summary panel displaying key calculated metrics:
    - Total Test Cases
    - Passed / Failed Counts
    - Pass Rate (%)
    - Total & Open Defects

![Step 4](./Screen%204.png)

### Success Message
After the report is generated in Step 4, a final success message appears with primary actions to **"Download All Formats"** or **"Generate Another"**.