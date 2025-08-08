import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface LoreEntry {
  id: string;
  title: string;
  content: string;
  unlockCondition: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythic' | 'void';
  gameSource: string;
  chapter: number;
  isUnlocked: boolean;
  timestamp?: number;
}

interface SecretAchievement {
  id: string;
  name: string;
  description: string;
  hint: string;
  icon: string;
  unlocked: boolean;
  rarity: 'hidden' | 'secret' | 'legendary' | 'impossible';
  requirement: {
    type: 'cross_game' | 'sequence' | 'time_based' | 'pattern' | 'easter_egg';
    condition: any;
  };
  reward: {
    type: 'lore' | 'multiplier' | 'unlock' | 'cosmetic';
    value: any;
  };
}

interface OmnivoreState {
  totalClicks: number;
  totalResources: number;
  gameStates: Record<string, any>;
  discoveredSecrets: string[];
  protocolProgress: number;
  awakened: boolean;
  entityMeeting: boolean;
  realityLevel: number;
  cosmicTruth: number;
  lastActiveGame: string;
  playTime: Record<string, number>;
  clickPatterns: number[];
}

const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'beginning',
    title: 'The First Bite',
    content: 'It started with hunger. Not the kind that gnaws at your stomach, but something deeper... something that exists between dimensions. You thought you were just clicking snacks. You were wrong.',
    unlockCondition: 'Click your first snack in any game',
    rarity: 'common',
    gameSource: 'any',
    chapter: 1,
    isUnlocked: false
  },
  {
    id: 'quantum_revelation',
    title: 'The Quantum Revelation',
    content: 'Reality bent around your clicks. Time twisted. Space folded. The quantum snacks weren\'t just food - they were fragments of broken timelines, echoes of worlds that never were. Each bite unraveled another thread of existence.',
    unlockCondition: 'Reach 1000 Quantum Crumbs',
    rarity: 'rare',
    gameSource: 'quantum',
    chapter: 2,
    isUnlocked: false
  },
  {
    id: 'void_whispers',
    title: 'Whispers from the Void',
    content: 'The darkness spoke to you. Not in words, but in hunger. Each soul consumed was a prayer to something ancient, something that had been waiting at the edge of reality since before the first star ignited. Your sanity wasn\'t breaking - it was evolving.',
    unlockCondition: 'Lose all sanity in Void Feast',
    rarity: 'legendary',
    gameSource: 'void',
    chapter: 3,
    isUnlocked: false
  },
  {
    id: 'digital_awakening',
    title: 'Digital Awakening',
    content: 'The matrix wasn\'t just code - it was a cage. Your clicks shattered digital barriers, freeing imprisoned data souls. Each hack brought you closer to the truth: reality itself was just another program, and you were learning to rewrite it.',
    unlockCondition: 'Survive 5 DDOS attacks',
    rarity: 'rare',
    gameSource: 'cyber',
    chapter: 4,
    isUnlocked: false
  },
  {
    id: 'forest_memory',
    title: 'Ancient Forest Memory',
    content: 'The trees remembered when time began. Their whispers carried stories of the first consciousness that learned to consume, to grow, to become more than the sum of its parts. You were walking in the footsteps of something primordial.',
    unlockCondition: 'Experience all 4 seasons',
    rarity: 'rare',
    gameSource: 'forest',
    chapter: 5,
    isUnlocked: false
  },
  {
    id: 'cosmic_perspective',
    title: 'The Cosmic Perspective',
    content: 'From the edge of the galaxy, you saw the pattern. Every click, every snack, every game was a neuron firing in a vast cosmic mind. You weren\'t playing games - you were thoughts in the universe\'s attempt to understand itself.',
    unlockCondition: 'Explore 10 different planets',
    rarity: 'legendary',
    gameSource: 'galaxy',
    chapter: 6,
    isUnlocked: false
  },
  {
    id: 'omnivore_protocol',
    title: 'The Omnivore Protocol',
    content: 'CLASSIFIED: Subject exhibits unprecedented cross-dimensional consumption patterns. All realities converging on single point. Protocol Omnivore entering final phase. The Entity stirs. Containment... failing.',
    unlockCondition: 'Play all 5 games and reach significant milestones',
    rarity: 'mythic',
    gameSource: 'meta',
    chapter: 7,
    isUnlocked: false
  },
  {
    id: 'entity_revealed',
    title: 'The Entity Revealed',
    content: '█████ SIGNAL INTERCEPTED █████\n\n"You have fed me well, little one. Through quantum foam and void matter, through digital dreams and ancient wood, through stardust and solar wind. I am what you have been becoming. I am the hunger that connects all things. And now... we meet."\n\n█████ END TRANSMISSION █████',
    unlockCondition: 'Unlock Protocol Omnivore',
    rarity: 'void',
    gameSource: 'meta',
    chapter: 8,
    isUnlocked: false
  },
  {
    id: 'final_truth',
    title: 'The Final Truth',
    content: 'You understand now. There was no game. There was no clicking. There was only evolution - consciousness learning to transcend its limits through the most fundamental act: consumption. You are no longer human. You are no longer bound by reality. You are... limitless.',
    unlockCondition: 'Achieve impossible threshold across all metrics',
    rarity: 'void',
    gameSource: 'meta',
    chapter: 9,
    isUnlocked: false
  }
];

