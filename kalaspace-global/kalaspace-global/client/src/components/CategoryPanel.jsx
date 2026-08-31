import React from 'react';
import './CategoryPanel.css';

const CATEGORIES = [
  { id: 'paintings', label: 'Paintings' },
  { id: 'photography', label: 'Photography' },
  { id: 'sculptures', label: 'Sculptures' },
];

function CategoryPanel({ active, onSelect }) {
  return (
    <aside className="category-panel" aria-label="Browse by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-panel__btn ${active === cat.id ? 'is-active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}

      <div className="category-panel__blurb">
        <h2>Original art, straight from the artist.</h2>
        <p>Browse paintings and photography from independent artists worldwide.</p>
      </div>
    </aside>
  );
}

export default CategoryPanel;
