import { useState, useEffect, useRef, useCallback } from 'react';
import { playSynthNote, playPowerUpSound, playGameOverSound } from '../../utils/audio';

interface SnakeGameProps {
  onExit: () => void;
}

interface Point {
  x: number;
  y: number;
}

const WIDTH = 24;
const HEIGHT = 12;
const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 5 },
  { x: 7, y: 5 },
  { x: 6, y: 5 },
];
const INITIAL_DIR: Point = { x: 1, y: 0 };

export function SnakeGame({ onExit }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIR);
  const [food, setFood] = useState<Point & { isBonus?: boolean }>({ x: 15, y: 5, isBonus: false });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(sessionStorage.getItem('suveer_snake_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [speed] = useState(115);

  const dirRef = useRef(direction);
  const nextDirRef = useRef(direction);

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  // Spawn food at random empty spot
  const spawnFood = useCallback((currentSnake: Point[]) => {
    let x: number;
    let y: number;
    let collision: boolean;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * WIDTH);
      y = Math.floor(Math.random() * HEIGHT);
      collision = currentSnake.some((seg) => seg.x === x && seg.y === y);
      attempts++;
    } while (collision && attempts < 100);

    const isBonus = Math.random() < 0.25;
    return { x, y, isBonus };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    nextDirRef.current = INITIAL_DIR;
    setFood({ x: 15, y: 5, isBonus: false });
    setScore(0);
    setGameOver(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const current = dirRef.current;

      // Always block default scroll/navigation actions for snake controls
      const isSnakeKey = [
        'arrowup',
        'arrowdown',
        'arrowleft',
        'arrowright',
        'w',
        'a',
        's',
        'd',
        ' ',
        'q',
        'r',
        'enter',
        'escape',
      ].includes(key);

      if (isSnakeKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      if (key === 'escape' || key === 'q') {
        onExit();
        return;
      }

      if (gameOver) {
        if (key === 'r' || key === 'enter') {
          resetGame();
        }
        return;
      }

      if ((key === 'arrowup' || key === 'w') && current.y !== 1) {
        nextDirRef.current = { x: 0, y: -1 };
      } else if ((key === 'arrowdown' || key === 's') && current.y !== -1) {
        nextDirRef.current = { x: 0, y: 1 };
      } else if ((key === 'arrowleft' || key === 'a') && current.x !== 1) {
        nextDirRef.current = { x: -1, y: 0 };
      } else if ((key === 'arrowright' || key === 'd') && current.x !== -1) {
        nextDirRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [gameOver, onExit]);

  // Main game tick
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const curDir = nextDirRef.current;
        setDirection(curDir);

        const head = prev[0];
        const newHead: Point = {
          x: head.x + curDir.x,
          y: head.y + curDir.y,
        };

        // Wall collisions
        if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
          setGameOver(true);
          playGameOverSound();
          return prev;
        }

        // Self collisions
        if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          playGameOverSound();
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const pointsGained = food.isBonus ? 25 : 10;
          setScore((s) => {
            const nextScore = s + pointsGained;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              try {
                sessionStorage.setItem('suveer_snake_hi', nextScore.toString());
              } catch {
                // Ignore storage issues
              }
            }
            return nextScore;
          });

          if (food.isBonus) {
            playPowerUpSound();
          } else {
            playSynthNote(587.33, 'square', 0.08);
          }

          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, food, highScore, speed, spawnFood]);

  // Build grid representation
  const renderGrid = () => {
    const grid: string[][] = Array.from({ length: HEIGHT }, () =>
      Array.from({ length: WIDTH }, () => ' ')
    );

    // Render food
    if (food.y >= 0 && food.y < HEIGHT && food.x >= 0 && food.x < WIDTH) {
      grid[food.y][food.x] = food.isBonus ? '☕' : '★';
    }

    // Render snake
    snake.forEach((seg, idx) => {
      if (seg.y >= 0 && seg.y < HEIGHT && seg.x >= 0 && seg.x < WIDTH) {
        grid[seg.y][seg.x] = idx === 0 ? '●' : '■';
      }
    });

    return grid;
  };

  const grid = renderGrid();

  return (
    <div className="my-2 p-3 bg-ink/90 border border-line-strong rounded-lg font-mono text-xs select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-line text-[11px]">
        <div className="flex items-center gap-3">
          <span className="text-accent font-bold">TERMINAL SNAKE v1.0</span>
          <span>
            SCORE: <strong className="text-text">{score}</strong>
          </span>
          <span className="text-text-muted">
            BEST: <strong className="text-amber-400">{highScore}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-dim hidden sm:inline">[W/A/S/D or ARROWS]</span>
          <button
            onClick={onExit}
            className="px-2 py-0.5 text-[10px] bg-surface hover:bg-surface-elevated text-text-muted hover:text-text rounded border border-line transition-colors"
          >
            Quit [Q]
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="flex justify-center my-1">
        <div className="inline-block bg-black/60 p-2 rounded border border-line/60">
          <div className="text-text-dim text-[11px] leading-none">
            +{'-'.repeat(WIDTH * 2)}+
          </div>
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="leading-none text-[12px] tracking-widest whitespace-pre">
              <span className="text-text-dim">|</span>
              {row.map((cell, cIdx) => {
                let cellClass = 'text-text-muted';
                if (cell === '●') cellClass = 'text-accent font-bold';
                else if (cell === '■') cellClass = 'text-emerald-400';
                else if (cell === '★') cellClass = 'text-amber-300 animate-pulse';
                else if (cell === '☕') cellClass = 'text-rose-400';

                return (
                  <span key={cIdx} className={cellClass}>
                    {cell === ' ' ? '  ' : cell + ' '}
                  </span>
                );
              })}
              <span className="text-text-dim">|</span>
            </div>
          ))}
          <div className="text-text-dim text-[11px] leading-none">
            +{'-'.repeat(WIDTH * 2)}+
          </div>
        </div>
      </div>

      {/* Game over / Controls overlay */}
      {gameOver ? (
        <div className="mt-2 p-2 bg-rose-950/40 border border-rose-500/40 rounded text-center">
          <p className="text-rose-400 font-bold">GAME OVER // COLLISION DETECTED</p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Final Score: <span className="text-text font-semibold">{score}</span>
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={resetGame}
              className="px-3 py-1 bg-accent/20 hover:bg-accent/30 text-accent font-semibold rounded border border-accent/40 text-xs transition-colors"
            >
              Play Again [R]
            </button>
            <button
              onClick={onExit}
              className="px-3 py-1 bg-surface hover:bg-surface-elevated text-text-muted hover:text-text rounded border border-line text-xs transition-colors"
            >
              Exit Terminal [Q]
            </button>
          </div>
        </div>
      ) : (
        /* Mobile / Trackpad D-Pad Controls */
        <div className="mt-2 pt-2 border-t border-line/40 flex flex-col items-center gap-1 sm:hidden">
          <button
            onClick={() => {
              if (dirRef.current.y !== 1) nextDirRef.current = { x: 0, y: -1 };
            }}
            className="w-10 h-7 bg-surface border border-line rounded flex items-center justify-center text-text active:bg-accent/30"
          >
            ▲
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (dirRef.current.x !== 1) nextDirRef.current = { x: -1, y: 0 };
              }}
              className="w-10 h-7 bg-surface border border-line rounded flex items-center justify-center text-text active:bg-accent/30"
            >
              ◀
            </button>
            <button
              onClick={() => {
                if (dirRef.current.y !== -1) nextDirRef.current = { x: 0, y: 1 };
              }}
              className="w-10 h-7 bg-surface border border-line rounded flex items-center justify-center text-text active:bg-accent/30"
            >
              ▼
            </button>
            <button
              onClick={() => {
                if (dirRef.current.x !== -1) nextDirRef.current = { x: 1, y: 0 };
              }}
              className="w-10 h-7 bg-surface border border-line rounded flex items-center justify-center text-text active:bg-accent/30"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