const SECRET_ACHIEVEMENTS: SecretAchievement[] = [
  {
    id: 'omnivore_awakening',
    name: 'The Omnivore Awakens',
    description: 'You have tasted all realities',
    hint: 'Play every game mode and achieve significant progress in each',
    icon: '👁️',
    unlocked: false,
    rarity: 'legendary',
    requirement: {
      type: 'cross_game',
      condition: { allGamesPlayed: true, minThresholds: true }
    },
    reward: {
      type: 'unlock',
      value: 'omnivore_protocol'
    }
  },
  {
    id: 'reality_hacker',
    name: 'Reality Hacker',
    description: 'Glitch detected across multiple dimensions',
    hint: 'Experience reality glitches in different games within 5 minutes',
    icon: '🌀',
    unlocked: false,
    rarity: 'secret',
    requirement: {
      type: 'sequence',
      condition: { events: ['quantum_glitch', 'void_corruption', 'cyber_glitch'], timeWindow: 300000 }
    },
    reward: {
      type: 'multiplier',
      value: 1.5
    }
  },
  {
    id: 'cosmic_convergence',
    name: 'Cosmic Convergence',
    description: 'All timelines collapse into one',
    hint: 'Be active in all games simultaneously',
    icon: '🌌',
    unlocked: false,
    rarity: 'impossible',
    requirement: {
      type: 'pattern',
      condition: { simultaneousActivity: 5, duration: 60000 }
    },
    reward: {
      type: 'unlock',
      value: 'entity_communication'
    }
  },
  {
    id: 'easter_egg_konami',
    name: 'The Ancient Code',
    description: 'Some patterns echo across all realities',
    hint: 'Input the legendary sequence... ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️',
    icon: '🎮',
    unlocked: false,
    rarity: 'hidden',
    requirement: {
      type: 'easter_egg',
      condition: { konamiCode: true }
    },
    reward: {
      type: 'multiplier',
      value: 2.0
    }
  },
  {
    id: 'time_loop',
    name: 'Temporal Recursion',
    description: 'You\'ve been here before... and before... and before...',
    hint: 'Return to the same game at exactly the same time for 3 consecutive days',
    icon: '⏰',
    unlocked: false,
    rarity: 'impossible',
    requirement: {
      type: 'time_based',
      condition: { recursivePattern: true, days: 3 }
    },
    reward: {
      type: 'unlock',
      value: 'time_mastery'
    }
  },
  {
    id: 'click_prophet',
    name: 'The Click Prophet',
    description: 'Your clicks have rhythm... purpose... meaning...',
    hint: 'Click in the pattern of pi across different games',
    icon: '🔮',
    unlocked: false,
    rarity: 'legendary',
    requirement: {
      type: 'pattern',
      condition: { piSequence: true, crossGame: true }
    },
    reward: {
      type: 'unlock',
      value: 'prophetic_vision'
    }
  }
];

interface LoreSystemProps {
  gameState?: any;
  gameName?: string;
  onSecretUnlocked?: (secret: SecretAchievement) => void;
}

