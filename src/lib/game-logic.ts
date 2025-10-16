import { GameNode, NodeColor, GameState } from '~/types/game';

const GRID_SIZE = 6;
const COLORS: NodeColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export function generateGameGrid(seed: string): GameNode[] {
  // Simple seeded random number generator
  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) {
    seedNum += seed.charCodeAt(i);
  }

  const nodes: GameNode[] = [];
  let random = seedNum;

  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const colorIndex = Math.floor(seededRandom() * COLORS.length);
      nodes.push({
        id: `${x}-${y}`,
        x,
        y,
        color: COLORS[colorIndex],
        connected: false,
        connections: []
      });
    }
  }

  return nodes;
}

export function getNeighbors(nodeId: string, gridSize: number = GRID_SIZE): string[] {
  const [x, y] = nodeId.split('-').map(Number);
  const neighbors: string[] = [];

  // Check all 4 directions
  if (x > 0) neighbors.push(`${x - 1}-${y}`);
  if (x < gridSize - 1) neighbors.push(`${x + 1}-${y}`);
  if (y > 0) neighbors.push(`${x}-${y - 1}`);
  if (y < gridSize - 1) neighbors.push(`${x}-${y + 1}`);

  return neighbors;
}

export function isValidConnection(nodeA: GameNode, nodeB: GameNode): boolean {
  // Nodes must be adjacent and same color
  const neighbors = getNeighbors(nodeA.id);
  return neighbors.includes(nodeB.id) && nodeA.color === nodeB.color;
}

export function findLoops(path: string[], nodes: GameNode[]): string[][] {
  if (path.length < 3) return [];

  const loops: string[][] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  // Check if the last node connects back to any previous node in the path
  for (let i = 0; i < path.length - 2; i++) {
    const startNode = nodeMap.get(path[i]);
    const endNode = nodeMap.get(path[path.length - 1]);

    if (startNode && endNode && isValidConnection(startNode, endNode)) {
      const loop = path.slice(i);
      loops.push(loop);
    }
  }

  return loops;
}

export function calculateScore(loop: string[], combo: number = 1): number {
  const baseScore = loop.length * 10;
  const comboMultiplier = 1 + (combo - 1) * 0.5;
  return Math.floor(baseScore * comboMultiplier);
}

export function removeLoopNodes(nodes: GameNode[], loop: string[]): GameNode[] {
  return nodes.map(node => ({
    ...node,
    connected: loop.includes(node.id) ? false : node.connected,
    connections: node.connections.filter(conn => !loop.includes(conn))
  })).filter(node => !loop.includes(node.id));
}

export function dropNodes(nodes: GameNode[]): GameNode[] {
  const gridSize = Math.sqrt(nodes.length);
  const result = [...nodes];

  // Drop nodes down in each column
  for (let x = 0; x < gridSize; x++) {
    const columnNodes = result.filter(node => node.x === x).sort((a, b) => a.y - b.y);
    const gaps = [];

    // Find gaps in the column
    for (let y = 0; y < gridSize; y++) {
      const nodeAtY = columnNodes.find(node => node.y === y);
      if (!nodeAtY) {
        gaps.push(y);
      }
    }

    // Move nodes down to fill gaps
    gaps.forEach(gapY => {
      const nodeToMove = columnNodes.find(node => node.y > gapY);
      if (nodeToMove) {
        nodeToMove.y = gapY;
        nodeToMove.id = `${nodeToMove.x}-${gapY}`;
      }
    });
  }

  return result;
}

export function generateNewNodes(nodes: GameNode[], seed: string, offset: number): GameNode[] {
  const gridSize = Math.sqrt(nodes.length);
  const missingNodes: GameNode[] = [];

  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) {
    seedNum += seed.charCodeAt(i);
  }
  seedNum += offset;

  let random = seedNum;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  // Find missing positions and create new nodes
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const existingNode = nodes.find(node => node.x === x && node.y === y);
      if (!existingNode) {
        const colorIndex = Math.floor(seededRandom() * COLORS.length);
        missingNodes.push({
          id: `${x}-${y}`,
          x,
          y,
          color: COLORS[colorIndex],
          connected: false,
          connections: []
        });
      }
    }
  }

  return [...nodes, ...missingNodes];
}

export const GAME_THEMES = {
  neon: {
    id: 'neon',
    name: 'Neon Dreams',
    colors: {
      red: '#FF3366',
      blue: '#3366FF',
      green: '#33FF66',
      yellow: '#FFFF33',
      purple: '#9933FF'
    },
    background: 'from-purple-900 via-blue-900 to-indigo-900',
    accent: '#00FFFF'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Punk',
    colors: {
      red: '#FF0080',
      blue: '#0080FF',
      green: '#80FF00',
      yellow: '#FFFF00',
      purple: '#FF00FF'
    },
    background: 'from-gray-900 via-purple-900 to-violet-900',
    accent: '#00FF41',
    price: 50
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel Dreams',
    colors: {
      red: '#FFB3BA',
      blue: '#BAE1FF',
      green: '#BAFFC9',
      yellow: '#FFFFBA',
      purple: '#E1BAFF'
    },
    background: 'from-pink-200 via-purple-200 to-indigo-200',
    accent: '#FF69B4',
    price: 30
  }
};