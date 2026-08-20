import React, { useState, useEffect, useRef, useCallback } from 'react';
import { detectAction } from '../utils/cookActions';

// Pulls a "5 min" / "10 minutes" style duration out of a step's text, if present.
const extractSeconds = (text) => {
  const match = text.match(/(\d+)\s*(?:-\s*\d+\s*)?(min|minute|sec|second)/i);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  return /sec/i.test(match[2]) ? value : value * 60;
};

const formatTime = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const CookMode = ({ recipe, onClose }) => {
  const steps = recipe.steps || [];
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const currentDuration = extractSeconds(steps[index] || '');
  const action = detectAction(steps[index] || '');

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    clearTimer();
    setRunning(false);
    setSecondsLeft(currentDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => () => clearTimer(), []);

  const toggleTimer = () => {
    if (running) {
      clearTimer();
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimer();
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const goNext = useCallback(() => {
    if (index < steps.length - 1) setIndex(index + 1);
  }, [index, steps.length]);

  const goPrev = () => { if (index > 0) setIndex(index - 1); };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, onClose]);

  const progress = steps.length ? ((index + 1) / steps.length) * 100 : 0;

  return (
    <div className="cook-mode-overlay">
      <div className="cook-mode-header">
        <strong>👨‍🍳 {recipe.title}</strong>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Exit</button>
      </div>

      <div className="cook-mode-progress" style={{ margin: '0 20px' }}>
        <div className="cook-mode-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="cook-mode-body">
        <div key={index} className={`cook-mode-action ${action.anim}`}>{action.icon}</div>
        <div className="cook-mode-action-label">{action.label}</div>
        <div className="cook-mode-step-num">{index + 1}</div>
        <div className="cook-mode-step-text">{steps[index]}</div>

        {currentDuration !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="cook-mode-timer">{formatTime(secondsLeft ?? currentDuration)}</div>
            <button className="btn btn-outline btn-sm" onClick={toggleTimer}>
              {running ? '⏸ Pause' : secondsLeft === 0 ? '↻ Restart' : '▶ Start timer'}
            </button>
          </div>
        )}
      </div>

      <div className="cook-mode-footer">
        <button className="btn btn-outline" onClick={goPrev} disabled={index === 0}>← Back</button>
        <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
          Step {index + 1} of {steps.length}
        </span>
        {index === steps.length - 1 ? (
          <button className="btn" onClick={onClose}>🎉 Done</button>
        ) : (
          <button className="btn" onClick={goNext}>Next →</button>
        )}
      </div>
    </div>
  );
};

export default CookMode;
