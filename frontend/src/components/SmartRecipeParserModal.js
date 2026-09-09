import React, { useState } from 'react';

export const parseRawRecipeText = (rawText) => {
  if (!rawText || !rawText.trim()) return null;

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  let title = '';
  let description = '';
  const ingredients = [];
  const sections = [];
  let currentSectionName = 'Preparation';
  let currentSectionSteps = [];

  let mode = 'header'; // 'header' | 'ingredients' | 'steps'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Check Mode Switchers
    if (/^(ingredients|what you'll need|shopping list|items):?/i.test(line) || lower === 'ingredients') {
      mode = 'ingredients';
      continue;
    }

    if (/^(instructions|directions|method|cooking steps|steps|how to cook|preparation):?/i.test(line) || lower === 'steps' || lower === 'instructions') {
      if (currentSectionSteps.length > 0) {
        sections.push({ name: currentSectionName, steps: currentSectionSteps });
        currentSectionSteps = [];
      }
      currentSectionName = 'Main Cooking Steps';
      mode = 'steps';
      continue;
    }

    // Sub-section header in steps mode (e.g. "For Marination:", "Section 1: Sauce", "### Plating")
    if (mode === 'steps' && (/^(section\s*\d+|for\s+[\w\s]+|###?\s*[\w\s]+|[\w\s]{3,30}:)$/i.test(line) || line.endsWith(':'))) {
      if (currentSectionSteps.length > 0) {
        sections.push({ name: currentSectionName, steps: currentSectionSteps });
        currentSectionSteps = [];
      }
      currentSectionName = line.replace(/^#+\s*/, '').replace(/:\s*$/, '').trim();
      continue;
    }

    // Process Content
    if (mode === 'ingredients') {
      const cleanIng = line.replace(/^[•*\-.d)]\s*/, '').trim();
      if (cleanIng) ingredients.push(cleanIng);
    } else if (mode === 'steps') {
      const cleanStep = line.replace(/^(\d+[.)]|step\s*\d+:?|[•*-])\s*/i, '').trim();
      if (cleanStep) {
        currentSectionSteps.push({ instructionText: cleanStep, timerSeconds: 0 });
      }
    } else {
      // Header / Title / Description
      if (!title) {
        title = line.replace(/^#+\s*/, '').replace(/\*+/g, '').trim();
      } else {
        description += (description ? ' ' : '') + line;
      }
    }
  }

  if (currentSectionSteps.length > 0) {
    sections.push({ name: currentSectionName, steps: currentSectionSteps });
  }

  return {
    title: title || 'Parsed Recipe',
    description,
    ingredients: ingredients.length > 0 ? ingredients : ['Ingredients list'],
    sections: sections.length > 0 ? sections : [{ name: 'Cooking Steps', steps: [{ instructionText: 'Cook until complete.', timerSeconds: 0 }] }]
  };
};

const SmartRecipeParserModal = ({ isOpen, onClose, onApplyParsedRecipe }) => {
  const [rawText, setRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);

  if (!isOpen) return null;

  const handleParse = () => {
    const res = parseRawRecipeText(rawText);
    setParsedPreview(res);
  };

  const handleConfirm = () => {
    if (parsedPreview) {
      onApplyParsedRecipe(parsedPreview);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 24,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
            ✨ Smart Recipe Paste & Text Parser
          </h2>
          <button className="btn btn-xs btn-ghost" onClick={onClose} style={{ fontSize: '1.2rem' }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '0 0 16px' }}>
          Paste raw recipe text from any website, blog, or chat. We will automatically format it into Title, Ingredients, and Section-Wise Steps!
        </p>

        {/* Raw Textarea Input */}
        <textarea
          rows={7}
          placeholder={`Paste raw recipe here...\n\nExample:\nCreamy Garlic Pasta\nDelicious Italian dinner recipe.\n\nIngredients:\n• 200g Pasta\n• 3 Garlic Cloves\n• 1 Cup Heavy Cream\n\nPreparation:\n1. Boil pasta in salted water.\n2. Mince garlic cloves.\n\nCooking:\n3. Sauté garlic in butter.\n4. Pour heavy cream and simmer.`}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          style={{ width: '100%', padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className="btn btn-sm" onClick={handleParse} disabled={!rawText.trim()}>
            ⚡ Format & Parse Recipe Text
          </button>
          {rawText && (
            <button className="btn btn-sm btn-ghost" onClick={() => { setRawText(''); setParsedPreview(null); }}>
              🧹 Clear Text
            </button>
          )}
        </div>

        {/* Formatted Parsed Preview */}
        {parsedPreview && (
          <div style={{ background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: 18, marginBottom: 16 }}>
            <h4 style={{ margin: '0 0 8px', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              📋 Formatted Preview: {parsedPreview.title}
            </h4>
            {parsedPreview.description && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 12px' }}>{parsedPreview.description}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
              {/* Parsed Ingredients */}
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>
                  🥕 Ingredients ({parsedPreview.ingredients.length})
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text)' }}>
                  {parsedPreview.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              {/* Parsed Section Steps */}
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
                  📌 Sections ({parsedPreview.sections.length})
                </div>
                {parsedPreview.sections.map((sec, secIdx) => (
                  <div key={secIdx} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text)' }}>
                      Section {secIdx + 1}: {sec.name}
                    </div>
                    <ol style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {sec.steps.map((st, stIdx) => (
                        <li key={stIdx}>{st.instructionText}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn" onClick={handleConfirm} style={{ width: '100%', marginTop: 16 }}>
              ✓ Apply Formatted Recipe to Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRecipeParserModal;
