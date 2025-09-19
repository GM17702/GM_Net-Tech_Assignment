import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/uploadPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
        </Routes>
      </div>
    </div>
  );
}
