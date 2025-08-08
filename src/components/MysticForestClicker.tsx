import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface MysticSnack {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  description: string;
  magic: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'eternal';
}

interface GameState {
  essence: number;
  magicPower: number;
  forestHarmony: number;
  moonPhase: number;
  snacks: MysticSnack[];
  activeEffects: string[];
  seasons: {
    current: 'spring' | 'summer' | 'autumn' | 'winter';
    timer: number;
  };
  upgrades: {
    ancientRoots: number;
    starlight: number;
    druidCircle: number;
  };
}

interface MysticEffect {
  name: string;
  duration: number;
  multiplier: number;
  description: string;
}

const MYSTIC_SNACKS: MysticSnack[] = [
  { id: 'berry', name: 'Moonberries', emoji: '🫐', baseValue: 1, description: 'Glowing with lunar energy', magic: 1, season: 'spring' },
  { id: 'mushroom', name: 'Fairy Mushroom', emoji: '🍄', baseValue: 3, description: 'Whispers ancient secrets', magic: 2, season: 'summer' },
  { id: 'acorn', name: 'Golden Acorn', emoji: '🌰', baseValue: 5, description: 'Seeds of wisdom', magic: 3, season: 'autumn' },
  { id: 'crystal', name: 'Ice Crystal', emoji: '❄️', baseValue: 8, description: 'Frozen starlight', magic: 4, season: 'winter' },
  { id: 'flower', name: 'Eternal Bloom', emoji: '🌸', baseValue: 12, description: 'Never withers, always beautiful', magic: 5, season: 'eternal' },
  { id: 'tree', name: 'World Tree Fruit', emoji: '🌳', baseValue: 20, description: 'Connects all realms', magic: 8, season: 'eternal' },
];

const MYSTIC_EFFECTS: MysticEffect[] = [
  { name: 'Forest Blessing', duration: 7000, multiplier: 2.5, description: 'The forest spirits smile upon you!' },
  { name: 'Seasonal Harmony', duration: 5000, multiplier: 4, description: 'All seasons align in perfect balance!' },
  { name: 'Lunar Eclipse', duration: 10000, multiplier: 3, description: 'The moon\'s power flows through you!' },
  { name: 'Ancient Awakening', duration: 6000, multiplier: 5, description: 'The old magic stirs from its slumber!' },
];

