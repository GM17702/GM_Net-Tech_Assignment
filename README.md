
# PDF Upload and Signature Management App

This repository contains a full-stack application that allows uploading PDFs, adding signatures, viewing documents, and emailing signed PDFs.

## Project Structure

```
.
├── client/     # React + Vite frontend
└── server/     # Node.js + Express backend
```

## Setup Instructions

### Prerequisites

- Node.js >= 22
- npm >= 10.9

### Backend Setup

1. Navigate to the server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` directory with the following variables (to be obtained from the developer):

```
PORT=Backend Port
MONGO_URI=mongodb_connection_string
SMTP_API_KEY=Smtp API Key
SMTP_API_SECRET=Smtp API Secret
```

4. Run the backend in development mode:

```bash
npm run dev
```

By default, the backend runs at `http://localhost:3000`. It is also important that you run it at port 3000 strictly.

### Frontend Setup

1. Navigate to the client folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend in development mode:

```bash
npm run dev
```

By default, the frontend runs at `http://localhost:5173`.

---

## API Documentation

Base URL: `http://localhost:3000/api/documents`

### Upload PDF

**Endpoint:** `POST /uploadPDF`  
**Description:** Uploads a PDF file, parses text, and stores summary and metadata.

**Request:** `multipart/form-data` with field `file` (PDF)

**Response:**

```json
{
  "id": "documentId",
  "originalFilename": "uploaded.pdf",
  "fileUrl": "/uploads/uploaded.pdf",
  "summary": "PDF summary",
  "parsedTextSnippet": "first 3000 chars"
}
```

### Upload Signature to Document

**Endpoint:** `POST /uploadSignature/:id`  
**Description:** Uploads a signature image (PNG/JPG) to a document, appends a signature page to the PDF, and saves it.

**Request:** `multipart/form-data` with field `file` (signature image)

**Response:** Document object with updated signature info.

### Get All Documents

**Endpoint:** `GET /`  
**Description:** Retrieves all documents (latest first).

**Response:**

```json
[
  {
    "_id": "documentId",
    "originalFilename": "uploaded.pdf",
    "signature": {
      "imagePath": "...",
      "imageURL": "/uploads/signature.png",
      "filePath": "...",
      "fileUrl": "/uploads/signed-uploaded.pdf"
    },
    "parsedText": "...",
    "summary": "..."
  }
]
```

### Get Document by ID

**Endpoint:** `GET /:id`  
**Description:** Retrieves a single document by its ID.

**Response:** Document object.

### Delete Signature from Document

**Endpoint:** `DELETE /deleteSignature/:id`  
**Description:** Deletes signature image and signed PDF from storage and clears signature info in the document.

**Response:** Updated document object without signature info.

### Send Signed PDF via Email

**Endpoint:** `POST /sendPDFEmail/:id`  
**Description:** Sends the signed PDF to a specified email address.

**Request Body:**

```json
{
  "email": "recipient@example.com"
}
```

**Response:**

```json
{
  "message": "Email sent successfully"
}
```

---

## Example Requests

### Upload PDF (using curl)

```bash
curl -X POST http://localhost:3000/api/pdf/uploadPDF   -F "file=@/path/to/yourfile.pdf"
```

### Upload Signature (using curl)

```bash
curl -X POST http://localhost:3000/api/pdf/uploadSignature/<documentId>   -F "file=@/path/to/signature.png"
```

### Send Signed PDF Email

```bash
curl -X POST http://localhost:3000/api/pdf/sendPDFEmail/<documentId>   -H "Content-Type: application/json"   -d '{"email":"recipient@example.com"}'
```

---

## Notes

- The backend stores uploaded files in an `uploads/` folder in the project root.
- Signed PDFs are generated with an additional page containing the signature.
- Make sure your `.env` file contains correct SMTP credentials to send emails.
- The frontend interacts with the backend API to provide a seamless user experience.
