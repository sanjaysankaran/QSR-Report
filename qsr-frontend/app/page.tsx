'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import ProgressBar from '@/app/components/ProgressBar';
import StepFetch from '@/app/components/StepFetch';
import StepValidate from '@/app/components/StepValidate';
import StepGenerate from '@/app/components/StepGenerate';
import StepExport from '@/app/components/StepExport';
import { QsrData, Step, StepStatus } from '@/app/types';
import { fetchQsrData } from '@/app/services/kissflowService';
import { generatePDF, generateDOCX } from '@/app/services/documentService';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('fetch');
  const [stepStatus, setStepStatus] = useState<StepStatus>({
    fetch: 'pending',
    validate: 'pending',
    generate: 'pending',
    export: 'pending',
  });
  const [reportData, setReportData] = useState<QsrData>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  
  // Specific loading states for each step
  const [isFetching, setIsFetching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progressText, setProgressText] = useState('Ready to Start');
  
  const [generationStatus, setGenerationStatus] = useState({
    processing: false,
    calculating: false,
    template: false,
    downloads: false,
  });

  const handleFetchData = async (itemId: string) => {
    setIsFetching(true);
    setFetchStatus('loading');
    setErrorMessage('');
    setProgressText('Fetching data from Kissflow...');
    setStepStatus(prev => ({ ...prev, fetch: 'pending' }));

    try {
      const response = await fetchQsrData(itemId);
      
      if (response.success) {
        setReportData(response.data);
        setMissingFields(response.missingFields);
        setFetchStatus('success');
        setStepStatus(prev => ({ ...prev, fetch: 'success' }));
        setCurrentStep('validate');
        setProgressText('Data fetched successfully! Please validate and fill missing fields.');
      }
    } catch (error) {
      setFetchStatus('error');
      setStepStatus(prev => ({ ...prev, fetch: 'error' }));
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setProgressText('Failed to fetch data. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleValidateData = () => {
    setIsValidating(true);
    setProgressText('Validating data...');
    setStepStatus(prev => ({ ...prev, validate: 'pending' }));
    
    // Add a small delay to show validation process
    setTimeout(() => {
      const updatedMissingFields = [];
      
      const requiredFields = [
        'FeatureName', 'TeamName', 'QuarterRelease', 'env', 'URL', 
        'FrontendPRLink', 'BackendPRLink', 'PRNumber', 'SpecDocLink', 
        'DesignLink', 'TDDLink', 'TestCaseDocLink', 'TestCaseExecutionLink', 
        'EvidenceDocLink', 'PreparedBy', 'TestedBy', 'DevelopedBy', 
        'DesignedBy', 'ReviewedBy'
      ];

      for (const field of requiredFields) {
        if (!reportData[field as keyof QsrData]) {
          updatedMissingFields.push(field);
        }
      }

      if (!reportData.TestExecutionData || reportData.TestExecutionData.length === 0) {
        updatedMissingFields.push('TestExecutionData');
      }

      // DefectData is now optional - not required for validation

      if (updatedMissingFields.length === 0) {
        setStepStatus(prev => ({ ...prev, validate: 'success' }));
        setCurrentStep('generate');
        setProgressText('Data validation complete! Ready to generate report.');
      } else {
        setStepStatus(prev => ({ ...prev, validate: 'error' }));
        setMissingFields(updatedMissingFields);
        setProgressText(`Please fill in ${updatedMissingFields.length} missing fields.`);
      }
      
      setIsValidating(false);
    }, 800);
  };

  const handleUpdateData = (updatedData: QsrData) => {
    setReportData(updatedData);
  };

  const handleGenerateReport = async (selectedFormats: string[]) => {
    setIsGenerating(true);
    setProgressText('Generating report...');

    const steps = ['processing', 'calculating', 'template', 'downloads'] as const;
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationStatus(prev => ({ ...prev, [steps[i]]: true }));
    }

    setStepStatus(prev => ({ ...prev, generate: 'success' }));
    setCurrentStep('export');
    setProgressText('Report generated successfully! Ready for download.');
    setIsGenerating(false);
    
    setGenerationStatus({
      processing: false,
      calculating: false,
      template: false,
      downloads: false,
    });
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(reportData);
      // Mark export step as complete after successful download
      setStepStatus(prev => ({ ...prev, export: 'success' }));
      setProgressText('Report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      await generateDOCX(reportData);
      // Mark export step as complete after successful download
      setStepStatus(prev => ({ ...prev, export: 'success' }));
      setProgressText('Report downloaded successfully!');
    } catch (error) {
      console.error('DOCX generation failed:', error);
    }
  };

  const handleGenerateNew = () => {
    setCurrentStep('fetch');
    setStepStatus({
      fetch: 'pending',
      validate: 'pending',
      generate: 'pending',
      export: 'pending',
    });
    setReportData({});
    setMissingFields([]);
    setFetchStatus('idle');
    setErrorMessage('');
    setProgressText('Ready to Start');
    
    // Reset all loading states
    setIsFetching(false);
    setIsValidating(false);
    setIsGenerating(false);
    setGenerationStatus({
      processing: false,
      calculating: false,
      template: false,
      downloads: false,
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'fetch':
        return (
          <StepFetch
            onFetchData={handleFetchData}
            isLoading={isFetching}
            fetchStatus={fetchStatus}
            errorMessage={errorMessage}
          />
        );
      case 'validate':
        return (
          <StepValidate
            data={reportData}
            missingFields={missingFields}
            onUpdateData={handleUpdateData}
            onValidate={handleValidateData}
            isValidating={isValidating}
          />
        );
      case 'generate':
        return (
          <StepGenerate
            onGenerate={handleGenerateReport}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
          />
        );
      case 'export':
        return (
          <StepExport
            reportData={reportData}
            onDownloadPDF={handleDownloadPDF}
            onDownloadDOCX={handleDownloadDOCX}
            onGenerateNew={handleGenerateNew}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            stepStatus={stepStatus}
            progressText={progressText}
            isProcessing={isFetching || isValidating || isGenerating}
          />
        </div>
        
        <div className="mb-8">
          {renderCurrentStep()}
        </div>
      </main>
    </div>
  );
}