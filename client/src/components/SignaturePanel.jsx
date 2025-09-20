import React, { useRef, useState } from "react";
import api from "../api";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePanel({ pdfData, onChange }) {
  const sigRef = useRef();
  const [textSignature, setTextSignature] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [method, setMethod] = useState("handdrawn"); // "handdrawn" | "text" | "photo"
  const [uploading, setUploading] = useState(false);

  // Upload handlers
const uploadHandDrawn = async () => {
    console.log("Uploading hand-drawn signature...");
  if (sigRef.current.isEmpty()) {
    alert("Please draw your signature.");
    return;
  }
  setUploading(true);
  try {
    const dataURL = sigRef.current.getCanvas().toDataURL("image/png");
    const blob = await (await fetch(dataURL)).blob();
    const formData = new FormData();
    formData.append("file", blob, "handdrawn.png");

    const response = await api.post(`/uploadSignature/${pdfData._id || pdfData.id}`, formData);
    console.log("Upload successful:", response.data);

    sigRef.current.clear();
    onChange();
  } catch (error) {
    console.error("Error uploading hand-drawn signature:", error);
    alert("Failed to upload signature. Please try again.");
  } finally {
    setUploading(false);
  }
};

const uploadTextSignature = async () => {
    console.log("Uploading text signature...");
  if (!textSignature.trim()) {
    alert("Please enter your name.");
    return;
  }
  setUploading(true);
  try {
    console.log("Uploading text signature...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "36px 'Segoe Script', cursive";
    canvas.width = ctx.measureText(textSignature).width + 40;
    canvas.height = 60;
    ctx.font = "36px 'Segoe Script', cursive";
    ctx.fillStyle = "#000";
    ctx.fillText(textSignature, 20, 45);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const formData = new FormData();
    formData.append("file", blob, "textsignature.png");
    const res = await api.post(`/uploadSignature/${pdfData._id || pdfData.id}`, formData);
    console.log("Upload response:", res.data);
    setTextSignature("");
    onChange();
  } catch (error) {
    console.error("Error uploading text signature:", error);
    alert("Failed to upload text signature. Please try again.");
  } finally {
    setUploading(false);
  }
};

const uploadPhotoSignature = async () => {
    console.log("Uploading photo signature...");
  if (!photoFile) {
    alert("Please select a photo file.");
    return;
  }
  setUploading(true);
  try {
    console.log("Uploading photo signature...");
    const formData = new FormData();
    formData.append("file", photoFile);
    const res = await api.post(`/uploadSignature/${pdfData._id || pdfData.id}`, formData);
    console.log("Upload response:", res.data);
    setPhotoFile(null);
    onChange();
  } catch (err) {
    console.error("Error uploading photo signature:", err);
    alert(err.response?.data?.error || "Upload failed");
  } finally {
    setUploading(false);
  }
};

const deleteSignature = async () => {
  if (!window.confirm("Are you sure you want to delete the existing signature?")) return;
  setUploading(true);
  try {
    console.log("Deleting signature...");
    const res = await api.delete(`/deleteSignature/${pdfData._id || pdfData.id}`);
    console.log("Delete response:", res.data);
    onChange();
  } catch (error) {
    console.error("Error deleting signature:", error);
    alert("Failed to delete signature. Please try again.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        height: "100%",
      }}
    >
      <h3 style={{ color: "#007bff", borderBottom: "3px solid #007bff", paddingBottom: 8, marginBottom: 8 }}>
        Sign Document
      </h3>

      {/* Existing signature */}
      {pdfData.signature ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 10,
            textAlign: "center",  // Centers text inside the div
            backgroundColor: "#f9f9f9",
            display: "flex",       // Makes the div a flex container
            flexDirection: "column", // Stacks the children vertically
            justifyContent: "center", // Centers the children horizontally
            alignItems: "center",   // Ensures vertical centering of the children
          }}
        >
          <h4 style={{ marginTop: 0 }}>Existing Signature</h4>
          <img
            src={`http://localhost:3000${pdfData.signature.imageURL}`}
            alt="signature"
            style={{
              maxWidth: "100%",
              maxHeight: 150,
              objectFit: "contain",
            }}
          />
          <button
            onClick={deleteSignature}
            disabled={uploading}
            style={{
              marginTop: 10,
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b02a37")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
          >
            Delete Signature
          </button>
          <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                marginBottom: "10px",
                alignItems: "flex-start",  // Align buttons to the top of the container
              }}
              >

              <button
                onClick={() => {
                  const link = document.createElement("a");
                  const fileUrl = `http://localhost:3000${pdfData.signature.fileUrl}`;

                  // Set the link to point directly to the file
                  link.href = fileUrl;
                  link.target = "_blank";  // Open in new tab/window

                  // Extract the filename from the URL (last part of the file path)
                  const filename = pdfData.signature.fileUrl.split("/").pop();
                  link.download = filename;  // This tells the browser to download the file

                  // Trigger the download by clicking the link
                  link.style.display = "none";  // Hide the link (it won’t be visible on the page)
                  document.body.appendChild(link);  // Add it to the DOM
                  link.click();  // Simulate a click to start the download
                  document.body.removeChild(link);  // Clean up by removing the link from the DOM
                }}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download Signed PDF
              </button>

              <button
                onClick={async () => {
                  const recipient = window.prompt("Enter recipient email:");
                  if (!recipient) return;

                  try {
                    // Call your backend API endpoint to send the email
                    await api.post(`/sendPDFEmail/${pdfData._id}`, {
                      email: recipient,
                    });
                    alert("Email sent successfully!");
                  } catch (err) {
                    console.error("Error sending email:", err);
                    alert("Failed to send email: " + err.response?.data?.error || err.response?.data?.message);
                  }
                }}
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Share via Email
              </button>
            </div>
        </div>
      ) : (
        <>

      {/* Method selection */}
      <div
        style={{
          display: "flex",
          gap: 15,
          marginBottom: 10,
          justifyContent: "center",
        }}
      >
        {["handdrawn", "text", "photo"].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 6,
              border: "2px solid",
              borderColor: method === m ? "#007bff" : "#ccc",
              backgroundColor: method === m ? "#007bff" : "#f5f5f5",
              color: method === m ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: method === m ? "700" : "400",
              transition: "all 0.3s ease",
              textTransform: "capitalize",
            }}
          >
            {m === "handdrawn" ? "Hand Drawn" : m === "text" ? "Text" : "Photo"}
          </button>
        ))}
      </div>

      {/* Method UI */}
      {method === "handdrawn" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 10,
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 320,
              height: 150,
              className: "sigCanvas",
              style: { borderRadius: 8, boxShadow: "0 3px 8px rgba(0,0,0,0.1)" },
            }}
            ref={sigRef}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => sigRef.current.clear()}
              disabled={uploading}
              style={{
                backgroundColor: "#6c757d",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
            >
              Clear
            </button>
            <button
              onClick={uploadHandDrawn}
              disabled={uploading}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {method === "text" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="Enter your name"
            value={textSignature}
            onChange={(e) => setTextSignature(e.target.value)}
            style={{
              padding: "10px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              outline: "none",
              fontFamily: "'Segoe Script', cursive, sans-serif",
              color: "#333",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
          <button
            onClick={uploadTextSignature}
            disabled={uploading}
            style={{
              backgroundColor: "#007bff",
              border: "none",
              padding: "12px",
              borderRadius: 6,
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Upload Text Signature
          </button>
        </div>
      )}

      {method === "photo" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            style={{ cursor: "pointer" }}
          />
          {photoFile && (
            <img
              src={URL.createObjectURL(photoFile)}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: 120,
                objectFit: "contain",
                borderRadius: 6,
                marginTop: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
          )}
          <button
            onClick={uploadPhotoSignature}
            disabled={uploading}
            style={{
              backgroundColor: "#007bff",
              border: "none",
              padding: "12px",
              borderRadius: 6,
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
                Upload Photo Signature
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}