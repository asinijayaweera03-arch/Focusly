import React, { useEffect, useState } from 'react';

const LevelUpToast = ({ level, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (level) {
      setVisible(true);

      // Generate confetti particles
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#ff7a00'];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${40 + Math.random() * 20}%`, // center start
        top: '30px',
        tx: `${(Math.random() - 0.5) * 300}px`,
        ty: `${50 + Math.random() * 200}px`,
        rot: `${Math.random() * 360}deg`,
        scale: Math.random() * 0.7 + 0.4,
        delay: `${Math.random() * 0.2}s`,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [level, onClose]);

  if (!visible) return null;

  return (
    <div className="level-up-toast-overlay">
      <div className="level-up-toast-card glassmorphic slide-in-toast">
        <div className="toast-glow"></div>
        <div className="toast-content">
          <span className="toast-emoji">🎉</span>
          <div className="toast-text-group">
            <h4 className="toast-title">LEVEL UP!</h4>
            <p className="toast-subtitle">You reached <strong>Level {level}</strong>!</p>
          </div>
        </div>
        <button className="toast-close-btn" onClick={() => { setVisible(false); if (onClose) onClose(); }}>
          ✕
        </button>
      </div>

      {/* Confetti container */}
      <div className="confetti-container">
        {particles.map(p => (
          <div 
            key={p.id}
            className="confetti-particle"
            style={{
              backgroundColor: p.color,
              left: p.left,
              top: p.top,
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': p.rot,
              transform: `scale(${p.scale})`,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelUpToast;
