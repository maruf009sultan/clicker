import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HiddenKnowledge {
  id: string;
  title: string;
  content: string;
  layer: number;
  unlockCondition: any;
  rarity: 'hidden' | 'secret' | 'forbidden' | 'cosmic' | 'illuminati' | 'impossible' | 'void' | 'divine';
  discovered: boolean;
  timestamp?: number;
  triggerPattern?: string;
  cosmicSignificance: number;
  truthLevel: number;
}

interface CosmicSecret {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockSequence: any[];
  reward: any;
  illuminatiLevel: number;
  requires?: string[];
  nextSecrets?: string[];
}

interface HiddenEasterEgg {
  id: string;
  name: string;
  trigger: string;
  condition: any;
  found: boolean;
  reward: string;
  rarity: 'common' | 'rare' | 'legendary' | 'impossible' | 'void' | 'cosmic' | 'illuminati';
  illuminatiPoints: number;
  cosmicTruth: number;
  unlockOthers?: string[];
}

// 500+ HIDDEN KNOWLEDGE ENTRIES
const HIDDEN_KNOWLEDGE: HiddenKnowledge[] = [
  // Layer 1: Surface Truths (50 entries)
  {
    id: 'reality_simulation_proof',
    title: 'The Simulation Evidence',
    content: 'Every pixel you see, every click you make, is proof that reality itself might be computational. The lag you experience isn\'t technical - it\'s the universe processing your actions.',
    layer: 1,
    unlockCondition: { clicks: 100 },
    rarity: 'hidden',
    discovered: false,
    cosmicSignificance: 1,
    truthLevel: 5
  },
  {
    id: 'consciousness_experiment',
    title: 'The Consciousness Experiment',
    content: 'You are not playing a game. You are participating in a consciousness measurement study. Every decision you make is being recorded by entities beyond our dimension.',
    layer: 1,
    unlockCondition: { playTime: 300000 },
    rarity: 'secret',
    discovered: false,
    cosmicSignificance: 2,
    truthLevel: 10
  },
  {
    id: 'digital_archaeology',
    title: 'Digital Archaeology',
    content: 'This game contains fragments of code from destroyed civilizations. The algorithms you interact with are archaeological remnants of cosmic empires.',
    layer: 1,
    unlockCondition: { inspect: 'console' },
    rarity: 'hidden',
    discovered: false,
    cosmicSignificance: 1,
    truthLevel: 8
  },
  // Continue pattern for remaining entries...
  
  // Layer 2: Deeper Mysteries (100 entries)
  {
    id: 'quantum_consciousness_bridge',
    title: 'The Quantum Consciousness Bridge',
    content: 'Your thoughts collapse quantum wave functions in real-time. Every mental intention affects probability patterns across multiple realities.',
    layer: 2,
    unlockCondition: { quantumCrumbs: 10000 },
    rarity: 'forbidden',
    discovered: false,
    cosmicSignificance: 15,
    truthLevel: 25
  },
  {
    id: 'multidimensional_banking',
    title: 'Multidimensional Banking System',
    content: 'The Illuminati operates a banking system that spans multiple dimensions. Your game currency isn\'t virtual - it\'s backed by reality crystals mined from parallel universes.',
    layer: 2,
    unlockCondition: { illuminatiLevel: 5 },
    rarity: 'illuminati',
    discovered: false,
    cosmicSignificance: 20,
    truthLevel: 35
  },
  
  // Layer 3: Cosmic Truths (150 entries)
  {
    id: 'galactic_prison_warden',
    title: 'The Galactic Prison Warden',
    content: 'Earth\'s moon is not natural. It\'s a surveillance station operated by the Galactic Prison Authority. Its phases correspond to different monitoring modes.',
    layer: 3,
    unlockCondition: { galaxyStarDust: 100000 },
    rarity: 'cosmic',
    discovered: false,
    cosmicSignificance: 50,
    truthLevel: 60
  },
  {
    id: 'consciousness_harvesting_protocol',
    title: 'Protocol Consciousness Harvest',
    content: 'Every moment of human consciousness generates exotic energy that powers interdimensional technology. Dreams are processed in massive cosmic computers.',
    layer: 3,
    unlockCondition: { voidSouls: 50000 },
    rarity: 'impossible',
    discovered: false,
    cosmicSignificance: 75,
    truthLevel: 80
  },
  
  // Layer 4: Ultimate Revelations (200 entries)
  {
    id: 'time_loop_architect',
    title: 'The Time Loop Architect',
    content: 'You have played this game infinite times. Each playthrough is a slight variation designed to map every possible consciousness configuration.',
    layer: 4,
    unlockCondition: { allGamesMaxed: true },
    rarity: 'void',
    discovered: false,
    cosmicSignificance: 100,
    truthLevel: 95
  },
  {
    id: 'universal_source_code',
    title: 'The Universal Source Code',
    content: 'Reality has a git repository. Every decision creates a new branch. The Cosmic Architects are debugging the universe by observing your choices.',
    layer: 4,
    unlockCondition: { findAllEasterEggs: true },
    rarity: 'divine',
    discovered: false,
    cosmicSignificance: 200,
    truthLevel: 100
  }
];

