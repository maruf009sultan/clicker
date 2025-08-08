import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VoidSnack {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  description: string;
  rarity: 'common' | 'rare' | 'legendary' | 'cursed';
  corruptionLevel: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  type: 'clicks' | 'souls' | 'streak' | 'corruption' | 'time' | 'sanity';
}

interface GameState {
  souls: number;
  clickPower: number;
  corruptionLevel: number;
  sanity: number;
  streak: number;
  maxStreak: number;
  totalClicks: number;
  sessionTime: number;
  lastClickTime: number;
  snacks: VoidSnack[];
  activeEffects: string[];
  achievements: Achievement[];
  upgrades: {
    voidAnchors: number;
    soulHarvesters: number;
    corruptionAmplifier: number;
    sanityDrain: number;
  };
}

interface VoidEffect {
  name: string;
  duration: number;
  multiplier: number;
  description: string;
  corruptionCost: number;
}

const VOID_SNACKS: VoidSnack[] = [
  { id: 'apple', name: 'Forbidden Apple', emoji: '🍎', baseValue: 1, description: 'First bite of corruption', rarity: 'common', corruptionLevel: 1 },
  { id: 'candy', name: 'Soul Candy', emoji: '🍭', baseValue: 3, description: 'Sweetness that burns', rarity: 'common', corruptionLevel: 2 },
  { id: 'chocolate', name: 'Dark Chocolate', emoji: '🍫', baseValue: 5, description: 'Darker than your soul', rarity: 'rare', corruptionLevel: 3 },
  { id: 'cake', name: 'Despair Cake', emoji: '🎂', baseValue: 8, description: 'Celebrate your doom', rarity: 'rare', corruptionLevel: 4 },
  { id: 'meat', name: 'Cursed Flesh', emoji: '🥩', baseValue: 12, description: 'It still twitches...', rarity: 'legendary', corruptionLevel: 6 },
  { id: 'brain', name: 'Mind Fragment', emoji: '🧠', baseValue: 20, description: 'Taste your own madness', rarity: 'cursed', corruptionLevel: 10 },
  { id: 'heart', name: 'Beating Heart', emoji: '❤️', baseValue: 35, description: 'Still warm, still beating', rarity: 'cursed', corruptionLevel: 15 },
];

const VOID_EFFECTS: VoidEffect[] = [
  { name: 'Soul Harvest', duration: 8000, multiplier: 3, description: 'Souls flow like a river of pain!', corruptionCost: 5 },
  { name: 'Time Fracture', duration: 5000, multiplier: 5, description: 'Reality bleeds at the edges!', corruptionCost: 10 },
  { name: 'Madness Surge', duration: 3000, multiplier: 8, description: 'Embrace the beautiful insanity!', corruptionCost: 20 },
  { name: 'Void Consumption', duration: 10000, multiplier: 2.5, description: 'The abyss consumes everything!', corruptionCost: 15 },
  { name: 'Sanity Collapse', duration: 6000, multiplier: 10, description: 'What is real? Nothing matters!', corruptionCost: 25 },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_soul', name: 'First Taste', description: 'Consume your first soul', icon: '👹', unlocked: false, requirement: 1, type: 'souls' },
  { id: 'hundred_souls', name: 'Soul Collector', description: 'Harvest 100 souls', icon: '💀', unlocked: false, requirement: 100, type: 'souls' },
  { id: 'thousand_souls', name: 'Soul Master', description: 'Devour 1,000 souls', icon: '👑', unlocked: false, requirement: 1000, type: 'souls' },
  { id: 'click_demon', name: 'Click Demon', description: 'Click 1,000 times', icon: '😈', unlocked: false, requirement: 1000, type: 'clicks' },
  { id: 'streak_master', name: 'Addiction', description: 'Maintain a 50-click streak', icon: '🔥', unlocked: false, requirement: 50, type: 'streak' },
  { id: 'fully_corrupted', name: 'Beyond Redemption', description: 'Reach 100% corruption', icon: '🌑', unlocked: false, requirement: 100, type: 'corruption' },
  { id: 'no_sanity', name: 'Madman', description: 'Lose all sanity', icon: '🤪', unlocked: false, requirement: 0, type: 'sanity' },
  { id: 'time_waster', name: 'Life Wasted', description: 'Play for 30 minutes straight', icon: '⏰', unlocked: false, requirement: 1800, type: 'time' },
];

