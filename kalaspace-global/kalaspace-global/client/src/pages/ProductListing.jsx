import React, { useMemo, useState } from 'react';
import { ArrowLeft, Star, Trash2, Zap } from 'lucide-react';
import './ProductListing.css';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Products' },
  { id: 'paintings', label: 'Paintings' },
  { id: 'photography', label: 'Photography' },
  { id: 'sculptures', label: 'Sculptures' },
];

const COLOR_OPTIONS = ['blue', 'brown', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'];

function ProductListing({ listings, onBackHome, onSellArt, currentRole, onRoleChange, onDeleteListing, onAddToCart, cartCount, onCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const visibleListings = useMemo(
    () => listings.filter((listing) => {
      const matchesCategory = activeCategory === 'all' || listing.category === activeCategory;
      const matchesColor = selectedColor === 'all' || listing.color?.toLowerCase() === selectedColor;
      const matchesMinPrice = minPrice === '' || listing.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || listing.price <= Number(maxPrice);
      return matchesCategory && matchesColor && matchesMinPrice && matchesMaxPrice;
    }),
    [activeCategory, listings, maxPrice, minPrice, selectedColor],
  );

  const canDeleteListing = (listing) => currentRole === 'admin' || listing.ownerRole === currentRole;

  return (
    <div className="product-page">
      <header className="product-page__hero">
        <button type="button" className="product-page__back" onClick={onBackHome}>
          <ArrowLeft size={18} />
          Back to home
        </button>

        <div className="product-page__copy">
          <p className="product-page__eyebrow">Product listing</p>
          <h1>Published artwork</h1>
          <p>
            Newly published pieces appear here as product cards, ready for collectors to browse.
          </p>
        </div>

        <div className="product-page__toolbar">
          <label className="product-page__role-picker">
            Viewing as
            <select value={currentRole} onChange={(event) => onRoleChange?.(event.target.value)}>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>

          <button type="button" className="product-page__cta" onClick={onSellArt}>
            <Zap size={18} />
            Add another listing
          </button>
          <button type="button" className="product-page__cart-link" onClick={onCart}>
            Cart ({cartCount})
          </button>
        </div>
      </header>

      <div className="product-page__filters" role="tablist" aria-label="Filter products by category">
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`product-page__filter ${activeCategory === option.id ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="product-page__advanced-filters" aria-label="Filter products by price and color">
        <label>
          Min price
          <input type="number" min="0" placeholder="$0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        </label>
        <label>
          Max price
          <input type="number" min="0" placeholder="Any price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </label>
        <label>
          Color
          <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
            <option value="all">All colors</option>
            {COLOR_OPTIONS.map((color) => <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>)}
          </select>
        </label>
        {(minPrice || maxPrice || selectedColor !== 'all') ? (
          <button type="button" className="product-page__clear-filters" onClick={() => { setMinPrice(''); setMaxPrice(''); setSelectedColor('all'); }}>
            Clear filters
          </button>
        ) : null}
      </div>

      <main className="product-page__grid">
        {visibleListings.length === 0 ? (
          <div className="product-page__empty">No products match these filters.</div>
        ) : null}
        {visibleListings.map((listing) => (
          <article className="product-card" key={listing.id}>
            <div className="product-card__image-wrap">
              <img className="product-card__image" src={listing.imageUrl} alt={listing.title} />
            </div>

            <div className="product-card__body">
              <h2>{listing.title}</h2>

              <div className="product-card__meta">
                <span className="product-card__rating">
                  <Star size={14} />
                  5.0 ({listing.ratingsCount} ratings)
                </span>
                <span className="product-card__category">{listing.category}</span>
                {listing.color ? <span className="product-card__color">{listing.color}</span> : null}
              </div>

              <div className="product-card__price-row">
                <strong>${listing.price.toFixed(2)}</strong>
                <span>{listing.stockText}</span>
              </div>

              <p className="product-card__description">
                {listing.description || 'A newly published artwork listing.'}
              </p>

              <div className="product-card__actions">
                <button type="button" className="product-card__button" onClick={() => onAddToCart?.(listing)}>
                  Add to cart
                </button>

                {canDeleteListing(listing) ? (
                  <button
                    type="button"
                    className="product-card__delete"
                    onClick={() => onDeleteListing?.(listing.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}

export default ProductListing;