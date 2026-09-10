import React from 'react';
import styles from './SectionHeading.module.css';

function renderTitle(title, singleLine = false) {
  if (!title) return null;
  if (typeof title !== 'string') return title;

  const trimmed = title.trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= 1) {
    return <span className="gradient-text">{trimmed}</span>;
  }

  if (singleLine) {
    const part1 = words.slice(0, -1).join(' ');
    const part2 = words[words.length - 1];
    return (
      <span className={styles.singleLineHeading}>
        {part1} <span className="gradient-text">{part2}</span>
      </span>
    );
  }

  let splitIndex = Math.ceil(words.length / 2);
  const lowerWords = words.map((w) => w.toLowerCase());

  if (words.length === 2) {
    splitIndex = 1;
  } else if (words.length === 3) {
    splitIndex = 2;
  } else if (words.length === 4) {
    const toIdx = lowerWords.indexOf('to');
    if (toIdx > 0) {
      splitIndex = toIdx;
    } else {
      const forIdx = lowerWords.indexOf('for');
      if (forIdx === 1) {
        splitIndex = 2;
      } else {
        splitIndex = 3;
      }
    }
  } else {
    const ampIdx = words.findIndex((w) => w === '&' || w === '&amp;');
    if (ampIdx > 0 && ampIdx < words.length - 1) {
      splitIndex = ampIdx;
    } else {
      const byIdx = lowerWords.indexOf('by');
      if (byIdx > 0 && byIdx < words.length - 1) {
        splitIndex = byIdx;
      } else {
        const aroundIdx = lowerWords.indexOf('around');
        if (aroundIdx === 1) {
          splitIndex = 2;
        } else {
          const forIdx = lowerWords.indexOf('for');
          if (forIdx > 0 && forIdx < words.length - 1) {
            splitIndex = forIdx;
          } else {
            const toIdx = lowerWords.indexOf('to');
            if (toIdx > 0 && toIdx < words.length - 1) {
              splitIndex = toIdx;
            }
          }
        }
      }
    }
  }

  const part1 = words.slice(0, splitIndex).join(' ');
  const part2 = words.slice(splitIndex).join(' ');

  return (
    <>
      {part1}
      <br />
      <span className="gradient-text">{part2}</span>
    </>
  );
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  dark = false,
  className = '',
  maxWidth = '780px',
  singleLine = false
}) {
  const containerClasses = [
    styles.container,
    styles[align],
    dark ? styles.dark : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={{ '--max-w': maxWidth }}>
      {title && (
        <h2 className={styles.title}>
          {renderTitle(title, singleLine)}
        </h2>
      )}
      {subtitle && (
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
