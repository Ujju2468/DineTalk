import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const formatRemaining = (ms) => {
  if (ms <= 0) return 'Ended';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s left`;
};

const PollWidget = ({ poll, onVoteUpdate }) => {
  const { user } = useAuth();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!poll) return null;

  const expiresAt = new Date(poll.expiresAt).getTime();
  const remaining = expiresAt - now;
  const isEnded = poll.isClosed || remaining <= 0;
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);

  const handleVote = async (index) => {
    if (isEnded) return;
    const res = await api.put(`/polls/${poll._id}/vote`, { optionIndex: index });
    onVoteUpdate(res.data);
  };

  const handleClose = async () => {
    const res = await api.put(`/polls/${poll._id}/close`);
    onVoteUpdate({ ...poll, isClosed: res.data.isClosed });
  };

  return (
    <div className="card poll-card">
      <h3 style={{ marginTop: 0 }}>🗳 {poll.question}</h3>
      {poll.options.map((opt, i) => {
        const pct = totalVotes ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
        const userVoted = opt.votes.some((v) => v._id === user._id || v === user._id);
        return (
          <div key={i} className={`poll-option ${userVoted ? 'voted' : ''}`} onClick={() => handleVote(i)}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{opt.recipe?.title || 'Recipe'}</span>
                <span>{opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''} ({pct}%)</span>
              </div>
              <div className="poll-bar-bg"><div className="poll-bar-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          </div>
        );
      })}
      <p style={{ fontSize: '0.8rem', color: '#8A7B6C' }}>
        {isEnded ? 'Poll ended' : formatRemaining(remaining)} · {totalVotes} total votes
      </p>
      {poll.createdBy && poll.createdBy._id === user._id && !isEnded && (
        <button className="btn btn-sm btn-danger" onClick={handleClose}>Close Poll Now</button>
      )}
    </div>
  );
};

export default PollWidget;
