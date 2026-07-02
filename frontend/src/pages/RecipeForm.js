import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers', 'Vegan', 'Vegetarian', 'Non-Veg', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Dinner',
  ingredients: [''],
  steps: [''],
  cookTime: 0,
  servings: 1,
  image: ''
};

const RecipeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/recipes/${id}`).then((res) => {
        const r = res.data;
        setForm({
          title: r.title,
          description: r.description,
          category: r.category,
          ingredients: r.ingredients,
          steps: r.steps,
          cookTime: r.cookTime,
          servings: r.servings,
          image: r.image
        });
      });
    }
  }, [id, isEdit]);

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  const updateListItem = (field, index, value) => {
    const list = [...form[field]];
    list[index] = value;
    setForm({ ...form, [field]: list });
  };

  const addListItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });

  const removeListItem = (field, index) => {
    const list = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.filter((i) => i.trim() !== ''),
        steps: form.steps.filter((s) => s.trim() !== '')
      };

      if (payload.ingredients.length === 0 || payload.steps.length === 0) {
        setError('Add at least one ingredient and one step.');
        return;
      }

      if (isEdit) {
        await api.put(`/recipes/${id}`, payload);
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post('/recipes', payload);
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container">
      <h2>{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      <form className="card" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />

        <label>Description</label>
        <textarea rows={2} value={form.description} onChange={(e) => updateField('description', e.target.value)} />

        <label>Category</label>
        <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Cook Time (minutes)</label>
            <input type="number" min={0} value={form.cookTime} onChange={(e) => updateField('cookTime', Number(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Servings</label>
            <input type="number" min={1} value={form.servings} onChange={(e) => updateField('servings', Number(e.target.value))} />
          </div>
        </div>

        <label>Image URL (optional)</label>
        <input value={form.image} onChange={(e) => updateField('image', e.target.value)} placeholder="https://..." />

        <label>Ingredients</label>
        {form.ingredients.map((ing, i) => (
          <div className="ingredient-row" key={i}>
            <input value={ing} onChange={(e) => updateListItem('ingredients', i, e.target.value)} placeholder={`Ingredient ${i + 1}`} />
            <button type="button" className="remove-btn" onClick={() => removeListItem('ingredients', i)}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline" onClick={() => addListItem('ingredients')}>+ Add Ingredient</button>

        <label style={{ marginTop: 18 }}>Steps</label>
        {form.steps.map((step, i) => (
          <div className="step-row" key={i}>
            <textarea rows={2} value={step} onChange={(e) => updateListItem('steps', i, e.target.value)} placeholder={`Step ${i + 1}`} />
            <button type="button" className="remove-btn" onClick={() => removeListItem('steps', i)}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline" onClick={() => addListItem('steps')}>+ Add Step</button>

        {error && <p className="error-text">{error}</p>}

        <button className="btn" style={{ marginTop: 20 }} type="submit">
          {isEdit ? 'Save Changes' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
