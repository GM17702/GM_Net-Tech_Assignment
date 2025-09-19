import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkStyle = (path) => ({
    padding: "10px 16px",
    textDecoration: "none",
    color: pathname === path ? "#fff" : "#495057",
    backgroundColor: pathname === path ? "#007bff" : "transparent",
    borderRadius: 4,
    marginLeft: 12,
    fontWeight: pathname === path ? "600" : "500",
    transition: "background-color 0.3s ease, color 0.3s ease",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 56,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #dee2e6",
        paddingBottom: 7,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Brand / Logo placeholder */}
      <div style={{ fontWeight: "700", fontSize: 20, color: "#007bff" }}>
        GM's PDF App
      </div>

      {/* Navigation links aligned right */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={linkStyle("/")}
          onMouseEnter={(e) => {
            if (pathname !== "/") e.currentTarget.style.backgroundColor = "#e2e6ea";
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/") e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Upload PDF
        </Link>
        <Link
          to="/documents"
          style={linkStyle("/documents")}
          onMouseEnter={(e) => {
            if (pathname !== "/documents") e.currentTarget.style.backgroundColor = "#e2e6ea";
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/documents") e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Documents
        </Link>
      </div>
    </nav>
  );
}
