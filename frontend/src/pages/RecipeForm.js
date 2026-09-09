import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import IngredientStore from '../components/IngredientStore';
import CookingStage from '../components/CookingStage';
import KitchenTray from '../components/KitchenTray';
import SmartRecipeParserModal from '../components/SmartRecipeParserModal';

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
  sections: [
    { name: 'Preparation & Cooking', order: 0, steps: [{ instructionText: '' }] }
  ]
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
  const [ingredientMode, setIngredientMode] = useState('list'); // 'list' | 'kitchen'
  const [showParserModal, setShowParserModal] = useState(false);
  const stageRef = useRef(null);
  const fileRef = useRef();

  const loadEdit = useCallback(async () => {
    if (!isEdit) return;
    try {
      const res = await api.get(`/recipes/${id}`);
      const r = res.data;
      const initialSections = Array.isArray(r.sections) && r.sections.length > 0
        ? r.sections
        : [{ name: 'Preparation & Cooking', order: 0, steps: (r.steps || ['']).map(s => ({ instructionText: typeof s === 'string' ? s : s.instructionText })) }];
      setForm({
        title: r.title, description: r.description,
        origin: r.origin||'', region: r.region||'',
        categories: r.categories||[], otherCategory: r.otherCategory||'',
        cookTime: r.cookTime||'', servings: r.servings||'',
        imageMode:'url', imageUrl: r.image||'', imageFile:null, imagePreview: r.image||'',
        ingredients: r.ingredients||[], steps: r.steps||[''],
        sections: initialSections
      });
    } catch (err) {
      console.error(err);
    }
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

  const addIngredientFromStore = (ing) => {
    const label = `${ing.emoji} ${ing.name}`;
    setForm(f => {
      if (f.ingredients.includes(label)) return f;
      return { ...f, ingredients: [...f.ingredients, label] };
    });
  };

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

  const addManual = () => {
    const val = manualInput.trim();
    if (!val) return;
    setForm(f => ({ ...f, ingredients: [...f.ingredients, val] }));
    setManualInput('');
  };

  const addFromKitchen = (item) => {
    const label = `[${item.iconKey}] ${item.name}`;
    setForm(f => f.ingredients.includes(label) ? f : { ...f, ingredients: [...f.ingredients, label] });
  };

  const parseKitchenLabel = (label) => {
    const match = /^\[([a-z]+)\] (.+)$/.exec(label);
    if (!match) return null;
    return { iconKey: match[1], name: match[2] };
  };

  // Section management helpers
  const addSection = () => {
    setForm(f => ({
      ...f,
      sections: [
        ...f.sections,
        { name: `Section ${f.sections.length + 1}`, order: f.sections.length, steps: [{ instructionText: '' }] }
      ]
    }));
  };

  const updateSectionName = (secIdx, name) => {
    setForm(f => {
      const next = [...f.sections];
      next[secIdx] = { ...next[secIdx], name };
      return { ...f, sections: next };
    });
  };

  const removeSection = (secIdx) => {
    setForm(f => ({
      ...f,
      sections: f.sections.filter((_, i) => i !== secIdx)
    }));
  };

  const addStepToSection = (secIdx) => {
    setForm(f => {
      const next = [...f.sections];
      next[secIdx] = {
        ...next[secIdx],
        steps: [...next[secIdx].steps, { instructionText: '' }]
      };
      return { ...f, sections: next };
    });
  };

  const updateSectionStep = (secIdx, stepIdx, field, val) => {
    setForm(f => {
      const next = [...f.sections];
      const secSteps = [...(next[secIdx]?.steps || [])];
      const existing = secSteps[stepIdx];
      const currentObj = typeof existing === 'string' ? { instructionText: existing } : (existing || { instructionText: '' });
      secSteps[stepIdx] = { ...currentObj, [field]: val };
      next[secIdx] = { ...next[secIdx], steps: secSteps };
      return { ...f, sections: next };
    });
  };

  const removeSectionStep = (secIdx, stepIdx) => {
    setForm(f => {
      const next = [...f.sections];
      next[secIdx] = {
        ...next[secIdx],
        steps: next[secIdx].steps.filter((_, i) => i !== stepIdx)
      };
      return { ...f, sections: next };
    });
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, imageFile: file, imagePreview: e.target.result }));
    reader.readAsDataURL(file);
  };

  const getCleanStepsFromSections = () => {
    const list = [];
    (form.sections || []).forEach(sec => {
      (sec.steps || []).forEach(st => {
        const text = typeof st === 'string' ? st : (st?.instructionText || '');
        if (text && text.trim()) {
          list.push(text.trim());
        }
      });
    });
    return list;
  };

  const canAdvance = () => {
    if (step === 0) return form.title.trim().length > 0;
    if (step === 5) return form.ingredients.filter(i => i.trim()).length > 0;
    if (step === 6) return getCleanStepsFromSections().length > 0;
    return true;
  };

  const handleApplyParsedRecipe = (parsed) => {
    setForm(f => ({
      ...f,
      title: parsed.title || f.title,
      description: parsed.description || f.description,
      ingredients: parsed.ingredients.length > 0 ? parsed.ingredients : f.ingredients,
      sections: parsed.sections.length > 0 ? parsed.sections : f.sections
    }));
    setStep(6);
  };

  const handleSubmit = async () => {
    setError('');
    const cleanIngredients = form.ingredients.filter(i => i.trim());
    const cleanSteps = getCleanStepsFromSections();
    if (!form.title.trim() || cleanIngredients.length === 0 || cleanSteps.length === 0) {
      setError('Title, at least one ingredient, and at least one step instruction are required.');
      return;
    }
    try {
      const cleanSections = (form.sections || []).map((sec, i) => {
        const validSteps = (sec.steps || [])
          .map(st => {
            const text = typeof st === 'string' ? st : (st?.instructionText || '');
            return text.trim();
          })
          .filter(text => text.length > 0)
          .map(instructionText => ({ instructionText, timerSeconds: 0 }));

        return {
          name: (sec.name || '').trim() || `Section ${i + 1}`,
          order: i,
          steps: validSteps
        };
      }).filter(sec => sec.steps.length > 0);

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
        sections: cleanSections
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
      {/* Smart Recipe Parser Modal */}
      <SmartRecipeParserModal
        isOpen={showParserModal}
        onClose={() => setShowParserModal(false)}
        onApplyParsedRecipe={handleApplyParsedRecipe}
      />

      <div className="wizard-wrap">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1>{isEdit ? '✏️ Edit Recipe' : '✨ Add New Recipe'}</h1>
            <p style={{ color:'var(--muted)', margin: 0 }}>{isEdit ? 'Update your recipe below.' : "Build your recipe step by step — make it delicious!"}</p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setShowParserModal(true)}
            style={{ borderRadius: 30, fontWeight: 700, borderColor: 'var(--gold)', color: 'var(--gold)' }}
          >
            ⚡ Paste & Parse Recipe Text
          </button>
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
              {form.imageMode === 'url' ? (
                <div>
                  <label>Image URL</label>
                  <input value={form.imageUrl} onChange={e => { set('imageUrl', e.target.value); set('imagePreview', e.target.value); }}
                    placeholder="https://images.unsplash.com/photo-..." />
                </div>
              ) : (
                <div className="file-drop-area" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFileChange(e.target.files[0])} />
                  <div style={{ fontSize:'2.5rem' }}>📷</div>
                  <p style={{ fontWeight:700, margin:'8px 0 4px' }}>Click to select a photo</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--muted)' }}>PNG, JPG, WEBP supported</p>
                </div>
              )}
              {form.imagePreview && (
                <div className="img-preview-box" style={{ marginTop:16 }}>
                  <img src={form.imagePreview} alt="Preview" onError={() => set('imagePreview','')} />
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Ingredients */}
          {step === 5 && (
            <div>
              <div className="wizard-panel-header">
                <h2>🥕 What ingredients are needed?</h2>
                <p>Build your ingredient list using our Store, Visual Kitchen, or custom text.</p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${ingredientMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIngredientMode('list')}
                >
                  📋 List & Store Picker
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${ingredientMode === 'kitchen' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIngredientMode('kitchen')}
                >
                  🍳 Visual Kitchen Interactive Pan
                </button>
              </div>

              {ingredientMode === 'list' && (
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input
                      placeholder="Type custom ingredient (e.g. 2 tbsp Olive Oil)..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManual(); } }}
                    />
                    <button type="button" className="btn btn-sm" onClick={addManual}>
                      + Add
                    </button>
                  </div>

                  <div
                    className={`drop-zone-area ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDropZone}
                  >
                    <p style={{ fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                      🛒 Added Ingredients ({form.ingredients.length})
                    </p>
                    {form.ingredients.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 0' }}>
                        No ingredients added yet. Click items below or type above!
                      </p>
                    ) : (
                      <div className="dropped-ingredients" style={{ marginTop: 12 }}>
                        {form.ingredients.map((ing, i) => (
                          <div key={i} className="dropped-chip">
                            <span>{ing}</span>
                            <button className="remove-x" onClick={() => removeIngredient(i)}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                      Popular Store Items — Click to add
                    </p>
                    <IngredientStore onIngredientClick={addIngredientFromStore} onSelect={addIngredientFromStore} />
                  </div>
                </div>
              )}

              {ingredientMode === 'kitchen' && (
                <div>
                  <CookingStage
                    ref={stageRef}
                    onAdd={addFromKitchen}
                    addedItems={form.ingredients
                      .map(parseKitchenLabel)
                      .filter(Boolean)}
                  />
                  <div style={{ marginTop:20, borderTop:'2px solid var(--border)', paddingTop:16 }}>
                    <p style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.8px' }}>
                      🧺 Kitchen Inventory — Click or drag into the pan
                    </p>
                    <KitchenTray onItemActivate={(item, el) => stageRef.current?.cook(item, el)} />
                  </div>

                  {form.ingredients.length > 0 && (
                    <div style={{ marginTop:16 }}>
                      <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:8 }}>Full ingredient list so far:</p>
                      <div className="dropped-ingredients" style={{ minHeight: 'auto' }}>
                        {form.ingredients.map((ing, i) => (
                          <div key={i} className="dropped-chip">
                            <span>{ing}</span>
                            <button className="remove-x" onClick={() => removeIngredient(i)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 6 — Steps (Section-Wise) */}
          {step === 6 && (
            <div>
              <div className="wizard-panel-header">
                <h2>👨‍🍳 How do you make it? (Section-Wise)</h2>
                <p>Organize your recipe steps into clear sections (e.g. Preparation, Marination, Cooking, Garnish)!</p>
              </div>

              <div className="steps-list" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {form.sections.map((sec, secIdx) => (
                  <div key={secIdx} className="card" style={{ border: '2px solid var(--border)', background: 'var(--surface)', padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: '1.2rem' }}>📁</span>
                      <input
                        value={sec.name}
                        onChange={e => updateSectionName(secIdx, e.target.value)}
                        placeholder={`Section ${secIdx + 1} Name (e.g. Preparation, Cooking, Garnish)`}
                        style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent)' }}
                      />
                      {form.sections.length > 1 && (
                        <button className="btn btn-sm btn-ghost btn-danger" onClick={() => removeSection(secIdx)}>
                          🗑 Delete Section
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
                      {sec.steps.map((st, stepIdx) => {
                        const stepText = typeof st === 'string' ? st : (st?.instructionText || '');
                        return (
                          <div key={stepIdx} className="step-card" style={{ background: 'var(--bg)' }}>
                            <div className="step-number">{stepIdx + 1}</div>
                            <div style={{ flex: 1 }}>
                              <textarea
                                rows={2}
                                value={stepText}
                                onChange={e => updateSectionStep(secIdx, stepIdx, 'instructionText', e.target.value)}
                                placeholder={`Step ${stepIdx + 1} instruction for ${sec.name || 'this section'}...`}
                                style={{ width: '100%' }}
                              />
                            </div>
                            {sec.steps.length > 1 && (
                              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => removeSectionStep(secIdx, stepIdx)}>
                                ×
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => addStepToSection(secIdx)}>
                      + Add Step to {sec.name || 'Section'}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <button className="btn btn-outline btn-sm" onClick={addSection}>
                  ➕ Add New Cooking Section
                </button>
              </div>

              {error && <p className="error-text" style={{ marginTop: 16 }}>{error}</p>}
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
