// Circuit board trace paths - data-driven approach
export const circuitTraces = [
  // Horizontal traces
  { points: [[-8, 3, 0], [-2, 3, 0], [2, 3, 0], [8, 3, 0]], speed: 0.5, delay: 0 },
  { points: [[-8, 1, 0], [-3, 1, 0], [0, 1, 0], [4, 1, 0], [8, 1, 0]], speed: 0.6, delay: 0.3 },
  { points: [[-8, -1, 0], [-1, -1, 0], [3, -1, 0], [8, -1, 0]], speed: 0.55, delay: 0.6 },
  { points: [[-8, -3, 0], [-4, -3, 0], [1, -3, 0], [8, -3, 0]], speed: 0.5, delay: 0.9 },
  
  // Vertical traces
  { points: [[-5, -4, 0], [-5, -1, 0], [-5, 2, 0], [-5, 4, 0]], speed: 0.6, delay: 0.2 },
  { points: [[-2, -4, 0], [-2, 0, 0], [-2, 4, 0]], speed: 0.55, delay: 0.5 },
  { points: [[2, -4, 0], [2, -1, 0], [2, 2, 0], [2, 4, 0]], speed: 0.6, delay: 0.8 },
  { points: [[5, -4, 0], [5, 1, 0], [5, 4, 0]], speed: 0.5, delay: 1.1 },
  
  // Diagonal/complex paths
  { points: [[-6, 2, 0], [-3, 0, 0], [0, -2, 0], [3, 0, 0], [6, 2, 0]], speed: 0.4, delay: 0.4 },
  { points: [[-4, -2, 0], [0, 0, 0], [4, 2, 0]], speed: 0.5, delay: 0.7 },
  { points: [[6, -2, 0], [3, -1, 0], [0, 0, 0], [-3, -1, 0], [-6, -2, 0]], speed: 0.45, delay: 1.0 },
];
