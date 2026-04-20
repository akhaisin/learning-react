import { useMemo, useState } from 'react';
import styles from './TikTakToe.module.css';

type Player = 'X' | 'O';
type CellValue = Player | null;

type WinnerResult = {
  player: Player;
  line: number[];
};

type TikTakToeProps = {
  size: number;
  winCount: number;
};

function calculateWinner(board: CellValue[], size: number, winCount: number): WinnerResult | null {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ] as const;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const start = board[row * size + col];
      if (!start) continue;

      for (const [dr, dc] of directions) {
        let ok = true;
        const line = [row * size + col];

        for (let step = 1; step < winCount; step += 1) {
          const nextRow = row + dr * step;
          const nextCol = col + dc * step;

          if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
            ok = false;
            break;
          }

          if (board[nextRow * size + nextCol] !== start) {
            ok = false;
            break;
          }

          line.push(nextRow * size + nextCol);
        }

        if (ok) {
          return {
            player: start,
            line,
          };
        }
      }
    }
  }

  return null;
}

function TikTakToe({ size, winCount }: TikTakToeProps) {
  const normalizedSize = Math.max(2, Math.floor(size));
  const normalizedWinCount = Math.min(normalizedSize, Math.max(2, Math.floor(winCount)));

  const [board, setBoard] = useState<CellValue[]>(() => Array.from({ length: normalizedSize ** 2 }, () => null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  const winnerResult = useMemo(
    () => calculateWinner(board, normalizedSize, normalizedWinCount),
    [board, normalizedSize, normalizedWinCount],
  );

  const winner = winnerResult?.player ?? null;
  const winningCells = winnerResult?.line ?? [];
  const winningCellSet = new Set(winningCells);

  const isDraw = !winner && board.every((cell) => cell !== null);
  const isGameOver = Boolean(winner) || isDraw;

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
      ? 'Draw'
      : `Current player: ${currentPlayer}`;

  const handleCellClick = (index: number) => {
    if (board[index] || isGameOver) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });

    setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
  };

  const handleReset = () => {
    setBoard(Array.from({ length: normalizedSize ** 2 }, () => null));
    setCurrentPlayer('X');
  };

  return (
    <section className={styles.container}>
      <p className={styles.status}>Size: {normalizedSize}x{normalizedSize} | Win line: {normalizedWinCount}</p>
      <p className={styles.status}>{status}</p>

      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${normalizedSize}, minmax(0, 1fr))` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.cell} ${winningCellSet.has(index) ? styles.cellWinning : ''}`}
            onClick={() => handleCellClick(index)}
            disabled={Boolean(cell) || isGameOver}
          >
            {cell}
          </button>
        ))}
      </div>

      <button type="button" className={styles.resetButton} onClick={handleReset}>
        Reset game
      </button>
    </section>
  );
}

export default TikTakToe;
