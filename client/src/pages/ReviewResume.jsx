import { FileText, Sparkles, Copy, Check, Upload, Edit } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import Markdown from "react-markdown";
import "./ReviewResume.css";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const ReviewResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a valid PDF file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume file size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setContent("");
      setUploadProgress(0);
    }
  };

  const simulateUpload = () => {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(Math.min(progress, 100));
      }, 300);
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a PDF file first");
      return;
    }

    try {
      setIsUploading(true);
      
      // Simulate upload progress (5-6 seconds)
      await simulateUpload();
      
      setIsUploading(false);
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      if (data.success) {
        setContent(data.content);
        toast.success('Resume reviewed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error reviewing resume:', error);
      toast.error(error.response?.data?.message || 
                 error.message || 
                 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Review text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setContent("");
    setUploadProgress(0);
  };

  return (
    <div className="resume-review-container">
      <div className="resume-review-wrapper">
        {/* Left Form */}
        <div className="upload-panel">
          <div className="panel-header">
            <div className="header-icon">
              <FileText className="panel-icon" />
            </div>
            <h1 className="panel-title">Resume Review</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="upload-form">
            <div className="form-group">
              <label className="form-label">
                Upload Resume (PDF)
              </label>
              <div className="upload-area">
                <label className="upload-label">
                  <div className="upload-content">
                    <Upload className="upload-icon" />
                    <p className="upload-text">
                      <span>Click to upload</span> or drag and drop
                    </p>
                    <p className="upload-subtext">PDF only (MAX. 5MB)</p>
                  </div>
                  <input 
                    onChange={handleFileChange} 
                    type="file" 
                    accept="application/pdf" 
                    className="upload-input" 
                    disabled={isUploading || isProcessing}
                  />
                </label>
              </div>
            </div>

            {(isUploading || isProcessing) && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {isUploading ? "Uploading..." : "Processing..."}
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            {selectedFile && !isUploading && !isProcessing && (
              <div className="form-group">
                <label className="form-label">
                  Selected File
                </label>
                <div className="file-preview">
                  <div className="file-info">
                    <FileText className="file-icon" />
                    <div>
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="clear-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || isUploading || isProcessing}
              className="submit-button"
            >
              {isUploading || isProcessing ? (
                <Loader className="button-icon spin" />
              ) : (
                <Edit className="button-icon" />
              )}
              <span>
                {isUploading ? "Uploading..." : 
                 isProcessing ? "Processing..." : 
                 "Review Resume"}
              </span>
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="result-panel">
          <div className="panel-header">
            <div className="header-icon">
              <FileText className="panel-icon" />
            </div>
            <h1 className="panel-title">Analysis Result</h1>
            {content && (
              <button
                onClick={handleCopy}
                className="copy-button"
                disabled={isUploading || isProcessing}
              >
                {copied ? (
                  <>
                    <Check className="button-icon" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="button-icon" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!content ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <p>Upload a PDF resume and click "Review Resume" to get started</p>
              {(isUploading || isProcessing) && (
                <div className="processing-message">
                  <Loader className="processing-icon spin" />
                  <span>Processing your resume...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="result-content">
              <div className="markdown-content">
                <Markdown>{content}</Markdown>
              </div>
              <div className="action-buttons">
                <button
                  onClick={resetForm}
                  className="new-analysis-button"
                >
                  <Sparkles className="button-icon" />
                  <span>Analyze Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;