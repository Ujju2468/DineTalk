import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { subscribeToPush } from '../utils/push';
import PollWidget from '../components/PollWidget';
import CreatePollForm from '../components/CreatePollForm';

const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const Chat = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showPollForm, setShowPollForm] = useState(false);
  const [pendingShare, setPendingShare] = useState(null);
  const [reminder, setReminder] = useState(null);
  const bottomRef = useRef(null);
  // FIX: track sent message IDs to prevent duplicates from socket echo
  const sentIds = useRef(new Set());

  const loadData = useCallback(async () => {
    const [g, msgs] = await Promise.all([
      api.get(`/groups/${groupId}`),
      api.get(`/messages/${groupId}`)
    ]);
    setGroup(g.data);
    setMessages(msgs.data);
  }, [groupId]);

  useEffect(() => {
    socket.emit('joinGroup', groupId);
    loadData();

    const handleReceive = (msg) => {
      const msgId = msg._id;
      // FIX: skip if we already added this message locally after sending
      if (sentIds.current.has(msgId)) {
        sentIds.current.delete(msgId);
        return;
      }
      const inGroup = msg.group === groupId || msg.group?._id === groupId;
      if (inGroup) setMessages(prev => [...prev, msg]);
    };

    const handlePollUpdate = (updatedPoll) => {
      setMessages(prev => prev.map(m =>
        m.sharedPoll && (m.sharedPoll._id === updatedPoll._id || m.sharedPoll === updatedPoll._id)
          ? { ...m, sharedPoll: updatedPoll } : m
      ));
    };

    const handleReminder = (payload) => setReminder(payload);

    socket.on('receiveMessage', handleReceive);
    socket.on('pollUpdated', handlePollUpdate);
    socket.on('pollReminder', handleReminder);

    return () => {
      socket.emit('leaveGroup', groupId);
      socket.off('receiveMessage', handleReceive);
      socket.off('pollUpdated', handlePollUpdate);
      socket.off('pollReminder', handleReminder);
    };
  }, [groupId, loadData]);

  useEffect(() => {
    if (location.state?.shareRecipeId)
      setPendingShare({ id: location.state.shareRecipeId, title: location.state.shareRecipeTitle });
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!text.trim() && !pendingShare) return;
    const res = await api.post('/messages', {
      group: groupId,
      text: text.trim(),
      sharedRecipe: pendingShare?.id || null
    });
    const newMsg = res.data;
    // FIX: add locally immediately, mark ID so socket echo is ignored
    sentIds.current.add(newMsg._id);
    setMessages(prev => [...prev, newMsg]);
    socket.emit('sendMessage', newMsg);
    setText('');
    setPendingShare(null);
  };

  const handlePollVoteUpdate = (updatedPoll) => {
    setMessages(prev => prev.map(m =>
      m.sharedPoll && m.sharedPoll._id === updatedPoll._id ? { ...m, sharedPoll: updatedPoll } : m
    ));
    socket.emit('pollUpdate', { ...updatedPoll, group: groupId });
  };

  const handlePollCreated = ({ message }) => {
    sentIds.current.add(message._id);
    setMessages(prev => [...prev, message]);
    socket.emit('sendMessage', message);
    setShowPollForm(false);
  };

  const enablePush = async () => {
    const ok = await subscribeToPush();
    alert(ok ? '🔔 Push reminders enabled!' : 'Could not enable push — check browser permissions.');
  };

  if (!group) return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: '3rem' }}>💬</div>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading chat...</p>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 12 }}>
      {reminder && (
        <div className="card" style={{ background: 'var(--gold-light)', borderColor: 'var(--gold)', borderLeft: '4px solid var(--gold)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⏰ {reminder.body}</span>
          <button onClick={() => setReminder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--muted)' }}>×</button>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <Link to="/groups" style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>← All Groups</Link>
      </div>

      <div className="chat-layout">
        <div className="chat-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="group-avatar" style={{ width: 40, height: 40, fontSize: '1rem' }}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{group.name}</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)' }}>{group.members.length} members</p>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Members</p>
            {group.members.map(m => (
              <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: '0.85rem', color: 'var(--text2)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)', flexShrink: 0 }}>
                  {m.username.charAt(0).toUpperCase()}
                </div>
                {m.username}
              </div>
            ))}
          </div>

          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: 10 }} onClick={enablePush}>
            🔔 Poll Reminders
          </button>

          {showPollForm
            ? <CreatePollForm groupId={groupId} onCreated={handlePollCreated} onCancel={() => setShowPollForm(false)} />
            : <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowPollForm(true)}>
                🗳 New Dinner Poll
              </button>
          }
        </div>

        <div className="chat-main">
          <div style={{ paddingBottom: 12, borderBottom: '1.5px solid var(--border)', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>💬 {group.name}</h2>
          </div>

          <div className="messages-area">
            {messages.length === 0 && (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-icon" style={{ fontSize: '2.5rem' }}>💬</div>
                <p>No messages yet — say hello!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={m._id || `msg-${i}`}>
                {m.type === 'poll' && m.sharedPoll ? (
                  <div style={{ maxWidth: 420, margin: '8px 0' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4 }}>
                      🗳 <strong>{m.sender?.username}</strong> started a poll
                    </p>
                    <PollWidget poll={m.sharedPoll} onVoteUpdate={handlePollVoteUpdate} />
                  </div>
                ) : (
                  <div className={`message-bubble ${m.sender?._id === user._id ? 'own' : ''}`}>
                    <div className="message-sender">{m.sender?.username}</div>
                    {m.text && <div style={{ marginBottom: m.sharedRecipe ? 6 : 0 }}>{m.text}</div>}
                    {m.sharedRecipe && (
                      <div className="shared-recipe-card">
                        <span style={{ fontSize: '1.5rem' }}>🍽</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.sharedRecipe.title}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            {(m.sharedRecipe.categories || [m.sharedRecipe.category] || []).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: '0.68rem', opacity: 0.6, marginTop: 4, textAlign: m.sender?._id === user._id ? 'right' : 'left' }}>
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {pendingShare && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--gold-light)', borderRadius: 'var(--radius-sm)', marginBottom: 8, border: '1px solid var(--gold)' }}>
              <span style={{ fontSize: '0.85rem' }}>📎 Sharing: <strong>{pendingShare.title}</strong></span>
              <button onClick={() => setPendingShare(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1.1rem', marginLeft: 'auto' }}>×</button>
            </div>
          )}

          <form className="message-input-row" onSubmit={sendMessage}>
            <input
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); }}
            />
            <button className="btn" type="submit" disabled={!text.trim() && !pendingShare}>Send 🍴</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
