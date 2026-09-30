import React from 'react';
import Home from './pages/Home';
import SellArt from './pages/SellArt';
import ProductListing from './pages/ProductListing';
import Cart from './pages/Cart';

const INITIAL_LISTINGS = [
  {
    id: 'seed-1',
    title: 'Blue Gem Hydration Mask',
    category: 'paintings',
    price: 30,
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
    description: 'A fourth slot to preserve the four-column layout at desktop widths.',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
    ratingsCount: 345,
    stockText: 'Let buy now',
    ownerRole: 'system',
  },
];

function App() {
  const [view, setView] = React.useState('home');
  const [listings, setListings] = React.useState(INITIAL_LISTINGS);
  const [currentRole, setCurrentRole] = React.useState('artist');
  const [cart, setCart] = React.useState([]);
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [showLogin, setShowLogin] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [pendingListing, setPendingListing] = React.useState(null);

  const handleAddToCart = (listing) => {
    if (!customerEmail) {
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

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = loginEmail.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return;
    setCustomerEmail(normalizedEmail);
    setShowLogin(false);
    if (pendingListing) {
      handleAddToCartWithEmail(pendingListing, normalizedEmail);
      setPendingListing(null);
    }
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
      />
    );
  }

  if (view === 'cart') {
    return (
      <Cart
        cart={cart}
        email={customerEmail}
        onBack={() => setView('home')}
        onUpdateQuantity={updateCartQuantity}
        onRemove={(listingId) => updateCartQuantity(listingId, 0)}
        onOrderComplete={() => { setCart([]); setView('home'); }}
      />
    );
  }

  return (
    <>
      <Home onSellArt={() => setView('sell')} onProducts={() => setView('products')} onCart={() => setView('cart')} cartCount={cart.reduce((count, item) => count + item.quantity, 0)} customerEmail={customerEmail} onLogin={() => setShowLogin(true)} />
      {showLogin ? (
        <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <form className="login-modal__form" onSubmit={handleLoginSubmit}>
            <button type="button" className="login-modal__close" onClick={() => setShowLogin(false)} aria-label="Close sign in">×</button>
            <p className="home__eyebrow">Collector access</p>
            <h2 id="login-title">Sign in with your email</h2>
            <p>Use your email to save your cart and receive order confirmation.</p>
            <input type="email" required autoFocus placeholder="you@example.com" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
            <button type="submit">Continue</button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default App;
