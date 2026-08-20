import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    const [g, m] = await Promise.all([api.get('/groups'), api.get('/groups/members')]);
    setGroups(g.data);
    setMembers(m.data);
  };
  useEffect(() => { load(); }, []);

  const toggleMember = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await api.post('/groups', { name, description: desc, memberIds: selected });
    setGroups([res.data, ...groups]);
    setName(''); setDesc(''); setSelected([]); setShowForm(false);
  };

  const openGroup = (groupId) => {
    navigate(`/groups/${groupId}/chat`, { state: location.state });
  };

  const groupInitial = (name) => name.charAt(0).toUpperCase();
  const groupColor = (name) => {
    const colors = ['#C85A1E','#5C7A3E','#C9962A','#6B4226','#8B5E3C'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="container">
      {location.state?.shareRecipeId && (
        <div className="card" style={{ background: 'var(--gold-light)', borderColor: 'var(--gold)', marginBottom: 20 }}>
          🍽 Pick a group to share <strong>"{location.state.shareRecipeTitle}"</strong> into.
        </div>
      )}

      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Family Groups</h1>
          <p>Chat, share recipes & run dinner polls per group</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Group'}
        </button>
      </div>

      {showForm && (
        <form className="card" style={{ marginTop: 16, marginBottom: 20 }} onSubmit={handleCreate}>
          <h3 style={{ marginBottom: 16 }}>👨‍👩‍👧‍👦 Create a new group</h3>
          <label>Group Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cousins Squad, Sunday Dinners..." required />
          <label>Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's this group about?" />
          <label>Add Members</label>
          <div className="recipe-pick-list" style={{ maxHeight: 200, overflowY: 'auto', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 10 }}>
            {members.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No other registered users yet — invite family to join!</p>
              : members.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>
                  <input type="checkbox" checked={selected.includes(m._id)} onChange={() => toggleMember(m._id)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-dark)' }}>
                    {m.username.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600 }}>{m.username}</span>
                </div>
              ))
            }
          </div>
          <button className="btn" style={{ marginTop: 16 }} type="submit">🎉 Create Group</button>
        </form>
      )}

      {groups.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon">👨‍👩‍👧‍👦</div>
          <h3>No groups yet</h3>
          <p>Create a group for your family, cousins, or friends to start chatting!</p>
        </div>
      ) : (
        <div className="recipe-grid" style={{ marginTop: 20 }}>
          {groups.map(g => (
            <div key={g._id} className="card group-card" onClick={() => openGroup(g._id)}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="group-avatar" style={{ background: groupColor(g.name) }}>
                  {groupInitial(g.name)}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{g.name}</h3>
                  {g.description && <p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>{g.description}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.members.map(m => (
                  <span key={m._id} style={{ fontSize: '0.78rem', background: 'var(--bg2)', padding: '3px 10px', borderRadius: 20, color: 'var(--text2)', fontWeight: 600 }}>
                    {m.username}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                {g.members.length} member{g.members.length !== 1 ? 's' : ''} · tap to open chat 💬
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