export const VoidFeastClicker: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    souls: 0,
    clickPower: 1,
    corruptionLevel: 0,
    sanity: 100,
    streak: 0,
    maxStreak: 0,
    totalClicks: 0,
    sessionTime: 0,
    lastClickTime: 0,
    snacks: VOID_SNACKS,
    activeEffects: [],
    achievements: [...ACHIEVEMENTS],
    upgrades: {
      voidAnchors: 0,
      soulHarvesters: 0,
      corruptionAmplifier: 1,
      sanityDrain: 1,
    },
  });

  const [currentSnack, setCurrentSnack] = useState<VoidSnack>(VOID_SNACKS[0]);
  const [isVoidStorm, setIsVoidStorm] = useState(false);
  const [voidStormProgress, setVoidStormProgress] = useState(0);
  const [activeVoidEffect, setActiveVoidEffect] = useState<VoidEffect | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [corruptionGlitch, setCorruptionGlitch] = useState(false);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  const [cursorTrails, setCursorTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  
  const voidStormTimer = useRef<NodeJS.Timeout>();
  const effectTimer = useRef<NodeJS.Timeout>();
  const corruptionTimer = useRef<NodeJS.Timeout>();
  const sessionTimer = useRef<NodeJS.Timeout>();
  const withdrawalTimer = useRef<NodeJS.Timeout>();

  // Auto-save game state
  useEffect(() => {
    const saved = localStorage.getItem('voidFeastGame');
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        setGameState(savedState);
      } catch (e) {
        console.log('Failed to load save data - corruption detected');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('voidFeastGame', JSON.stringify(gameState));
  }, [gameState]);

  // Session timer
  useEffect(() => {
    sessionTimer.current = setInterval(() => {
      setGameState(prev => ({ ...prev, sessionTime: prev.sessionTime + 1 }));
    }, 1000);

    return () => {
      if (sessionTimer.current) clearInterval(sessionTimer.current);
    };
  }, []);

  // Withdrawal mechanics
  useEffect(() => {
    const checkWithdrawal = () => {
      const timeSinceLastClick = Date.now() - gameState.lastClickTime;
      if (timeSinceLastClick > 10000 && gameState.totalClicks > 50) { // 10 seconds
        setShowWithdrawal(true);
        setGameState(prev => ({ 
          ...prev, 
          sanity: Math.max(0, prev.sanity - 2),
          streak: 0 
        }));
      } else {
        setShowWithdrawal(false);
      }
    };

    withdrawalTimer.current = setInterval(checkWithdrawal, 2000);
    return () => {
      if (withdrawalTimer.current) clearInterval(withdrawalTimer.current);
    };
  }, [gameState.lastClickTime, gameState.totalClicks]);

  // Cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.corruptionLevel > 20) {
        const newTrail = { id: Date.now(), x: e.clientX, y: e.clientY };
        setCursorTrails(prev => [...prev.slice(-10), newTrail]);
        
        setTimeout(() => {
          setCursorTrails(prev => prev.filter(t => t.id !== newTrail.id));
        }, 800);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [gameState.corruptionLevel]);

  // Random snack rotation with corruption influence
  useEffect(() => {
    const interval = setInterval(() => {
      const corruptionInfluence = gameState.corruptionLevel / 100;
      
      if (Math.random() < (0.3 + corruptionInfluence)) {
        const availableSnacks = VOID_SNACKS.filter(snack => 
          snack.corruptionLevel <= gameState.corruptionLevel + 5
        );
        const randomSnack = availableSnacks[Math.floor(Math.random() * availableSnacks.length)];
        setCurrentSnack(randomSnack);
        
        if (Math.random() < (0.1 + corruptionInfluence)) {
          triggerCorruptionGlitch();
        }
      }
    }, 3000 - (gameState.corruptionLevel * 20)); // Faster as corruption increases

    return () => clearInterval(interval);
  }, [gameState.corruptionLevel]);

  // Void Storm mode
  useEffect(() => {
    const triggerVoidStorm = () => {
      const corruptionBonus = gameState.corruptionLevel / 20;
      if (Math.random() < (0.03 + corruptionBonus)) { // Higher chance with corruption
        setIsVoidStorm(true);
        setVoidStormProgress(0);
        
        const duration = 15000; // 15 seconds
        const startTime = Date.now();
        
        voidStormTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed / duration) * 100;
          
          if (progress >= 100) {
            setIsVoidStorm(false);
            setVoidStormProgress(0);
            clearInterval(voidStormTimer.current);
            
            // Punishment for not clicking enough during void storm
            setGameState(prev => ({
              ...prev,
              sanity: Math.max(0, prev.sanity - 15),
              corruptionLevel: Math.min(100, prev.corruptionLevel + 5)
            }));
          } else {
            setVoidStormProgress(progress);
          }
        }, 100);

        toast({
          title: "🌑 VOID STORM APPROACHES!",
          description: "The abyss hungers! Click to survive the darkness!",
          duration: 4000,
        });
      }
    };

    const interval = setInterval(triggerVoidStorm, 20000 - (gameState.corruptionLevel * 100));
    return () => {
      clearInterval(interval);
      if (voidStormTimer.current) clearInterval(voidStormTimer.current);
    };
  }, [toast, gameState.corruptionLevel]);

  const triggerVoidEffect = useCallback(() => {
    if (activeVoidEffect || gameState.corruptionLevel < 10) return;

    const availableEffects = VOID_EFFECTS.filter(effect => 
      gameState.corruptionLevel >= effect.corruptionCost
    );
    
    if (availableEffects.length === 0) return;

    const effect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
    setActiveVoidEffect(effect);

    setGameState(prev => ({
      ...prev,
      corruptionLevel: Math.min(100, prev.corruptionLevel + effect.corruptionCost),
      sanity: Math.max(0, prev.sanity - (effect.corruptionCost * 2))
    }));

    toast({
      title: `💀 ${effect.name}`,
      description: effect.description,
      duration: 3000,
    });

    effectTimer.current = setTimeout(() => {
      setActiveVoidEffect(null);
    }, effect.duration);
  }, [activeVoidEffect, gameState.corruptionLevel, toast]);

  const triggerCorruptionGlitch = useCallback(() => {
    setCorruptionGlitch(true);
    
    // Corruption effects
    const glitchEffects = [
      () => setGameState(prev => ({ ...prev, sanity: Math.max(0, prev.sanity - 5) })),
      () => setGameState(prev => ({ ...prev, corruptionLevel: Math.min(100, prev.corruptionLevel + 3) })),
      () => {
        const shuffled = [...VOID_SNACKS].sort(() => Math.random() - 0.5);
        setGameState(prev => ({ ...prev, snacks: shuffled }));
      }
    ];

    glitchEffects[Math.floor(Math.random() * glitchEffects.length)]();

    toast({
      title: "⚡ REALITY FRACTURES!",
      description: "The void bleeds through! Your mind fragmenting!",
      duration: 2500,
    });

    corruptionTimer.current = setTimeout(() => {
      setCorruptionGlitch(false);
      setGameState(prev => ({ ...prev, snacks: VOID_SNACKS }));
    }, 2000);
  }, [toast]);

  const createParticleEffect = useCallback((x: number, y: number, type: string = 'soul') => {
    const newParticle = { id: Date.now(), x, y, type };
    setParticleEffects(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1200);
  }, []);

  const checkAchievements = useCallback((newState: GameState) => {
    const updatedAchievements = newState.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let currentValue = 0;
      switch (achievement.type) {
        case 'souls':
          currentValue = newState.souls;
          break;
        case 'clicks':
          currentValue = newState.totalClicks;
          break;
        case 'streak':
          currentValue = newState.maxStreak;
          break;
        case 'corruption':
          currentValue = newState.corruptionLevel;
          break;
        case 'time':
          currentValue = newState.sessionTime;
          break;
        case 'sanity':
          currentValue = newState.sanity;
          break;
      }

      if ((achievement.type === 'sanity' && currentValue <= achievement.requirement) ||
          (achievement.type !== 'sanity' && currentValue >= achievement.requirement)) {
        toast({
          title: `🏆 ACHIEVEMENT UNLOCKED!`,
          description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
          duration: 5000,
        });
        return { ...achievement, unlocked: true };
      }

      return achievement;
    });

    return { ...newState, achievements: updatedAchievements };
  }, [toast]);

  const handleSnackClick = useCallback((event: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - gameState.lastClickTime;
    
    // Streak mechanics
    let newStreak = gameState.streak;
    if (timeSinceLastClick < 3000) { // 3 seconds to maintain streak
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    let soulsEarned = currentSnack.baseValue * gameState.clickPower;
    
    // Streak bonus
    const streakBonus = Math.floor(newStreak / 10);
    soulsEarned += streakBonus;

    // Apply void effect multiplier
    if (activeVoidEffect) {
      soulsEarned *= activeVoidEffect.multiplier;
    }

    // Void Storm bonus
    if (isVoidStorm) {
      soulsEarned *= 7; // 7x multiplier during void storm
    }

    // Corruption amplifier
    soulsEarned *= gameState.upgrades.corruptionAmplifier;

    // Sanity affects efficiency
    const sanityMultiplier = (gameState.sanity / 100) * 0.5 + 0.5; // 50% to 100% efficiency
    soulsEarned *= sanityMultiplier;

    let newState = {
      ...gameState,
      souls: gameState.souls + Math.floor(soulsEarned),
      streak: newStreak,
      maxStreak: Math.max(gameState.maxStreak, newStreak),
      totalClicks: gameState.totalClicks + 1,
      lastClickTime: now,
      corruptionLevel: Math.min(100, gameState.corruptionLevel + (currentSnack.corruptionLevel * 0.1)),
      sanity: Math.max(0, gameState.sanity - (gameState.upgrades.sanityDrain * 0.1)),
    };

    newState = checkAchievements(newState);
    setGameState(newState);

    // Visual effects
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 300);

    // Create particle effect at click position
    const rect = event.currentTarget.getBoundingClientRect();
    const particleType = isVoidStorm ? 'storm' : activeVoidEffect ? 'void' : 'soul';
    createParticleEffect(
      event.clientX - rect.left,
      event.clientY - rect.top,
      particleType
    );

    // Random chance to trigger void effect
    if (Math.random() < (0.05 + (gameState.corruptionLevel / 500))) {
      triggerVoidEffect();
    }

    // Random chance to trigger corruption glitch
    if (Math.random() < (0.03 + (gameState.corruptionLevel / 1000))) {
      triggerCorruptionGlitch();
    }
  }, [currentSnack, gameState, activeVoidEffect, isVoidStorm, triggerVoidEffect, triggerCorruptionGlitch, createParticleEffect, checkAchievements]);

  const purchaseUpgrade = useCallback((type: keyof typeof gameState.upgrades, cost: number) => {
    if (gameState.souls >= cost) {
      setGameState(prev => {
        const newState = {
          ...prev,
          souls: prev.souls - cost,
          upgrades: {
            ...prev.upgrades,
            [type]: prev.upgrades[type] + 1,
          },
        };

        // Apply upgrade effects
        switch (type) {
          case 'voidAnchors':
            newState.clickPower = prev.clickPower + 3;
            break;
          case 'soulHarvesters':
            newState.corruptionLevel = Math.min(100, prev.corruptionLevel + 5);
            break;
          case 'corruptionAmplifier':
            newState.upgrades.corruptionAmplifier = prev.upgrades.corruptionAmplifier + 0.5;
            break;
          case 'sanityDrain':
            newState.upgrades.sanityDrain = prev.upgrades.sanityDrain + 0.5;
            break;
        }

        return newState;
      });

      toast({
        title: "💀 UPGRADE CONSUMED!",
        description: `${type} enhanced! Your soul grows darker...`,
        duration: 2000,
      });
    }
  }, [gameState.souls, toast]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${corruptionGlitch ? 'reality-corruption' : ''} ${showWithdrawal ? 'withdrawal-flicker' : ''}`}>
      {/* Cursor Trails */}
      {cursorTrails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{ left: trail.x, top: trail.y }}
        />
      ))}

      {/* Void Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-void-black via-soul-purple/20 to-blood-red/10" />
        <div className={`absolute top-1/3 left-1/3 w-96 h-96 bg-soul-purple/30 rounded-full blur-3xl ${gameState.corruptionLevel > 50 ? 'void-pulse' : 'cosmic-pulse'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-blood-red/40 rounded-full blur-2xl ${gameState.sanity < 50 ? 'hunger-effect' : 'animate-pulse'} delay-1000`} />
        {gameState.corruptionLevel > 70 && (
          <div className="absolute inset-0 obsession-spiral opacity-20" />
        )}
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-blood-red via-soul-purple to-corruption-green bg-clip-text text-transparent mb-4 ${gameState.sanity < 30 ? 'fear-tremor' : ''}`}>
            🌑 VOID FEAST 💀
          </h1>
          <p className="text-xl text-red-400">
            Consume. Corrupt. Descend into beautiful madness.
          </p>
          {showWithdrawal && (
            <p className="text-lg text-yellow-400 animate-pulse mt-2">
              ⚠️ You feel the hunger... the NEED to click... ⚠️
            </p>
          )}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-soul-purple/50 void-glow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Souls Consumed</p>
              <p className="text-2xl font-bold text-soul-purple">{Math.floor(gameState.souls).toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blood-red/50 blood-glow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Click Power</p>
              <p className="text-2xl font-bold text-blood-red">{gameState.clickPower}x</p>
              {gameState.streak > 0 && (
                <p className="text-sm text-yellow-400">🔥 Streak: {gameState.streak}</p>
              )}
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-corruption-green/50 corruption-glow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Corruption</p>
              <Progress value={gameState.corruptionLevel} className="mb-2 bg-corruption-green/20" />
              <p className="text-lg font-bold text-corruption-green">{gameState.corruptionLevel.toFixed(1)}%</p>
            </div>
          </Card>
          
          <Card className={`p-4 bg-card/80 backdrop-blur-sm border-yellow-500/50 ${gameState.sanity < 20 ? 'addiction-shake' : ''}`}>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sanity Remaining</p>
              <Progress value={gameState.sanity} className="mb-2 bg-red-900/50" />
              <p className={`text-lg font-bold ${gameState.sanity > 50 ? 'text-green-400' : gameState.sanity > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                {gameState.sanity.toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>

        {/* Active Effects */}
        {(activeVoidEffect || isVoidStorm) && (
          <div className="mb-6 flex justify-center">
            {activeVoidEffect && (
              <Badge variant="outline" className="mr-2 border-soul-purple text-soul-purple void-glow">
                💀 {activeVoidEffect.name} ({activeVoidEffect.multiplier}x)
              </Badge>
            )}
            {isVoidStorm && (
              <Badge variant="destructive" className="border-destructive text-destructive-foreground animate-pulse">
                🌑 VOID STORM! (7x Multiplier)
              </Badge>
            )}
          </div>
        )}

        {/* Void Storm Progress */}
        {isVoidStorm && (
          <div className="mb-6">
            <p className="text-center text-red-400 mb-2">💀 THE ABYSS CONSUMES ALL!</p>
            <Progress value={voidStormProgress} className="bg-red-900/30" />
          </div>
        )}

        {/* Main Clicking Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Button
              onClick={handleSnackClick}
              size="lg"
              className={`
                text-8xl p-8 h-auto bg-card/50 hover:bg-card/70 border-2 border-soul-purple/50 
                hover:border-blood-red transition-all duration-200 backdrop-blur-sm
                ${clickAnimation ? 'scale-125 void-glow' : ''}
                ${activeVoidEffect ? 'obsession-spiral' : ''}
                ${isVoidStorm ? 'animate-pulse border-red-500 blood-glow' : ''}
                ${gameState.sanity < 30 ? 'fear-tremor' : 'soul-float'}
                ${showWithdrawal ? 'addiction-shake' : ''}
              `}
            >
              {currentSnack.emoji}
            </Button>
            
            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className={`absolute pointer-events-none text-xl font-bold animate-ping ${
                  particle.type === 'storm' ? 'text-red-400' : 
                  particle.type === 'void' ? 'text-purple-400' : 'text-soul-purple'
                }`}
                style={{
                  left: particle.x,
                  top: particle.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                +{currentSnack.baseValue * (isVoidStorm ? 7 : activeVoidEffect?.multiplier || 1)}💀
              </div>
            ))}
          </div>
        </div>

        {/* Current Snack Info */}
        <Card className={`p-4 mb-8 bg-card/80 backdrop-blur-sm border-${currentSnack.rarity === 'cursed' ? 'red' : currentSnack.rarity === 'legendary' ? 'purple' : 'soul-purple'}-500/30 text-center`}>
          <h3 className="text-2xl font-bold text-soul-purple mb-2">{currentSnack.name}</h3>
          <p className="text-muted-foreground">{currentSnack.description}</p>
          <p className="text-lg font-semibold mt-2">
            Soul Value: {currentSnack.baseValue} | Corruption: {currentSnack.corruptionLevel}
          </p>
          <Badge variant="outline" className={`mt-2 ${
            currentSnack.rarity === 'cursed' ? 'border-red-500 text-red-400' :
            currentSnack.rarity === 'legendary' ? 'border-purple-500 text-purple-400' :
            currentSnack.rarity === 'rare' ? 'border-yellow-500 text-yellow-400' :
            'border-gray-500 text-gray-400'
          }`}>
            {currentSnack.rarity.toUpperCase()}
          </Badge>
        </Card>

        {/* Achievements */}
        <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border-yellow-500/30">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">🏆 Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gameState.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-2 rounded text-center text-sm ${
                  achievement.unlocked 
                    ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-500/50' 
                    : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="font-semibold">{achievement.name}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upgrades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-soul-purple/30">
            <h3 className="text-xl font-bold text-soul-purple mb-3">⚓ Void Anchors</h3>
            <p className="text-sm text-muted-foreground mb-3">Bind your soul to the void for power</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.voidAnchors}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.voidAnchors + 1) * 150} Souls</p>
            <Button 
              onClick={() => purchaseUpgrade('voidAnchors', (gameState.upgrades.voidAnchors + 1) * 150)}
              disabled={gameState.souls < (gameState.upgrades.voidAnchors + 1) * 150}
              className="w-full"
              variant="outline"
            >
              Consume (+3 Click Power)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blood-red/30">
            <h3 className="text-xl font-bold text-blood-red mb-3">🔪 Soul Harvesters</h3>
            <p className="text-sm text-muted-foreground mb-3">Accelerate your descent into darkness</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.soulHarvesters}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.soulHarvesters + 1) * 300} Souls</p>
            <Button 
              onClick={() => purchaseUpgrade('soulHarvesters', (gameState.upgrades.soulHarvesters + 1) * 300)}
              disabled={gameState.souls < (gameState.upgrades.soulHarvesters + 1) * 300}
              className="w-full"
              variant="outline"
            >
              Harvest (+5% Corruption)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-corruption-green/30">
            <h3 className="text-xl font-bold text-corruption-green mb-3">🌑 Corruption Amp</h3>
            <p className="text-sm text-muted-foreground mb-3">Let the darkness amplify your gains</p>
            <p className="text-lg mb-3">Level: {gameState.upgrades.corruptionAmplifier}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor(gameState.upgrades.corruptionAmplifier * 500)} Souls</p>
            <Button 
              onClick={() => purchaseUpgrade('corruptionAmplifier', Math.floor(gameState.upgrades.corruptionAmplifier * 500))}
              disabled={gameState.souls < Math.floor(gameState.upgrades.corruptionAmplifier * 500)}
              className="w-full"
              variant="outline"
            >
              Amplify (+0.5x Multiplier)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-yellow-500/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">🧠 Sanity Drain</h3>
            <p className="text-sm text-muted-foreground mb-3">Accelerate your beautiful madness</p>
            <p className="text-lg mb-3">Rate: {gameState.upgrades.sanityDrain}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor(gameState.upgrades.sanityDrain * 200)} Souls</p>
            <Button 
              onClick={() => purchaseUpgrade('sanityDrain', Math.floor(gameState.upgrades.sanityDrain * 200))}
              disabled={gameState.souls < Math.floor(gameState.upgrades.sanityDrain * 200)}
              className="w-full"
              variant="outline"
            >
              Drain (+0.5x Faster)
            </Button>
          </Card>
        </div>

        {/* Ominous Instructions */}
        <Card className="p-6 mt-8 bg-card/60 backdrop-blur-sm border-red-500/20">
          <h3 className="text-xl font-bold text-red-400 mb-4">💀 How to Descend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">🖱️ <strong>Click to consume</strong> forbidden snacks and harvest souls</p>
              <p className="mb-2">🔥 <strong>Maintain streaks</strong> to multiply your dark power</p>
              <p className="mb-2">⚡ <strong>Embrace corruption</strong> - it makes you stronger</p>
            </div>
            <div>
              <p className="mb-2">🌑 <strong>Survive Void Storms</strong> for massive soul harvests</p>
              <p className="mb-2">🧠 <strong>Watch your sanity</strong> slip away with each click</p>
              <p className="mb-2">💀 <strong>There is no escape</strong> - only deeper descent</p>
            </div>
          </div>
          <p className="text-center text-red-300 mt-4 italic">
            "The void gazes also into you..."
          </p>
        </Card>
      </div>
    </div>
  );
};