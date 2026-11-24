import React, { useState, useEffect, useRef } from 'react';

export function SpotlightBackground() {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef(null);

  // Mouse move listener for smooth spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Click listener for particle / ripple effect
  useEffect(() => {
    const handleClick = (e) => {
      // Don't spawn ripples on inputs or textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 20 + 30
      };

      setRipples((prev) => [...prev.slice(-8), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Interactive Cursor-Following Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(750px circle at ${coords.x}px ${coords.y}px, rgba(212, 160, 23, 0.085), transparent 80%)`,
        }}
      />

      {/* 2. Floating Ambient Glow Orbs */}
      {/* Top Left Gold Orb */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/10 blur-[120px] animate-float-slow" />
      
      {/* Bottom Right Amber Orb */}
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-amber-600/10 blur-[140px] animate-float-reverse" />

      {/* Center Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-gold-400/5 blur-[160px] animate-pulse-gold" />

      {/* 3. Click Ripples / Sparks */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-active"
          style={{
            left: `${ripple.x - ripple.size / 2}px`,
            top: `${ripple.y - ripple.size / 2}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            background: 'radial-gradient(circle, rgba(212, 160, 23, 0.5) 0%, rgba(212, 160, 23, 0) 70%)',
          }}
        />
      ))}
    </div>
  );
}
