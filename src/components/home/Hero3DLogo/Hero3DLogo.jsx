import React, { useState, useRef, useCallback } from 'react';
import logoImg from '../../../assets/logo.png';
import styles from './Hero3DLogo.module.css';

export default function Hero3DLogo() {
  const stageRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotateX = 16;
    const maxRotateY = 18;

    const rotateX = -((y - centerY) / centerY) * maxRotateX;
    const rotateY = ((x - centerX) / centerX) * maxRotateY;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`
    );
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('');
  };

  return (
    <div
      className={styles.stageWrapper}
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Slidevance 3D Brand Logo"
    >
      {/* 3D Floating Logo Container - Pure Logo with Zero Background */}
      <div
        className={`${styles.logoContainer3D} ${!isHovered ? styles.floating : ''}`}
        style={transformStyle ? { transform: transformStyle } : undefined}
      >
        {/* Soft Ambient Chroma Glow directly behind the translucent glass letters */}
        <div className={styles.ambientGlow} />

        {/* 3D Logo Image with Depth & Specular Filter */}
        <img
          src={logoImg}
          alt="Slidevance - Ideas That Slide. Solutions That Advance."
          className={styles.logoImage}
          draggable={false}
        />

        {/* Dynamic 3D Grounding Shadow */}
        <div className={styles.groundShadow} />
      </div>
    </div>
  );
}
