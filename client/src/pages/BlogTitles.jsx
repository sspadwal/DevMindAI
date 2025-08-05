import { Edit, Hash, Sparkles, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import {Loader } from "lucide-react";

import "./BlogTitles.css";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const BlogTitles = () => {
  const blogCategories = [
    { name: "General", icon: "🌐" },
    { name: "Technology", icon: "💻" },
    { name: "Business", icon: "💼" },
    { name: "Health", icon: "🏥" },
    { name: "Lifestyle", icon: "✨" },
    { name: "Education", icon: "🎓" },
    { name: "Travel", icon: "✈️" },
    { name: "Food", icon: "🍴" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
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
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();

        try {
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Failed to copy using fallback method");
          }
          setCopied(true);
          toast.success("Titles copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        } finally {
          document.body.removeChild(textarea);
        }
      } else {
        // Modern clipboard API
        await navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Titles copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy titles");
    }
  };

  return (
    <div className="blog-titles-container">
      <div className="blog-titles-wrapper">
        {/* Left Form */}
        <div className="form-panel">
          <div className="form-header">
            <div className="form-icon-container">
              <Sparkles className="form-icon" />
            </div>
            <h1 className="form-title">Title Configuration</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="form-content">
            <div>
              <label className="form-label">Keyword</label>
              <input
                onChange={e => setInput(e.target.value)}
                value={input}
                type="text"
                className="form-input"
                placeholder="Enter your keyword..."
                required
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <div className="category-options">
                {blogCategories.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCategory(item.name)}
                    className={`category-option ${
                      selectedCategory === item.name ? "selected" : ""
                    }`}
                  >
                    <div className="category-option-content">
                      <span className="text-sm mr-1">{item.icon}</span>
                      <span
                        className={`category-option-title ${
                          selectedCategory === item.name ? "selected" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <Hash className="copy-icon" />
              )}
              <span>Generate Titles</span>
            </button> */}

<button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              <span>Generate Titles</span>
            </button>



          </form>
        </div>

        {/* Right Panel */}
        <div className="result-panel">
          <div className="result-header">
            <div className="result-title-container">
              <Hash className="result-icon" />
              <h1 className="result-title">Generated Titles</h1>
            </div>
            {content && (
              <button
                onClick={handleCopy}
                className={`copy-button ${copied ? "copied" : ""}`}
                aria-label="Copy titles"
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
                <Hash className="empty-state-icon" />
                <p>
                  Enter a keyword and click "Generate titles" to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="titles-content">
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

export default BlogTitles;
