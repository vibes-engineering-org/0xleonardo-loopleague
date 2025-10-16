'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { useGame } from '~/hooks/use-game';
import { GameNode, NodeColor } from '~/types/game';
import { GAME_THEMES } from '~/lib/game-logic';

interface GameScreenProps {
  seed: string;
  onGameEnd: (score: number) => void;
  theme?: string;
}

function Node({
  node,
  isInPath,
  isLastInPath,
  onClick,
  theme = 'neon'
}: {
  node: GameNode;
  isInPath: boolean;
  isLastInPath: boolean;
  onClick: () => void;
  theme?: string;
}) {
  const themeColors = GAME_THEMES[theme as keyof typeof GAME_THEMES]?.colors || GAME_THEMES.neon.colors;
  const color = themeColors[node.color];

  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-full border-2 transition-all duration-200 relative
        ${isInPath
          ? 'border-white scale-110 shadow-lg shadow-white/50'
          : 'border-gray-400 hover:border-white hover:scale-105'
        }
        ${isLastInPath ? 'animate-pulse' : ''}
      `}
      style={{
        backgroundColor: color,
        boxShadow: isInPath ? `0 0 20px ${color}` : `0 0 10px ${color}40`
      }}
    >
      {isInPath && (
        <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
      )}
    </button>
  );
}

export function GameScreen({ seed, onGameEnd, theme = 'neon' }: GameScreenProps) {
  const { gameState, startGame, addNodeToPath, clearPath, resetGame } = useGame(seed);

  useEffect(() => {
    if (gameState.gameStatus === 'finished') {
      onGameEnd(gameState.score);
    }
  }, [gameState.gameStatus, gameState.score, onGameEnd]);

  const renderGrid = () => {
    const gridSize = Math.sqrt(gameState.nodes.length);
    return (
      <div
        className="grid gap-2 p-4 rounded-xl bg-black/20 backdrop-blur-sm"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {gameState.nodes.map((node) => {
          const isInPath = gameState.currentPath.includes(node.id);
          const isLastInPath = gameState.currentPath[gameState.currentPath.length - 1] === node.id;

          return (
            <Node
              key={node.id}
              node={node}
              isInPath={isInPath}
              isLastInPath={isLastInPath}
              onClick={() => addNodeToPath(node.id)}
              theme={theme}
            />
          );
        })}
      </div>
    );
  };

  const themeConfig = GAME_THEMES[theme as keyof typeof GAME_THEMES] || GAME_THEMES.neon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} flex flex-col items-center justify-center p-4`}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Loop League</h1>
          {gameState.gameStatus === 'waiting' && (
            <p className="text-white/80">Connect same-colored nodes to form loops!</p>
          )}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{gameState.score}</div>
            <div className="text-xs text-white/60">SCORE</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{ color: themeConfig.accent }}>
              {gameState.timeLeft}s
            </div>
            <div className="text-xs text-white/60">TIME</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{gameState.combo}x</div>
            <div className="text-xs text-white/60">COMBO</div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress
          value={(60 - gameState.timeLeft) / 60 * 100}
          className="h-2"
        />

        {/* Game Grid */}
        {gameState.gameStatus !== 'waiting' && (
          <div className="flex justify-center">
            {renderGrid()}
          </div>
        )}

        {/* Current Path */}
        {gameState.currentPath.length > 0 && (
          <div className="text-center space-y-2">
            <div className="text-white/80 text-sm">Current Path: {gameState.currentPath.length} nodes</div>
            <Button
              onClick={clearPath}
              variant="outline"
              size="sm"
              className="text-white border-white/30"
            >
              Clear Path
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          {gameState.gameStatus === 'waiting' && (
            <Button
              onClick={startGame}
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold px-8"
            >
              Start Game!
            </Button>
          )}

          {gameState.gameStatus === 'finished' && (
            <div className="space-y-4 text-center">
              <div className="text-white">
                <div className="text-2xl font-bold">Game Over!</div>
                <div className="text-lg">Final Score: {gameState.score}</div>
              </div>
              <Button
                onClick={resetGame}
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold px-8"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {gameState.gameStatus === 'waiting' && (
          <div className="text-center text-white/60 text-sm max-w-xs mx-auto">
            Tap nodes of the same color to create a path. Close the loop to score points and trigger combos!
          </div>
        )}
      </div>
    </div>
  );
}