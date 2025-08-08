import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface GalaxySnack {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  description: string;
  starRating: number;
  planet: string;
}

interface GameState {
  starDust: number;
  cosmicPower: number;
  warpDrive: number;
  shieldIntegrity: number;
  snacks: GalaxySnack[];
  activeEffects: string[];
  currentPlanet: string;
  exploredPlanets: string[];
  upgrades: {
    hyperdrive: number;
    stellarCompass: number;
    cosmicAmplifier: number;
  };
}

interface CosmicEffect {
  name: string;
  duration: number;
  multiplier: number;
  description: string;
}

const GALAXY_SNACKS: GalaxySnack[] = [
  { id: 'meteorite', name: 'Meteorite Munchies', emoji: '☄️', baseValue: 1, description: 'Crunchy space rocks', starRating: 1, planet: 'Asteroid Belt' },
  { id: 'space_fruit', name: 'Zero-G Grapes', emoji: '🍇', baseValue: 3, description: 'Floating fruit from Kepler-442b', starRating: 2, planet: 'Kepler-442b' },
  { id: 'nova_nuts', name: 'Supernova Nuts', emoji: '🥜', baseValue: 5, description: 'Exploding with flavor', starRating: 3, planet: 'Proxima B' },
  { id: 'plasma_pie', name: 'Plasma Pie', emoji: '🥧', baseValue: 8, description: 'Hot as a star\'s core', starRating: 4, planet: 'Titan' },
  { id: 'dark_matter', name: 'Dark Matter Donuts', emoji: '🍩', baseValue: 12, description: 'Invisible until you bite', starRating: 5, planet: 'Andromeda' },
  { id: 'galaxy_cake', name: 'Galaxy Spiral Cake', emoji: '🎂', baseValue: 20, description: 'Contains entire solar systems', starRating: 6, planet: 'Milky Way Core' },
  { id: 'universe_smoothie', name: 'Universe Smoothie', emoji: '🥤', baseValue: 35, description: 'Blend of cosmic energies', starRating: 7, planet: 'Multiverse Hub' },
];

const COSMIC_EFFECTS: CosmicEffect[] = [
  { name: 'Solar Flare', duration: 5000, multiplier: 3, description: 'Stellar radiation supercharges your snacks!' },
  { name: 'Wormhole Boost', duration: 8000, multiplier: 2.5, description: 'Space-time tunnel accelerates gathering!' },
  { name: 'Pulsar Pulse', duration: 6000, multiplier: 4, description: 'Neutron star rhythms energize the cosmos!' },
  { name: 'Big Bang Echo', duration: 10000, multiplier: 5, description: 'Primordial energy flows through everything!' },
  { name: 'Black Hole Gravity', duration: 4000, multiplier: 6, description: 'Infinite density pulls in infinite snacks!' },
];

const PLANETS = [
  'Earth', 'Mars', 'Jupiter', 'Saturn', 'Kepler-442b', 'Proxima B', 
  'Titan', 'Europa', 'Enceladus', 'Andromeda', 'Milky Way Core', 'Multiverse Hub'
];