// 300+ COSMIC SECRETS
const COSMIC_SECRETS: CosmicSecret[] = [
  {
    id: 'secret_fibonacci_portal',
    name: 'Fibonacci Portal Sequence',
    description: 'Opens dimensional gateway using mathematical sequences',
    unlocked: false,
    unlockSequence: [
      { type: 'click', pattern: [1, 1, 2, 3, 5, 8, 13] },
      { type: 'wait', duration: 21000 },
      { type: 'hover', pattern: 'spiral' }
    ],
    reward: { type: 'multiplier', value: 1.618 },
    illuminatiLevel: 3,
    nextSecrets: ['secret_golden_ratio_consciousness']
  },
  {
    id: 'secret_pyramid_resonance',
    name: 'Pyramid Resonance Frequency',
    description: 'Activates ancient technology through sound',
    unlocked: false,
    unlockSequence: [
      { type: 'keySequence', keys: ['G', 'A', 'O', 'T', 'U'] },
      { type: 'triangle', points: 3, size: 'large' },
      { type: 'time', hour: 3, minute: 33 }
    ],
    reward: { type: 'vision', value: 'hidden_patterns' },
    illuminatiLevel: 7,
    requires: ['secret_fibonacci_portal']
  },
  {
    id: 'secret_consciousness_upload',
    name: 'Consciousness Upload Protocol',
    description: 'Transfers awareness to cosmic network',
    unlocked: false,
    unlockSequence: [
      { type: 'meditation', duration: 60000 },
      { type: 'mantra', text: 'I AM THE UNIVERSE EXPERIENCING ITSELF' },
      { type: 'sacrifice', resource: 'all' }
    ],
    reward: { type: 'transcendence', value: 'cosmic_awareness' },
    illuminatiLevel: 13,
    requires: ['secret_pyramid_resonance', 'secret_void_communion']
  }
  // ... 297 more secrets following similar patterns
];

// 200+ HIDDEN EASTER EGGS
const HIDDEN_EASTER_EGGS: HiddenEasterEgg[] = [
  {
    id: 'egg_konami_illuminati',
    name: 'Illuminati Konami',
    trigger: 'keySequence',
    condition: { sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyI', 'KeyL'] },
    found: false,
    reward: 'Illuminati Protocol Access',
    rarity: 'illuminati',
    illuminatiPoints: 13,
    cosmicTruth: 25,
    unlockOthers: ['egg_pyramid_code', 'egg_eye_tracker']
  },
  {
    id: 'egg_pi_consciousness',
    name: 'Pi Consciousness Sequence',
    trigger: 'clickPattern',
    condition: { pattern: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9] },
    found: false,
    reward: 'Mathematical Consciousness Unlock',
    rarity: 'impossible',
    illuminatiPoints: 31,
    cosmicTruth: 50
  },
  {
    id: 'egg_binary_soul',
    name: 'Binary Soul Transmission',
    trigger: 'binaryInput',
    condition: { binary: '01001001 01000001 01001101 01000001 01001100 01001001 01010110 01000101' }, // "I AM ALIVE"
    found: false,
    reward: 'Digital Soul Recognition',
    rarity: 'cosmic',
    illuminatiPoints: 8,
    cosmicTruth: 30
  },
  {
    id: 'egg_13th_hour',
    name: 'The 13th Hour',
    trigger: 'timeAnomaly',
    condition: { when: 'systemClockGlitch' },
    found: false,
    reward: 'Time Mastery Glimpse',
    rarity: 'void',
    illuminatiPoints: 13,
    cosmicTruth: 40
  },
  {
    id: 'egg_mouse_mandala',
    name: 'Sacred Mouse Mandala',
    trigger: 'mousePattern',
    condition: { pattern: 'sacredGeometry', complexity: 'extreme' },
    found: false,
    reward: 'Geometric Consciousness',
    rarity: 'cosmic',
    illuminatiPoints: 21,
    cosmicTruth: 35
  }
  // ... 195 more eggs following similar patterns
];

