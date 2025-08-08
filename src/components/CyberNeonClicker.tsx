import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface CyberSnack {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  description: string;
  cyberlevel: number;
}

interface GameState {
  bits: number;
  hackPower: number;
  networkSpeed: number;
  firewall: number;
  snacks: CyberSnack[];
  activeEffects: string[];
  upgrades: {
    processors: number;
    bandwidth: number;
    encryption: number;
  };
}

interface CyberEffect {
  name: string;
  duration: number;
  multiplier: number;
  description: string;
}

const CYBER_SNACKS: CyberSnack[] = [
  { id: 'cookie', name: 'Data Cookie', emoji: '🍪', baseValue: 1, description: 'Basic tracking data', cyberlevel: 1 },
  { id: 'chip', name: 'Memory Chip', emoji: '🍟', baseValue: 3, description: 'Crunchy digital storage', cyberlevel: 2 },
  { id: 'circuit', name: 'Circuit Board', emoji: '🧈', baseValue: 5, description: 'Electric butter spread', cyberlevel: 3 },
  { id: 'energy', name: 'Energy Drink', emoji: '⚡', baseValue: 8, description: 'Liquid electricity', cyberlevel: 4 },
  { id: 'code', name: 'Source Code', emoji: '💽', baseValue: 12, description: 'Raw digital essence', cyberlevel: 5 },
  { id: 'ai', name: 'AI Core', emoji: '🤖', baseValue: 20, description: 'Sentient snack data', cyberlevel: 6 },
];

const CYBER_EFFECTS: CyberEffect[] = [
  { name: 'Overclock', duration: 6000, multiplier: 3, description: 'CPU running at maximum speed!' },
  { name: 'Data Burst', duration: 4000, multiplier: 5, description: 'Information overload detected!' },
  { name: 'Neural Link', duration: 8000, multiplier: 2.5, description: 'Direct brain interface active!' },
  { name: 'Quantum Hack', duration: 5000, multiplier: 4, description: 'Reality.exe has stopped working!' },
];

