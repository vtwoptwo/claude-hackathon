import { useState, useEffect, useRef } from 'react';

export function BeerRow({ score, size = 'large', showLabel = false, playerName = '' }) {
  const beerCount = Math.ceil(score / 10);
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (score < prevScoreRef.current) {
      // A beer was consumed - animate the one being removed
      const removedIndex = Math.ceil(score / 10);
      setAnimatingIndex(removedIndex);

      const timer = setTimeout(() => {
        setAnimatingIndex(null);
      }, 400);

      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score;
  }, [score]);

  const beers = [];
  for (let i = 0; i < 10; i++) {
    const isVisible = i < beerCount;
    const isAnimating = i === animatingIndex;

    beers.push(
      <div
        key={i}
        className={`beer ${size} ${isVisible ? 'visible' : 'empty'} ${isAnimating ? 'drinking' : ''}`}
      >
        <span className="beer-icon">🍺</span>
      </div>
    );
  }

  return (
    <div className="beer-row-container">
      {showLabel && playerName && (
        <div className="beer-row-label">{playerName}</div>
      )}
      <div className={`beer-row ${size}`}>
        {beers}
      </div>
    </div>
  );
}
