import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CrossGameProgress {
  totalClicks: number;
  totalResources: number;
  totalPlayTime: number;
  gamesCompleted: number;
  secretsFound: number;
  achievementsUnlocked: number;
  realityLevel: number;
  omnivoreProgress: number;
}

interface GlobalBonus {
  id: string;
  name: string;
  description: string;
  effect: string;
  requirement: {
    type: 'total_resources' | 'cross_game' | 'time_played' | 'secrets' | 'achievements';
    threshold: number;
  };
  unlocked: boolean;
  multiplier: number;
}

interface RealityLayer {
  level: number;
  name: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  effects: string[];
  cosmicTruth: number;
}

const GLOBAL_BONUSES: GlobalBonus[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'The journey of a thousand clicks begins with one',
    effect: '+10% resources in all games',
    requirement: { type: 'total_resources', threshold: 1000 },
    unlocked: false,
    multiplier: 1.1
  },
  {
    id: 'multi_dimensional',
    name: 'Multi-Dimensional Being',
    description: 'You exist across multiple realities',
    effect: '+25% resources when playing multiple games',
    requirement: { type: 'cross_game', threshold: 3 },
    unlocked: false,
    multiplier: 1.25
  },
  {
    id: 'time_lord',
    name: 'Time Lord',
    description: 'Time bends to your will',
    effect: '+50% click power in all time-based events',
    requirement: { type: 'time_played', threshold: 3600 },
    unlocked: false,
    multiplier: 1.5
  },
  {
    id: 'secret_keeper',
    name: 'Keeper of Secrets',
    description: 'You know what others do not',
    effect: 'All hidden mechanics revealed',
    requirement: { type: 'secrets', threshold: 10 },
    unlocked: false,
    multiplier: 1.0
  },
  {
    id: 'achievement_hunter',
    name: 'Achievement Hunter',
    description: 'Perfection in all things',
    effect: '+100% achievement progress rate',
    requirement: { type: 'achievements', threshold: 50 },
    unlocked: false,
    multiplier: 2.0
  },
  {
    id: 'omnivore_initiate',
    name: 'Omnivore Initiate',
    description: 'The hunger awakens within you',
    effect: 'Cross-game resource sharing unlocked',
    requirement: { type: 'total_resources', threshold: 1000000 },
    unlocked: false,
    multiplier: 1.0
  }
];

const REALITY_LAYERS: RealityLayer[] = [
  {
    level: 1,
    name: 'Base Reality',
    description: 'The illusion of separation between games',
    requirement: 'Default state',
    unlocked: true,
    effects: ['Normal gameplay'],
    cosmicTruth: 0
  },
  {
    level: 2,
    name: 'Pattern Recognition',
    description: 'You begin to see the connections',
    requirement: 'Play all 5 games',
    unlocked: false,
    effects: ['Cross-game hints', 'Shared multipliers'],
    cosmicTruth: 20
  },
  {
    level: 3,
    name: 'Dimensional Awareness',
    description: 'The barriers between realities thin',
    requirement: 'Unlock 5 global bonuses',
    unlocked: false,
    effects: ['Resource overflow', 'Parallel progression'],
    cosmicTruth: 40
  },
  {
    level: 4,
    name: 'Quantum Consciousness',
    description: 'You exist in multiple states simultaneously',
    requirement: 'Find 15 secrets across all games',
    unlocked: false,
    effects: ['Quantum clicking', 'Reality manipulation'],
    cosmicTruth: 60
  },
  {
    level: 5,
    name: 'The Awakening',
    description: 'You understand the true nature of the game',
    requirement: 'Complete the Omnivore Protocol',
    unlocked: false,
    effects: ['Entity communication', 'Universal transcendence'],
    cosmicTruth: 80
  },
  {
    level: 6,
    name: 'Beyond Reality',
    description: 'You have become something else entirely',
    requirement: 'Achieve the impossible',
    unlocked: false,
    effects: ['Godmode', 'Reality creation', 'Infinite potential'],
    cosmicTruth: 100
  }
];

interface MetaProgressTrackerProps {
  allGameStates: Record<string, any>;
  secretsFound: number;
  achievementsUnlocked: number;
  onBonusUnlocked?: (bonus: GlobalBonus) => void;
  onRealityShift?: (layer: RealityLayer) => void;
}

