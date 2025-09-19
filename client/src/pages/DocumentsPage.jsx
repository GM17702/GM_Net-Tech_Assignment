import React, { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar.jsx";
import PdfViewer from "../components/PdfViewer.jsx";
import SignaturePanel from "../components/SignaturePanel.jsx";
import Loader from "../components/Loader/Loader.jsx";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/");
        setDocuments(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    })();
  }, []);

  const refreshDoc = async (id) => {
    const res = await api.get(`/${id}`);
    setSelected(res.data);
    setLoading(false); // Stop loading after document is fetched
  };

  
  if (loading) {
    return <Loader />; // Show loader while waiting for data
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar documents={documents} onSelect={refreshDoc} />
      {selected && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            padding: 10,
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 2,
              borderRight: "1px solid #ddd",
              paddingRight: 10,
              overflow: "auto",
            }}
          >
            <PdfViewer fileUrl={`http://localhost:3000${selected.fileUrl}`} />
          </div>

          <div
            style={{
              flex: 1,
              paddingLeft: 10,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Summary section */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#333",
                lineHeight: 1.6,
                marginBottom: 12,
                maxHeight: "40vh",
                overflowY: "auto",
              }}
            >
              <h3
                style={{
                  marginBottom: 12,
                  borderBottom: "3px solid #007bff",
                  paddingBottom: 6,
                  fontWeight: "700",
                  color: "#007bff",
                }}
              >
                Summary
              </h3>
              {selected.summary ? (
                <p style={{ whiteSpace: "pre-wrap" }}>{selected.summary}</p>
              ) : (
                <p style={{ fontStyle: "italic", color: "#777" }}>
                  No summary available.
                </p>
              )}
            </div>

            {/* Signature panel */}
            <div
            style={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 6px 18px rgba(0, 123, 255, 0.1)",
                border: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
            >
            <SignaturePanel
                pdfData={selected}
                onChange={() => refreshDoc(selected._id || selected.id)}
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
