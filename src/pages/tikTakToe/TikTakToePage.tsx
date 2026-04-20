import { useState } from 'react';
import TikTakToe from './TikTakToe';

function TikTakToeDemo() {
  const [sizeInput, setSizeInput] = useState(3);
  const [winCountInput, setWinCountInput] = useState(3);

  const [gameConfig, setGameConfig] = useState({ size: 3, winCount: 3, runId: 0 });

  const handleStart = () => {
    const nextSize = Math.max(2, Math.floor(sizeInput));
    const nextWinCount = Math.min(nextSize, Math.max(2, Math.floor(winCountInput)));

    setGameConfig((prev) => ({
      size: nextSize,
      winCount: nextWinCount,
      runId: prev.runId + 1,
    }));
  };

  return (
    <section>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a configurable Tic-Tac-Toe game. Implement winner detection for an NxN board in any
        direction, draw detection, and use the key prop to force a full component reset when the
        game config changes.
      </p>
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        <label>
          Size:
          <input
            type="number"
            min={2}
            value={sizeInput}
            onChange={(event) => setSizeInput(Number(event.currentTarget.value))}
            style={{ marginLeft: '0.4rem', width: '5.5rem' }}
          />
        </label>

        <label>
          Win count:
          <input
            type="number"
            min={2}
            value={winCountInput}
            onChange={(event) => setWinCountInput(Number(event.currentTarget.value))}
            style={{ marginLeft: '0.4rem', width: '5.5rem' }}
          />
        </label>

        <button type="button" onClick={handleStart}>
          Start game
        </button>
      </div>

      <TikTakToe
        key={`${gameConfig.size}-${gameConfig.winCount}-${gameConfig.runId}`}
        size={gameConfig.size}
        winCount={gameConfig.winCount}
      />
    </section>
  );
}

export default TikTakToeDemo;
