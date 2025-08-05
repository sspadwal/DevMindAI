import { Edit, Sparkles, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";
import {Loader } from "lucide-react";

import "./WriteArticle.css";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const WriteArticle = () => {
  const articleLength = [
    {
      length: 800,
      tokens: 1500,
      text: "Short (500-800 words)",
      description: "Quick reads, blog posts",
    },
    {
      length: 1200,
      tokens: 2200,
      text: "Medium (800-1200 words)",
      description: "Detailed articles, guides",
    },
    {
      length: 1600,
      tokens: 2800,
      text: "Long (1200+ words)",
      description: "In-depth reports",
    },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write a comprehensive article about ${input}. Target length: approximately ${selectedLength.length} words.`;
      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: selectedLength.length,
          tokens: selectedLength.tokens,
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
      if (!navigator.clipboard) {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = content;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();

        try {
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Failed to copy using fallback method");
          }
          setCopied(true);
          toast.success("Article copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        } finally {
          document.body.removeChild(textarea);
        }
      } else {
        // Modern clipboard API
        await navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Article copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="write-article-container">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="write-article-wrapper">
        {/* Left Form */}
        <div className="form-panel">
          <div className="form-header">
            <div className="form-icon-container">
              <Sparkles className="form-icon" />
            </div>
            <h1 className="form-title">Article Configuration</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="form-content">
            <div>
              <label className="form-label">Article Topic</label>
              <input
                onChange={e => setInput(e.target.value)}
                value={input}
                type="text"
                className="form-input"
                placeholder="The future of artificial intelligence is..."
                required
              />
            </div>

            <div>
              <label className="form-label">Article Length</label>
              <div className="length-options">
                {articleLength.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedLength(item)}
                    className={`length-option ${
                      selectedLength.text === item.text ? "selected" : ""
                    }`}
                  >
                    <div className="length-option-content">
                      <span
                        className={`length-option-title ${
                          selectedLength.text === item.text ? "selected" : ""
                        }`}
                      >
                        {item.text.split(" ")[0]}
                      </span>
                      <p className="length-option-description">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              <span>Generate Article</span>
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="result-panel">
          <div className="result-header">
            <div className="result-title-container">
              <Edit className="result-icon" />
              <h1 className="result-title">Generated Article</h1>
            </div>
            {content && (
              <button
                onClick={handleCopy}
                className={`copy-button ${copied ? "copied" : ""}`}
                aria-label="Copy article content"
                disabled={!content}
              >
                {copied ? (
                  <>
                    <Check className="check-icon" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="copy-icon" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!content ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <Edit className="empty-state-icon" />
                <p>Enter a topic and click "Generate article" to get started</p>
              </div>
            </div>
          ) : (
            <div className="article-content">
              <div className="reset-tw">
                <Markdown>{String(content)}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
