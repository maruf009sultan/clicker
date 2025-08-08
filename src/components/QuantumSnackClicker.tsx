import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Snack {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  description: string;
}

interface GameState {
  quantumCrumbs: number;
  clickPower: number;
  timeSpeed: number;
  realityStability: number;
  snacks: Snack[];
  activeEffects: string[];
  upgrades: {
    timeAnchors: number;
    realityTuners: number;
    cosmicMultiplier: number;
  };
}

interface TimeEffect {
  name: string;
  duration: number;
  multiplier: number;
  description: string;
}

const COSMIC_SNACKS: Snack[] = [
  { id: 'taco', name: 'Time-Twisting Taco', emoji: '🌮', baseValue: 1, description: 'Bends spacetime with every bite' },
  { id: 'waffle', name: 'Wormhole Waffle', emoji: '🧇', baseValue: 3, description: 'Creates delicious dimensional rifts' },
  { id: 'donut', name: 'Quantum Donut', emoji: '🍩', baseValue: 5, description: 'Exists in multiple universes simultaneously' },
  { id: 'pizza', name: 'Nebula Pizza', emoji: '🍕', baseValue: 8, description: 'Topped with stardust and possibility' },
  { id: 'burger', name: 'Black Hole Burger', emoji: '🍔', baseValue: 12, description: 'So dense it warps reality' },
];

const TIME_EFFECTS: TimeEffect[] = [
  { name: 'Time Acceleration', duration: 5000, multiplier: 2, description: 'Time flows faster!' },
  { name: 'Slow Motion', duration: 3000, multiplier: 0.5, description: 'Everything slows down, but rewards double!' },
  { name: 'Quantum Rewind', duration: 2000, multiplier: 3, description: 'Time reverses with bonus multiplier!' },
  { name: 'Reality Flux', duration: 4000, multiplier: 1.5, description: 'Reality becomes unstable!' },
];