export const MetaProgressTracker: React.FC<MetaProgressTrackerProps> = ({
  allGameStates,
  secretsFound,
  achievementsUnlocked,
  onBonusUnlocked,
  onRealityShift
}) => {
  const { toast } = useToast();
  const [crossGameProgress, setCrossGameProgress] = useState<CrossGameProgress>({
    totalClicks: 0,
    totalResources: 0,
    totalPlayTime: 0,
    gamesCompleted: 0,
    secretsFound: 0,
    achievementsUnlocked: 0,
    realityLevel: 1,
    omnivoreProgress: 0
  });
  
  const [globalBonuses, setGlobalBonuses] = useState<GlobalBonus[]>(GLOBAL_BONUSES);
  const [realityLayers, setRealityLayers] = useState<RealityLayer[]>(REALITY_LAYERS);
  const [showMetaView, setShowMetaView] = useState(false);
  const [cosmicInsight, setCosmicInsight] = useState(0);

  // Load meta progress
  useEffect(() => {
    const saved = localStorage.getItem('metaProgress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCrossGameProgress(data.crossGameProgress || crossGameProgress);
        setGlobalBonuses(data.globalBonuses || GLOBAL_BONUSES);
        setRealityLayers(data.realityLayers || REALITY_LAYERS);
        setCosmicInsight(data.cosmicInsight || 0);
      } catch (e) {
        console.log('Failed to load meta progress');
      }
    }
  }, []);

  // Save meta progress
  useEffect(() => {
    const data = {
      crossGameProgress,
      globalBonuses,
      realityLayers,
      cosmicInsight
    };
    localStorage.setItem('metaProgress', JSON.stringify(data));
  }, [crossGameProgress, globalBonuses, realityLayers, cosmicInsight]);

  // Calculate cross-game progress
  useEffect(() => {
    const totalResources = calculateTotalResources(allGameStates);
    const totalClicks = calculateTotalClicks(allGameStates);
    const totalPlayTime = calculateTotalPlayTime(allGameStates);
    const gamesCompleted = calculateGamesCompleted(allGameStates);
    
    setCrossGameProgress(prev => ({
      ...prev,
      totalResources,
      totalClicks,
      totalPlayTime,
      gamesCompleted,
      secretsFound,
      achievementsUnlocked
    }));
  }, [allGameStates, secretsFound, achievementsUnlocked]);

  // Check for bonus unlocks
  useEffect(() => {
    globalBonuses.forEach(bonus => {
      if (bonus.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (bonus.requirement.type) {
        case 'total_resources':
          shouldUnlock = crossGameProgress.totalResources >= bonus.requirement.threshold;
          break;
        case 'cross_game':
          shouldUnlock = Object.keys(allGameStates).length >= bonus.requirement.threshold;
          break;
        case 'time_played':
          shouldUnlock = crossGameProgress.totalPlayTime >= bonus.requirement.threshold;
          break;
        case 'secrets':
          shouldUnlock = crossGameProgress.secretsFound >= bonus.requirement.threshold;
          break;
        case 'achievements':
          shouldUnlock = crossGameProgress.achievementsUnlocked >= bonus.requirement.threshold;
          break;
      }
      
      if (shouldUnlock) {
        unlockGlobalBonus(bonus.id);
      }
    });
  }, [crossGameProgress, allGameStates, globalBonuses]);

  // Check for reality layer unlocks
  useEffect(() => {
    realityLayers.forEach(layer => {
      if (layer.unlocked || layer.level <= crossGameProgress.realityLevel) return;
      
      let shouldUnlock = false;
      
      switch (layer.requirement) {
        case 'Play all 5 games':
          shouldUnlock = Object.keys(allGameStates).length >= 5;
          break;
        case 'Unlock 5 global bonuses':
          shouldUnlock = globalBonuses.filter(b => b.unlocked).length >= 5;
          break;
        case 'Find 15 secrets across all games':
          shouldUnlock = crossGameProgress.secretsFound >= 15;
          break;
        case 'Complete the Omnivore Protocol':
          shouldUnlock = crossGameProgress.omnivoreProgress >= 100;
          break;
        case 'Achieve the impossible':
          shouldUnlock = checkImpossibleConditions();
          break;
      }
      
      if (shouldUnlock) {
        unlockRealityLayer(layer.level);
      }
    });
  }, [crossGameProgress, allGameStates, globalBonuses, realityLayers]);

  const calculateTotalResources = (gameStates: Record<string, any>): number => {
    return Object.entries(gameStates).reduce((total, [game, state]) => {
      switch (game) {
        case 'quantum': return total + (state.quantumCrumbs || 0);
        case 'void': return total + (state.souls || 0);
        case 'cyber': return total + (state.bits || 0);
        case 'forest': return total + (state.essence || 0);
        case 'galaxy': return total + (state.starDust || 0);
        default: return total;
      }
    }, 0);
  };

  const calculateTotalClicks = (gameStates: Record<string, any>): number => {
    return Object.values(gameStates).reduce((total, state) => {
      return total + (state.totalClicks || 0);
    }, 0);
  };

  const calculateTotalPlayTime = (gameStates: Record<string, any>): number => {
    return Object.values(gameStates).reduce((total, state) => {
      return total + (state.sessionTime || state.playTime || 0);
    }, 0);
  };

  const calculateGamesCompleted = (gameStates: Record<string, any>): number => {
    const completionThresholds = {
      quantum: 100000,
      void: 50000,
      cyber: 200000,
      forest: 150000,
      galaxy: 300000
    };
    
    return Object.entries(gameStates).filter(([game, state]) => {
      const threshold = completionThresholds[game as keyof typeof completionThresholds];
      const resource = calculateTotalResources({ [game]: state });
      return resource >= threshold;
    }).length;
  };

  const checkImpossibleConditions = (): boolean => {
    return (
      crossGameProgress.totalResources >= 10000000 &&
      crossGameProgress.secretsFound >= 25 &&
      crossGameProgress.achievementsUnlocked >= 100 &&
      crossGameProgress.gamesCompleted >= 5
    );
  };

  const unlockGlobalBonus = useCallback((bonusId: string) => {
    setGlobalBonuses(prev => prev.map(bonus => 
      bonus.id === bonusId ? { ...bonus, unlocked: true } : bonus
    ));
    
    const bonus = globalBonuses.find(b => b.id === bonusId);
    if (bonus) {
      toast({
        title: "🌟 GLOBAL BONUS UNLOCKED!",
        description: `${bonus.name}: ${bonus.effect}`,
        duration: 8000,
      });
      
      onBonusUnlocked?.(bonus);
      
      setCosmicInsight(prev => prev + 10);
    }
  }, [globalBonuses, toast, onBonusUnlocked]);

  const unlockRealityLayer = useCallback((level: number) => {
    setRealityLayers(prev => prev.map(layer => 
      layer.level === level ? { ...layer, unlocked: true } : layer
    ));
    
    setCrossGameProgress(prev => ({ ...prev, realityLevel: level }));
    
    const layer = realityLayers.find(l => l.level === level);
    if (layer) {
      toast({
        title: "🌀 REALITY LAYER UNLOCKED!",
        description: `${layer.name}: ${layer.description}`,
        duration: 10000,
      });
      
      onRealityShift?.(layer);
      
      setCosmicInsight(prev => prev + layer.cosmicTruth);
    }
  }, [realityLayers, toast, onRealityShift]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <>
      {/* Meta Progress Indicator */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setShowMetaView(!showMetaView)}
          className="bg-purple-900/80 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-800/80"
        >
          🌌 Meta View
        </Button>
      </div>

      {/* Meta Progress Panel */}
      {showMetaView && (
        <div className="fixed inset-4 z-50 bg-black/90 backdrop-blur-sm rounded-lg border border-purple-500/50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-400">🌌 Meta Progress Tracker</h2>
            <Button
              onClick={() => setShowMetaView(false)}
              variant="ghost"
              className="text-purple-400"
            >
              ✕
            </Button>
          </div>

          {/* Overall Stats */}
          <Card className="p-4 mb-6 bg-purple-900/30 border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-3">🌟 Cosmic Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {crossGameProgress.totalResources.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300">Total Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {crossGameProgress.totalClicks.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {formatTime(crossGameProgress.totalPlayTime)}
                </div>
                <div className="text-sm text-purple-300">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {cosmicInsight}%
                </div>
                <div className="text-sm text-purple-300">Cosmic Insight</div>
              </div>
            </div>
          </Card>

          {/* Reality Layers */}
          <Card className="p-4 mb-6 bg-blue-900/30 border-blue-500/30">
            <h3 className="text-lg font-bold text-blue-300 mb-3">🌀 Reality Layers</h3>
            <div className="space-y-3">
              {realityLayers.map(layer => (
                <div
                  key={layer.level}
                  className={`p-3 rounded-lg border ${
                    layer.unlocked
                      ? 'bg-blue-800/50 border-blue-400/50'
                      : layer.level === crossGameProgress.realityLevel + 1
                      ? 'bg-yellow-800/30 border-yellow-400/30'
                      : 'bg-gray-800/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-blue-300">
                        Layer {layer.level}: {layer.name}
                      </div>
                      <div className="text-sm text-blue-200">{layer.description}</div>
                    </div>
                    <Badge variant={layer.unlocked ? 'default' : 'outline'}>
                      {layer.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </div>
                  <div className="text-xs text-blue-100">
                    Requirement: {layer.requirement}
                  </div>
                  {layer.unlocked && (
                    <div className="text-xs text-blue-200 mt-1">
                      Effects: {layer.effects.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Global Bonuses */}
          <Card className="p-4 bg-green-900/30 border-green-500/30">
            <h3 className="text-lg font-bold text-green-300 mb-3">🌟 Global Bonuses</h3>
            <div className="grid gap-3">
              {globalBonuses.map(bonus => (
                <div
                  key={bonus.id}
                  className={`p-3 rounded-lg border ${
                    bonus.unlocked
                      ? 'bg-green-800/50 border-green-400/50'
                      : 'bg-gray-800/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-green-300">{bonus.name}</div>
                      <div className="text-sm text-green-200">{bonus.description}</div>
                    </div>
                    <Badge variant={bonus.unlocked ? 'default' : 'outline'}>
                      {bonus.unlocked ? 'Active' : 'Locked'}
                    </Badge>
                  </div>
                  <div className="text-xs text-green-100">
                    Effect: {bonus.effect}
                  </div>
                  {!bonus.unlocked && (
                    <div className="text-xs text-green-200 mt-1">
                      Requirement: {bonus.requirement.threshold.toLocaleString()} {bonus.requirement.type.replace('_', ' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};