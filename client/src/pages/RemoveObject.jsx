import { Scissors, Sparkles, Copy, Check, Upload,Edit } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {Loader } from "lucide-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const RemoveObject = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [object, setObject] = useState("");
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setContent(""); // Clear previous result when new file is selected
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitHandler = async e => {
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

    if (!object.trim()) {
      return toast.error('Please describe the object to remove');
    }
    
    if (object.trim().split(' ').length > 1) {
      return toast.error('Please enter only one object name');
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('object', object.trim());
      
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      if (data.success) {
        setContent(data.content);
        toast.success('Object removed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error removing object:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewImage("");
    setContent("");
    setObject("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-6">
        {/* Left Form - Matching Design */}
        <div className="w-full lg:w-1/2 xl:w-2/5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Scissors className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Object Removal</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input 
                    onChange={handleFileChange} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    required
                  />
                </label>
              </div>
            </div>

            {previewImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={resetForm}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object to Remove
              </label>
              <input
                type="text"
                value={object}
                onChange={(e) => setObject(e.target.value)}
                className="w-full p-2 px-3 outline-none text-sm rounded-md border border-gray-300"
                placeholder="e.g., watch, spoon, car (only single object name)"
                required
              />
            </div>

            {/* <button
              disabled={loading || !selectedFile || !object.trim()}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              <span>Remove Object</span>
            </button> */}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              <span>Remove Object</span>
            </button>
          </form>
        </div>

        {/* Right Panel - With Copy Button */}
        <div className="w-full lg:w-1/2 xl:w-3/5 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-[#4A7AFF]" />
              <h1 className="text-xl font-semibold">Processed Image</h1>
            </div>
            {content && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Scissors className="w-9 h-9" />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-lg">
                <img 
                  src={content} 
                  alt="Object removed" 
                  className="w-full h-auto rounded-lg shadow-sm border border-gray-200" 
                />
                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Process Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;