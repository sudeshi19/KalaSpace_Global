import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Image, MessageCircle, Search, Send, Smile } from 'lucide-react';
import './Messages.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const EMOJIS = ['😊', '😍', '👏', '🙏', '❤️', '🔥', '🎨', '🖼️', '👍', '💯'];

function Messages({ authToken, userEmail, onBack, onLogin }) {
  const [people, setPeople] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = { Authorization: `Bearer ${authToken}` };
  const activePerson = people.find((person) => person._id === activeId);
  const visiblePeople = useMemo(() => people.filter((person) => {
    const text = `${person.name || ''} ${person.email}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (filter === 'all' || person.role === 'artist');
  }), [filter, people, search]);

  useEffect(() => {
    if (!authToken) return;
    fetch(`${API_BASE}/messages/people`, { headers: authHeaders })
      .then(async (response) => {
        if (!response.ok) throw new Error('Please sign in to use messages.');
        return response.json();
      })
      .then((data) => {
        setPeople(data.users || []);
        setLoading(false);
      })
      .catch((loadError) => {
        setError(loadError.message);
        setLoading(false);
      });
  }, [authToken]);

  useEffect(() => {
    if (!activeId || !authToken) return undefined;
    const loadMessages = () => fetch(`${API_BASE}/messages/${activeId}`, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => setMessages(data.messages || []));
    loadMessages();
    const interval = window.setInterval(loadMessages, 5000);
    return () => window.clearInterval(interval);
  }, [activeId, authToken]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || !activeId) return;
    const response = await fetch(`${API_BASE}/messages/${activeId}`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessages((current) => [...current, data.message]);
      setInput('');
      setShowEmoji(false);
    }
  };

  if (!authToken) {
    return (
      <main className="messages-page messages-page--locked">
        <MessageCircle size={42} />
        <h1>Messages are for members</h1>
        <p>Sign in to contact artists about their work.</p>
        <button type="button" onClick={onLogin}>Sign in</button>
      </main>
    );
  }

  return (
    <main className="messages-page">
      <header className="messages-page__header">
        <button type="button" onClick={onBack}><ArrowLeft size={18} /> Back to home</button>
        <div>
          <p className="messages-page__eyebrow">Private conversations</p>
          <h1>Messages</h1>
          <p>Ask artists about pieces you love, commissions, and orders.</p>
        </div>
        <span className="messages-page__account">{userEmail}</span>
      </header>

      <section className="messages-shell">
        <aside className={`messages-list ${activeId ? 'messages-list--mobile-hidden' : ''}`}>
          <div className="messages-list__tools">
            <div className="messages-search">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people" />
            </div>
            <div className="messages-tabs">
              <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>All</button>
              <button className={filter === 'artists' ? 'is-active' : ''} onClick={() => setFilter('artists')}>Artists</button>
            </div>
          </div>
          {loading ? <p className="messages-empty">Loading people...</p> : null}
          {error ? <p className="messages-empty">{error}</p> : null}
          {!loading && !error && visiblePeople.length === 0 ? <p className="messages-empty">No people found yet. Create another account to start a conversation.</p> : null}
          {visiblePeople.map((person) => (
            <button type="button" className={`message-person ${activeId === person._id ? 'is-active' : ''}`} key={person._id} onClick={() => setActiveId(person._id)}>
              <span className="message-person__avatar">{(person.name || person.email).charAt(0).toUpperCase()}</span>
              <span><strong>{person.name || person.email}</strong><small>{person.role}</small></span>
            </button>
          ))}
        </aside>

        <section className={`message-chat ${!activeId ? 'message-chat--mobile-hidden' : ''}`}>
          {!activePerson ? (
            <div className="messages-empty messages-empty--large"><MessageCircle size={40} /><h2>Select someone to start chatting</h2><p>Choose an artist or user from the list.</p></div>
          ) : (
            <>
              <header className="message-chat__header">
                <button type="button" className="message-chat__back" onClick={() => setActiveId('')}><ArrowLeft size={18} /></button>
                <span className="message-person__avatar">{(activePerson.name || activePerson.email).charAt(0).toUpperCase()}</span>
                <div><strong>{activePerson.name || activePerson.email}</strong><small>{activePerson.role}</small></div>
              </header>
              <div className="message-chat__body">
                {messages.length === 0 ? <p className="messages-empty">Start the conversation.</p> : messages.map((message) => {
                  const mine = message.sender?._id !== activeId;
                  return <div key={message._id} className={`message-bubble ${mine ? 'is-mine' : ''}`}><p>{message.content}</p><small>{new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small></div>;
                })}
              </div>
              <form className="message-chat__composer" onSubmit={sendMessage}>
                {showEmoji ? <div className="message-emoji">{EMOJIS.map((emoji) => <button type="button" key={emoji} onClick={() => setInput((current) => current + emoji)}>{emoji}</button>)}</div> : null}
                <button type="button" onClick={() => setShowEmoji((current) => !current)} aria-label="Add emoji"><Smile size={19} /></button>
                <button type="button" aria-label="Attach image" onClick={() => setInput((current) => `${current} 🖼️`)}><Image size={19} /></button>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Message ${activePerson.name || activePerson.email}`} />
                <button type="submit" className="message-chat__send" disabled={!input.trim()} aria-label="Send message"><Send size={18} /></button>
              </form>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default Messages;
