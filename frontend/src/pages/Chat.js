import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { subscribeToPush } from '../utils/push';
import PollWidget from '../components/PollWidget';
import CreatePollForm from '../components/CreatePollForm';

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
      if (msg.group === groupId || msg.group?._id === groupId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handlePollUpdate = (updatedPoll) => {
      setMessages((prev) =>
        prev.map((m) => (m.sharedPoll && m.sharedPoll._id === updatedPoll._id ? { ...m, sharedPoll: updatedPoll } : m))
      );
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
    if (location.state?.shareRecipeId) {
      setPendingShare({ id: location.state.shareRecipeId, title: location.state.shareRecipeTitle });
    }
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

    socket.emit('sendMessage', res.data);
    setMessages((prev) => [...prev, res.data]);
    setText('');
    setPendingShare(null);
  };

  const handlePollVoteUpdate = (updatedPoll) => {
    setMessages((prev) =>
      prev.map((m) => (m.sharedPoll && m.sharedPoll._id === updatedPoll._id ? { ...m, sharedPoll: updatedPoll } : m))
    );
    socket.emit('pollUpdate', updatedPoll);
  };

  const handlePollCreated = ({ message }) => {
    setMessages((prev) => [...prev, message]);
    socket.emit('sendMessage', message);
    setShowPollForm(false);
  };

  const enablePush = async () => {
    const ok = await subscribeToPush();
    alert(ok ? 'Push reminders enabled!' : 'Could not enable push (check browser permissions).');
  };

  if (!group) return <div className="container">Loading group...</div>;

  return (
    <div className="container">
      {reminder && (
        <div className="card" style={{ background: '#FFF3EA', borderColor: '#D9622B', marginBottom: 12 }}>
          ⏰ {reminder.body}
          <button className="remove-btn" onClick={() => setReminder(null)}>×</button>
        </div>
      )}

      <Link to="/groups">&larr; All groups</Link>
      <div className="chat-layout">
        <div className="chat-sidebar">
          <h3>{group.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#8A7B6C' }}>
            {group.members.length} members: {group.members.map((m) => m.username).join(', ')}
          </p>
          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: 10 }} onClick={enablePush}>
            🔔 Enable Push Reminders
          </button>
          {showPollForm ? (
            <CreatePollForm groupId={groupId} onCreated={handlePollCreated} onCancel={() => setShowPollForm(false)} />
          ) : (
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowPollForm(true)}>
              + New Dinner Poll
            </button>
          )}
        </div>

        <div className="chat-main">
          <h2>💬 {group.name} Chat</h2>
          <div className="messages-area">
            {messages.map((m) => (
              <div key={m._id}>
                {m.type === 'poll' && m.sharedPoll ? (
                  <PollWidget poll={m.sharedPoll} onVoteUpdate={handlePollVoteUpdate} />
                ) : (
                  <div className={`message-bubble ${m.sender?._id === user._id ? 'own' : ''}`}>
                    <div className="message-sender">{m.sender?.username}</div>
                    {m.text && <div>{m.text}</div>}
                    {m.sharedRecipe && (
                      <div className="shared-recipe-card">
                        <div>
                          <strong>🍽 {m.sharedRecipe.title}</strong>
                          <div style={{ fontSize: '0.75rem' }}>{m.sharedRecipe.category}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {pendingShare && (
            <div className="shared-recipe-card" style={{ marginBottom: 8 }}>
              Sharing: <strong>{pendingShare.title}</strong>
              <button className="remove-btn" onClick={() => setPendingShare(null)}>×</button>
            </div>
          )}

          <form className="message-input-row" onSubmit={sendMessage}>
            <input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
