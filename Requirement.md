# Quality Summary Report Automation – Requirement & Planning Phase

## 1. Objective
The objective is to automate the generation of the **Quality Summary Report (QSR)** to reduce manual effort, ensure consistency, and improve reporting accuracy across releases.  

This automation will fetch testing results, defects, and associated documentation, and generate a standardized QSR in PDF/Docx format.

---

## 2. Current Manual Process
- QA team manually updates the QSR template after each release.  
- Inputs include:
  - Test execution results from test management tools.  
  - Defect logs from issue tracking systems.  
  - Links to specification, design, and test documents.  
- Data is copy-pasted into the QSR template.  
- Final report is reviewed and approved by stakeholders.  

**Pain Points:**
- Time-consuming and repetitive.  
- Risk of human error (missing data, wrong percentages).  
- Lack of traceability when multiple builds are executed.  

---

## 3. Requirements

### 3.1 Functional Requirements
- **Report Generation**
  - System should generate the QSR using the existing template structure.
  - Must support export to **PDF, and DOCX** formats.

- **Data Ingestion**
  - **Primary Input:** User will provide a unique **Item ID** from a Kissflow board record.
  - **Automated Fetching:** The system will connect to Kissflow via its API to pull all available report data (e.g., feature name, environment, document links, test results).
  - **Fallback Manual Entry:** If the Kissflow record is missing any data required for the report, the system will present a form to the user to fill in *only* the missing fields.

- **Customization**
  - Support placeholders (e.g., `{FeatureName}`, `{Env}`, `{Frontend PR link}`, `{Backend PR link}`, `{SpecDocLink}`) to auto-fill data.
  - Allow configurable templates per squad/release.

- **Automation Flow**
  - User provides a Kissflow Item ID and triggers a "Fetch Data" action.
  - System pulls all available data from the Kissflow record.
  - If data is missing, the system prompts the user to fill in the gaps.
  - Once all data is present, the user triggers a "Generate Report" action.
  - The system generates the final report with the approvals section ready for sign-off.  

### 3.2 Non-Functional Requirements
- **Usability** – Easy for QA team to run the automation without technical complexity.  
- **Scalability** – Should support multiple squads and parallel releases.  
- **Maintainability** – Easy to update when template changes.  
- **Accuracy** – 100% match with manual report structure.  

---

## 4. Scope
- **In-Scope**
  - Automating report content population.  
  - Integration with test management & defect tracking systems.  
  - Generating reports in multiple formats.  

- **Out of Scope**
  - Creation of new test cases or defect entries.  
  - Approval workflow automation (manual sign-off remains).  

---

## 5. Dependencies
- Access to squad documentation links (spec doc, TDD, RTM).  

---

## 6. Risks
- Template updates may require code changes.  
- Data quality issues if source systems are not updated correctly.  
- Integration challenges across multiple tools.  

---

## 7. Planning

### 7.1 Phase 1 – Requirement Finalization
- Confirm mandatory vs optional fields in QSR.  
- Identify data sources for each section (manual entry vs automated fetch).  
- Validate with QA leads and stakeholders.  

### 7.2 Phase 2 – Design
- Define architecture for report generation.  
- Create mapping between template placeholders and data sources.  
- Define error handling (e.g., missing links or incomplete test execution).  

### 7.3 Phase 3 – Development
- Build connectors to pull data from tools.  
- Implement template engine to populate report.  
- Enable export to PDF, DOCX.  

### 7.4 Phase 4 – Testing
- Validate generated reports against existing manual reports.  
- Regression test across multiple features/releases.  

### 7.5 Phase 5 – Rollout
- Deploy to QA teams.  
- Provide training/documentation.  
- Monitor adoption and collect feedback.  

---

## 8. Deliverables
- Automated QSR template engine.  
- Configurable mapping file for squads/releases.  
- Export functionality (PDF/DOCX).  
- User guide for QA teams.  

---

✅ This document represents the **Requirement Gathering & Planning Phase** for QSR automation.

---
---

# Appendix A: QSR Template

**TEST SUMMARY REPORT**

1. **Purpose:**

The purpose of this Test Summary Report (TSR) is to demonstrate the establishment of the qualified state of the Apps system, summarize overall the activities as outlined in the associated Test Plan (TP) including result and conclusion of the testing & validation activities performed for implementing/upgrading the Kissflow application. This Test Summary Report serves as a summary of the process of testing, and validation documentation deliverables and defects related to the testing for the release. Approval of this quality summary report document marks the completion of the System validation activities for the release. 

2. **Scope:**

The scope of the {TeamName} squad release is limited to the items specified in the {feature name} feature under description of change section.

3. **Environmental Details:**

**Pesagi Env: {env}**  
**TST Env: {env}**

4. **System Risk Assessment Summary:**  
   

