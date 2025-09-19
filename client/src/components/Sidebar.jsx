import React from "react";

export default function Sidebar({ documents, onSelect, selectedId }) {
  return (
    <div
      style={{
        width: "100%", // Full width on mobile
        maxWidth: 220, // Maximum width for larger screens
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Full height of the viewport
      }}
    >
      <h3
        style={{
          padding: "16px",
          margin: 0,
          borderBottom: "1px solid #ddd",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#fff",
        }}
      >
        Documents
      </h3>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flex: 1, // Take up the remaining space in the container
          overflowY: "auto", // Scrollable if content exceeds available space
          maxHeight: "calc(100vh - 60px)", // Prevent overflow in the sidebar and allow scrolling
        }}
      >
        {documents.map((doc) => {
          const id = doc._id || doc.id;
          const isSelected = id === selectedId;

          return (
            <li
              key={id}
              onClick={() => onSelect(id)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor: isSelected ? "#e6f0ff" : "transparent",
                fontWeight: isSelected ? "600" : "normal",
                color: isSelected ? "#003366" : "#333",
                transition: "background-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {doc.originalFilename}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
