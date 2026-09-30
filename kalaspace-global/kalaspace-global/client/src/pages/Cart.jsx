import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, CheckCircle } from 'lucide-react';
import './Cart.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Cart({ cart, email, authToken, onBack, onUpdateQuantity, onRemove, onOrderComplete }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmOrder = async (event) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          items: cart.map(({ id, title, price, imageUrl, quantity }) => ({
            artworkId: id,
            title,
            price,
            imageUrl,
            quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to place order');
      setStatus('success');
      setMessage(data.message);
      onOrderComplete();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <button type="button" className="cart-page__back" onClick={onBack}><ArrowLeft size={18} /> Back to shopping</button>
        <p className="cart-page__eyebrow">Collector checkout</p>
        <h1>Your cart</h1>
        <p>Review your selected works before placing the order.</p>
      </header>

      <main className="cart-page__content">
        {cart.length === 0 ? (
          <section className="cart-page__empty">
            <h2>Your cart is waiting for something remarkable.</h2>
            <button type="button" onClick={onBack}>Browse artwork</button>
          </section>
        ) : (
          <>
            <section className="cart-page__items" aria-label="Cart items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="cart-item__details">
                    <h2>{item.title}</h2>
                    <p>{item.category} · ${item.price.toFixed(2)} each</p>
                    <div className="cart-item__controls">
                      <button type="button" aria-label={`Decrease ${item.title} quantity`} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}><Minus size={15} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.title} quantity`} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus size={15} /></button>
                      <button type="button" className="cart-item__remove" onClick={() => onRemove(item.id)}><Trash2 size={15} /> Remove</button>
                    </div>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <p>Order email</p>
              <strong>{email}</strong>
              <div className="cart-summary__total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
              <button type="button" className="cart-summary__confirm" onClick={confirmOrder} disabled={status === 'loading'}>
                {status === 'loading' ? 'Confirming...' : 'Confirm order'}
              </button>
              {status === 'success' ? <p className="cart-summary__message cart-summary__message--success"><CheckCircle size={16} /> {message}</p> : null}
              {status === 'error' ? <p className="cart-summary__message cart-summary__message--error">{message}</p> : null}
            </aside>
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;