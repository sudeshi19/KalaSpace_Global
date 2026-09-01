import React from 'react';
import Home from './pages/Home';
import SellArt from './pages/SellArt';
import ProductListing from './pages/ProductListing';

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
      />
    );
  }

  return <Home onSellArt={() => setView('sell')} onProducts={() => setView('products')} />;
}

export default App;
