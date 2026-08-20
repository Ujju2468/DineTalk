import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import IngredientStore from '../components/IngredientStore';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Dessert','Snacks','Beverages','Appetizers','Vegan','Vegetarian','Non-Veg','Other'];
const CAT_EMOJIS = { Breakfast:'🍳',Lunch:'🥗',Dinner:'🍽',Dessert:'🍰',Snacks:'🍿',Beverages:'🥤',Appetizers:'🥟',Vegan:'🌱',Vegetarian:'🥦','Non-Veg':'🍖',Other:'🏷' };

const STEPS_META = [
  { id:'info',        label:'Basics',      emoji:'📝' },
  { id:'origin',      label:'Origin',      emoji:'🌍' },
  { id:'categories',  label:'Category',    emoji:'🏷'  },
  { id:'timing',      label:'Timing',      emoji:'⏱'  },
  { id:'image',       label:'Photo',       emoji:'📸'  },
  { id:'ingredients', label:'Ingredients', emoji:'🥕'  },
  { id:'steps',       label:'Steps',       emoji:'👨‍🍳' },
];

const emptyForm = {
  title:'', description:'', origin:'', region:'',
  categories:[], otherCategory:'',
  cookTime:'', servings:'',
  imageMode:'url', imageUrl:'', imageFile:null, imagePreview:'',
  ingredients:[], steps:[''],
};

const RecipeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const fileRef = useRef();

  const loadEdit = useCallback(async () => {
    if (!isEdit) return;
    const res = await api.get(`/recipes/${id}`);
    const r = res.data;
    setForm({
      title: r.title, description: r.description,
      origin: r.origin||'', region: r.region||'',
      categories: r.categories||[], otherCategory: r.otherCategory||'',
      cookTime: r.cookTime||'', servings: r.servings||'',
      imageMode:'url', imageUrl: r.image||'', imageFile:null, imagePreview: r.image||'',
      ingredients: r.ingredients||[], steps: r.steps||[''],
    });
  }, [id, isEdit]);

  useEffect(() => { loadEdit(); }, [loadEdit]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleCat = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat]
    }));
  };

  // FIX: click to add from ingredient store
  const addIngredientFromStore = (ing) => {
    const label = `${ing.emoji} ${ing.name}`;
    setForm(f => {
      if (f.ingredients.includes(label)) return f;
      return { ...f, ingredients: [...f.ingredients, label] };
    });
  };

  // Drop zone handler
  const handleDropZone = (e) => {
    e.preventDefault(); setDragOver(false);
    const name = e.dataTransfer.getData('ingredient');
    const emoji = e.dataTransfer.getData('ingredientEmoji') || '🥄';
    if (!name) return;
    const label = `${emoji} ${name}`;
    setForm(f => f.ingredients.includes(label) ? f : { ...f, ingredients: [...f.ingredients, label] });
  };

  const removeIngredient = (idx) => {
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== idx) }));
  };

  // FIX: manual input uses separate state, added on Enter or button click
  const addManual = () => {
    const val = manualInput.trim();
    if (!val) return;
    setForm(f => ({ ...f, ingredients: [...f.ingredients, val] }));
    setManualInput('');
  };

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, ''] }));
  const updateStep = (idx, val) => {
    const list = [...form.steps]; list[idx] = val;
    setForm(f => ({ ...f, steps: list }));
  };
  const removeStep = (idx) => setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== idx) }));

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, imageFile: file, imagePreview: e.target.result }));
    reader.readAsDataURL(file);
  };

  const canAdvance = () => {
    if (step === 0) return form.title.trim().length > 0;
    if (step === 5) return form.ingredients.filter(i => i.trim()).length > 0;
    if (step === 6) return form.steps.filter(s => s.trim()).length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    const cleanIngredients = form.ingredients.filter(i => i.trim());
    const cleanSteps = form.steps.filter(s => s.trim());
    if (!form.title.trim() || cleanIngredients.length === 0 || cleanSteps.length === 0) {
      setError('Title, at least one ingredient, and at least one step are required.');
      return;
    }
    try {
      const payload = {
        title: form.title, description: form.description,
        origin: form.origin, region: form.region,
        categories: form.categories.length ? form.categories : ['Other'],
        otherCategory: form.otherCategory,
        cookTime: Number(form.cookTime)||0,
        servings: Number(form.servings)||1,
        image: form.imagePreview || form.imageUrl || '',
        ingredients: cleanIngredients,
        steps: cleanSteps,
      };
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
      <div className="wizard-wrap">
        <div className="page-header">
          <h1>{isEdit ? '✏️ Edit Recipe' : '✨ Add New Recipe'}</h1>
          <p style={{ color:'var(--muted)' }}>{isEdit ? 'Update your recipe below.' : "Build your recipe step by step — make it delicious!"}</p>
        </div>

        {/* Progress */}
        <div className="wizard-progress">
          {STEPS_META.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`wizard-step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} onClick={() => i <= step && setStep(i)}>
                <div className="wizard-dot-circle">{i < step ? '✓' : s.emoji}</div>
                <div className="wizard-dot-label">{s.label}</div>
              </div>
              {i < STEPS_META.length - 1 && <div className={`wizard-dot-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card wizard-panel" key={step}>

          {/* STEP 0 — Basics */}
          {step === 0 && (
            <div>
              <div className="wizard-panel-header">
                <h2>📝 What are you cooking?</h2>
                <p>Give your recipe a name and a mouth-watering description.</p>
              </div>
              <label>Recipe Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Maa ki Dal, Pasta Carbonara, Mango Lassi..." autoFocus />
              <label>Description</label>
              <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the flavour, texture, when you usually make it... helps people search for this dish later!" />
            </div>
          )}

          {/* STEP 1 — Origin */}
          {step === 1 && (
            <div>
              <div className="wizard-panel-header">
                <h2>🌍 Where is this dish from?</h2>
                <p>Help your family discover the story behind the dish.</p>
              </div>
              <label>Country / Culture of Origin</label>
              <input value={form.origin} onChange={e => set('origin', e.target.value)}
                placeholder="e.g. India, Italy, Mexico..." />
              <label>Famous Region or Area</label>
              <input value={form.region} onChange={e => set('region', e.target.value)}
                placeholder="e.g. Rajasthan, Sicily, Hyderabad..." />
              <div style={{ marginTop:16, padding:'14px 16px', background:'var(--gold-light)', borderRadius:'var(--radius-sm)', fontSize:'0.88rem', color:'var(--text2)' }}>
                💡 Mentioning origin makes your recipe searchable — search "Punjabi", "Kerala", "Italian" and it'll show up!
              </div>
            </div>
          )}

          {/* STEP 2 — Categories */}
          {step === 2 && (
            <div>
              <div className="wizard-panel-header">
                <h2>🏷 What kind of dish is this?</h2>
                <p>Pick as many as apply — a dish can belong to multiple categories!</p>
              </div>
              <div className="multi-cat-grid">
                {CATEGORIES.map(cat => (
                  <div key={cat} className={`cat-toggle ${form.categories.includes(cat) ? 'selected' : ''}`} onClick={() => toggleCat(cat)}>
                    {CAT_EMOJIS[cat]} {cat}
                  </div>
                ))}
              </div>
              {/* FIX: show text input when "Other" is selected */}
              {form.categories.includes('Other') && (
                <div style={{ marginTop: 16 }}>
                  <label>Specify "Other" category</label>
                  <input value={form.otherCategory} onChange={e => set('otherCategory', e.target.value)}
                    placeholder="e.g. Street Food, Fusion, BBQ, Pickle..." />
                </div>
              )}
              {form.categories.length > 0 && (
                <p style={{ marginTop:14, fontSize:'0.85rem', color:'var(--green)' }}>
                  ✓ Selected: {form.categories.map(c => c === 'Other' && form.otherCategory ? form.otherCategory : c).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* STEP 3 — Timing */}
          {step === 3 && (
            <div>
              <div className="wizard-panel-header">
                <h2>⏱ How long does it take?</h2>
                <p>Optional — but super helpful for planning dinner!</p>
              </div>
              <div className="fill-blank-row" style={{ marginTop:24 }}>
                <span>This meal will be ready in</span>
                <input type="number" min={0} className="fill-blank-input" style={{ width:70 }}
                  value={form.cookTime} onChange={e => set('cookTime', e.target.value)} placeholder="30" />
                <span>minutes and serves</span>
                <input type="number" min={1} className="fill-blank-input" style={{ width:55 }}
                  value={form.servings} onChange={e => set('servings', e.target.value)} placeholder="4" />
                <span>people.</span>
              </div>
            </div>
          )}

          {/* STEP 4 — Image */}
          {step === 4 && (
            <div>
              <div className="wizard-panel-header">
                <h2>📸 Add a photo (optional)</h2>
                <p>A picture is worth a thousand bites. Add one from a URL or upload from your device.</p>
              </div>
              <div className="img-upload-tabs">
                <div className={`img-tab ${form.imageMode==='url'?'active':''}`} onClick={() => set('imageMode','url')}>🌐 Online URL</div>
                <div className={`img-tab ${form.imageMode==='file'?'active':''}`} onClick={() => set('imageMode','file')}>📁 Upload File</div>
              </div>
              {form.imageMode==='url' && (
                <input value={form.imageUrl}
                  onChange={e => { set('imageUrl', e.target.value); set('imagePreview', e.target.value); }}
                  placeholder="https://example.com/my-dish.jpg" />
              )}
              {form.imageMode==='file' && (
                <div className="file-drop-zone"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
                  style={{ borderColor: dragOver ? 'var(--accent)' : undefined }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:8 }}>📷</div>
                  <p>Click or drag & drop a photo here</p>
                  <p style={{ fontSize:'0.8rem', marginTop:4 }}>JPG, PNG, WEBP</p>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFileChange(e.target.files[0])} />
                </div>
              )}
              {form.imagePreview && (
                <div style={{ position:'relative', marginTop:10 }}>
                  <img src={form.imagePreview} alt="Preview" className="img-preview" />
                  <button className="btn btn-sm btn-danger"
                    style={{ position:'absolute', top:8, right:8 }}
                    onClick={() => setForm(f => ({ ...f, imagePreview:'', imageUrl:'', imageFile:null }))}>
                    ✕ Remove
                  </button>
                </div>
              )}
              {!form.imagePreview && (
                <div style={{ textAlign:'center', marginTop:16, color:'var(--muted)', fontSize:'0.85rem' }}>
                  No image? No problem — a food emoji will show as placeholder 🍽
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Ingredients */}
          {step === 5 && (
            <div>
              <div className="wizard-panel-header">
                <h2>🥕 What goes into it?</h2>
                <p>
                  <strong>Click</strong> any ingredient from the store to add instantly, or <strong>drag</strong> it into the box.
                  You can also type manually below.
                </p>
              </div>

              {/* Drop zone showing added ingredients */}
              <div
                className="dropped-ingredients"
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDropZone}
                style={{ borderColor: dragOver ? 'var(--accent)' : undefined, minHeight:80, marginBottom:14 }}>
                {form.ingredients.length === 0 && (
                  <p style={{ color:'var(--muted)', fontSize:'0.85rem', margin:'auto' }}>
                    Click ingredients below or drag here ⬇️
                  </p>
                )}
                {form.ingredients.map((ing, i) => (
                  <div key={i} className="dropped-chip">
                    <span>{ing}</span>
                    <button className="remove-x" onClick={() => removeIngredient(i)}>×</button>
                  </div>
                ))}
              </div>

              {/* FIX: proper manual input with its own state */}
              <div style={{ display:'flex', gap:8, marginBottom:20 }}>
                <input
                  placeholder="Type an ingredient manually (e.g. 2 cups basmati rice)"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addManual(); } }}
                />
                <button className="btn btn-secondary btn-sm" style={{ flexShrink:0 }} onClick={addManual}>+ Add</button>
              </div>

              <div style={{ borderTop:'2px solid var(--border)', paddingTop:16 }}>
                <p style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.8px' }}>
                  🥄 Ingredient Store — Click to add · Drag also works
                </p>
                {/* FIX: pass onClick handler to IngredientStore */}
                <IngredientStore onIngredientClick={addIngredientFromStore} showAddNew={true} />
              </div>
            </div>
          )}

          {/* STEP 6 — Steps */}
          {step === 6 && (
            <div>
              <div className="wizard-panel-header">
                <h2>👨‍🍳 How do you make it?</h2>
                <p>Walk the family through each step. Be as detailed or brief as you like!</p>
              </div>
              <div className="steps-list">
                {form.steps.map((s, i) => (
                  <div key={i} className="step-card">
                    <div className="step-number">{i + 1}</div>
                    <textarea rows={2} value={s} onChange={e => updateStep(i, e.target.value)}
                      placeholder={`Step ${i+1}...`} style={{ width:'100%' }} />
                    {form.steps.length > 1 && (
                      <button className="btn btn-icon btn-ghost btn-sm" style={{ flexShrink:0 }} onClick={() => removeStep(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop:12 }} onClick={addStep}>+ Add Step</button>
              {error && <p className="error-text" style={{ marginTop:16 }}>{error}</p>}
            </div>
          )}

          {/* Wizard nav */}
          <div className="wizard-nav">
            <button className="btn btn-ghost" onClick={() => setStep(s => s-1)}
              style={{ visibility: step===0?'hidden':'visible' }}>← Back</button>
            <span style={{ fontSize:'0.82rem', color:'var(--muted)' }}>{step+1} of {STEPS_META.length}</span>
            {step < STEPS_META.length - 1 ? (
              <button className="btn" onClick={() => { if (canAdvance()) setStep(s => s+1); }}
                style={{ opacity: canAdvance()?1:0.5 }}>Next →</button>
            ) : (
              <button className="btn btn-secondary" onClick={handleSubmit}>
                {isEdit ? '💾 Save Changes' : '🍴 Publish Recipe!'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
