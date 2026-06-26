# 🎓 Dynamic Certificate Generator

A no-code web application for generating professional certificates. Upload your own template, define custom fields, place them anywhere via drag-and-drop, and generate certificates in bulk.

## Features

- **Upload Any Template** — PNG, JPG, or PDF certificate designs
- **Unlimited Custom Fields** — Create any field (name, course, date, etc.)
- **Drag & Drop Editor** — Place fields anywhere with Fabric.js canvas
- **Signature & Stamp** — Upload and position signature/seal images
- **Manual or Excel Entry** — Enter data one-by-one or bulk upload via Excel/CSV
- **PDF/PNG Export** — Generate high-quality certificates
- **Bulk Generation** — Generate hundreds of certificates with ZIP download
- **QR Verification** — Each certificate gets a unique ID and QR code for verification

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Fabric.js v6 |
| State | Zustand |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| File Storage | Cloudinary |
| PDF Generation | pdf-lib |
| Excel Parsing | SheetJS |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies:

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

4. Start development servers:

```bash
# Backend (from server/)
npm run dev

# Frontend (from client/)
npm run dev
```

5. Open `http://localhost:5173`

## License

MIT