export const QuantumSnackClicker: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    quantumCrumbs: 0,
    clickPower: 1,
    timeSpeed: 1,
    realityStability: 100,
    snacks: COSMIC_SNACKS,
    activeEffects: [],
    upgrades: {
      timeAnchors: 0,
      realityTuners: 0,
      cosmicMultiplier: 1,
    },
  });

  const [currentSnack, setCurrentSnack] = useState<Snack>(COSMIC_SNACKS[0]);
  const [isEventHorizon, setIsEventHorizon] = useState(false);
  const [eventHorizonProgress, setEventHorizonProgress] = useState(0);
  const [activeTimeEffect, setActiveTimeEffect] = useState<TimeEffect | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [realityGlitch, setRealityGlitch] = useState(false);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const eventHorizonTimer = useRef<NodeJS.Timeout>();
  const effectTimer = useRef<NodeJS.Timeout>();
  const glitchTimer = useRef<NodeJS.Timeout>();

  // Auto-save game state
  useEffect(() => {
    const saved = localStorage.getItem('quantumSnackGame');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load save data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quantumSnackGame', JSON.stringify(gameState));
  }, [gameState]);

  // Random snack rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomSnack = COSMIC_SNACKS[Math.floor(Math.random() * COSMIC_SNACKS.length)];
        setCurrentSnack(randomSnack);
        
        if (Math.random() < 0.1) {
          triggerRealityGlitch();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Event Horizon mode
  useEffect(() => {
    const triggerEventHorizon = () => {
      if (Math.random() < 0.05) { // 5% chance every check
        setIsEventHorizon(true);
        setEventHorizonProgress(0);
        
        const duration = 10000; // 10 seconds
        const startTime = Date.now();
        
        eventHorizonTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed / duration) * 100;
          
          if (progress >= 100) {
            setIsEventHorizon(false);
            setEventHorizonProgress(0);
            clearInterval(eventHorizonTimer.current);
          } else {
            setEventHorizonProgress(progress);
          }
        }, 100);

        toast({
          title: "🕳️ EVENT HORIZON DETECTED!",
          description: "Click fast to escape the black hole and earn massive bonuses!",
          duration: 3000,
        });
      }
    };

    const interval = setInterval(triggerEventHorizon, 15000);
    return () => {
      clearInterval(interval);
      if (eventHorizonTimer.current) clearInterval(eventHorizonTimer.current);
    };
  }, [toast]);

  const triggerTimeEffect = useCallback(() => {
    if (activeTimeEffect) return;

    const effect = TIME_EFFECTS[Math.floor(Math.random() * TIME_EFFECTS.length)];
    setActiveTimeEffect(effect);

    toast({
      title: `⏰ ${effect.name}`,
      description: effect.description,
      duration: 2000,
    });

    effectTimer.current = setTimeout(() => {
      setActiveTimeEffect(null);
    }, effect.duration);
  }, [activeTimeEffect, toast]);

  const triggerRealityGlitch = useCallback(() => {
    setRealityGlitch(true);
    
    // Shuffle snacks during glitch
    const shuffled = [...COSMIC_SNACKS].sort(() => Math.random() - 0.5);
    setGameState(prev => ({ ...prev, snacks: shuffled }));

    toast({
      title: "⚡ REALITY GLITCH!",
      description: "The universe hiccups! Snacks have been reshuffled!",
      duration: 2000,
    });

    glitchTimer.current = setTimeout(() => {
      setRealityGlitch(false);
      setGameState(prev => ({ ...prev, snacks: COSMIC_SNACKS }));
    }, 2000);
  }, [toast]);

  const createParticleEffect = useCallback((x: number, y: number) => {
    const newParticle = { id: Date.now(), x, y };
    setParticleEffects(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, []);

  const handleSnackClick = useCallback((event: React.MouseEvent) => {
    let crumbsEarned = currentSnack.baseValue * gameState.clickPower;
    
    // Apply time effect multiplier
    if (activeTimeEffect) {
      if (activeTimeEffect.name === 'Slow Motion') {
        crumbsEarned *= 2; // Double rewards in slow motion
      } else {
        crumbsEarned *= activeTimeEffect.multiplier;
      }
    }

    // Event Horizon bonus
    if (isEventHorizon) {
      crumbsEarned *= 5; // 5x multiplier during event horizon
    }

    // Apply cosmic multiplier
    crumbsEarned *= gameState.upgrades.cosmicMultiplier;

    setGameState(prev => ({
      ...prev,
      quantumCrumbs: prev.quantumCrumbs + Math.floor(crumbsEarned),
      realityStability: Math.max(0, prev.realityStability - 1),
    }));

    // Visual effects
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 200);

    // Create particle effect at click position
    const rect = event.currentTarget.getBoundingClientRect();
    createParticleEffect(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    // Random chance to trigger time effect
    if (Math.random() < 0.1) {
      triggerTimeEffect();
    }

    // Random chance to trigger reality glitch
    if (Math.random() < 0.05) {
      triggerRealityGlitch();
    }
  }, [currentSnack, gameState, activeTimeEffect, isEventHorizon, triggerTimeEffect, triggerRealityGlitch, createParticleEffect]);

  const purchaseUpgrade = useCallback((type: keyof typeof gameState.upgrades, cost: number) => {
    if (gameState.quantumCrumbs >= cost) {
      setGameState(prev => ({
        ...prev,
        quantumCrumbs: prev.quantumCrumbs - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1,
        },
        ...(type === 'cosmicMultiplier' && { 
          upgrades: { 
            ...prev.upgrades, 
            cosmicMultiplier: prev.upgrades.cosmicMultiplier + 0.5 
          } 
        }),
        clickPower: type === 'timeAnchors' ? prev.clickPower + 2 : prev.clickPower,
      }));

      toast({
        title: "🚀 Upgrade Purchased!",
        description: `${type} improved!`,
        duration: 2000,
      });
    }
  }, [gameState.quantumCrumbs, toast]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${realityGlitch ? 'reality-glitch' : ''}`}>
      {/* Cosmic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/10 via-transparent to-cosmic-accent/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cosmic-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cosmic-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cosmic-primary to-cosmic-accent bg-clip-text text-transparent mb-4">
            ⚛️ Quantum Snack Clicker 🌌
          </h1>
          <p className="text-xl text-muted-foreground">
            Click cosmic snacks to harvest Quantum Crumbs and bend reality!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-primary/30 quantum-glow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Quantum Crumbs</p>
              <p className="text-2xl font-bold text-cosmic-primary">{Math.floor(gameState.quantumCrumbs).toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-secondary/30 quantum-glow-secondary">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Click Power</p>
              <p className="text-2xl font-bold text-cosmic-secondary">{gameState.clickPower}x</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-accent/30 quantum-glow-accent">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Reality Stability</p>
              <Progress value={gameState.realityStability} className="mb-2" />
              <p className="text-lg font-bold text-cosmic-accent">{gameState.realityStability}%</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-warning/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Cosmic Multiplier</p>
              <p className="text-2xl font-bold text-cosmic-warning">{gameState.upgrades.cosmicMultiplier}x</p>
            </div>
          </Card>
        </div>

        {/* Active Effects */}
        {(activeTimeEffect || isEventHorizon) && (
          <div className="mb-6 flex justify-center">
            {activeTimeEffect && (
              <Badge variant="outline" className="mr-2 border-cosmic-primary text-cosmic-primary quantum-glow">
                ⏰ {activeTimeEffect.name} ({activeTimeEffect.multiplier}x)
              </Badge>
            )}
            {isEventHorizon && (
              <Badge variant="destructive" className="border-destructive text-destructive-foreground animate-pulse">
                🕳️ EVENT HORIZON MODE! (5x Multiplier)
              </Badge>
            )}
          </div>
        )}

        {/* Event Horizon Progress */}
        {isEventHorizon && (
          <div className="mb-6">
            <p className="text-center text-destructive mb-2">⚠️ BLACK HOLE APPROACHING!</p>
            <Progress value={eventHorizonProgress} className="bg-destructive/20" />
          </div>
        )}

        {/* Main Clicking Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Button
              onClick={handleSnackClick}
              size="lg"
              className={`
                text-8xl p-8 h-auto bg-card/50 hover:bg-card/70 border-2 border-cosmic-primary/50 
                hover:border-cosmic-primary transition-all duration-200 backdrop-blur-sm
                ${clickAnimation ? 'scale-110 quantum-glow' : ''}
                ${activeTimeEffect?.name === 'Slow Motion' ? 'time-dilation' : ''}
                ${isEventHorizon ? 'animate-pulse border-destructive' : ''}
                quantum-float
              `}
            >
              {currentSnack.emoji}
            </Button>
            
            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className="absolute pointer-events-none text-cosmic-primary text-xl font-bold animate-ping"
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
        <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border-cosmic-accent/30 text-center">
          <h3 className="text-2xl font-bold text-cosmic-accent mb-2">{currentSnack.name}</h3>
          <p className="text-muted-foreground">{currentSnack.description}</p>
          <p className="text-lg font-semibold mt-2">Base Value: {currentSnack.baseValue} Quantum Crumbs</p>
        </Card>

        {/* Upgrades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-primary/30">
            <h3 className="text-xl font-bold text-cosmic-primary mb-3">⚓ Time Anchors</h3>
            <p className="text-sm text-muted-foreground mb-3">Stabilize time flow and increase click power</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.timeAnchors}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.timeAnchors + 1) * 100} Crumbs</p>
            <Button 
              onClick={() => purchaseUpgrade('timeAnchors', (gameState.upgrades.timeAnchors + 1) * 100)}
              disabled={gameState.quantumCrumbs < (gameState.upgrades.timeAnchors + 1) * 100}
              className="w-full"
              variant="outline"
            >
              Purchase (+2 Click Power)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-secondary/30">
            <h3 className="text-xl font-bold text-cosmic-secondary mb-3">🔧 Reality Tuners</h3>
            <p className="text-sm text-muted-foreground mb-3">Control reality glitch frequency</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.realityTuners}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.realityTuners + 1) * 250} Crumbs</p>
            <Button 
              onClick={() => purchaseUpgrade('realityTuners', (gameState.upgrades.realityTuners + 1) * 250)}
              disabled={gameState.quantumCrumbs < (gameState.upgrades.realityTuners + 1) * 250}
              className="w-full"
              variant="outline"
            >
              Purchase (Stability +10%)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cosmic-accent/30">
            <h3 className="text-xl font-bold text-cosmic-accent mb-3">🌌 Cosmic Multiplier</h3>
            <p className="text-sm text-muted-foreground mb-3">Amplify all quantum crumb gains</p>
            <p className="text-lg mb-3">Level: {gameState.upgrades.cosmicMultiplier}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor((gameState.upgrades.cosmicMultiplier) * 500)} Crumbs</p>
            <Button 
              onClick={() => purchaseUpgrade('cosmicMultiplier', Math.floor((gameState.upgrades.cosmicMultiplier) * 500))}
              disabled={gameState.quantumCrumbs < Math.floor((gameState.upgrades.cosmicMultiplier) * 500)}
              className="w-full"
              variant="outline"
            >
              Purchase (+0.5x Multiplier)
            </Button>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-card/60 backdrop-blur-sm border-cosmic-primary/20">
          <h3 className="text-xl font-bold text-cosmic-primary mb-4">🎮 How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">🖱️ <strong>Click snacks</strong> to earn Quantum Crumbs</p>
              <p className="mb-2">⏰ <strong>Time effects</strong> randomly trigger with special bonuses</p>
              <p className="mb-2">⚡ <strong>Reality glitches</strong> shuffle the universe</p>
            </div>
            <div>
              <p className="mb-2">🕳️ <strong>Event Horizons</strong> appear randomly for massive bonuses</p>
              <p className="mb-2">🚀 <strong>Buy upgrades</strong> to increase your cosmic power</p>
              <p className="mb-2">🌌 <strong>Watch reality bend</strong> as you click your way through dimensions</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};