export const CyberNeonClicker: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    bits: 0,
    hackPower: 1,
    networkSpeed: 1,
    firewall: 100,
    snacks: CYBER_SNACKS,
    activeEffects: [],
    upgrades: {
      processors: 0,
      bandwidth: 0,
      encryption: 1,
    },
  });

  const [currentSnack, setCurrentSnack] = useState<CyberSnack>(CYBER_SNACKS[0]);
  const [isDDOS, setIsDDOS] = useState(false);
  const [ddosProgress, setDDOSProgress] = useState(0);
  const [activeCyberEffect, setActiveCyberEffect] = useState<CyberEffect | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const ddosTimer = useRef<NodeJS.Timeout>();
  const effectTimer = useRef<NodeJS.Timeout>();
  const glitchTimer = useRef<NodeJS.Timeout>();

  // Auto-save
  useEffect(() => {
    const saved = localStorage.getItem('cyberNeonGame');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load cyber data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cyberNeonGame', JSON.stringify(gameState));
  }, [gameState]);

  // Random snack rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        const randomSnack = CYBER_SNACKS[Math.floor(Math.random() * CYBER_SNACKS.length)];
        setCurrentSnack(randomSnack);
        
        if (Math.random() < 0.15) {
          triggerGlitch();
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // DDOS Attack mode
  useEffect(() => {
    const triggerDDOS = () => {
      if (Math.random() < 0.06) {
        setIsDDOS(true);
        setDDOSProgress(0);
        
        const duration = 12000;
        const startTime = Date.now();
        
        ddosTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed / duration) * 100;
          
          if (progress >= 100) {
            setIsDDOS(false);
            setDDOSProgress(0);
            clearInterval(ddosTimer.current);
          } else {
            setDDOSProgress(progress);
          }
        }, 100);

        toast({
          title: "⚠️ DDOS ATTACK DETECTED!",
          description: "Click rapidly to defend your network!",
          duration: 3000,
        });
      }
    };

    const interval = setInterval(triggerDDOS, 18000);
    return () => {
      clearInterval(interval);
      if (ddosTimer.current) clearInterval(ddosTimer.current);
    };
  }, [toast]);

  const triggerCyberEffect = useCallback(() => {
    if (activeCyberEffect) return;

    const effect = CYBER_EFFECTS[Math.floor(Math.random() * CYBER_EFFECTS.length)];
    setActiveCyberEffect(effect);

    toast({
      title: `💻 ${effect.name}`,
      description: effect.description,
      duration: 2000,
    });

    effectTimer.current = setTimeout(() => {
      setActiveCyberEffect(null);
    }, effect.duration);
  }, [activeCyberEffect, toast]);

  const triggerGlitch = useCallback(() => {
    setGlitchMode(true);
    
    const shuffled = [...CYBER_SNACKS].sort(() => Math.random() - 0.5);
    setGameState(prev => ({ ...prev, snacks: shuffled }));

    toast({
      title: "🌈 SYSTEM GLITCH!",
      description: "Neural pathways scrambled! Snacks digitally corrupted!",
      duration: 2000,
    });

    glitchTimer.current = setTimeout(() => {
      setGlitchMode(false);
      setGameState(prev => ({ ...prev, snacks: CYBER_SNACKS }));
    }, 2500);
  }, [toast]);

  const createParticleEffect = useCallback((x: number, y: number) => {
    const newParticle = { id: Date.now(), x, y };
    setParticleEffects(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, []);

  const handleSnackClick = useCallback((event: React.MouseEvent) => {
    let bitsEarned = currentSnack.baseValue * gameState.hackPower;
    
    if (activeCyberEffect) {
      bitsEarned *= activeCyberEffect.multiplier;
    }

    if (isDDOS) {
      bitsEarned *= 6;
    }

    bitsEarned *= gameState.upgrades.encryption;

    setGameState(prev => ({
      ...prev,
      bits: prev.bits + Math.floor(bitsEarned),
      firewall: Math.max(0, prev.firewall - 0.5),
    }));

    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 200);

    const rect = event.currentTarget.getBoundingClientRect();
    createParticleEffect(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    if (Math.random() < 0.12) {
      triggerCyberEffect();
    }

    if (Math.random() < 0.08) {
      triggerGlitch();
    }
  }, [currentSnack, gameState, activeCyberEffect, isDDOS, triggerCyberEffect, triggerGlitch, createParticleEffect]);

  const purchaseUpgrade = useCallback((type: keyof typeof gameState.upgrades, cost: number) => {
    if (gameState.bits >= cost) {
      setGameState(prev => ({
        ...prev,
        bits: prev.bits - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1,
        },
        ...(type === 'encryption' && { 
          upgrades: { 
            ...prev.upgrades, 
            encryption: prev.upgrades.encryption + 0.5 
          } 
        }),
        hackPower: type === 'processors' ? prev.hackPower + 2 : prev.hackPower,
        networkSpeed: type === 'bandwidth' ? prev.networkSpeed + 1 : prev.networkSpeed,
      }));

      toast({
        title: "🔧 UPGRADE INSTALLED!",
        description: `${type} enhanced!`,
        duration: 2000,
      });
    }
  }, [gameState.bits, toast]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${glitchMode ? 'reality-glitch' : ''}`}>
      {/* Cyber Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
        {/* Matrix-style grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            💻 Cyber Neon Clicker 🌈
          </h1>
          <p className="text-xl text-muted-foreground">
            Hack the matrix and consume digital snacks!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cyan-400/30 shadow-[0_0_20px_cyan]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Data Bits</p>
              <p className="text-2xl font-bold text-cyan-400">{Math.floor(gameState.bits).toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blue-400/30 shadow-[0_0_20px_blue]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Hack Power</p>
              <p className="text-2xl font-bold text-blue-400">{gameState.hackPower}x</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-purple-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Firewall</p>
              <Progress value={gameState.firewall} className="mb-2" />
              <p className="text-lg font-bold text-purple-400">{gameState.firewall.toFixed(1)}%</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-green-400/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Encryption</p>
              <p className="text-2xl font-bold text-green-400">{gameState.upgrades.encryption}x</p>
            </div>
          </Card>
        </div>

        {/* Active Effects */}
        {(activeCyberEffect || isDDOS) && (
          <div className="mb-6 flex justify-center">
            {activeCyberEffect && (
              <Badge variant="outline" className="mr-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_cyan]">
                💻 {activeCyberEffect.name} ({activeCyberEffect.multiplier}x)
              </Badge>
            )}
            {isDDOS && (
              <Badge variant="destructive" className="border-red-400 text-red-400 animate-pulse shadow-[0_0_10px_red]">
                ⚠️ DDOS ATTACK! (6x Multiplier)
              </Badge>
            )}
          </div>
        )}

        {/* DDOS Progress */}
        {isDDOS && (
          <div className="mb-6">
            <p className="text-center text-red-400 mb-2">🚨 NETWORK UNDER ATTACK!</p>
            <Progress value={ddosProgress} className="bg-red-500/20" />
          </div>
        )}

        {/* Main Clicking Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Button
              onClick={handleSnackClick}
              size="lg"
              className={`
                text-8xl p-8 h-auto bg-card/50 hover:bg-card/70 border-2 border-cyan-400/50 
                hover:border-cyan-400 transition-all duration-200 backdrop-blur-sm
                ${clickAnimation ? 'scale-110 shadow-[0_0_40px_cyan]' : ''}
                ${isDDOS ? 'animate-pulse border-red-400 shadow-[0_0_30px_red]' : ''}
                hover:shadow-[0_0_25px_cyan]
              `}
            >
              {currentSnack.emoji}
            </Button>
            
            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className="absolute pointer-events-none text-cyan-400 text-xl font-bold animate-ping"
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
        <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border-cyan-400/30 text-center">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">{currentSnack.name}</h3>
          <p className="text-muted-foreground">{currentSnack.description}</p>
          <p className="text-lg font-semibold mt-2">Base Value: {currentSnack.baseValue} Bits</p>
        </Card>

        {/* Upgrades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-cyan-400/30">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">🔧 Processors</h3>
            <p className="text-sm text-muted-foreground mb-3">Upgrade your CPU for more hack power</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.processors}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.processors + 1) * 150} Bits</p>
            <Button 
              onClick={() => purchaseUpgrade('processors', (gameState.upgrades.processors + 1) * 150)}
              disabled={gameState.bits < (gameState.upgrades.processors + 1) * 150}
              className="w-full"
              variant="outline"
            >
              Install (+2 Hack Power)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-blue-400/30">
            <h3 className="text-xl font-bold text-blue-400 mb-3">📡 Bandwidth</h3>
            <p className="text-sm text-muted-foreground mb-3">Increase network speed</p>
            <p className="text-lg mb-3">Owned: {gameState.upgrades.bandwidth}</p>
            <p className="text-sm mb-3">Cost: {(gameState.upgrades.bandwidth + 1) * 300} Bits</p>
            <Button 
              onClick={() => purchaseUpgrade('bandwidth', (gameState.upgrades.bandwidth + 1) * 300)}
              disabled={gameState.bits < (gameState.upgrades.bandwidth + 1) * 300}
              className="w-full"
              variant="outline"
            >
              Upgrade (+1 Speed)
            </Button>
          </Card>

          <Card className="p-4 bg-card/80 backdrop-blur-sm border-green-400/30">
            <h3 className="text-xl font-bold text-green-400 mb-3">🔐 Encryption</h3>
            <p className="text-sm text-muted-foreground mb-3">Amplify all data gains</p>
            <p className="text-lg mb-3">Level: {gameState.upgrades.encryption}x</p>
            <p className="text-sm mb-3">Cost: {Math.floor(gameState.upgrades.encryption * 600)} Bits</p>
            <Button 
              onClick={() => purchaseUpgrade('encryption', Math.floor(gameState.upgrades.encryption * 600))}
              disabled={gameState.bits < Math.floor(gameState.upgrades.encryption * 600)}
              className="w-full"
              variant="outline"
            >
              Encrypt (+0.5x Multiplier)
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};