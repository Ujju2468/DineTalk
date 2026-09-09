import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (d) => {
  if (!d) return '';
  const now = new Date();
  const date = new Date(d);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const RecipeComments = ({ recipeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/${recipeId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post(`/comments/${recipeId}`, { text: text.trim() });
      setComments((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      alert('Could not post comment.');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;
    try {
      const res = await api.post(`/comments/${recipeId}`, {
        text: replyText.trim(),
        parentComment: replyTo
      });
      setComments((prev) => [...prev, res.data]);
      setReplyText('');
      setReplyTo(null);
    } catch (err) {
      alert('Could not post reply.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      // Remove the comment and all its replies from local state
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId && c.parentComment !== commentId)
      );
    } catch (err) {
      alert('Could not delete comment.');
    }
  };

  // Build threaded structure: top-level comments + their replies
  const topLevel = comments.filter((c) => !c.parentComment);
  const getReplies = (parentId) =>
    comments.filter((c) => c.parentComment === parentId || c.parentComment?._id === parentId);

  const totalCount = comments.length;

  if (!user) return null;

  return (
    <div
      className="card"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        padding: '22px 26px',
        marginBottom: 28
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
          borderBottom: '1.5px solid var(--border)',
          paddingBottom: 14
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '1.3rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--text)'
          }}
        >
          💬 Comments & Reviews ({totalCount})
        </h3>
      </div>

      {/* Post Comment Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 22 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            placeholder="Share your experience with this recipe..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 500))}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-body)',
              resize: 'vertical',
              minHeight: 80,
              transition: 'border-color var(--transition)'
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: text.length > 450 ? 'var(--accent)' : 'var(--muted)',
                fontWeight: 600
              }}
            >
              {text.length}/500
            </span>
            <button
              className="btn btn-sm"
              type="submit"
              disabled={!text.trim()}
              style={{ opacity: text.trim() ? 1 : 0.5 }}
            >
              💬 Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', padding: 20 }}>
          Loading comments...
        </p>
      ) : topLevel.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💭</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
            No comments yet — be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topLevel.map((comment) => {
            const replies = getReplies(comment._id);
            const isOwner = user._id === (comment.author?._id || comment.author);

            return (
              <div key={comment._id}>
                {/* Top-Level Comment */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    transition: 'border-color var(--transition)'
                  }}
                >
                  {/* Author Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}
                    >
                      {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: 'var(--text)'
                        }}
                      >
                        {comment.author?.username || 'Anonymous'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--muted)',
                          marginLeft: 8
                        }}
                      >
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--accent)',
                          padding: '2px 8px',
                          borderRadius: 12
                        }}
                      >
                        ↩ Reply
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'var(--muted)',
                            padding: '2px 8px',
                            borderRadius: 12
                          }}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: 'var(--text)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {comment.text}
                  </p>
                </div>

                {/* Reply Input (conditionally shown) */}
                {replyTo === comment._id && (
                  <form
                    onSubmit={handleReply}
                    style={{
                      marginTop: 8,
                      marginLeft: 32,
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start'
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--border)',
                        fontSize: '1.2rem',
                        marginTop: 6,
                        flexShrink: 0
                      }}
                    >
                      ↳
                    </span>
                    <input
                      placeholder={`Reply to ${comment.author?.username || 'this comment'}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
                      style={{
                        flex: 1,
                        padding: '8px 14px',
                        borderRadius: 20,
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-elevated)',
                        color: 'var(--text)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button
                      className="btn btn-sm"
                      type="submit"
                      disabled={!replyText.trim()}
                      style={{ flexShrink: 0, opacity: replyText.trim() ? 1 : 0.5 }}
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReplyTo(null); setReplyText(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted)',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}
                    >
                      ✕
                    </button>
                  </form>
                )}

                {/* Replies */}
                {replies.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      marginLeft: 32,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    {replies.map((reply) => {
                      const isReplyOwner = user._id === (reply.author?._id || reply.author);
                      return (
                        <div
                          key={reply._id}
                          style={{
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start'
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--border)',
                              fontSize: '1rem',
                              marginTop: 8,
                              flexShrink: 0
                            }}
                          >
                            ↳
                          </span>
                          <div
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 4
                              }}
                            >
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  background: 'var(--secondary)',
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.65rem',
                                  flexShrink: 0
                                }}
                              >
                                {reply.author?.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  color: 'var(--text)'
                                }}
                              >
                                {reply.author?.username || 'Anonymous'}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  color: 'var(--muted)'
                                }}
                              >
                                {formatDate(reply.createdAt)}
                              </span>
                              {isReplyOwner && (
                                <button
                                  onClick={() => handleDelete(reply._id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.72rem',
                                    color: 'var(--muted)',
                                    marginLeft: 'auto'
                                  }}
                                >
                                  🗑
                                </button>
                              )}
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.86rem',
                                lineHeight: 1.5,
                                color: 'var(--text2)',
                                whiteSpace: 'pre-wrap'
                              }}
                            >
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecipeComments;
