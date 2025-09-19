import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import UploadProgressBar from "../components/uploadProgressBar.jsx";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/uploadPDF", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      console.log("Uploaded:", res.data);
      navigate("/documents");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 360,
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: 30,
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: 24, color: "#333" }}>Upload PDF</h1>

        {/* Custom styled file input */}
        <label
          htmlFor="file-upload"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: 16,
            userSelect: "none",
            boxShadow: "0 2px 8px rgb(0 123 255 / 0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          {file ? "Change File" : "Choose PDF"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        {/* Show selected file name */}
        {file && (
          <p
            style={{
              fontSize: 14,
              color: "#555",
              marginTop: 8,
              marginBottom: 20,
              wordBreak: "break-word",
            }}
            title={file.name}
          >
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file}
            style={{
                width: "100%",
                padding: "12px 0",
                fontSize: 16,
                fontWeight: "600",
                color: file ? "#fff" : "#aaa",
                backgroundColor: file ? "#28a745" : "#e0e0e0",
                border: "none",
                borderRadius: 6,
                cursor: file ? "pointer" : "not-allowed",
                boxShadow: file ? "0 3px 8px rgba(40,167,69,0.5)" : "none",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          onMouseEnter={(e) => {
            if (file) e.currentTarget.style.backgroundColor = "#218838";
          }}
          onMouseLeave={(e) => {
            if (file) e.currentTarget.style.backgroundColor = "#28a745";
          }}
        >
          Upload
        </button>

        {progress > 0 && <UploadProgressBar progress={progress} />}
      </div>
    </div>
  );
}