export const GalaxyMunchClicker: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    starDust: 0,
    cosmicPower: 1,
    warpDrive: 1,
    shieldIntegrity: 100,
    snacks: GALAXY_SNACKS,
    activeEffects: [],
    currentPlanet: 'Earth',
    exploredPlanets: ['Earth'],
    upgrades: {
      hyperdrive: 0,
      stellarCompass: 0,
      cosmicAmplifier: 1,
    },
  });

  const [currentSnack, setCurrentSnack] = useState<GalaxySnack>(GALAXY_SNACKS[0]);
  const [isAsteroidStorm, setIsAsteroidStorm] = useState(false);
  const [stormProgress, setStormProgress] = useState(0);
  const [activeCosmicEffect, setActiveCosmicEffect] = useState<CosmicEffect | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [warpEffect, setWarpEffect] = useState(false);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  const [starField, setStarField] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  
  const stormTimer = useRef<NodeJS.Timeout>();
  const effectTimer = useRef<NodeJS.Timeout>();
  const warpTimer = useRef<NodeJS.Timeout>();

  // Generate initial starfield
  useEffect(() => {
    const stars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setStarField(stars);
  }, []);

  // Auto-save
  useEffect(() => {
    const saved = localStorage.getItem('galaxyMunchGame');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load galactic data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('galaxyMunchGame', JSON.stringify(gameState));
  }, [gameState]);

  // Planet exploration and snack rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        // Possibly discover new planet
        if (Math.random() < 0.3 && gameState.exploredPlanets.length < PLANETS.length) {
          const unexplored = PLANETS.filter(p => !gameState.exploredPlanets.includes(p));
          if (unexplored.length > 0) {
            const newPlanet = unexplored[Math.floor(Math.random() * unexplored.length)];
            setGameState(prev => ({
              ...prev,
              exploredPlanets: [...prev.exploredPlanets, newPlanet],
              currentPlanet: newPlanet,
            }));
            
            toast({
              title: `🌍 NEW PLANET DISCOVERED!`,
              description: `Welcome to ${newPlanet}! New snacks await!`,
              duration: 4000,
            });
          }
        }
        
        // Change snack based on current planet
        const planetSnacks = GALAXY_SNACKS.filter(snack => 
          snack.planet === gameState.currentPlanet || Math.random() < 0.3
        );
        const availableSnacks = planetSnacks.length > 0 ? planetSnacks : GALAXY_SNACKS;
        const randomSnack = availableSnacks[Math.floor(Math.random() * availableSnacks.length)];
        setCurrentSnack(randomSnack);
        
        if (Math.random() < 0.1) {
          triggerWarpEffect();
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [gameState.currentPlanet, gameState.exploredPlanets, toast]);

  // Asteroid Storm
  useEffect(() => {
    const triggerAsteroidStorm = () => {
      if (Math.random() < 0.05) {
        setIsAsteroidStorm(true);
        setStormProgress(0);
        
        const duration = 18000; // 18 seconds
        const startTime = Date.now();
        
        stormTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed / duration) * 100;
          
          if (progress >= 100) {
            setIsAsteroidStorm(false);
            setStormProgress(0);
            clearInterval(stormTimer.current);
          } else {
            setStormProgress(progress);
          }
        }, 100);

        toast({
          title: "☄️ ASTEROID STORM INCOMING!",
          description: "Dodge asteroids and munch on cosmic debris for massive rewards!",
          duration: 4000,
        });
      }
    };

    const interval = setInterval(triggerAsteroidStorm, 22000);
    return () => {
      clearInterval(interval);
      if (stormTimer.current) clearInterval(stormTimer.current);
    };
  }, [toast]);

  const triggerCosmicEffect = useCallback(() => {
    if (activeCosmicEffect) return;

    const effect = COSMIC_EFFECTS[Math.floor(Math.random() * COSMIC_EFFECTS.length)];
    setActiveCosmicEffect(effect);

    toast({
      title: `🌟 ${effect.name}`,
      description: effect.description,
      duration: 3000,
    });

    effectTimer.current = setTimeout(() => {
      setActiveCosmicEffect(null);
    }, effect.duration);
  }, [activeCosmicEffect, toast]);

  const triggerWarpEffect = useCallback(() => {
    setWarpEffect(true);
    
    // Warp to random explored planet
    const randomPlanet = gameState.exploredPlanets[Math.floor(Math.random() * gameState.exploredPlanets.length)];
    setGameState(prev => ({ ...prev, currentPlanet: randomPlanet }));

    toast({
      title: "🚀 WARP JUMP!",
      description: `Traveling through hyperspace to ${randomPlanet}!`,
      duration: 2500,
    });

    warpTimer.current = setTimeout(() => {
      setWarpEffect(false);
    }, 2500);
  }, [gameState.exploredPlanets, toast]);

  const createParticleEffect = useCallback((x: number, y: number, type: string = 'stardust') => {
    const newParticle = { id: Date.now(), x, y, type };
    setParticleEffects(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1800);
  }, []);

  const handleSnackClick = useCallback((event: React.MouseEvent) => {
    let starDustEarned = currentSnack.baseValue * gameState.cosmicPower;
    
    // Star rating bonus
    const starBonus = 1 + (currentSnack.starRating * 0.2);
    starDustEarned *= starBonus;
    
    // Planet exploration bonus
    const explorationBonus = 1 + (gameState.exploredPlanets.length * 0.1);
    starDustEarned *= explorationBonus;
    
    if (activeCosmicEffect) {
      starDustEarned *= activeCosmicEffect.multiplier;
    }

    if (isAsteroidStorm) {
      starDustEarned *= 5; // 5x during asteroid storms
    }

    starDustEarned *= gameState.upgrades.cosmicAmplifier;

    setGameState(prev => ({
      ...prev,
      starDust: prev.starDust + Math.floor(starDustEarned),
      shieldIntegrity: Math.max(0, prev.shieldIntegrity - 0.2),
    }));

    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 300);

    const rect = event.currentTarget.getBoundingClientRect();
    const particleType = isAsteroidStorm ? 'asteroid' : activeCosmicEffect ? 'cosmic' : 'stardust';
    createParticleEffect(
      event.clientX - rect.left,
      event.clientY - rect.top,
      particleType
    );

    if (Math.random() < 0.09) {
      triggerCosmicEffect();
    }

    if (Math.random() < 0.06) {
      triggerWarpEffect();
    }
  }, [currentSnack, gameState, activeCosmicEffect, isAsteroidStorm, triggerCosmicEffect, triggerWarpEffect, createParticleEffect]);

  const purchaseUpgrade = useCallback((type: keyof typeof gameState.upgrades, cost: number) => {
    if (gameState.starDust >= cost) {
      setGameState(prev => ({
        ...prev,
        starDust: prev.starDust - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1,
        },
        ...(type === 'cosmicAmplifier' && { 
          upgrades: { 
            ...prev.upgrades, 
            cosmicAmplifier: prev.upgrades.cosmicAmplifier + 0.6 
          } 
        }),
        cosmicPower: type === 'hyperdrive' ? prev.cosmicPower + 3 : prev.cosmicPower,
        warpDrive: type === 'stellarCompass' ? prev.warpDrive + 1 : prev.warpDrive,
      }));

      toast({
        title: "🚀 UPGRADE INSTALLED!",
        description: `${type} enhanced with galactic technology!`,
        duration: 2000,
      });
    }
  }, [gameState.starDust, toast]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${warpEffect ? 'transition-all duration-1000 brightness-200 contrast-150' : ''}`}>
      {/* Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20" />
        {starField.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="absolute top-1/5 left-1/5 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/5 right-1/5 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            🌌 Galaxy Munch Clicker 🚀
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore the cosmos and devour intergalactic snacks!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Star Dust</p>
              <p className="text-2xl font-bold text-blue-400">{Math.floor(gameState.starDust).toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Cosmic Power</p>
              <p className="text-2xl font-bold text-purple-400">{gameState.cosmicPower}x</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-pink-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Shield Integrity</p>
              <Progress value={gameState.shieldIntegrity} className="mb-2" />
              <p className="text-lg font-bold text-pink-400">{gameState.shieldIntegrity.toFixed(1)}%</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cyan-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Planet</p>
              <p className="text-lg font-bold text-cyan-400">🌍 {gameState.currentPlanet}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-yellow-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Explored</p>
              <p className="text-2xl font-bold text-yellow-400">{gameState.exploredPlanets.length}/{PLANETS.length}</p>
            </div>
          </Card>
        </div>

        {/* Active Effects */}
        {(activeCosmicEffect || isAsteroidStorm) && (
          <div className="mb-6 flex justify-center">
            {activeCosmicEffect && (
              <Badge variant="outline" className="mr-2 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                🌟 {activeCosmicEffect.name} ({activeCosmicEffect.multiplier}x)
              </Badge>
            )}
            {isAsteroidStorm && (
              <Badge variant="destructive" className="border-orange-400 text-orange-400 animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]">
                ☄️ ASTEROID STORM! (5x Multiplier)
              </Badge>
            )}
          </div>
        )}

        {/* Storm Progress */}
        {isAsteroidStorm && (
          <div className="mb-6">
            <p className="text-center text-orange-400 mb-2">☄️ COSMIC DEBRIS INCOMING!</p>
            <Progress value={stormProgress} className="bg-orange-500/20" />
          </div>
        )}

        {/* Main Clicking Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Button
              onClick={handleSnackClick}
              size="lg"
              className={`
                text-8xl p-8 h-auto bg-card/50 hover:bg-card/70 border-2 border-blue-400/50 
                hover:border-blue-400 transition-all duration-200 backdrop-blur-sm
                ${clickAnimation ? 'scale-110 shadow-[0_0_40px_rgba(59,130,246,0.6)]' : ''}
                ${isAsteroidStorm ? 'animate-pulse border-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.6)]' : ''}
                hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
              `}
            >
              {currentSnack.emoji}
            </Button>
            
            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className={`absolute pointer-events-none text-xl font-bold animate-ping ${
                  particle.type === 'asteroid' ? 'text-orange-400' : 
                  particle.type === 'cosmic' ? 'text-purple-400' : 'text-blue-400'
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
        <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border-blue-400/30 text-center">
          <h3 className="text-2xl font-bold text-blue-400 mb-2">{currentSnack.name}</h3>
          <p className="text-muted-foreground">{currentSnack.description}</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <p className="text-lg font-semibold">Base Value: {currentSnack.baseValue} Star Dust</p>
            <Badge className="text-yellow-400">
              ⭐ {currentSnack.starRating} Stars
            </Badge>
            <Badge className="text-cyan-400">
              🌍 {currentSnack.planet}
            </Badge>
          </div>
        </Card>

        {/* Upgrades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blue-400/30">
            <h3 className="text-xl font-bold text-blue-400 mb-3">🚀 Hyperdrive</h3>
            <p className="text-sm text-muted-foreground mb-3">Boost cosmic power with faster-than-light engines</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.hyperdrive}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.hyperdrive + 1) * 250} Star Dust</p>
            <Button 
              onClick={() => purchaseUpgrade('hyperdrive', (gameState.upgrades.hyperdrive + 1) * 250)}
              disabled={gameState.starDust < (gameState.upgrades.hyperdrive + 1) * 250}
              className="w-full"
              variant="outline"
            >
              Install (+3 Cosmic Power)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-purple-400/30">
            <h3 className="text-xl font-bold text-purple-400 mb-3">🧭 Stellar Compass</h3>
            <p className="text-sm text-muted-foreground mb-3">Navigate to distant galaxies</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.stellarCompass}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.stellarCompass + 1) * 500} Star Dust</p>
            <Button 
              onClick={() => purchaseUpgrade('stellarCompass', (gameState.upgrades.stellarCompass + 1) * 500)}
              disabled={gameState.starDust < (gameState.upgrades.stellarCompass + 1) * 500}
              className="w-full"
              variant="outline"
            >
              Calibrate (+1 Warp Drive)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-pink-400/30">
            <h3 className="text-xl font-bold text-pink-400 mb-3">⚡ Cosmic Amplifier</h3>
            <p className="text-sm text-muted-foreground mb-3">Amplify all star dust collection</p>
            <p className="text-lg mb-3">Level: {gameState.upgrades.cosmicAmplifier}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor(gameState.upgrades.cosmicAmplifier * 1000)} Star Dust</p>
            <Button 
              onClick={() => purchaseUpgrade('cosmicAmplifier', Math.floor(gameState.upgrades.cosmicAmplifier * 1000))}
              disabled={gameState.starDust < Math.floor(gameState.upgrades.cosmicAmplifier * 1000)}
              className="w-full"
              variant="outline"
            >
              Amplify (+0.6x Multiplier)
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};