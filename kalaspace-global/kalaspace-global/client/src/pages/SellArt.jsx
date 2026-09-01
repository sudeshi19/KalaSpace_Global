import React, { useState } from 'react';
import { ArrowLeft, Upload, ShieldCheck, Sparkles } from 'lucide-react';
import './SellArt.css';

const CHECKLIST = [
  'Add clear title, medium, and dimensions.',
  'Upload at least 3 images in good lighting.',
  'Set a price and share your story.',
];

function SellArt({ onBack, onPublish, currentRole }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('paintings');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!title.trim()) nextErrors.title = 'Artwork title is required.';
    if (!category) nextErrors.category = 'Category is required.';
    if (!price || Number(price) <= 0) nextErrors.price = 'Price must be greater than zero.';
    if (!description.trim()) nextErrors.description = 'Description is required.';
    if (!imageFile) nextErrors.image = 'At least one image is required.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const listing = {
      id: `listing-${Date.now()}`,
      title: title.trim() || 'Untitled artwork',
      category,
      price: Number(price) || 0,
      description: description.trim(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://images.unsplash.com/photo-1579783901588-8f67a7b88b52?auto=format&fit=crop&w=900&q=80',
      ratingsCount: 345,
      stockText: 'Only 1 item left',
      ownerRole: currentRole,
    };

    onPublish?.(listing);
  };

  return (
    <div className="sell-page">
      <section className="sell-page__hero">
        <button type="button" className="sell-page__back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to home
        </button>

        <p className="sell-page__eyebrow">Sell your art</p>
        <h1>Create a listing that feels gallery-ready.</h1>
        <p className="sell-page__intro">
          Share your artwork with collectors around the world. This listing flow is designed
          to help you publish quickly without losing the details that matter.
        </p>

        <p className="sell-page__role-note">Publishing as: {currentRole}</p>

        <div className="sell-page__stats">
          <div>
            <strong>5 min</strong>
            <span>Average listing time</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Collector visibility</span>
          </div>
          <div>
            <strong>Safe</strong>
            <span>Protected seller flow</span>
          </div>
        </div>
      </section>

      <section className="sell-page__content">
        <div className="sell-page__card sell-page__card--form">
          <div className="sell-page__card-title">
            <Upload size={18} />
            <h2>Product listing</h2>
          </div>

          <form className="sell-form" onSubmit={handleSubmit}>
            <label>
              Artwork title
              <input
                type="text"
                placeholder="Example: Midnight Bloom"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              {errors.title ? <span className="sell-form__error">{errors.title}</span> : null}
            </label>

            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="paintings">Paintings</option>
                <option value="photography">Photography</option>
                <option value="sculptures">Sculptures</option>
              </select>
              {errors.category ? <span className="sell-form__error">{errors.category}</span> : null}
            </label>

            <label>
              Price
              <input
                type="number"
                placeholder="450"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
              {errors.price ? <span className="sell-form__error">{errors.price}</span> : null}
            </label>

            <label>
              Description
              <textarea
                rows="6"
                placeholder="Describe the medium, inspiration, size, and condition."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              {errors.description ? <span className="sell-form__error">{errors.description}</span> : null}
            </label>

            <label className="sell-form__upload">
              <span>Upload images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              />
              {errors.image ? <span className="sell-form__error">{errors.image}</span> : null}
            </label>

            <button type="submit" className="sell-form__submit">
              Publish listing
            </button>
          </form>
        </div>

        <aside className="sell-page__card sell-page__card--guide">
          <div className="sell-page__card-title">
            <Sparkles size={18} />
            <h2>Before you publish</h2>
          </div>

          <ul className="sell-page__checklist">
            {CHECKLIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="sell-page__trust">
            <ShieldCheck size={18} />
            <div>
              <strong>Seller trust</strong>
              <p>Listings with strong photos and clear details convert faster.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default SellArt;