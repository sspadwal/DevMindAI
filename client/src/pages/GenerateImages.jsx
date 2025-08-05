import { Image, Sparkles, Copy, Check,Edit } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import {Loader } from "lucide-react";

import "./GenerateImages.css";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const GenerateImages = () => {
  const imageStyles = [
    {
      name: "Realistic",
      emoji: "📸",
      tokens: 500,
      description: "Photorealistic images"
    },
    {
      name: "Ghibli Style",
      emoji: "🐉",
      tokens: 600,
      description: "Studio Ghibli inspired"
    },
    {
      name: "Anime Style",
      emoji: "🌸",
      tokens: 550,
      description: "Japanese anime look"
    },
    {
      name: "Cartoon Style",
      emoji: "🖍️",
      tokens: 500,
      description: "Western cartoon style"
    },
    {
      name: "Fantasy Style",
      emoji: "🧙",
      tokens: 650,
      description: "Fantasy art style"
    },
    {
      name: "3D Style",
      emoji: "🟦",
      tokens: 700,
      description: "3D rendered look"
    },
    {
      name: "Portrait Style",
      emoji: "👤",
      tokens: 600,
      description: "Professional portraits"
    }
  ];

  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [publish, setPublish] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a high-quality ${selectedStyle.name} image of: ${input}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { 
          prompt,
          style: selectedStyle.name,
          tokens: selectedStyle.tokens,
          publish
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

 const handleCopy = async () => {
  try {
    if (!content) {
      toast.error("No image URL to copy");
      return;
    }

    // Fallback method for browsers that don't support clipboard API
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('Failed to copy using fallback method');
        }
        setCopied(true);
        toast.success("Image URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(textarea);
      }
      return;
    }

    // Modern clipboard API
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    toast.error("Failed to copy URL. Try manually selecting the URL.");
  }
};

  return (
    <div className="generate-images-container">
      <div className="generate-images-wrapper">
        {/* Left Form */}
        <div className="form-panel">
          <div className="form-header">
            <div className="form-icon-container">
              <Sparkles className="form-icon" />
            </div>
            <h1 className="form-title">Image Configuration</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="form-content">
            <div>
              <label className="form-label">
                Image Description
              </label>
              <textarea
                onChange={e => setInput(e.target.value)}
                value={input}
                className="form-textarea"
                placeholder="A futuristic cityscape at sunset with flying cars..."
                required
              />
            </div>

            <div>
              <label className="form-label">
                Style
              </label>
              <div className="style-options">
                {imageStyles.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedStyle(item)}
                    className={`style-option ${
                      selectedStyle.name === item.name ? "selected" : ""
                    }`}
                  >
                    <span className="style-emoji">{item.emoji}</span>
                    <span className={`style-name ${
                      selectedStyle.name === item.name ? "selected" : ""
                    }`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="publish-checkbox">
              <input
                type="checkbox"
                id="publish"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              <label htmlFor="publish">
                Make this image public
              </label>
            </div>

            {/* <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <Image className="copy-icon" />
              )}
              <span>Generate Image</span>
            </button> */}

<button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              <span>Generate Image</span>
            </button>








          </form>
        </div>

        {/* Right Panel */}
        <div className="result-panel">
          <div className="result-header">
            <div className="result-title-container">
              <Image className="result-icon" />
              <h1 className="result-title">Generated Image</h1>
            </div>
            {content && (
              <button
                onClick={handleCopy}
                className="copy-button"
              >
                {copied ? (
                  <>
                    <Check className="check-icon" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="copy-icon" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!content ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <Image className="empty-state-icon" />
                <p>Enter a description and click "Generate Image" to get started</p>
              </div>
            </div>
          ) : (
            <div className="image-content">
              <img 
                src={content} 
                alt="Generated content" 
                className="generated-image" 
              />
              <button
                onClick={() => setContent("")}
                className="new-image-button"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;