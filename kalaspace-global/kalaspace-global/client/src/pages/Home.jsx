import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CircleCheck,
  Flame,
  Gavel,
  MessageCircle,
  Palette,
  Quote,
  Send,
  Shapes,
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
} from 'lucide-react';
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

const MARQUEE_ITEMS = ['Original oils', 'Curated globally', 'Verified artists', 'Insured shipping', 'Limited editions', 'New drops weekly'];

const CATEGORIES = [
  { name: 'Paintings', count: '1,240 works', value: 'paintings', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80', Icon: Palette },
  { name: 'Photography', count: '680 works', value: 'photography', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80', Icon: Camera },
  { name: 'Sculptures', count: '390 works', value: 'sculptures', image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80', Icon: Shapes },
  { name: 'New drops', count: '120 this week', value: 'all', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', Icon: Sparkles },
];

const ARTISTS = [
  { name: 'Aria Bennett', specialty: 'Abstract expression', rating: '4.9', works: 42, online: true, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' },
  { name: 'Malik Okafor', specialty: 'Contemporary sculpture', rating: '4.8', works: 28, online: true, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80' },
  { name: 'Sofia Laurent', specialty: 'Fine art photography', rating: '5.0', works: 36, online: false, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80' },
  { name: 'Dante Reyes', specialty: 'Modern oil painting', rating: '4.9', works: 51, online: true, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' },
];

const TESTIMONIALS = [
  ['Messaged the artist at 9pm, had the piece framed and shipped by Friday. Unreal experience.', 'Priya Sharma', 'Collector • Mumbai'],
  ['The chat thread kept everything — price, framing, tracking — in one place. So simple.', 'Daniel Cole', 'Collector • London'],
  ['Commissioned a custom diptych through messages. Progress photos every week!', 'Amara Osei', 'Collector • New York'],
  ['Sold six pieces in my first month. Buyers ask better questions when they can message me.', 'Elena Petrova', 'Artist • Miami'],
];

function Home({ onSellArt, onProducts, onCart, onMessages, cartCount, customerEmail, currentRole, onLogin, onLogout }) {
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
      <Navbar onSearch={setSearch} onSellArt={onSellArt} onProducts={onProducts} onCart={onCart} onMessages={onMessages} cartCount={cartCount} customerEmail={customerEmail} currentRole={currentRole} onLogin={onLogin} onLogout={onLogout} />

      <section className="home__hero">
        <div className="home__hero-copy home__reveal">
          <p className="home__eyebrow"><Sparkles size={14} /> Curated global artwork</p>
          <h1>Discover original pieces <em>that move</em> culture forward.</h1>
          <p className="home__hero-text">KalaSpace connects collectors, galleries, and artists through rare paintings, photography, and sculptural works from around the world.</p>
          <div className="home__hero-actions">
            <a href="#featured" className="home__cta home__cta--primary">Explore collection <ArrowRight size={17} /></a>
            <button type="button" className="home__cta home__cta--secondary" onClick={onSellArt}>Sell your art</button>
          </div>
          <div className="home__proof">
            <div className="home__proof-rating"><Star size={15} fill="currentColor" /> <strong>4.9/5</strong><span>12k+ happy collectors</span></div>
            <div className="home__stats"><span><strong>2,400+</strong> Artworks</span><span><strong>320+</strong> Artists</span><span><strong>40+</strong> Countries</span></div>
          </div>
        </div>

        <div className="home__hero-visual home__reveal" aria-label="Featured artwork collage">
          <div className="home__feature-strip">
            {['photo-1460661419201-fd4cecdf8a8b', 'photo-1493246507139-91e8fad9978e', 'photo-1515405295579-ba7b45403062', 'photo-1579783902614-a3fb3927b6a5'].map((image, index) => (
              <img key={image} src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=80`} alt="Featured artwork" className={index % 2 ? 'home__feature-image--offset' : ''} />
            ))}
          </div>
          <div className="home__floating-card home__floating-card--bid"><span><Gavel size={13} /> Live bid</span><strong>“Ember Tide”</strong><b>$1,240</b></div>
          <div className="home__floating-card home__floating-card--sold"><CircleCheck size={20} /><span><strong>Just sold in Paris</strong><small>“Azure Sonata” • $520</small></span></div>
        </div>
      </section>

      <div className="home__marquee"><div>{[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => <span key={`${item}-${index}`}>{item} <Flame size={14} /></span>)}</div></div>

      <main className="home__body">
        <section className="home__section home__section--categories">
          <div className="home__section-heading"><div><p className="home__eyebrow">Browse by category</p><h2>Find your next obsession</h2></div><button type="button" className="home__text-link" onClick={onProducts}>View gallery <ArrowRight size={15} /></button></div>
          <div className="home__category-grid">
            {CATEGORIES.map(({ name, count, value, image, Icon }, index) => <button type="button" key={name} className="home__category-card" onClick={() => { setCategory(value); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ animationDelay: `${index * 80}ms` }}><img src={image} alt={name} /><span className="home__category-overlay" /><span className="home__category-copy"><span><strong>{name}</strong><small>{count}</small></span><i><Icon size={18} /></i></span></button>)}
          </div>
        </section>

        <section id="featured" className="home__section home__section--featured">
          <div className="home__section-heading"><div><p className="home__eyebrow">Handpicked this week</p><h2>Featured artworks</h2><p>Hover any piece to discover work from artists around the world.</p></div><button type="button" className="home__text-link" onClick={onProducts}>See all works <ArrowRight size={15} /></button></div>
          <div id="gallery" className="home__collection"><CategoryPanel active={category} onSelect={setCategory} /><Gallery artworks={artworks} loading={loading} /></div>
        </section>

        <section className="home__chat-banner">
          <div className="home__chat-copy"><p className="home__eyebrow"><MessageCircle size={14} /> Buyer ↔ Artist chat</p><h2>Every artwork has a story. <em>Ask the maker.</em></h2><p>Negotiate framing, request a commission, or sort out insured shipping right inside your inbox.</p><ul><li><CircleCheck size={17} /> Live unread badges and instant replies</li><li><CircleCheck size={17} /> Artwork attached to every thread</li><li><CircleCheck size={17} /> A personal connection behind every piece</li></ul><button type="button" className="home__cta home__cta--primary" onClick={onMessages}><Send size={16} /> Open Messages</button></div>
          <div className="home__chat-mock"><div className="home__chat-header"><div className="home__avatar">A</div><div><strong>Aria Bennett <BadgeCheck size={14} /></strong><small>● Online now • replies in ~1h</small></div><span>Ember Tide • $450</span></div><div className="home__messages"><p>Hi! Yes, “Ember Tide” is still available 🎨</p><p className="home__message--mine">Love it! Does $450 include framing + shipping to NY?</p><p>Framing included. Shipping is free and fully insured.</p></div><button type="button" onClick={onMessages}>Continue this conversation <ArrowRight size={14} /></button></div>
        </section>

        <section className="home__section"><div className="home__section-heading"><div><p className="home__eyebrow">Most messaged</p><h2>Trending artists</h2></div><button type="button" className="home__text-link" onClick={onMessages}>Message an artist <ArrowRight size={15} /></button></div><div className="home__artist-grid">{ARTISTS.map((artist) => <article className="home__artist-card" key={artist.name}><div className="home__artist-image"><img src={artist.image} alt={artist.name} /><span className={artist.online ? 'is-online' : ''} /></div><h3>{artist.name} <BadgeCheck size={15} /></h3><p>{artist.specialty}</p><div className="home__artist-meta"><span><Star size={12} fill="currentColor" /> {artist.rating}</span><span>•</span><span>{artist.works} works</span><span>•</span><span className={artist.online ? 'is-online-text' : ''}>{artist.online ? 'Online' : 'Offline'}</span></div><button type="button" onClick={onMessages}><MessageCircle size={14} /> Message artist</button></article>)}</div></section>

        <section className="home__image-strip"><div className="home__image-panel"><img src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80" alt="Inside a KalaSpace partner gallery" /><span><small>Partner galleries</small><strong>Walk the world's walls, from your couch</strong><button type="button" onClick={onProducts}>Tour the gallery <ArrowRight size={15} /></button></span></div><div className="home__image-panel"><img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80" alt="Blue abstract collection exhibition" /><span><small>This month's drop</small><strong>The Blue Period — 24 new abstracts</strong><button type="button" onClick={onProducts}>Shop the drop <ArrowRight size={15} /></button></span></div></section>

        <section className="home__split-section"><div><p className="home__eyebrow">Effortless collecting</p><h2>Own art in 3 easy steps</h2><div className="home__steps">{[['1', 'Discover and message', 'Fall in love with a piece, then ask the artist about details, framing, or commissions.'], ['2', 'Buy with protection', 'Checkout securely with authenticity guarantee and buyer protection.'], ['3', 'Hang it and brag', 'Enjoy insured doorstep delivery with tracking shared in your message thread.']].map(([number, title, text]) => <div className="home__step" key={number}><b>{number}</b><span><strong>{title}</strong><small>{text}</small></span></div>)}</div></div><div><p className="home__eyebrow">Collector stories</p><h2>Loved by 12,000+ collectors</h2><div className="home__testimonial-grid">{TESTIMONIALS.map(([quote, name, role]) => <article key={name}><Quote size={21} /><p>“{quote}”</p><footer><strong>{name}</strong><small>{role}</small><span><Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /></span></footer></article>)}</div></div></section>

        <section className="home__trust">{[[ShieldCheck, 'Authenticity guaranteed'], [Truck, 'Free insured shipping over $200'], [Star, '4.9 average artist rating'], [MessageCircle, 'Direct artist support']].map(([Icon, text]) => <span key={text}><Icon size={18} /> {text}</span>)}</section>
        <section className="home__sell-cta"><p className="home__eyebrow"><Palette size={14} /> For artists</p><h2>Your art deserves a global stage</h2><p>Join 320+ artists earning on KalaSpace. List in minutes, chat with collectors, and keep up to 90% of every sale.</p><button type="button" className="home__cta home__cta--dark" onClick={onSellArt}>Start selling today <ArrowRight size={17} /></button></section>
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
