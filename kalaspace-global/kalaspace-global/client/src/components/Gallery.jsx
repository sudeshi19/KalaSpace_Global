import React from 'react';
import './Gallery.css';

function Gallery({ artworks, loading }) {
  if (loading) {
    return <div className="gallery gallery--loading">Loading artwork...</div>;
  }

  if (!artworks.length) {
    return <div className="gallery gallery--empty">No artwork found. Try a different search.</div>;
  }

  const featured = artworks.slice(0, 3);

  return (
    <div className="gallery gallery--featured">
      {featured.map((art) => (
        <figure className="gallery__item gallery__item--featured" key={art._id || art.id}>
          <div className="gallery__visual">
            <img src={art.imageUrl} alt={art.title} loading="lazy" />
          </div>
          <figcaption className="gallery__caption">
            <span>{art.title}</span>
            <span className="gallery__arrow">→</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default Gallery;