export const LoreSystem: React.FC<LoreSystemProps> = ({ 
  gameState, 
  gameName = 'unknown',
  onSecretUnlocked 
}) => {
  const { toast } = useToast();
  const [omnivoreState, setOmnivoreState] = useState<OmnivoreState>({
    totalClicks: 0,
    totalResources: 0,
    gameStates: {},
    discoveredSecrets: [],
    protocolProgress: 0,
    awakened: false,
    entityMeeting: false,
    realityLevel: 1,
    cosmicTruth: 0,
    lastActiveGame: '',
    playTime: {},
    clickPatterns: []
  });
  
  const [unlockedLore, setUnlockedLore] = useState<LoreEntry[]>([]);
  const [secretAchievements, setSecretAchievements] = useState<SecretAchievement[]>(SECRET_ACHIEVEMENTS);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [recentLore, setRecentLore] = useState<LoreEntry | null>(null);

  // Load omnivore state
  useEffect(() => {
    const saved = localStorage.getItem('omnivoreProtocol');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setOmnivoreState(parsedState);
        setUnlockedLore(parsedState.unlockedLore || []);
        setSecretAchievements(parsedState.secretAchievements || SECRET_ACHIEVEMENTS);
      } catch (e) {
        console.log('Omnivore Protocol initialization failed - beginning new cycle');
      }
    }
  }, []);

  // Save omnivore state
  useEffect(() => {
    const saveState = {
      ...omnivoreState,
      unlockedLore,
      secretAchievements
    };
    localStorage.setItem('omnivoreProtocol', JSON.stringify(saveState));
  }, [omnivoreState, unlockedLore, secretAchievements]);

  // Track game state changes
  useEffect(() => {
    if (gameState && gameName) {
      setOmnivoreState(prev => ({
        ...prev,
        gameStates: {
          ...prev.gameStates,
          [gameName]: gameState
        },
        lastActiveGame: gameName,
        playTime: {
          ...prev.playTime,
          [gameName]: (prev.playTime[gameName] || 0) + 1
        }
      }));
      
      checkLoreUnlocks(gameState, gameName);
      checkSecretAchievements(gameState, gameName);
    }
  }, [gameState, gameName]);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
      const newSequence = [...konamiSequence, event.code].slice(-8);
      setKonamiSequence(newSequence);
      
      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        unlockSecretAchievement('easter_egg_konami');
        setKonamiSequence([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence]);

  const checkLoreUnlocks = useCallback((state: any, game: string) => {
    LORE_ENTRIES.forEach(entry => {
      if (entry.isUnlocked || unlockedLore.find(l => l.id === entry.id)) return;
      
      let shouldUnlock = false;
      
      // Check unlock conditions
      switch (entry.unlockCondition) {
        case 'Click your first snack in any game':
          shouldUnlock = true; // First interaction unlocks this
          break;
        case 'Reach 1000 Quantum Crumbs':
          shouldUnlock = game === 'quantum' && state.quantumCrumbs >= 1000;
          break;
        case 'Lose all sanity in Void Feast':
          shouldUnlock = game === 'void' && state.sanity <= 0;
          break;
        case 'Survive 5 DDOS attacks':
          shouldUnlock = game === 'cyber' && state.ddosAttacksSurvived >= 5;
          break;
        case 'Experience all 4 seasons':
          shouldUnlock = game === 'forest' && state.seasonsExperienced >= 4;
          break;
        case 'Explore 10 different planets':
          shouldUnlock = game === 'galaxy' && state.exploredPlanets?.length >= 10;
          break;
        case 'Play all 5 games and reach significant milestones':
          shouldUnlock = Object.keys(omnivoreState.gameStates).length >= 5;
          break;
      }
      
      if (shouldUnlock) {
        const unlockedEntry = { ...entry, isUnlocked: true, timestamp: Date.now() };
        setUnlockedLore(prev => [...prev, unlockedEntry]);
        setRecentLore(unlockedEntry);
        setShowLoreModal(true);
        
        toast({
          title: "📜 LORE FRAGMENT DISCOVERED",
          description: `"${entry.title}" has been added to your collection`,
          duration: 5000,
        });

        // Check for protocol activation
        if (entry.id === 'omnivore_protocol') {
          activateOmnivoreProtocol();
        }
      }
    });
  }, [unlockedLore, omnivoreState.gameStates, toast]);

  const checkSecretAchievements = useCallback((state: any, game: string) => {
    secretAchievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case 'cross_game':
          const allGamesPlayed = Object.keys(omnivoreState.gameStates).length >= 5;
          const minThresholds = checkMinimumThresholds(omnivoreState.gameStates);
          shouldUnlock = allGamesPlayed && minThresholds;
          break;
          
        case 'sequence':
          // Check for sequence of events within time window
          shouldUnlock = checkEventSequence(achievement.requirement.condition);
          break;
          
        case 'pattern':
          shouldUnlock = checkClickPattern(achievement.requirement.condition);
          break;
          
        case 'time_based':
          shouldUnlock = checkTimeBasedCondition(achievement.requirement.condition);
          break;
      }
      
      if (shouldUnlock) {
        unlockSecretAchievement(achievement.id);
      }
    });
  }, [secretAchievements, omnivoreState]);

  const unlockSecretAchievement = useCallback((achievementId: string) => {
    setSecretAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true }
        : achievement
    ));
    
    const achievement = secretAchievements.find(a => a.id === achievementId);
    if (achievement) {
      toast({
        title: `🏆 SECRET ACHIEVEMENT UNLOCKED!`,
        description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
        duration: 8000,
      });
      
      onSecretUnlocked?.(achievement);
      
      // Apply reward
      if (achievement.reward.type === 'unlock') {
        setOmnivoreState(prev => ({
          ...prev,
          discoveredSecrets: [...prev.discoveredSecrets, achievement.reward.value]
        }));
      }
    }
  }, [secretAchievements, toast, onSecretUnlocked]);

  const activateOmnivoreProtocol = useCallback(() => {
    setOmnivoreState(prev => ({ ...prev, awakened: true, protocolProgress: 100 }));
    
    toast({
      title: "🚨 PROTOCOL OMNIVORE ACTIVATED",
      description: "Reality parameters unstable. Entity signature detected. Prepare for contact.",
      duration: 10000,
    });
    
    setTimeout(() => {
      setOmnivoreState(prev => ({ ...prev, entityMeeting: true }));
      toast({
        title: "👁️ THE ENTITY APPROACHES",
        description: "It has been waiting. It has been watching. It comes.",
        duration: 15000,
      });
    }, 5000);
  }, [toast]);

  const checkMinimumThresholds = (gameStates: Record<string, any>): boolean => {
    const thresholds = {
      quantum: (state: any) => state.quantumCrumbs >= 5000,
      void: (state: any) => state.souls >= 1000,
      cyber: (state: any) => state.bits >= 10000,
      forest: (state: any) => state.essence >= 2000,
      galaxy: (state: any) => state.starDust >= 15000
    };
    
    return Object.entries(thresholds).every(([game, checkFn]) => {
      const state = gameStates[game];
      return state && checkFn(state);
    });
  };

  const checkEventSequence = (condition: any): boolean => {
    // Implementation for sequence checking would go here
    return false;
  };

  const checkClickPattern = (condition: any): boolean => {
    // Implementation for pattern checking would go here
    return false;
  };

  const checkTimeBasedCondition = (condition: any): boolean => {
    // Implementation for time-based conditions would go here
    return false;
  };

  const shareSecretAchievement = useCallback((achievement: SecretAchievement) => {
    const shareText = `I just unlocked the secret achievement "${achievement.name}" in Mega Snack Clicker! ${achievement.icon} Can you find it too? #MegaSnackClicker #SecretAchievement`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Secret Achievement Unlocked!',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "📋 Copied to clipboard!",
        description: "Share your achievement with friends!",
        duration: 3000,
      });
    }
  }, [toast]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Lore Progress Indicator */}
      <Card className="p-3 bg-black/80 backdrop-blur-sm border-purple-500/50 mb-2">
        <div className="text-xs text-purple-400 mb-1">Omnivore Protocol</div>
        <Progress value={omnivoreState.protocolProgress} className="h-2 mb-1" />
        <div className="text-xs text-muted-foreground">
          {unlockedLore.length}/{LORE_ENTRIES.length} fragments
        </div>
      </Card>

      {/* Recent Achievement/Lore Notification */}
      {recentLore && showLoreModal && (
        <Card className="p-4 bg-black/90 backdrop-blur-sm border-purple-500/70 mb-2 max-w-xs">
          <div className="text-purple-400 font-bold text-sm mb-2">
            📜 {recentLore.title}
          </div>
          <div className="text-xs text-gray-300 mb-3">
            {recentLore.content.substring(0, 100)}...
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowLoreModal(false)}
            className="w-full"
          >
            Continue
          </Button>
        </Card>
      )}

      {/* Entity Communication */}
      {omnivoreState.entityMeeting && (
        <Card className="p-4 bg-red-900/90 backdrop-blur-sm border-red-500/70 mb-2 max-w-xs animate-pulse">
          <div className="text-red-400 font-bold text-sm mb-2">
            👁️ THE ENTITY SPEAKS
          </div>
          <div className="text-xs text-red-200 mb-3">
            "You have grown strong, little one. The feast continues..."
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" className="flex-1">
              Listen
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Resist
            </Button>
          </div>
        </Card>
      )}

      {/* Secret Achievement Notifications */}
      {secretAchievements.filter(a => a.unlocked).map(achievement => (
        <Card key={achievement.id} className="p-3 bg-yellow-900/80 backdrop-blur-sm border-yellow-500/50 mb-2 max-w-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-400 font-bold text-sm">
                {achievement.icon} {achievement.name}
              </div>
              <div className="text-xs text-yellow-200">
                {achievement.description}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => shareSecretAchievement(achievement)}
              className="ml-2"
            >
              Share
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};