# KalaSpace Global — Home Page (MERN)

## File structure

```
kalaspace-global/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # logo + centered search + nav links + icons
│       │   ├── Navbar.css
│       │   ├── CategoryPanel.jsx  # left-side filter buttons (Paintings/Photography/Sculptures)
│       │   ├── CategoryPanel.css
│       │   ├── Gallery.jsx        # right-side masonry image grid
│       │   └── Gallery.css
│       ├── pages/
│       │   ├── Home.jsx           # wires Navbar + CategoryPanel + Gallery, fetches data
│       │   └── Home.css
│       ├── App.jsx
│       ├── index.js
│       └── index.css              # color/type tokens (CSS variables)
│
└── server/                        # Express + MongoDB backend
    ├── config/
    │   └── db.js                  # Mongo connection
    ├── models/
    │   └── Artwork.js             # Mongoose schema
    ├── controllers/
    │   └── artworkController.js   # GET /api/artworks logic
    ├── routes/
    │   └── artworkRoutes.js
    ├── server.js                  # app entry point
    └── .env.example
```

## Layout (matches your revised sketch)

Top bar: **logo (left) → search bar (center) → Home / About Us / Gallery / Sell Art links → icons (right)**.
Below the top bar: **category buttons on the left**, **artwork masonry gallery on the right**.

## Setup

**Backend**
```bash
cd server
npm install
cp .env.example .env      # set your MONGO_URI
npm run dev                # starts on http://localhost:5000
```

**Frontend**
```bash
cd client
npm install
npm start                  # starts on http://localhost:3000
```

The Home page calls `GET /api/artworks?category=...&q=...`, so start the backend first (or seed some Artwork documents in MongoDB) to see images in the gallery.

## Next steps
- Add a `POST /api/artworks` route + upload handling (e.g. Multer + Cloudinary) so artists can list new work.
- Add auth (JWT) to gate the "Sell Art" flow to logged-in artists, per your Admin/Artist/Buyer roles.
