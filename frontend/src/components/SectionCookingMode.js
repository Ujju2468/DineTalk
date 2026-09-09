import React, { useState, useEffect, useRef, useCallback } from 'react';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const SectionCookingMode = ({ sections = [], flatSteps = [], recipeTitle = '' }) => {
  // Normalize sections if only flatSteps were passed
  const formattedSections = React.useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      return sections.map((sec, idx) => ({
        id: sec._id || `sec_${idx}`,
        name: sec.name || `Section ${idx + 1}`,
        steps: (sec.steps || []).map((st, sIdx) => ({
          id: st._id || `step_${idx}_${sIdx}`,
          instructionText: typeof st === 'string' ? st : st.instructionText,
          timerSeconds: typeof st === 'object' ? st.timerSeconds || 0 : 0
        }))
      }));
    }
    return [{
      id: 'sec_0',
      name: 'Main Instructions',
      steps: flatSteps.map((st, sIdx) => ({
        id: `step_0_${sIdx}`,
        instructionText: typeof st === 'string' ? st : st.instructionText || String(st),
        timerSeconds: 0
      }))
    }];
  }, [sections, flatSteps]);

  const [activeSecIndex, setActiveSecIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const currentSec = formattedSections[activeSecIndex] || formattedSections[0];
  const currentStep = currentSec?.steps[activeStepIndex] || currentSec?.steps[0];

  const speakText = useCallback((text) => {
    if (!isSupported || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeech = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setIsReading(false);
  }, []);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopSpeech]);

  // Timer Countdown logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            speakText(`Timer complete for ${currentSec?.name}, Step ${activeStepIndex + 1}!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerSeconds, activeStepIndex, currentSec, speakText]);

  if (!formattedSections || formattedSections.length === 0) return null;

  const handleStartMode = () => {
    setIsPlaying(true);
    setActiveSecIndex(0);
    setActiveStepIndex(0);
    const firstSec = formattedSections[0];
    const firstStep = firstSec.steps[0];
    speakText(`Starting ${recipeTitle || 'recipe'}. Section 1: ${firstSec.name}. Step 1: ${firstStep?.instructionText}`);
    if (firstStep?.timerSeconds > 0) {
      setTimerSeconds(firstStep.timerSeconds);
    }
  };

  const handleStopMode = () => {
    stopSpeech();
    setIsPlaying(false);
    setTimerRunning(false);
  };

  const selectSectionTab = (secIdx) => {
    setActiveSecIndex(secIdx);
    setActiveStepIndex(0);
    const sec = formattedSections[secIdx];
    const firstStep = sec.steps[0];
    speakText(`Switched to Section ${secIdx + 1}: ${sec.name}. Step 1: ${firstStep?.instructionText}`);
    if (firstStep?.timerSeconds > 0) {
      setTimerSeconds(firstStep.timerSeconds);
    } else {
      setTimerSeconds(0);
      setTimerRunning(false);
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < currentSec.steps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      const st = currentSec.steps[nextIdx];
      speakText(`Step ${nextIdx + 1}: ${st.instructionText}`);
      if (st.timerSeconds > 0) setTimerSeconds(st.timerSeconds);
    } else if (activeSecIndex < formattedSections.length - 1) {
      // Advance to next section automatically!
      const nextSecIdx = activeSecIndex + 1;
      setActiveSecIndex(nextSecIdx);
      setActiveStepIndex(0);
      const nextSec = formattedSections[nextSecIdx];
      const st = nextSec.steps[0];
      speakText(`Section ${nextSecIdx + 1}: ${nextSec.name}. Step 1: ${st?.instructionText}`);
      if (st?.timerSeconds > 0) setTimerSeconds(st.timerSeconds);
    } else {
      speakText("Congratulations! You've finished all sections of this recipe!");
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      const st = currentSec.steps[prevIdx];
      speakText(`Step ${prevIdx + 1}: ${st.instructionText}`);
    } else if (activeSecIndex > 0) {
      const prevSecIdx = activeSecIndex - 1;
      const prevSec = formattedSections[prevSecIdx];
      setActiveSecIndex(prevSecIdx);
      const lastStepIdx = prevSec.steps.length - 1;
      setActiveStepIndex(lastStepIdx);
      const st = prevSec.steps[lastStepIdx];
      speakText(`Section ${prevSecIdx + 1}: ${prevSec.name}. Step ${lastStepIdx + 1}: ${st?.instructionText}`);
    }
  };

  const handleReadCurrent = () => {
    if (!currentStep) return;
    speakText(`Section ${activeSecIndex + 1}: ${currentSec.name}. Step ${activeStepIndex + 1}: ${currentStep.instructionText}`);
  };

  if (!isPlaying) {
    return (
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg2) 100%)', marginBottom: 24, border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🎙 Section-Wise Voice Cooking Assistant
            </h3>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
              Cook section by section ({formattedSections.length} sections) with audio guidance & step timers.
            </p>
          </div>
          <button className="btn" onClick={handleStartMode}>
            🔊 Launch Section Cooking Assistant
          </button>
        </div>

        {/* Section preview chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
          {formattedSections.map((sec, idx) => (
            <span key={sec.id} className="badge" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)', padding: '4px 12px' }}>
              📌 Section {idx + 1}: {sec.name} ({sec.steps.length} steps)
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', marginBottom: 28, boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.3s ease' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1.5px solid var(--border)', paddingBottom: 12 }}>
        <span className="badge" style={{ background: 'var(--accent)', color: 'white', fontSize: '0.82rem' }}>
          🎙 Cooking Mode • Section {activeSecIndex + 1} of {formattedSections.length}
        </span>
        <button className="btn btn-xs btn-ghost" onClick={handleStopMode}>
          ✕ Close Cooking Mode
        </button>
      </div>

      {/* Section Tabs */}
      <div className="category-bar" style={{ marginBottom: 16, paddingBottom: 6 }}>
        {formattedSections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`category-chip ${activeSecIndex === idx ? 'active' : ''}`}
            onClick={() => selectSectionTab(idx)}
            style={{ fontWeight: 700, fontSize: '0.85rem' }}
          >
            📌 {sec.name}
          </div>
        ))}
      </div>

      {/* Active Step Content */}
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 18, marginBottom: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {currentSec.name} — Step {activeStepIndex + 1} of {currentSec.steps.length}
          </span>
        </div>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {currentStep?.instructionText}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={handlePrevStep} disabled={activeSecIndex === 0 && activeStepIndex === 0}>
            ◀ Previous
          </button>
          <button className="btn btn-sm" onClick={handleReadCurrent}>
            {isReading ? '🔊 Speaking...' : '🗣 Read Out Step'}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleNextStep}>
            Next Step ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionCookingMode;