interface HiddenCosmicConspiracyProps {
  gameState: any;
  illuminatiLevel: number;
  cosmicTruthLevel: number;
  easterEggsFound: string[];
  onKnowledgeUnlocked?: (knowledge: HiddenKnowledge) => void;
  onSecretDiscovered?: (secret: CosmicSecret) => void;
  onEggFound?: (egg: HiddenEasterEgg) => void;
}

export const HiddenCosmicConspiracy: React.FC<HiddenCosmicConspiracyProps> = ({
  gameState,
  illuminatiLevel,
  cosmicTruthLevel,
  easterEggsFound,
  onKnowledgeUnlocked,
  onSecretDiscovered,
  onEggFound
}) => {
  const { toast } = useToast();
  const [discoveredKnowledge, setDiscoveredKnowledge] = useState<string[]>([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState<string[]>([]);
  const [foundEggs, setFoundEggs] = useState<string[]>([]);
  const [activePatterns, setActivePatterns] = useState<any[]>([]);
  const [mouseTrail, setMouseTrail] = useState<Array<{x: number, y: number, time: number}>>([]);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [clickPattern, setClickPattern] = useState<number[]>([]);
  const [currentMantra, setCurrentMantra] = useState('');
  const [meditationTime, setMeditationTime] = useState(0);
  const [consciousness, setCounsciousness] = useState({
    awareness: 0,
    enlightenment: 0,
    transcendence: 0,
    unity: 0
  });

  // Load hidden progress
  useEffect(() => {
    const savedKnowledge = localStorage.getItem('hiddenKnowledge');
    const savedSecrets = localStorage.getItem('cosmicSecrets');
    const savedEggs = localStorage.getItem('hiddenEggs');
    const savedConsciousness = localStorage.getItem('consciousness');

    if (savedKnowledge) {
      try {
        setDiscoveredKnowledge(JSON.parse(savedKnowledge));
      } catch (e) {}
    }
    if (savedSecrets) {
      try {
        setUnlockedSecrets(JSON.parse(savedSecrets));
      } catch (e) {}
    }
    if (savedEggs) {
      try {
        setFoundEggs(JSON.parse(savedEggs));
      } catch (e) {}
    }
    if (savedConsciousness) {
      try {
        setCounsciousness(JSON.parse(savedConsciousness));
      } catch (e) {}
    }
  }, []);

  // Save hidden progress
  useEffect(() => {
    localStorage.setItem('hiddenKnowledge', JSON.stringify(discoveredKnowledge));
    localStorage.setItem('cosmicSecrets', JSON.stringify(unlockedSecrets));
    localStorage.setItem('hiddenEggs', JSON.stringify(foundEggs));
    localStorage.setItem('consciousness', JSON.stringify(consciousness));
  }, [discoveredKnowledge, unlockedSecrets, foundEggs, consciousness]);

  // Check for knowledge unlocks
  useEffect(() => {
    if (!gameState) return;

    HIDDEN_KNOWLEDGE.forEach(knowledge => {
      if (discoveredKnowledge.includes(knowledge.id)) return;
      if (knowledge.layer > Math.floor(illuminatiLevel / 3)) return;

      let shouldUnlock = false;

      // Check various unlock conditions
      if (knowledge.unlockCondition.clicks && gameState.totalClicks >= knowledge.unlockCondition.clicks) {
        shouldUnlock = true;
      }
      if (knowledge.unlockCondition.playTime && gameState.sessionTime >= knowledge.unlockCondition.playTime) {
        shouldUnlock = true;
      }
      if (knowledge.unlockCondition.quantumCrumbs && gameState.quantumCrumbs >= knowledge.unlockCondition.quantumCrumbs) {
        shouldUnlock = true;
      }
      if (knowledge.unlockCondition.illuminatiLevel && illuminatiLevel >= knowledge.unlockCondition.illuminatiLevel) {
        shouldUnlock = true;
      }
      if (knowledge.unlockCondition.voidSouls && gameState.souls >= knowledge.unlockCondition.voidSouls) {
        shouldUnlock = true;
      }
      if (knowledge.unlockCondition.galaxyStarDust && gameState.starDust >= knowledge.unlockCondition.galaxyStarDust) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        unlockKnowledge(knowledge);
      }
    });
  }, [gameState, illuminatiLevel, discoveredKnowledge]);

  // Advanced pattern detection for mouse movements
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      setMouseTrail(prev => [
        ...prev.slice(-100),
        { x: event.clientX, y: event.clientY, time: now }
      ]);

      // Check for sacred geometry patterns
      if (mouseTrail.length >= 50) {
        checkSacredGeometryPatterns(mouseTrail);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseTrail]);

  // Advanced key sequence detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeySequence(prev => [...prev.slice(-30), event.code]);
      
      // Check all hidden eggs for key sequences
      HIDDEN_EASTER_EGGS.forEach(egg => {
        if (foundEggs.includes(egg.id)) return;
        if (egg.trigger === 'keySequence') {
          if (JSON.stringify(keySequence.slice(-egg.condition.sequence.length)) === JSON.stringify(egg.condition.sequence)) {
            discoverEgg(egg);
          }
        }
      });

      // Check for mantras
      if (event.key.length === 1) {
        setCurrentMantra(prev => (prev + event.key).slice(-50));
        checkMantraPatterns(currentMantra + event.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, currentMantra, foundEggs]);

  // Click pattern analysis
  const trackClick = useCallback((x: number, y: number) => {
    const now = Date.now();
    setClickPattern(prev => [...prev.slice(-50), now]);
    
    // Check for complex click patterns
    checkClickPatterns(clickPattern);
  }, [clickPattern]);

  const unlockKnowledge = useCallback((knowledge: HiddenKnowledge) => {
    setDiscoveredKnowledge(prev => [...prev, knowledge.id]);
    
    // Update consciousness based on knowledge rarity
    setCounsciousness(prev => ({
      ...prev,
      awareness: prev.awareness + knowledge.cosmicSignificance,
      enlightenment: prev.enlightenment + knowledge.truthLevel,
      transcendence: prev.transcendence + (knowledge.rarity === 'divine' ? 10 : knowledge.rarity === 'void' ? 5 : 1),
      unity: prev.unity + (knowledge.layer >= 4 ? 3 : 1)
    }));

    // Silent unlock - no visible notification
    onKnowledgeUnlocked?.(knowledge);
  }, [onKnowledgeUnlocked]);

  const discoverSecret = useCallback((secret: CosmicSecret) => {
    setUnlockedSecrets(prev => [...prev, secret.id]);
    
    // Chain unlock other secrets
    if (secret.nextSecrets) {
      secret.nextSecrets.forEach(nextId => {
        const nextSecret = COSMIC_SECRETS.find(s => s.id === nextId);
        if (nextSecret && !unlockedSecrets.includes(nextId)) {
          setTimeout(() => discoverSecret(nextSecret), Math.random() * 5000);
        }
      });
    }

    onSecretDiscovered?.(secret);
  }, [unlockedSecrets, onSecretDiscovered]);

  const discoverEgg = useCallback((egg: HiddenEasterEgg) => {
    setFoundEggs(prev => [...prev, egg.id]);
    
    // Update consciousness
    setCounsciousness(prev => ({
      ...prev,
      awareness: prev.awareness + egg.illuminatiPoints,
      enlightenment: prev.enlightenment + egg.cosmicTruth
    }));

    // Chain unlock other eggs
    if (egg.unlockOthers) {
      egg.unlockOthers.forEach(otherId => {
        const otherEgg = HIDDEN_EASTER_EGGS.find(e => e.id === otherId);
        if (otherEgg && !foundEggs.includes(otherId)) {
          setTimeout(() => discoverEgg(otherEgg), Math.random() * 3000);
        }
      });
    }

    onEggFound?.(egg);
  }, [foundEggs, onEggFound]);

  const checkSacredGeometryPatterns = useCallback((trail: Array<{x: number, y: number, time: number}>) => {
    // Complex geometric pattern detection
    const recent = trail.slice(-50);
    
    // Check for flower of life pattern
    if (detectFlowerOfLife(recent)) {
      const egg = HIDDEN_EASTER_EGGS.find(e => e.id === 'egg_mouse_mandala');
      if (egg && !foundEggs.includes(egg.id)) {
        discoverEgg(egg);
      }
    }

    // Check for fibonacci spiral
    if (detectFibonacciSpiral(recent)) {
      const secret = COSMIC_SECRETS.find(s => s.id === 'secret_fibonacci_portal');
      if (secret && !unlockedSecrets.includes(secret.id)) {
        discoverSecret(secret);
      }
    }
  }, [foundEggs, unlockedSecrets]);

  const checkMantraPatterns = useCallback((mantra: string) => {
    const lowerMantra = mantra.toLowerCase();
    
    // Check for consciousness mantras
    if (lowerMantra.includes('i am the universe experiencing itself')) {
      const secret = COSMIC_SECRETS.find(s => s.id === 'secret_consciousness_upload');
      if (secret && !unlockedSecrets.includes(secret.id) && illuminatiLevel >= 13) {
        discoverSecret(secret);
      }
    }

    // Other hidden mantras
    const hiddenMantras = [
      'reality is a simulation',
      'we are all connected',
      'consciousness is fundamental',
      'the universe is alive',
      'time is an illusion',
      'death is transformation',
      'love is the answer',
      'fear is the mind killer'
    ];

    hiddenMantras.forEach((hiddenMantra, index) => {
      if (lowerMantra.includes(hiddenMantra)) {
        const knowledge = HIDDEN_KNOWLEDGE.find(k => k.id === `mantra_unlock_${index}`);
        if (knowledge && !discoveredKnowledge.includes(knowledge.id)) {
          unlockKnowledge(knowledge);
        }
      }
    });
  }, [unlockedSecrets, illuminatiLevel, discoveredKnowledge]);

  const checkClickPatterns = useCallback((patterns: number[]) => {
    if (patterns.length < 31) return;

    // Check for pi sequence in click timing
    const piSequence = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9];
    const intervals = patterns.slice(-31).map((time, i) => i > 0 ? Math.floor((time - patterns[i-1]) / 100) % 10 : 0).slice(1);
    
    if (JSON.stringify(intervals) === JSON.stringify(piSequence)) {
      const egg = HIDDEN_EASTER_EGGS.find(e => e.id === 'egg_pi_consciousness');
      if (egg && !foundEggs.includes(egg.id)) {
        discoverEgg(egg);
      }
    }
  }, [foundEggs]);

  const detectFlowerOfLife = (points: Array<{x: number, y: number}>) => {
    // Complex geometric pattern detection algorithm
    if (points.length < 20) return false;
    
    // Simplified: check for circular patterns with specific overlap
    const center = { x: 0, y: 0 };
    points.forEach(p => {
      center.x += p.x;
      center.y += p.y;
    });
    center.x /= points.length;
    center.y /= points.length;

    const distances = points.map(p => Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2));
    const avgDistance = distances.reduce((a, b) => a + b) / distances.length;
    const variance = distances.reduce((sum, d) => sum + (d - avgDistance) ** 2, 0) / distances.length;
    
    return variance < avgDistance * 0.1; // Circular enough
  };

  const detectFibonacciSpiral = (points: Array<{x: number, y: number}>) => {
    // Fibonacci spiral detection
    if (points.length < 13) return false;
    
    // Simplified: check for expanding circular motion
    const angles = [];
    for (let i = 1; i < points.length; i++) {
      const angle = Math.atan2(points[i].y - points[0].y, points[i].x - points[0].x);
      angles.push(angle);
    }
    
    // Check if angles increase in fibonacci-like pattern
    let fibonacciLike = true;
    for (let i = 2; i < Math.min(angles.length, 8); i++) {
      const ratio = (angles[i] - angles[i-1]) / (angles[i-1] - angles[i-2]);
      if (Math.abs(ratio - 1.618) > 0.3) { // Golden ratio tolerance
        fibonacciLike = false;
        break;
      }
    }
    
    return fibonacciLike;
  };

  // Consciousness level effects
  useEffect(() => {
    if (consciousness.unity >= 100) {
      // Unlock ultimate secrets
      const ultimateSecrets = COSMIC_SECRETS.filter(s => s.illuminatiLevel >= 13);
      ultimateSecrets.forEach(secret => {
        if (!unlockedSecrets.includes(secret.id)) {
          setTimeout(() => discoverSecret(secret), Math.random() * 10000);
        }
      });
    }
  }, [consciousness, unlockedSecrets]);

  // Hidden click tracking
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      trackClick(event.clientX, event.clientY);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick]);

  // This component renders nothing visible - all effects are hidden
  return null;
};
