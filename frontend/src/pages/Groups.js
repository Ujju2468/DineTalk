import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    const [g, m] = await Promise.all([api.get('/groups'), api.get('/groups/members')]);
    setGroups(g.data);
    setMembers(m.data);
  };

  useEffect(() => { load(); }, []);

  const toggleMember = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await api.post('/groups', { name, memberIds: selected });
    setGroups([res.data, ...groups]);
    setName('');
    setSelected([]);
    setShowForm(false);
  };

  const openGroup = (groupId) => {
    navigate(`/groups/${groupId}/chat`, { state: location.state });
  };

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
        </button>
      </div>

      {showForm && (
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
        </form>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">No groups yet. Create one to start a dinner chat!</div>
      ) : (
        <div className="recipe-grid">
          {groups.map((g) => (
            <div key={g._id} className="card" onClick={() => openGroup(g._id)} style={{ cursor: 'pointer' }}>
              <h3 style={{ margin: '0 0 6px' }}>{g.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#8A7B6C', margin: 0 }}>
                {g.members.length} member{g.members.length !== 1 ? 's' : ''} · {g.members.map((m) => m.username).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