| AUDIT LOG |  |
| ----- | :---- |
| **Prepared By** | {Name} |
| **Tested By** | {Name} |
| **Developed By** | {Name} |
| **Designed By** | {Name} |
| **Reviewed By** | {Name} |

**Test Summary Report for {FeatureName} feature**

| GENERAL INFORMATION |  |  |
| ----- | :---- | :---- |
|  **Test Level:                                                                                                     Summary Date:  15-05-2024**  |  |  |
| **Application: Pesagi URL: {URL} Priority:** High |  | **Frontend PR: {Frontend PR link}** **Backend PR: {Backend PR link}** **PBR Numbers: {PR number}**  |
| **SUMMARY** |  |  |
| **FEATURE ARTIFACTS** | INSCOPE: **Spec Document:** {spec doc link} **Design Document:** {design link} **TDD Document:** {TDD link} |  |
| **DEVIATION (VARIANCES) & RESIDUAL RISK** |  **NA** |  |

| TEST DELIVERABLES & REUSABLE ASSETS | Test Case Document: {Test case Doc link} Test case Execution Document:{Test case execution link} Evidence Document: {evidence doc link} RTM: RTM doc if the optional   |  |
| :---- | :---- | ----- |

***Test Execution Summary:***

*The table below summarizes the overall test results for the builds that were tested for **{Feature name}** feature during **{Quarter release }.***

| *Builds/ Build Date* | *Total Designed Test Cases* | *Total Test Cases Executed* | *No. Of Test Cases Passed* | *% Of Passed Test Cases* | *No. Of Test Cases Failed* | *% Of Failed Test Cases* | *Defects Found* |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| ***Build 1 / Cycle 1** Start date \- End date* | TC count | TC count | TC count | Pass percentage | Number of failed TC | percentage of failed TC | [No.of](http://No.of) Defect found |
| ***Build 2 / Cycle 2** Start date \- End date* | TC count | TC count | TC count | Pass percentage | Number of failed TC | percentage of failed TC | [No.of](http://No.of) Defect found |

***Defect Report:***

| *Severity Level Of Defect* | *Total No. Of Defects Found In The Test Level* | *Total No. Of Defects Closed At The End Of The Test Level* | *Total No. Of Defects Open At The End Of The Test Level*  |
| ----- | :---: | :---: | :---: |
| Critical | \- | \- | \- |
| High | 3 | 3 | 0 |
| Medium | \- | \- | \- |
| Low | \- | \- | \- |

***Defect Summary:***

| *Defect ID* | *Status* | *Severity Level of Defect* |
| :---: | :---: | :---: |
| {Defect ID} | {Status}  | {Priority} |
|  |  |  |
|  |  |  |

***Approvals:***

| TITLE | NAME | STATUS | DATE |
| :---- | :---- | :---- | :---- |
| ***Test Lead*** |  |  |  |
| ***Test Manager*** |  |  |  |
| ***Technical Manager*** |  |  |  |
| ***Project Manager*** |  |  |  |

---
---

# Appendix B: Required Input Fields

This document lists all the data fields required to generate the Quality Summary Report (QSR). The primary source for this data should be a Kissflow board record.

---

### Category 1: Core Report Information
*This data defines the release and should be fetched directly from the main Kissflow record.*

-   `{TeamName}`
-   `{FeatureName}`
-   `{Quarter release}`
-   `{env}` (for both Pesagi and TST environments)
-   `{URL}` (for the application)
-   `{Frontend PR link}`
-   `{Backend PR link}`
-   `{PR number}`

---

### Category 2: Document & Artifact Links
*These are the URLs that should be stored as fields in the Kissflow record.*

-   `{spec doc link}`
-   `{design link}`
-   `{TDD link}`
-   `{Test case Doc link}`
-   `{Test case execution link}`
-   `{evidence doc link}`

---

### Category 3: Personnel / Audit Information
*Names of the individuals responsible for different stages.*

-   `Prepared By`
-   `Tested By`
-   `Developed By`
-   `Designed By`
-   `Reviewed By`

---

### Category 4: Test Execution & Defect Data
*This is the quantitative data that should be pulled from a test management tool or defect tracker, which is linked or summarized in the Kissflow record.*

-   **Test Execution Summary (per build/cycle):**
    -   `Total Designed Test Cases`
    -   `Total Test Cases Executed`
    -   `No. Of Test Cases Passed`
    -   `No. Of Test Cases Failed`
    -   *(Note: Pass/Fail percentages are calculated from these numbers.)*

-   **Defect Summary (a list of defects, where each has):**
    -   `{Defect ID}`
    -   `{Status}` (e.g., "Closed", "Open")
    -   `{Priority}` / `{Severity}` (e.g., "High", "Medium")
    -   *(Note: The summary table that counts defects by severity is generated by processing this list.)*
