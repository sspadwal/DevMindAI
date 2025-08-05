import { Eraser, Sparkles, Copy, Check, Upload, Download } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import "./RemoveBackground.css";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProcessedImage("");
      setUploadProgress(0);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = async () => {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
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
      toast.error("Please select an image file first");
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      
      // Simulate upload progress (3-5 seconds)
      await simulateUpload();
      
      setIsUploading(false);
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const { data } = await axios.post(
        "/api/ai/remove-image-background",
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
        setProcessedImage(data.content);
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error(error.response?.data?.message || 
                 error.message || 
                 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedImage);
      setCopied(true);
      toast.success("Image URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewImage("");
    setProcessedImage("");
    setUploadProgress(0);
  };

  return (
    <div className="remove-bg-container">
      <div className="remove-bg-wrapper">
        {/* Left Form */}
        <div className="form-panel">
          <div className="form-header">
            <div className="form-icon-container">
              <Eraser className="form-icon" />
            </div>
            <h1 className="form-title">Background Removal</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="form-content">
            <div>
              <label className="form-label">
                Upload Image
              </label>
              <div className="upload-container">
                <label className="upload-label">
                  <div className="upload-content">
                    <Upload className="upload-icon" />
                    <p className="upload-text">
                      <span>Click to upload</span> or drag and drop
                    </p>
                    <p className="upload-subtext">PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input 
                    onChange={handleFileChange} 
                    type="file" 
                    accept="image/*" 
                    className="upload-input" 
                    required
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

            {previewImage && !isUploading && !isProcessing && (
              <div>
                <label className="form-label">
                  Preview
                </label>
                <div className="preview-container">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={resetForm}
                    className="clear-preview"
                    disabled={isUploading || isProcessing}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="clear-icon" viewBox="0 0 20 20" fill="currentColor">
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
                <Loader className="button-icon animate-spin" />
              ) : (
                <Eraser className="button-icon" />
              )}
              <span>
                {isUploading ? "Uploading..." : 
                 isProcessing ? "Processing..." : 
                 "Remove Background"}
              </span>
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="result-panel">
          <div className="result-header">
            <div className="result-title-container">
              <Eraser className="result-icon" />
              <h1 className="result-title">Processed Image</h1>
            </div>
            {processedImage && (
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
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!processedImage ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <Eraser className="empty-state-icon" />
                <p>Upload an image and click "Remove Background" to get started</p>
                {(isUploading || isProcessing) && (
                  <div className="processing-message">
                    <Loader className="processing-icon animate-spin" />
                    <span>Processing your image...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="result-content">
              <div className="image-container">
                <img 
                  src={processedImage} 
                  alt="Background removed" 
                  className="processed-image" 
                />
              </div>
              <div className="action-buttons">
                <a
                  href={processedImage}
                  download="background-removed.png"
                  className="download-button"
                >
                  <Download className="button-icon" />
                  <span>Download</span>
                </a>
                <button
                  onClick={resetForm}
                  className="reset-button"
                >
                  <Sparkles className="button-icon" />
                  <span>Process Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;