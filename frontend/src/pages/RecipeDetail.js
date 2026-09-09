import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SectionCookingMode from '../components/SectionCookingMode';
import RecipeComments from '../components/RecipeComments';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Interactive Checklist States
  const [checkedIngs, setCheckedIngs] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [activeSectionTab, setActiveSectionTab] = useState(0);

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleLike = async () => {
    try {
      const res = await api.put(`/recipes/${id}/like`);
      setRecipe({ ...recipe, likes: res.data.likes });
    } catch (err) {
      alert('Could not update like status.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      navigate('/my-recipes');
    } catch (err) {
      alert('Could not delete recipe.');
    }
  };

  const sendToChat = () => {
    navigate('/groups', { state: { shareRecipeId: recipe._id, shareRecipeTitle: recipe.title } });
  };

  const toggleIng = (index) => {
    setCheckedIngs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleStep = (stepKey) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  if (!recipe) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: '3.5rem', animation: 'spin 2s linear infinite' }}>🍲</div>
        <p style={{ color: 'var(--muted)', marginTop: 14, fontWeight: 700 }}>Fetching recipe details...</p>
      </div>
    );
  }

  const isOwner = user && recipe.author?._id === user._id;
  const hasLiked = recipe.likes?.some((l) => l === user._id || l._id === user._id);
  const cats = Array.isArray(recipe.categories) && recipe.categories.length > 0
    ? recipe.categories
    : recipe.category ? [recipe.category] : ['Other'];

  // Always prefer saved sections if they contain actual steps.
  // Fall back to flat steps array only if sections are empty or missing.
  const hasSections = Array.isArray(recipe.sections) && recipe.sections.length > 0
    && recipe.sections.some((sec) => sec.steps && sec.steps.length > 0);

  const displaySections = hasSections
    ? recipe.sections
    : [{ name: 'Main Instructions', steps: (recipe.steps || []).map((s) => ({ instructionText: typeof s === 'string' ? s : s.instructionText })) }];

  // Calculate overall progress across all sections
  let totalStepsCount = 0;
  let finishedStepsCount = 0;

  displaySections.forEach((sec, sIdx) => {
    (sec.steps || []).forEach((_, stIdx) => {
      totalStepsCount++;
      if (completedSteps[`${sIdx}_${stIdx}`]) finishedStepsCount++;
    });
  });

  const progressPercent = totalStepsCount > 0 ? Math.round((finishedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="container" style={{ maxWidth: 920, paddingBottom: 60 }}>
      {/* Back Link */}
      <Link to="/recipes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--muted)', fontWeight: 700, fontSize: '0.9rem' }}>
        ← Back to Recipes
      </Link>

      {/* Hero Image Banner */}
      {recipe.image ? (
        <div className="detail-hero" style={{ height: 340, borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', marginBottom: 24, boxShadow: 'var(--shadow-lg)' }}>
          <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="detail-hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.78) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {cats.map((c) => (
                <span key={c} className="badge-category">
                  {c}
                </span>
              ))}
              {recipe.origin && <span className="badge-origin">🌍 {recipe.origin}</span>}
            </div>
            <h1 style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '2.3rem', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {recipe.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', textAlign: 'center', padding: '40px 24px', marginBottom: 24, borderRadius: 'var(--radius)' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: 12 }}>🍽</div>
          <h1 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0 }}>
            {recipe.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
            {cats.map((c) => (
              <span key={c} className="badge-category">{c}</span>
            ))}
            {recipe.origin && <span className="badge-origin">🌍 {recipe.origin}</span>}
          </div>
        </div>
      )}

      {/* Meta Bar */}
      <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '16px 22px', borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800 }}>Recipe Author</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>👤 {recipe.author?.username || 'Family Chef'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800 }}>Date Added</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>🗓 {formatDate(recipe.createdAt)}</div>
          </div>
          {recipe.cookTime > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800 }}>Cook Duration</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gold)' }}>⏱ {recipe.cookTime} Mins</div>
            </div>
          )}
          {recipe.servings > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800 }}>Servings</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>🍽 {recipe.servings} Servings</div>
            </div>
          )}
          {recipe.region && (
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800 }}>Region</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>📍 {recipe.region}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${hasLiked ? 'btn-gold' : 'btn-outline'}`} onClick={handleLike}>
            {hasLiked ? '❤️ Liked' : '🤍 Like'} ({recipe.likes?.length || 0})
          </button>
          <button className="btn btn-sm" onClick={sendToChat}>
            💬 Share to Group Chat
          </button>
          {isOwner && (
            <>
              <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/recipes/${id}/edit`)}>✏️ Edit</button>
              <button className="btn btn-sm btn-danger" onClick={handleDelete}>🗑 Delete</button>
            </>
          )}
        </div>
      </div>

      {recipe.description && (
        <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '18px 22px', marginBottom: 24 }}>
          <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            {recipe.description}
          </p>
        </div>
      )}

      {/* Interactive Ingredients Checklist */}
      <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '20px 24px', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text)', marginTop: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🥕 Recipe Ingredients Checklist ({recipe.ingredients?.length || 0})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {(recipe.ingredients || []).map((ing, i) => {
            const isChecked = !!checkedIngs[i];
            const ingText = typeof ing === 'string' ? ing : ing.name;
            return (
              <div
                key={i}
                onClick={() => toggleIng(i)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isChecked ? 'var(--bg-elevated)' : 'var(--bg)',
                  border: isChecked ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  color: isChecked ? 'var(--muted)' : 'var(--text)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all var(--transition)'
                }}
              >
                <span style={{ fontSize: '1rem', color: isChecked ? 'var(--accent)' : 'var(--muted)' }}>
                  {isChecked ? '☑' : '☐'}
                </span>
                <span>{ingText}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrated Section-Wise Voice Cooking Assistant */}
      <SectionCookingMode sections={recipe.sections} flatSteps={recipe.steps} recipeTitle={recipe.title} />

      {/* Section-Wise Interactive Cooking Steps & Progress */}
      <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '22px 26px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16, borderBottom: '1.5px solid var(--border)', paddingBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              👨‍🍳 Cooking Instructions (Section-Wise)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--muted)' }}>
              Click step numbers to mark progress as you cook each section.
            </p>
          </div>

          {/* Progress Bar Badge */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>
              Progress: {finishedStepsCount} of {totalStepsCount} Steps ({progressPercent}%)
            </div>
            <div style={{ width: 160, height: 8, background: 'var(--bg)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--gold))', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        {displaySections.length > 1 && (
          <div className="category-bar" style={{ marginBottom: 20 }}>
            {displaySections.map((sec, secIdx) => (
              <div
                key={secIdx}
                className={`category-chip ${activeSectionTab === secIdx ? 'active' : ''}`}
                onClick={() => setActiveSectionTab(secIdx)}
                style={{ fontWeight: 800, fontSize: '0.88rem' }}
              >
                📌 Section {secIdx + 1}: {sec.name || `Part ${secIdx + 1}`}
              </div>
            ))}
            <div
              className={`category-chip ${activeSectionTab === -1 ? 'active' : ''}`}
              onClick={() => setActiveSectionTab(-1)}
              style={{ fontWeight: 800, fontSize: '0.88rem' }}
            >
              📑 View All Sections
            </div>
          </div>
        )}

        {/* Section Instructions Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {displaySections.map((sec, secIdx) => {
            if (activeSectionTab !== -1 && activeSectionTab !== secIdx && displaySections.length > 1) return null;
            return (
              <div
                key={secIdx}
                style={{
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '20px 22px'
                }}
              >
                <h4 style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginTop: 0, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  📌 Section {secIdx + 1}: {sec.name || `Section ${secIdx + 1}`}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(sec.steps || []).map((st, stepIdx) => {
                    const stepKey = `${secIdx}_${stepIdx}`;
                    const isDone = !!completedSteps[stepKey];
                    const text = typeof st === 'string' ? st : (st?.instructionText || String(st));

                    return (
                      <div
                        key={stepIdx}
                        onClick={() => toggleStep(stepKey)}
                        style={{
                          display: 'flex',
                          gap: 16,
                          alignItems: 'flex-start',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: isDone ? 'var(--surface)' : 'var(--bg-elevated)',
                          border: isDone ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all var(--transition)'
                        }}
                      >
                        {/* Step Number Circle */}
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: isDone ? 'var(--accent)' : 'var(--surface)',
                            color: isDone ? '#FFFFFF' : 'var(--gold)',
                            border: '1.5px solid var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            flexShrink: 0
                          }}
                        >
                          {isDone ? '✓' : stepIdx + 1}
                        </div>

                        {/* Instruction Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.98rem', color: isDone ? 'var(--muted)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none', lineHeight: 1.6 }}>
                            {text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments & Reviews */}
      <RecipeComments recipeId={id} />
    </div>
  );
};

export default RecipeDetail;
