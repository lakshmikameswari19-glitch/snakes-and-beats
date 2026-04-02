import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 100;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
      case 'ArrowDown': case 's': case 'S': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
      case 'ArrowLeft': case 'a': case 'A': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
      case 'ArrowRight': case 'd': case 'D': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      case ' ': setIsPaused(prev => !prev); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div 
        className="relative bg-black jarring-border w-full aspect-square max-w-[400px]"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[1px] border-cyan/30" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => {
          const isHead = i === 0;
          return (
            <div
              key={`${i}-${segment.x}-${segment.y}`}
              className={`${isHead ? 'bg-white' : (i % 2 === 0 ? 'bg-cyan' : 'bg-cyan/80')} border border-black`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-magenta border-2 border-white screen-tear"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 jarring-border-alt">
            <h2 className="text-2xl md:text-3xl font-pixel text-magenta mb-4 glitch-text text-center" data-text="KERNEL_PANIC">KERNEL_PANIC</h2>
            <p className="text-xl text-cyan mb-6">DUMP: {score} BYTES</p>
            <button
              onClick={resetGame}
              className="px-6 py-4 bg-cyan text-black font-pixel hover:bg-magenta hover:text-white transition-none"
            >
              REBOOT
            </button>
          </div>
        )}

        {/* Start/Pause Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-4 border-4 border-cyan text-cyan font-pixel hover:bg-cyan hover:text-black transition-none glitch-text"
              data-text="EXECUTE"
            >
              EXECUTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
