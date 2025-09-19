import React from "react";

export default function UploadProgressBar({ progress }) {
  return (
    <div
      style={{
        width: "100%",         // full width of parent
        maxWidth: 360,         // max width to match UploadPage container nicely
        height: 24,
        backgroundColor: "#e9ecef",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        marginTop: 16,
        userSelect: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #28a745, #218838)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
          borderRadius: 12,
          whiteSpace: "nowrap",
          transition: "width 0.4s ease",
          boxShadow: "0 2px 8px rgba(40,167,69,0.4)",
        }}
      >
        {progress}%
      </div>
    </div>
  );
}
