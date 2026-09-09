import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CreatePollForm = ({ groupId, onCreated, onCancel }) => {
  const [question, setQuestion] = useState("What's for dinner tonight?");
  const [duration, setDuration] = useState(30);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get('/recipes').then((res) => setRecipes(res.data));
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreate = async () => {
    if (selected.length < 2) {
      alert('Pick at least 2 recipes');
      return;
    }
    const res = await api.post('/polls', {
      group: groupId,
      question,
      recipeIds: selected,
      durationMinutes: duration
    });
    onCreated(res.data); // { poll, message }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Create Dinner Poll</h3>
      <label>Question</label>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} />

      <label>Poll duration (minutes)</label>
      <input type="number" min={1} max={1440} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

      <label>Select recipes to vote on (min 2)</label>
      <div className="recipe-pick-list">
        {recipes.map((r) => (
          <div className="recipe-pick-item" key={r._id}>
            <input type="checkbox" checked={selected.includes(r._id)} onChange={() => toggleSelect(r._id)} style={{ width: 'auto' }} />
            <span>{r.title} <small style={{ color: '#8A7B6C' }}>({r.category})</small></span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button className="btn" onClick={handleCreate}>Create Poll</button>
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CreatePollForm;
