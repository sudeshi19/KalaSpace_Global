import React from 'react';
import Home from './pages/Home';
import SellArt from './pages/SellArt';
import ProductListing from './pages/ProductListing';
import Cart from './pages/Cart';
import Messages from './pages/Messages';

const INITIAL_LISTINGS = [
  {
    id: 'seed-1',
    title: 'Blue Gem Hydration Mask',
    category: 'paintings',
    price: 30,
    color: 'blue',
    description: 'A calm, minimal product card with premium gallery styling.',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd0248?auto=format&fit=crop&w=900&q=80',
    ratingsCount: 345,
    stockText: 'Only 8 item left',
    ownerRole: 'system',
  },
  {
    id: 'seed-2',
    title: 'Blue Gem Skincare Bundle',
    category: 'photography',
    price: 180,
    color: 'white',
    description: 'A clean showcase card with the same size and spacing as the rest.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    ratingsCount: 345,
    stockText: 'Only 29 item left',
    ownerRole: 'system',
  },
  {
    id: 'seed-3',
    title: 'BlueGem Cleansing Water',
    category: 'sculptures',
    price: 180,
    color: 'blue',
    description: 'Large title, consistent price row, and fixed card dimensions.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    ratingsCount: 345,
    stockText: 'Only 6 item left',
    ownerRole: 'system',
  },
  {
    id: 'seed-4',
    title: 'GemShadow Palette',
    category: 'paintings',
    price: 100,
    color: 'pink',
    description: 'A fourth slot to preserve the four-column layout at desktop widths.',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
    ratingsCount: 345,
    stockText: 'Let buy now',
    ownerRole: 'system',
  },
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [view, setView] = React.useState('home');
  const [listings, setListings] = React.useState(INITIAL_LISTINGS);
  const [currentRole, setCurrentRole] = React.useState('user');
  const [cart, setCart] = React.useState([]);
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [showLogin, setShowLogin] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginRole, setLoginRole] = React.useState('user');
  const [pendingListing, setPendingListing] = React.useState(null);
  const [authToken, setAuthToken] = React.useState(() => localStorage.getItem('kalaspace_token') || '');
  const [authMode, setAuthMode] = React.useState('login');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [authBusy, setAuthBusy] = React.useState(false);

  React.useEffect(() => {
    if (!authToken) return;
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired');
        return response.json();
      })
      .then(({ user }) => {
        setCustomerEmail(user.email);
        setCurrentRole(user.role);
      })
      .catch(() => {
        localStorage.removeItem('kalaspace_token');
        setAuthToken('');
      });
  }, [authToken]);

  const handleAddToCart = (listing) => {
    if (!authToken || !customerEmail) {
      setPendingListing(listing);
      setShowLogin(true);
      setView('home');
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === listing.id);
      if (existingItem) {
        return currentCart.map((item) => (
          item.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
      return [...currentCart, { ...listing, quantity: 1 }];
    });
  };

  const handleAddToCartWithEmail = (listing, email) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === listing.id);
      if (existingItem) {
        return currentCart.map((item) => (
          item.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
      return [...currentCart, { ...listing, quantity: 1, customerEmail: email }];
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = loginEmail.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@') || loginPassword.length < 6) return;
    setAuthBusy(true);
    setAuthError('');
    try {
      const response = await fetch(`${API_BASE}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: loginPassword, role: loginRole }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');
      localStorage.setItem('kalaspace_token', data.token);
      setAuthToken(data.token);
      setCustomerEmail(data.user.email);
      setCurrentRole(data.user.role);
      setShowLogin(false);
      setLoginPassword('');
      if (pendingListing) {
        handleAddToCartWithEmail(pendingListing, data.user.email);
        setPendingListing(null);
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const openLogin = () => {
    setLoginRole(currentRole);
    setAuthMode('login');
    setAuthError('');
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('kalaspace_token');
    setAuthToken('');
    setCustomerEmail('');
    setCart([]);
    setView('home');
  };

  const updateCartQuantity = (listingId, quantity) => {
    setCart((currentCart) => currentCart
      .map((item) => item.id === listingId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0));
  };

  const handlePublish = (listing) => {
    setListings((currentListings) => [listing, ...currentListings]);
    setView('products');
  };

  const handleDeleteListing = (listingId) => {
    setListings((currentListings) => currentListings.filter((listing) => listing.id !== listingId));
  };

  if (view === 'sell') {
    return (
      <SellArt
        onBack={() => setView('home')}
        currentRole={currentRole}
        onPublish={handlePublish}
      />
    );
  }

  if (view === 'products') {
    return (
      <ProductListing
        listings={listings}
        onBackHome={() => setView('home')}
        onSellArt={() => setView('sell')}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onDeleteListing={handleDeleteListing}
        onAddToCart={handleAddToCart}
        cartCount={cart.reduce((count, item) => count + item.quantity, 0)}
        onCart={() => setView('cart')}
        authToken={authToken}
      />
    );
  }

  if (view === 'cart') {
    return (
      <Cart
        cart={cart}
        email={customerEmail}
        authToken={authToken}
        onBack={() => setView('home')}
        onUpdateQuantity={updateCartQuantity}
        onRemove={(listingId) => updateCartQuantity(listingId, 0)}
        onOrderComplete={() => { setCart([]); setView('home'); }}
      />
    );
  }

  if (view === 'messages') {
    return <Messages authToken={authToken} userEmail={customerEmail} onBack={() => setView('home')} onLogin={openLogin} />;
  }

  return (
    <>
      <Home onSellArt={() => setView('sell')} onProducts={() => setView('products')} onCart={() => setView('cart')} onMessages={() => setView('messages')} cartCount={cart.reduce((count, item) => count + item.quantity, 0)} customerEmail={customerEmail} currentRole={currentRole} onLogin={openLogin} onLogout={handleLogout} />
      {showLogin ? (
        <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <form className="login-modal__form" onSubmit={handleLoginSubmit}>
            <button type="button" className="login-modal__close" onClick={() => setShowLogin(false)} aria-label="Close sign in">×</button>
            <p className="home__eyebrow">Collector access</p>
            <h2 id="login-title">Sign in with your email</h2>
            <p>Use your email to save your cart and receive order confirmation.</p>
            <input type="email" required autoFocus placeholder="you@example.com" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" required minLength="6" placeholder="At least 6 characters" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} />
            <label htmlFor="login-role">Sign in as</label>
            <select id="login-role" value={loginRole} onChange={(event) => setLoginRole(event.target.value)}>
              <option value="user">User</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
            {authMode === 'register' ? <p className="login-modal__hint">New accounts can be User or Artist. Admin accounts are provisioned by the server.</p> : null}
            {authError ? <p className="login-modal__error">{authError}</p> : null}
            <button type="submit" disabled={authBusy}>{authBusy ? 'Please wait...' : authMode === 'login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" className="login-modal__switch" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>
              {authMode === 'login' ? 'Create a new account' : 'I already have an account'}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default App;