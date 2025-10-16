'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameNode } from '~/types/game';
import {
  generateGameGrid,
  findLoops,
  calculateScore,
  removeLoopNodes,
  dropNodes,
  generateNewNodes,
  isValidConnection
} from '~/lib/game-logic';

const GAME_DURATION = 60; // 60 seconds

export function useGame(seed: string) {
  const [gameState, setGameState] = useState<GameState>({
    nodes: [],
    score: 0,
    timeLeft: GAME_DURATION,
    gameStatus: 'waiting',
    currentPath: [],
    validLoops: [],
    combo: 1,
    seed
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGame = useCallback(() => {
    const nodes = generateGameGrid(seed);
    setGameState(prev => ({
      ...prev,
      nodes,
      score: 0,
      timeLeft: GAME_DURATION,
      gameStatus: 'waiting',
      currentPath: [],
      validLoops: [],
      combo: 1
    }));
  }, [seed]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      setGameState(prev => ({ ...prev, timeLeft: remaining }));

      if (remaining > 0) {
        timerRef.current = setTimeout(tick, 100);
      } else {
        setGameState(prev => ({ ...prev, gameStatus: 'finished' }));
      }
    };

    timerRef.current = setTimeout(tick, 100);
  }, []);

  const addNodeToPath = useCallback((nodeId: string) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const node = prev.nodes.find(n => n.id === nodeId);
      if (!node) return prev;

      // If clicking the same node, do nothing
      if (prev.currentPath[prev.currentPath.length - 1] === nodeId) {
        return prev;
      }

      // If clicking a node already in path (not the last), try to create a loop
      if (prev.currentPath.includes(nodeId)) {
        const nodeIndex = prev.currentPath.indexOf(nodeId);
        const loop = prev.currentPath.slice(nodeIndex);

        if (loop.length >= 3) {
          // Valid loop found!
          const loopScore = calculateScore(loop, prev.combo);
          const newNodes = removeLoopNodes(prev.nodes, loop);
          const droppedNodes = dropNodes(newNodes);
          const filledNodes = generateNewNodes(droppedNodes, prev.seed, prev.score);

          return {
            ...prev,
            nodes: filledNodes,
            score: prev.score + loopScore,
            currentPath: [],
            combo: prev.combo + 1,
            validLoops: [...prev.validLoops, loop]
          };
        }
        return prev;
      }

      // Check if we can add this node to the current path
      if (prev.currentPath.length === 0) {
        // First node - always valid
        return {
          ...prev,
          currentPath: [nodeId],
          combo: 1
        };
      }

      // Check if the new node connects to the last node in path
      const lastNodeId = prev.currentPath[prev.currentPath.length - 1];
      const lastNode = prev.nodes.find(n => n.id === lastNodeId);

      if (lastNode && isValidConnection(lastNode, node)) {
        return {
          ...prev,
          currentPath: [...prev.currentPath, nodeId]
        };
      }

      // If not connected, start a new path with this node
      return {
        ...prev,
        currentPath: [nodeId],
        combo: 1
      };
    });
  }, []);

  const clearPath = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPath: [],
      combo: 1
    }));
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    initializeGame();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [initializeGame]);

  return {
    gameState,
    startGame,
    addNodeToPath,
    clearPath,
    resetGame,
    initializeGame
  };
}