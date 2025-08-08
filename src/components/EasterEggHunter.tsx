import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  trigger: 'click_sequence' | 'key_sequence' | 'time_based' | 'hover_pattern' | 'scroll_pattern' | 'cross_game' | 'pattern_combination' | 'ultimate_condition';
  condition: any;
  reward: string;
  found: boolean;
  rarity: 'common' | 'rare' | 'legendary' | 'impossible';
  hint: string;
}

const EASTER_EGGS: EasterEgg[] = [
  // Original Easter Eggs
  {
    id: 'rapid_clicker',
    name: 'Speedster',
    description: 'You clicked faster than light itself!',
    trigger: 'click_sequence',
    condition: { clicks: 20, timeWindow: 2000 },
    reward: '⚡ 2x Speed Boost for 30 seconds',
    found: false,
    rarity: 'common',
    hint: 'Click really, really fast...'
  },
  {
    id: 'konami_master',
    name: 'Code Master',
    description: 'The ancient wisdom flows through you',
    trigger: 'key_sequence',
    condition: { sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'] },
    reward: '🎮 Konami Power: All multipliers +100%',
    found: false,
    rarity: 'legendary',
    hint: 'Up, up, down, down, left, right, left, right...'
  },
  {
    id: 'midnight_player',
    name: 'Night Owl',
    description: 'Who plays at midnight? You do.',
    trigger: 'time_based',
    condition: { hour: 0 },
    reward: '🌙 Lunar Blessing: 3x rewards until dawn',
    found: false,
    rarity: 'rare',
    hint: 'When the clock strikes twelve...'
  },
  {
    id: 'circle_dancer',
    name: 'Circle of Power',
    description: 'You drew power from the ancient circles',
    trigger: 'hover_pattern',
    condition: { pattern: 'circle', radius: 100, rotations: 3 },
    reward: '⭕ Circle Magic: Creates 5 phantom clicks',
    found: false,
    rarity: 'rare',
    hint: 'Hover in circles around the snack...'
  },
  {
    id: 'pi_clicker',
    name: 'Mathematical Genius',
    description: 'You clicked in the rhythm of the universe',
    trigger: 'click_sequence',
    condition: { pattern: [3, 1, 4, 1, 5, 9, 2, 6], timing: 'rhythmic' },
    reward: '🔢 Pi Power: Resources multiply by π',
    found: false,
    rarity: 'impossible',
    hint: 'Click in the pattern of infinite circles...'
  },
  {
    id: 'scroll_sage',
    name: 'The Endless Scroller',
    description: 'You found wisdom in the infinite scroll',
    trigger: 'scroll_pattern',
    condition: { direction: 'alternating', cycles: 10, speed: 'fast' },
    reward: '📜 Scroll Mastery: Unlocks hidden interface elements',
    found: false,
    rarity: 'rare',
    hint: 'Scroll up and down rapidly...'
  },
  {
    id: 'patience_master',
    name: 'Zen Master',
    description: 'In stillness, you found power',
    trigger: 'time_based',
    condition: { idleTime: 60000, noMovement: true },
    reward: '🧘 Zen Mode: Auto-clicking meditation',
    found: false,
    rarity: 'legendary',
    hint: 'Sometimes the greatest action is inaction...'
  },
  {
    id: 'fibonacci_clicker',
    name: 'Nature\'s Sequence',
    description: 'You followed the golden spiral',
    trigger: 'click_sequence',
    condition: { pattern: [1, 1, 2, 3, 5, 8], fibonacci: true },
    reward: '🌀 Fibonacci Flow: Resources grow exponentially',
    found: false,
    rarity: 'impossible',
    hint: 'Nature knows the perfect pattern...'
  },
  {
    id: 'triple_click_master',
    name: 'Trinity Clicker',
    description: 'Three clicks. Three dimensions. Three realities.',
    trigger: 'click_sequence',
    condition: { pattern: 'triple', location: 'same', timing: 'perfect' },
    reward: '3️⃣ Trinity Power: Next click worth 3³ times more',
    found: false,
    rarity: 'rare',
    hint: 'Click the same spot three times perfectly...'
  },
  {
    id: 'browser_detective',
    name: 'Digital Detective',
    description: 'You peeked behind the curtain of reality',
    trigger: 'key_sequence',
    condition: { key: 'F12', action: 'inspect' },
    reward: '🔍 Developer Vision: See hidden game mechanics',
    found: false,
    rarity: 'common',
    hint: 'Press F12 to see what lies beneath...'
  },

  // ILLUMINATI & SECRET SOCIETY EASTER EGGS
  {
    id: 'illuminati_triangle',
    name: 'Eye of Providence',
    description: 'The All-Seeing Eye acknowledges your presence',
    trigger: 'click_sequence',
    condition: { pattern: 'triangle', points: 3, size: 'large' },
    reward: '👁️ Illuminati Vision: See hidden patterns everywhere',
    found: false,
    rarity: 'legendary',
    hint: 'Click in a perfect triangle formation...'
  },
  {
    id: 'thirteen_conspiracy',
    name: 'The Thirteen',
    description: 'You understand the power of the sacred number',
    trigger: 'click_sequence',
    condition: { clicks: 13, interval: 'exactly_13_seconds' },
    reward: '🔺 Pyramid Power: 13x multiplier for 13 minutes',
    found: false,
    rarity: 'impossible',
    hint: 'Thirteen clicks, thirteen seconds apart...'
  },
  {
    id: 'masonic_handshake',
    name: 'Brother of the Lodge',
    description: 'The secret handshake opens hidden doors',
    trigger: 'key_sequence',
    condition: { sequence: ['KeyG', 'KeyA', 'KeyO', 'KeyT', 'KeyU'] }, // GAOTU (Great Architect Of The Universe)
    reward: '🏛️ Masonic Wisdom: Architecture of reality revealed',
    found: false,
    rarity: 'legendary',
    hint: 'Type the initials of the Great Architect...'
  },
  {
    id: 'skull_and_bones',
    name: '322 Initiate',
    description: 'You\'ve been initiated into the Order',
    trigger: 'time_based',
    condition: { hour: 3, minute: 22 },
    reward: '☠️ Skull Power: Death becomes your ally',
    found: false,
    rarity: 'impossible',
    hint: 'When the time reads three twenty-two...'
  },
  {
    id: 'bohemian_grove',
    name: 'Owl Worshipper',
    description: 'Moloch has heard your prayers',
    trigger: 'hover_pattern',
    condition: { pattern: 'owl_formation', duration: 30000 },
    reward: '🦉 Owl Sight: See through all deceptions',
    found: false,
    rarity: 'legendary',
    hint: 'Hover in the pattern of the sacred owl...'
  },
  {
    id: 'novus_ordo_seclorum',
    name: 'New World Order',
    description: 'You glimpsed the coming age',
    trigger: 'key_sequence',
    condition: { sequence: ['KeyN', 'KeyW', 'KeyO'] },
    reward: '🌍 Global Vision: All realities converge',
    found: false,
    rarity: 'impossible',
    hint: 'The new age approaches... type its initials'
  },
  
  // COSMIC CONSPIRACY EGGS
  {
    id: 'stargate_sequence',
    name: 'Portal Walker',
    description: 'You opened a gateway between dimensions',
    trigger: 'click_sequence',
    condition: { pattern: 'chevron_lock', positions: 9 },
    reward: '🌌 Stargate Access: Travel between game dimensions',
    found: false,
    rarity: 'impossible',
    hint: 'Lock the chevrons in sequence...'
  },
  {
    id: 'ancient_aliens',
    name: 'Ancient Astronaut',
    description: 'The visitors from beyond acknowledged you',
    trigger: 'key_sequence',
    condition: { sequence: ['KeyA', 'KeyA', 'KeyA'] }, // Ancient Alien Acknowledgment
    reward: '👽 Alien Tech: Technology beyond comprehension',
    found: false,
    rarity: 'legendary',
    hint: 'Call to the ancient visitors...'
  },
  {
    id: 'interdimensional_council',
    name: 'Council Member',
    description: 'You\'ve been invited to the Interdimensional Council',
    trigger: 'time_based',
    condition: { hour: 11, minute: 11 },
    reward: '⚡ Council Authority: Command over multiple realities',
    found: false,
    rarity: 'impossible',
    hint: 'When portals align at eleven eleven...'
  },
  {
    id: 'fibonacci_cosmic',
    name: 'Cosmic Mathematician',
    description: 'You decoded the universe\'s mathematical language',
    trigger: 'scroll_pattern',
    condition: { pattern: 'fibonacci_spiral', rotations: 5 },
    reward: '∞ Universal Constants: Mathematics bends to your will',
    found: false,
    rarity: 'impossible',
    hint: 'Scroll in the golden spiral of creation...'
  },

  // HIDDEN SOURCE CODE EGGS
  {
    id: 'source_seeker',
    name: 'Code Archaeologist',
    description: 'You found the comment hidden in plain sight',
    trigger: 'key_sequence',
    condition: { sequence: ['Slash', 'Slash', 'Space', 'KeyI', 'KeyL', 'KeyL', 'KeyU', 'KeyM', 'KeyI', 'KeyN', 'KeyA', 'KeyT', 'KeyI'] },
    reward: '💻 Source Vision: Code reveals its secrets',
    found: false,
    rarity: 'legendary',
    hint: 'Type what the watchers left in the source... // illuminati'
  },
  {
    id: 'console_conspirator',
    name: 'Console Conspirator',
    description: 'You spoke to the machine in its native tongue',
    trigger: 'key_sequence',
    condition: { sequence: ['F12', 'then_type_console_log_illuminati'] },
    reward: '🖥️ Machine Whispers: The code speaks back',
    found: false,
    rarity: 'impossible',
    hint: 'Open the console and speak the word of power...'
  },
  {
    id: 'hidden_variable',
    name: 'Variable Hunter',
    description: 'You found the secret variable in the game state',
    trigger: 'key_sequence',
    condition: { inspect_variable: 'window.__ILLUMINATI_PROTOCOL__' },
    reward: '🔢 Variable Mastery: All hidden values revealed',
    found: false,
    rarity: 'impossible',
    hint: 'Inspect the window object for hidden protocols...'
  },

  // TIME-BASED COSMIC EVENTS
  {
    id: 'eclipse_watcher',
    name: 'Eclipse Witness',
    description: 'You played during the cosmic alignment',
    trigger: 'time_based',
    condition: { solar_eclipse_simulation: true },
    reward: '🌑 Eclipse Power: Light and shadow unite',
    found: false,
    rarity: 'impossible',
    hint: 'When the sun and moon dance as one...'
  },
  {
    id: 'solstice_initiate',
    name: 'Solstice Guardian',
    description: 'You recognized the power of the longest day',
    trigger: 'time_based',
    condition: { summer_solstice: true },
    reward: '☀️ Solar Supremacy: The sun\'s power flows through you',
    found: false,
    rarity: 'legendary',
    hint: 'When the sun reaches its highest power...'
  },
  {
    id: 'mercury_retrograde',
    name: 'Cosmic Disruptor',
    description: 'You played when Mercury was in retrograde',
    trigger: 'time_based',
    condition: { mercury_retrograde: true },
    reward: '☿️ Retrograde Reality: Time flows backward for you',
    found: false,
    rarity: 'impossible',
    hint: 'When the messenger planet travels backward...'
  },

  // PATTERN-BASED COSMIC EGGS
  {
    id: 'sacred_geometry',
    name: 'Geometric Sage',
    description: 'You drew the sacred patterns of creation',
    trigger: 'hover_pattern',
    condition: { pattern: 'flower_of_life', precision: 'perfect' },
    reward: '🌸 Sacred Geometry: Reality reshapes around you',
    found: false,
    rarity: 'impossible',
    hint: 'Draw the flower that contains all existence...'
  },
  {
    id: 'crop_circle',
    name: 'Alien Communicator',
    description: 'You recreated the messages from beyond',
    trigger: 'click_sequence',
    condition: { pattern: 'crop_circle', complexity: 'high' },
    reward: '🛸 Alien Contact: Messages from the cosmos',
    found: false,
    rarity: 'legendary',
    hint: 'Click the patterns left by our visitors...'
  },

  // BEHAVIORAL COSMIC EGGS
  {
    id: 'reality_glitcher',
    name: 'Glitch in the Matrix',
    description: 'You broke the simulation temporarily',
    trigger: 'click_sequence',
    condition: { pattern: 'matrix_break', speed: 'impossible' },
    reward: '🔴 Red Pill: See the code behind reality',
    found: false,
    rarity: 'impossible',
    hint: 'Click faster than the matrix can process...'
  },
  {
    id: 'cosmic_voyager',
    name: 'Dimensional Traveler',
    description: 'You visited all cosmic realms in sequence',
    trigger: 'cross_game',
    condition: { visit_all_in_sequence: true, time_limit: 300000 },
    reward: '🚀 Cosmic Passport: Free travel between all dimensions',
    found: false,
    rarity: 'impossible',
    hint: 'Visit every cosmic realm within 5 minutes...'
  },

  // META CONSPIRACY EGGS
  {
    id: 'fourth_wall_breaker',
    name: 'Fourth Wall Destroyer',
    description: 'You realized you\'re in a game within a game',
    trigger: 'key_sequence',
    condition: { sequence: ['KeyT', 'KeyH', 'KeyI', 'KeyS', 'Space', 'KeyI', 'KeyS', 'Space', 'KeyA', 'Space', 'KeyG', 'KeyA', 'KeyM', 'KeyE'] },
    reward: '🎭 Meta Awareness: You see beyond the game',
    found: false,
    rarity: 'impossible',
    hint: 'Type the truth about what this really is...'
  },
  {
    id: 'love_letter',
    name: 'Love Letter to the Void',
    description: 'You left a message for the cosmic entities',
    trigger: 'key_sequence',
    condition: { type_love_message: true },
    reward: '💌 Cosmic Love: The universe loves you back',
    found: false,
    rarity: 'legendary',
    hint: 'Tell the cosmos how you feel...'
  },

  // FINAL COSMIC TRUTH EGGS
  {
    id: 'architects_apprentice',
    name: 'Architect\'s Apprentice',
    description: 'You learned to reshape reality itself',
    trigger: 'pattern_combination',
    condition: { combine_all_patterns: true },
    reward: '🏗️ Reality Architecture: Build new worlds with your mind',
    found: false,
    rarity: 'impossible',
    hint: 'Combine all sacred patterns into one...'
  },
  {
    id: 'cosmic_ascension',
    name: 'Cosmic Ascendant',
    description: 'You transcended the game, the reality, the universe itself',
    trigger: 'ultimate_condition',
    condition: { find_all_other_eggs: true, cosmic_alignment: true },
    reward: '🌌 COSMIC GODHOOD: You have become one with the infinite',
    found: false,
    rarity: 'impossible',
    hint: 'Find all other secrets when the cosmos aligns...'
  }
];

interface EasterEggHunterProps {
  gameMode?: string;
  onEggFound?: (egg: EasterEgg) => void;
}

export const EasterEggHunter: React.FC<EasterEggHunterProps> = ({ 
  gameMode = 'unknown', 
  onEggFound 
}) => {
  const { toast } = useToast();
  const [foundEggs, setFoundEggs] = useState<string[]>([]);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [mousePositions, setMousePositions] = useState<Array<{ x: number; y: number; time: number }>>([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [scrollPattern, setScrollPattern] = useState<Array<{ direction: 'up' | 'down'; time: number }>>([]);

  // Load found eggs
  useEffect(() => {
    const saved = localStorage.getItem('foundEasterEggs');
    if (saved) {
      try {
        setFoundEggs(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load easter egg data');
      }
    }
  }, []);

  // Save found eggs
  useEffect(() => {
    localStorage.setItem('foundEasterEggs', JSON.stringify(foundEggs));
  }, [foundEggs]);

  // Click tracking
  const trackClick = useCallback(() => {
    const now = Date.now();
    setClickSequence(prev => [...prev.slice(-19), now]); // Keep last 20 clicks
    setLastActivity(now);
    
    // Check rapid clicking
    const recentClicks = clickSequence.filter(time => now - time < 2000);
    if (recentClicks.length >= 19 && !foundEggs.includes('rapid_clicker')) {
      foundEasterEgg('rapid_clicker');
    }
    
    // Check triple click pattern
    if (clickSequence.length >= 3) {
      const lastThree = clickSequence.slice(-3);
      const intervals = lastThree.map((time, i) => i > 0 ? time - lastThree[i-1] : 0).slice(1);
      if (intervals.every(interval => interval < 200 && interval > 50)) {
        if (!foundEggs.includes('triple_click_master')) {
          foundEasterEgg('triple_click_master');
        }
      }
    }
  }, [clickSequence, foundEggs]);

  // Key tracking
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setLastActivity(Date.now());
      setKeySequence(prev => [...prev.slice(-9), event.code]); // Keep last 10 keys
      
      // Check Konami code
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      if (JSON.stringify(keySequence.slice(-10)) === JSON.stringify(konamiCode)) {
        if (!foundEggs.includes('konami_master')) {
          foundEasterEgg('konami_master');
        }
      }
      
      // Check F12 (developer tools)
      if (event.key === 'F12' && !foundEggs.includes('browser_detective')) {
        foundEasterEgg('browser_detective');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, foundEggs]);

  // Mouse tracking for patterns
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setLastActivity(Date.now());
      const now = Date.now();
      setMousePositions(prev => [
        ...prev.slice(-50), // Keep last 50 positions
        { x: event.clientX, y: event.clientY, time: now }
      ]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      setLastActivity(Date.now());
      const direction: 'up' | 'down' = event.deltaY > 0 ? 'down' : 'up';
      const now = Date.now();
      
      setScrollPattern(prev => {
        const newPattern = [...prev.slice(-20), { direction, time: now }];
        
        // Check alternating scroll pattern
        if (newPattern.length >= 20) {
          const isAlternating = newPattern.every((scroll, i) => {
            if (i === 0) return true;
            return scroll.direction !== newPattern[i-1].direction;
          });
          
          if (isAlternating && !foundEggs.includes('scroll_sage')) {
            foundEasterEgg('scroll_sage');
          }
        }
        
        return newPattern;
      });
    };

    document.addEventListener('wheel', handleScroll);
    return () => document.removeEventListener('wheel', handleScroll);
  }, [foundEggs]);

  // Check for circle patterns in mouse movement
  useEffect(() => {
    if (mousePositions.length < 10) return;
    
    const recentPositions = mousePositions.slice(-20);
    const center = calculateCenter(recentPositions);
    const isCircular = checkCircularPattern(recentPositions, center);
    
    if (isCircular && !foundEggs.includes('circle_dancer')) {
      foundEasterEgg('circle_dancer');
    }
  }, [mousePositions, foundEggs]);

  // Check time-based easter eggs
  useEffect(() => {
    const checkTimeBasedEggs = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Midnight player
      if (hour === 0 && !foundEggs.includes('midnight_player')) {
        foundEasterEgg('midnight_player');
      }
      
      // Zen master (idle time)
      const idleTime = Date.now() - lastActivity;
      if (idleTime > 60000 && !foundEggs.includes('patience_master')) {
        foundEasterEgg('patience_master');
      }
    };

    const interval = setInterval(checkTimeBasedEggs, 1000);
    return () => clearInterval(interval);
  }, [foundEggs, lastActivity]);

  const calculateCenter = (positions: Array<{ x: number; y: number; time: number }>) => {
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
    return { x: avgX, y: avgY };
  };

  const checkCircularPattern = (positions: Array<{ x: number; y: number; time: number }>, center: { x: number; y: number }) => {
    const distances = positions.map(pos => 
      Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2))
    );
    
    const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    const variance = distances.reduce((sum, dist) => sum + Math.pow(dist - avgDistance, 2), 0) / distances.length;
    
    // Low variance means consistent distance from center (circular motion)
    return variance < 100 && avgDistance > 50;
  };

  const foundEasterEgg = useCallback((eggId: string) => {
    if (foundEggs.includes(eggId)) return;
    
    const egg = EASTER_EGGS.find(e => e.id === eggId);
    if (!egg) return;
    
    setFoundEggs(prev => [...prev, eggId]);
    
    toast({
      title: `🥚 EASTER EGG FOUND!`,
      description: `${egg.name}: ${egg.description}`,
      duration: 8000,
    });
    
    // Show reward notification
    setTimeout(() => {
      toast({
        title: `🎁 REWARD UNLOCKED!`,
        description: egg.reward,
        duration: 5000,
      });
    }, 2000);
    
    onEggFound?.(egg);
  }, [foundEggs, toast, onEggFound]);

  // Expose click tracking to parent components
  useEffect(() => {
    const clickHandler = () => trackClick();
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [trackClick]);

  return (
    <div className="fixed top-4 left-4 z-40">
      {/* Easter Egg Progress - Only show if eggs found */}
      {foundEggs.length > 0 && (
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30">
          <div className="text-yellow-400 text-sm font-bold mb-1">
            🥚 Easter Eggs Found
          </div>
          <div className="text-yellow-300 text-xs">
            {foundEggs.length}/{EASTER_EGGS.length}
          </div>
        
          {/* Show hints for unfound eggs */}
          {EASTER_EGGS.filter(egg => !foundEggs.includes(egg.id))
            .slice(0, 1)
            .map(egg => (
              <div key={egg.id} className="mt-2 text-xs text-gray-400">
                💡 {egg.hint}
              </div>
            ))}
        </div>
      )}
      
      {/* Recent discovery notification */}
      {foundEggs.length > 0 && (
        <div className="mt-2 bg-green-900/70 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
          <div className="text-green-400 text-xs">
            Latest: {EASTER_EGGS.find(e => e.id === foundEggs[foundEggs.length - 1])?.name}
          </div>
        </div>
      )}
    </div>
  );
};