import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
<<<<<<< HEAD
=======
  const [desc, setDesc] = useState('');
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    const [g, m] = await Promise.all([api.get('/groups'), api.get('/groups/members')]);
    setGroups(g.data);
    setMembers(m.data);
  };
<<<<<<< HEAD

  useEffect(() => { load(); }, []);

  const toggleMember = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
=======
  useEffect(() => { load(); }, []);

  const toggleMember = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
<<<<<<< HEAD
    const res = await api.post('/groups', { name, memberIds: selected });
    setGroups([res.data, ...groups]);
    setName('');
    setSelected([]);
    setShowForm(false);
=======
    const res = await api.post('/groups', { name, description: desc, memberIds: selected });
    setGroups([res.data, ...groups]);
    setName(''); setDesc(''); setSelected([]); setShowForm(false);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
  };

  const openGroup = (groupId) => {
    navigate(`/groups/${groupId}/chat`, { state: location.state });
  };

<<<<<<< HEAD
  return (
    <div className="container">
      {location.state?.shareRecipeId && (
        <div className="card" style={{ background: '#FFF3EA', marginBottom: 14 }}>
          Pick a group to share <strong>{location.state.shareRecipeTitle}</strong> into.
        </div>
      )}
      <div className="toolbar">
        <h2>Your Groups</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Group'}
=======
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
        </button>
      </div>

      {showForm && (
<<<<<<< HEAD
        <form className="card" style={{ marginBottom: 18 }} onSubmit={handleCreate}>
          <label>Group name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cousins Squad" required />
          <label>Add members</label>
          <div className="recipe-pick-list">
            {members.map((m) => (
              <div className="recipe-pick-item" key={m._id}>
                <input
                  type="checkbox"
                  style={{ width: 'auto' }}
                  checked={selected.includes(m._id)}
                  onChange={() => toggleMember(m._id)}
                />
                <span>{m.username}</span>
              </div>
            ))}
            {members.length === 0 && <p style={{ color: '#8A7B6C' }}>No other registered users yet.</p>}
          </div>
          <button className="btn" style={{ marginTop: 14 }} type="submit">Create Group</button>
=======
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
        </form>
      )}

      {groups.length === 0 ? (
<<<<<<< HEAD
        <div className="empty-state">No groups yet. Create one to start a dinner chat!</div>
      ) : (
        <div className="recipe-grid">
          {groups.map((g) => (
            <div key={g._id} className="card" onClick={() => openGroup(g._id)} style={{ cursor: 'pointer' }}>
              <h3 style={{ margin: '0 0 6px' }}>{g.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#8A7B6C', margin: 0 }}>
                {g.members.length} member{g.members.length !== 1 ? 's' : ''} · {g.members.map((m) => m.username).join(', ')}
              </p>
=======
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