export const MysticForestClicker: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    essence: 0,
    magicPower: 1,
    forestHarmony: 100,
    moonPhase: 0,
    snacks: MYSTIC_SNACKS,
    activeEffects: [],
    seasons: {
      current: 'spring',
      timer: 0,
    },
    upgrades: {
      ancientRoots: 0,
      starlight: 0,
      druidCircle: 1,
    },
  });

  const [currentSnack, setCurrentSnack] = useState<MysticSnack>(MYSTIC_SNACKS[0]);
  const [isStormfront, setIsStormfront] = useState(false);
  const [stormProgress, setStormProgress] = useState(0);
  const [activeMysticEffect, setActiveMysticEffect] = useState<MysticEffect | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [magicRipple, setMagicRipple] = useState(false);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  
  const stormTimer = useRef<NodeJS.Timeout>();
  const effectTimer = useRef<NodeJS.Timeout>();
  const seasonTimer = useRef<NodeJS.Timeout>();

  // Auto-save
  useEffect(() => {
    const saved = localStorage.getItem('mysticForestGame');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load forest memories');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mysticForestGame', JSON.stringify(gameState));
  }, [gameState]);

  // Season cycle
  useEffect(() => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    
    seasonTimer.current = setInterval(() => {
      setGameState(prev => {
        const newTimer = prev.seasons.timer + 1;
        if (newTimer >= 60) { // Change season every 60 seconds
          const currentIndex = seasons.indexOf(prev.seasons.current);
          const nextSeason = seasons[(currentIndex + 1) % seasons.length];
          
          toast({
            title: `🌿 ${nextSeason.toUpperCase()} ARRIVES!`,
            description: `The forest transforms with new seasonal magic!`,
            duration: 3000,
          });
          
          return {
            ...prev,
            seasons: { current: nextSeason, timer: 0 },
            forestHarmony: Math.min(100, prev.forestHarmony + 10),
          };
        }
        
        return {
          ...prev,
          seasons: { ...prev.seasons, timer: newTimer },
          moonPhase: (prev.moonPhase + 1) % 360,
        };
      });
    }, 1000);

    return () => {
      if (seasonTimer.current) clearInterval(seasonTimer.current);
    };
  }, [toast]);

  // Random snack rotation based on seasons
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        const seasonalSnacks = MYSTIC_SNACKS.filter(snack => 
          snack.season === gameState.seasons.current || snack.season === 'eternal'
        );
        const randomSnack = seasonalSnacks[Math.floor(Math.random() * seasonalSnacks.length)];
        setCurrentSnack(randomSnack);
        
        if (Math.random() < 0.12) {
          triggerMagicRipple();
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [gameState.seasons.current]);

  // Mystical Stormfront
  useEffect(() => {
    const triggerStormfront = () => {
      if (Math.random() < 0.04) {
        setIsStormfront(true);
        setStormProgress(0);
        
        const duration = 20000; // 20 seconds
        const startTime = Date.now();
        
        stormTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed / duration) * 100;
          
          if (progress >= 100) {
            setIsStormfront(false);
            setStormProgress(0);
            clearInterval(stormTimer.current);
          } else {
            setStormProgress(progress);
          }
        }, 100);

        toast({
          title: "🌩️ MYSTICAL STORMFRONT!",
          description: "Channel the storm's power! Click to gather its essence!",
          duration: 4000,
        });
      }
    };

    const interval = setInterval(triggerStormfront, 25000);
    return () => {
      clearInterval(interval);
      if (stormTimer.current) clearInterval(stormTimer.current);
    };
  }, [toast]);

  const triggerMysticEffect = useCallback(() => {
    if (activeMysticEffect) return;

    const effect = MYSTIC_EFFECTS[Math.floor(Math.random() * MYSTIC_EFFECTS.length)];
    setActiveMysticEffect(effect);

    toast({
      title: `✨ ${effect.name}`,
      description: effect.description,
      duration: 3000,
    });

    effectTimer.current = setTimeout(() => {
      setActiveMysticEffect(null);
    }, effect.duration);
  }, [activeMysticEffect, toast]);

  const triggerMagicRipple = useCallback(() => {
    setMagicRipple(true);

    toast({
      title: "🌟 MAGIC RIPPLES!",
      description: "Reality shimmers with mystical energy!",
      duration: 2000,
    });

    setTimeout(() => {
      setMagicRipple(false);
    }, 2000);
  }, [toast]);

  const createParticleEffect = useCallback((x: number, y: number, type: string = 'essence') => {
    const newParticle = { id: Date.now(), x, y, type };
    setParticleEffects(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1500);
  }, []);

  const handleSnackClick = useCallback((event: React.MouseEvent) => {
    let essenceEarned = currentSnack.baseValue * gameState.magicPower;
    
    // Seasonal bonuses
    const seasonBonus = currentSnack.season === gameState.seasons.current ? 1.5 : 1;
    essenceEarned *= seasonBonus;
    
    // Moon phase bonus
    const moonBonus = 1 + (Math.sin(gameState.moonPhase * Math.PI / 180) * 0.3);
    essenceEarned *= moonBonus;
    
    if (activeMysticEffect) {
      essenceEarned *= activeMysticEffect.multiplier;
    }

    if (isStormfront) {
      essenceEarned *= 4; // 4x during mystical storms
    }

    essenceEarned *= gameState.upgrades.druidCircle;

    setGameState(prev => ({
      ...prev,
      essence: prev.essence + Math.floor(essenceEarned),
      forestHarmony: Math.max(0, prev.forestHarmony - 0.3),
    }));

    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 250);

    const rect = event.currentTarget.getBoundingClientRect();
    const particleType = isStormfront ? 'storm' : activeMysticEffect ? 'magic' : 'essence';
    createParticleEffect(
      event.clientX - rect.left,
      event.clientY - rect.top,
      particleType
    );

    if (Math.random() < 0.1) {
      triggerMysticEffect();
    }

    if (Math.random() < 0.08) {
      triggerMagicRipple();
    }
  }, [currentSnack, gameState, activeMysticEffect, isStormfront, triggerMysticEffect, triggerMagicRipple, createParticleEffect]);

  const purchaseUpgrade = useCallback((type: keyof typeof gameState.upgrades, cost: number) => {
    if (gameState.essence >= cost) {
      setGameState(prev => ({
        ...prev,
        essence: prev.essence - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1,
        },
        ...(type === 'druidCircle' && { 
          upgrades: { 
            ...prev.upgrades, 
            druidCircle: prev.upgrades.druidCircle + 0.4 
          } 
        }),
        magicPower: type === 'ancientRoots' ? prev.magicPower + 2 : prev.magicPower,
      }));

      toast({
        title: "🌟 UPGRADE BLESSED!",
        description: `${type} enhanced by forest magic!`,
        duration: 2000,
      });
    }
  }, [gameState.essence, toast]);

  const getSeasonEmoji = (season: string) => {
    switch (season) {
      case 'spring': return '🌱';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring': return 'text-green-400';
      case 'summer': return 'text-yellow-400';
      case 'autumn': return 'text-orange-400';
      case 'winter': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${magicRipple ? 'transition-all duration-1000 hue-rotate-45' : ''}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent mb-4">
            🌲 Mystic Forest Clicker ✨
          </h1>
          <p className="text-xl text-muted-foreground">
            Gather mystical essence and commune with ancient forest spirits!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Forest Essence</p>
              <p className="text-2xl font-bold text-emerald-400">{Math.floor(gameState.essence).toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-violet-400/30 shadow-[0_0_20px_rgba(167,139,250,0.3)]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Magic Power</p>
              <p className="text-2xl font-bold text-violet-400">{gameState.magicPower}x</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blue-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Forest Harmony</p>
              <Progress value={gameState.forestHarmony} className="mb-2" />
              <p className="text-lg font-bold text-blue-400">{gameState.forestHarmony.toFixed(1)}%</p>
            </div>
          </Card>
          
          <Card className={`p-4 bg-card/80 backdrop-blur-sm border-yellow-400/30`}>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Season</p>
              <p className={`text-2xl font-bold ${getSeasonColor(gameState.seasons.current)}`}>
                {getSeasonEmoji(gameState.seasons.current)} {gameState.seasons.current}
              </p>
              <p className="text-xs text-muted-foreground">{60 - gameState.seasons.timer}s left</p>
            </div>
          </Card>
        </div>

        {/* Active Effects */}
        {(activeMysticEffect || isStormfront) && (
          <div className="mb-6 flex justify-center">
            {activeMysticEffect && (
              <Badge variant="outline" className="mr-2 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                ✨ {activeMysticEffect.name} ({activeMysticEffect.multiplier}x)
              </Badge>
            )}
            {isStormfront && (
              <Badge variant="destructive" className="border-purple-400 text-purple-400 animate-pulse shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                🌩️ MYSTICAL STORMFRONT! (4x Multiplier)
              </Badge>
            )}
          </div>
        )}

        {/* Storm Progress */}
        {isStormfront && (
          <div className="mb-6">
            <p className="text-center text-purple-400 mb-2">⚡ STORM ENERGY GATHERING!</p>
            <Progress value={stormProgress} className="bg-purple-500/20" />
          </div>
        )}

        {/* Main Clicking Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Button
              onClick={handleSnackClick}
              size="lg"
              className={`
                text-8xl p-8 h-auto bg-card/50 hover:bg-card/70 border-2 border-emerald-400/50 
                hover:border-emerald-400 transition-all duration-200 backdrop-blur-sm
                ${clickAnimation ? 'scale-110 shadow-[0_0_40px_rgba(52,211,153,0.6)]' : ''}
                ${isStormfront ? 'animate-pulse border-purple-400 shadow-[0_0_30px_rgba(167,139,250,0.6)]' : ''}
                hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]
              `}
            >
              {currentSnack.emoji}
            </Button>
            
            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className={`absolute pointer-events-none text-xl font-bold animate-ping ${
                  particle.type === 'storm' ? 'text-purple-400' : 
                  particle.type === 'magic' ? 'text-violet-400' : 'text-emerald-400'
                }`}
                style={{
                  left: particle.x,
                  top: particle.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                +{currentSnack.baseValue}
              </div>
            ))}
          </div>
        </div>

        {/* Current Snack Info */}
        <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border-emerald-400/30 text-center">
          <h3 className="text-2xl font-bold text-emerald-400 mb-2">{currentSnack.name}</h3>
          <p className="text-muted-foreground">{currentSnack.description}</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <p className="text-lg font-semibold">Base Value: {currentSnack.baseValue} Essence</p>
            <Badge className={`${getSeasonColor(currentSnack.season)}`}>
              {getSeasonEmoji(currentSnack.season)} {currentSnack.season}
            </Badge>
          </div>
        </Card>

        {/* Upgrades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-emerald-400/30">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">🌳 Ancient Roots</h3>
            <p className="text-sm text-muted-foreground mb-3">Connect with elder trees for greater magic power</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.ancientRoots}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.ancientRoots + 1) * 200} Essence</p>
            <Button 
              onClick={() => purchaseUpgrade('ancientRoots', (gameState.upgrades.ancientRoots + 1) * 200)}
              disabled={gameState.essence < (gameState.upgrades.ancientRoots + 1) * 200}
              className="w-full"
              variant="outline"
            >
              Awaken (+2 Magic Power)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-violet-400/30">
            <h3 className="text-xl font-bold text-violet-400 mb-3">⭐ Starlight</h3>
            <p className="text-sm text-muted-foreground mb-3">Channel celestial energies</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.starlight}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.starlight + 1) * 400} Essence</p>
            <Button 
              onClick={() => purchaseUpgrade('starlight', (gameState.upgrades.starlight + 1) * 400)}
              disabled={gameState.essence < (gameState.upgrades.starlight + 1) * 400}
              className="w-full"
              variant="outline"
            >
              Channel (Moon Bonus +10%)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">🔮 Druid Circle</h3>
            <p className="text-sm text-muted-foreground mb-3">Amplify all essence gathering</p>
            <p className="text-lg mb-3">Level: {gameState.upgrades.druidCircle}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor(gameState.upgrades.druidCircle * 800)} Essence</p>
            <Button 
              onClick={() => purchaseUpgrade('druidCircle', Math.floor(gameState.upgrades.druidCircle * 800))}
              disabled={gameState.essence < Math.floor(gameState.upgrades.druidCircle * 800)}
              className="w-full"
              variant="outline"
            >
              Expand (+0.4x Multiplier)
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};