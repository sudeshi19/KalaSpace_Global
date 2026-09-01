import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CategoryPanel from '../components/CategoryPanel';
import Gallery from '../components/Gallery';
import logo from '../assets/kala-logo.jpg';
import './Home.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FALLBACK_ARTWORKS = [
  {
    _id: 'fallback-1',
    title: 'Golden Horizon',
    artistName: 'Rina Thompson',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80',
    price: 420,
  },
  {
    _id: 'fallback-2',
    title: 'Velvet Sunrise',
    artistName: 'Nina Flores',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80',
    price: 460,
  },
  {
    _id: 'fallback-3',
    title: 'Desert Echo',
    artistName: 'Milo Hart',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    price: 380,
  },
  {
    _id: 'fallback-4',
    title: 'Amber Drift',
    artistName: 'Dorian Vale',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    price: 520,
  },
  {
    _id: 'fallback-5',
    title: 'Blooming Dawn',
    artistName: 'Lena Park',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80',
    price: 495,
  },
  {
    _id: 'fallback-6',
    title: 'Soft Geometry',
    artistName: 'Aria Bell',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    price: 410,
  },
  {
    _id: 'fallback-7',
    title: 'Ocean Memory',
    artistName: 'Rae Wilson',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
    price: 470,
  },
  {
    _id: 'fallback-8',
    title: 'Terracotta Tide',
    artistName: 'Samir Cole',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    price: 540,
  },
  {
    _id: 'fallback-9',
    title: 'Sunlit Field',
    artistName: 'Iris Moore',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    price: 430,
  },
  {
    _id: 'fallback-10',
    title: 'Cotton Sky',
    artistName: 'Eli Grant',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    price: 390,
  },
  {
    _id: 'fallback-11',
    title: 'Brushlight',
    artistName: 'Mara Quinn',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    price: 610,
  },
  {
    _id: 'fallback-12',
    title: 'Ember Thread',
    artistName: 'Kora Hayes',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    price: 560,
  },
  {
    _id: 'fallback-13',
    title: 'Iris Form',
    artistName: 'Nora Chen',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80',
    price: 480,
  },
  {
    _id: 'fallback-14',
    title: 'Golden Thread',
    artistName: 'Omar West',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80',
    price: 620,
  },
  {
    _id: 'fallback-15',
    title: 'Stone & Bloom',
    artistName: 'Vera Holt',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    price: 515,
  },
  {
    _id: 'fallback-16',
    title: 'Morning Echo',
    artistName: 'Theo Lane',
    category: 'paintings',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    price: 455,
  },
  {
    _id: 'fallback-17',
    title: 'Quiet Geometry',
    artistName: 'Noah Brooks',
    category: 'photography',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    price: 290,
  },
  {
    _id: 'fallback-18',
    title: 'Textured Motion',
    artistName: 'Elena Cruz',
    category: 'sculptures',
    imageUrl: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80',
    price: 610,
  },
];

function Home({ onSellArt, onProducts }) {
  const [artworks, setArtworks] = useState(FALLBACK_ARTWORKS);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('paintings');
  const [search, setSearch] = useState('');

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('q', search);

      const res = await fetch(`${API_BASE}/artworks?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch artworks');
      const data = await res.json();
      setArtworks(data.length ? data : FALLBACK_ARTWORKS.filter((art) => art.category === category || !category));
    } catch (err) {
      console.error(err);
      setArtworks(FALLBACK_ARTWORKS.filter((art) => art.category === category || !category));
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <div className="home">
      <Navbar onSearch={setSearch} onSellArt={onSellArt} onProducts={onProducts} />

      <header className="home__hero">
        <div className="home__hero-copy">
          <p className="home__eyebrow">Curated global artwork</p>
          <h1>Discover original pieces that move culture forward.</h1>
          <p className="home__hero-text">
            KalaSpace connects collectors, galleries, and artists through rare paintings,
            photography, and sculptural works from around the world.
          </p>
          <div className="home__hero-actions">
            <a href="#gallery" className="home__cta home__cta--primary">Explore collection</a>
            <button type="button" className="home__cta home__cta--secondary" onClick={onSellArt}>
              Sell your art
            </button>
          </div>
        </div>

        <div className="home__hero-visual" aria-label="Featured artwork collage">
          <div className="home__feature-strip">
            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80" alt="Featured painting" />
            <img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80" alt="Featured photography" />
            <img src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=700&q=80" alt="Featured sculpture" />
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80" alt="Featured artwork" />
          </div>
        </div>
      </header>

      <main className="home__body">
        <CategoryPanel active={category} onSelect={setCategory} />
        <Gallery artworks={artworks} loading={loading} />
      </main>

      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand-block">
            <img className="footer__brand-logo" src={logo} alt="KalaSpace Global logo" />
            <div className="footer__brand-copy">
              <h3>KalaSpace</h3>
              <span>Global</span>
            </div>
          </div>

          <div className="footer__links">
            <div>
              <h4>Explore</h4>
              <a href="#gallery">Gallery</a>
              <a href="#paintings">Paintings</a>
              <a href="#artists">Artists</a>
            </div>

            <div>
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <button type="button" className="footer__link-button" onClick={onSellArt}>
                Sell Art
              </button>
              <a href="#journal">Journal</a>
            </div>

            <div>
              <h4>Connect</h4>
              <a href="#contact">Contact</a>
              <a href="#support">Support</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 KalaSpace Global</p>
          <p>Curating modern art for a global audience.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
