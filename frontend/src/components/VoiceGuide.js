import React, { useState, useEffect, useRef, useCallback } from 'react';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const VoiceGuide = ({ steps = [], sections = [], recipeTitle = '' }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Normalize steps from sections or flat steps
  const normalizedSteps = React.useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      const list = [];
      sections.forEach((sec, secIdx) => {
        (sec.steps || []).forEach((st, stIdx) => {
          list.push({
            sectionName: sec.name || `Section ${secIdx + 1}`,
            stepNum: stIdx + 1,
            text: typeof st === 'string' ? st : st.instructionText,
            timerSeconds: typeof st === 'object' ? st.timerSeconds || 0 : 0
          });
        });
      });
      return list;
    }
    return steps.map((st, i) => ({
      sectionName: 'Instructions',
      stepNum: i + 1,
      text: typeof st === 'string' ? st : st.instructionText || String(st),
      timerSeconds: 0
    }));
  }, [steps, sections]);

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

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            speakText(`Timer complete for step ${activeStepIndex + 1}!`);
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
  }, [timerRunning, timerSeconds, activeStepIndex, speakText]);

  if (!normalizedSteps || normalizedSteps.length === 0) return null;

  const currentItem = normalizedSteps[activeStepIndex];

  const handleStartMode = () => {
    setIsPlaying(true);
    const first = normalizedSteps[0];
    speakText(`Starting ${recipeTitle || 'recipe'}. ${first.sectionName}. Step ${first.stepNum}: ${first.text}`);
  };

  const handleStopMode = () => {
    stopSpeech();
    setIsPlaying(false);
    setTimerRunning(false);
  };

  const handleNext = () => {
    if (activeStepIndex < normalizedSteps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      const item = normalizedSteps[nextIdx];
      speakText(`${item.sectionName}. Step ${item.stepNum}: ${item.text}`);
      if (item.timerSeconds > 0) {
        setTimerSeconds(item.timerSeconds);
      }
    } else {
      speakText("Congratulations! You've reached the last step. Enjoy your meal!");
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      const item = normalizedSteps[prevIdx];
      speakText(`${item.sectionName}. Step ${item.stepNum}: ${item.text}`);
    }
  };

  const handleRepeat = () => {
    if (!currentItem) return;
    speakText(`${currentItem.sectionName}. Step ${currentItem.stepNum}: ${currentItem.text}`);
  };

  const startTimer = (mins) => {
    setTimerSeconds(mins * 60);
    setTimerRunning(true);
    speakText(`Setting timer for ${mins} minutes.`);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isPlaying) {
    return (
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg2) 100%)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
            🎙 Voice Guided Cooking Mode
          </h3>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Hands-free step reader with audio instructions & built-in timers.
          </p>
        </div>
        <button className="btn" onClick={handleStartMode}>
          🔊 Start Cooking Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', marginBottom: 24, boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <span className="badge" style={{ background: 'var(--accent)', color: 'white', fontSize: '0.8rem' }}>
          🎙 Voice Assistant Active • Step {activeStepIndex + 1} of {normalizedSteps.length}
        </span>
        <button className="btn btn-xs btn-ghost" onClick={handleStopMode}>
          ✕ Close Assistant
        </button>
      </div>

      {currentItem?.sectionName && (
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
          📌 {currentItem.sectionName} — Step {currentItem.stepNum}
        </div>
      )}

      <div style={{ minHeight: 70, display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {currentItem?.text}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={handlePrev} disabled={activeStepIndex === 0}>
            ◀ Prev
          </button>
          <button className="btn btn-sm" onClick={handleRepeat}>
            {isReading ? '🔊 Reading...' : '🗣 Read Step'}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleNext} disabled={activeStepIndex === normalizedSteps.length - 1}>
            Next ▶
          </button>
        </div>

        {/* Quick step timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {timerSeconds > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gold-light)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--gold)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.9rem' }}>
                ⏱ {formatTimer(timerSeconds)}
              </span>
              <button className="btn btn-xs btn-ghost" onClick={() => setTimerRunning(!timerRunning)}>
                {timerRunning ? '⏸' : '▶'}
              </button>
              <button className="btn btn-xs btn-ghost" onClick={() => { setTimerSeconds(0); setTimerRunning(false); }}>
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', alignSelf: 'center', fontWeight: 700 }}>Quick Timer:</span>
              <button className="btn btn-xs btn-outline" onClick={() => startTimer(2)}>+2m</button>
              <button className="btn btn-xs btn-outline" onClick={() => startTimer(5)}>+5m</button>
              <button className="btn btn-xs btn-outline" onClick={() => startTimer(10)}>+10m</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceGuide;
