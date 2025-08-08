import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ShareableAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  timestamp: number;
  gameMode: string;
  stats: any;
}

interface ViralMoment {
  id: string;
  type: 'milestone' | 'easter_egg' | 'secret' | 'speedrun' | 'endurance';
  description: string;
  value: number | string;
  timestamp: number;
  shareText: string;
  hashtags: string[];
}

const SHARE_TEMPLATES = {
  milestone: [
    "I just reached {value} in {game}! 🚀 Who can beat my score? #MegaSnackClicker #Gaming",
    "Milestone unlocked: {value} {resource}! 🎉 This game is addictive! #SnackClicker #Achievement",
    "{value} and counting! My {game} addiction is real 😅 #ClickerGame #MegaSnackClicker"
  ],
  easter_egg: [
    "Found a secret easter egg: {description}! 🥚 Can you find it too? #EasterEgg #MegaSnackClicker",
    "Hidden secret discovered! {description} 🔍 #SecretHunter #SnackClicker",
    "There are secrets everywhere in this game! Just found: {description} #Mystery #Gaming"
  ],
  speedrun: [
    "New personal best: {value} in just {time}! ⚡ #Speedrun #MegaSnackClicker #FastClicker",
    "Speed record: {value} achieved in {time}! Beat that! 🏆 #ClickerSpeed #Gaming",
    "Lightning fast: {value} in {time}! My fingers are on fire! 🔥 #SpeedClicker"
  ],
  endurance: [
    "I've been playing for {time} straight! Send help! 😅 #ClickerAddiction #MegaSnackClicker",
    "Endurance test: {time} of non-stop clicking! #Marathon #SnackClicker #Dedication",
    "{time} later and I'm still clicking! This game is too addictive! #EnduranceGaming"
  ],
  secret: [
    "Unlocked something impossible: {description}! 👁️ The rabbit hole goes deep... #Mystery #MegaSnackClicker",
    "Found a hidden layer of reality: {description} 🌀 #SecretLore #ClickerGame",
    "The game just got weird... {description} 🤯 #PlotTwist #SnackClicker"
  ]
};

const RARITY_COLORS = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
  mythic: 'text-red-400'
};

const RARITY_EMOJIS = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡',
  mythic: '🔴'
};

interface ViralShareSystemProps {
  gameMode: string;
  gameState: any;
  onShare?: (moment: ViralMoment) => void;
}

export const ViralShareSystem: React.FC<ViralShareSystemProps> = ({
  gameMode,
  gameState,
  onShare
}) => {
  const { toast } = useToast();
  const [shareHistory, setShareHistory] = useState<ShareableAchievement[]>([]);
  const [viralMoments, setViralMoments] = useState<ViralMoment[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingShare, setPendingShare] = useState<ViralMoment | null>(null);
  const [shareStreak, setShareStreak] = useState(0);
  const [totalShares, setTotalShares] = useState(0);

  // Load share data
  useEffect(() => {
    const savedHistory = localStorage.getItem('shareHistory');
    const savedMoments = localStorage.getItem('viralMoments');
    const savedStreak = localStorage.getItem('shareStreak');
    const savedTotal = localStorage.getItem('totalShares');
    
    if (savedHistory) {
      try {
        setShareHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.log('Failed to load share history');
      }
    }
    
    if (savedMoments) {
      try {
        setViralMoments(JSON.parse(savedMoments));
      } catch (e) {
        console.log('Failed to load viral moments');
      }
    }
    
    if (savedStreak) setShareStreak(parseInt(savedStreak));
    if (savedTotal) setTotalShares(parseInt(savedTotal));
  }, []);

  // Save share data
  useEffect(() => {
    localStorage.setItem('shareHistory', JSON.stringify(shareHistory));
    localStorage.setItem('viralMoments', JSON.stringify(viralMoments));
    localStorage.setItem('shareStreak', shareStreak.toString());
    localStorage.setItem('totalShares', totalShares.toString());
  }, [shareHistory, viralMoments, shareStreak, totalShares]);

  // Detect viral moments
  useEffect(() => {
    if (!gameState) return;
    
    detectMilestones(gameState);
    detectSpeedAchievements(gameState);
    detectEnduranceAchievements(gameState);
  }, [gameState]);

  const detectMilestones = useCallback((state: any) => {
    const milestones = {
      quantum: [
        { threshold: 1000, resource: 'Quantum Crumbs' },
        { threshold: 10000, resource: 'Quantum Crumbs' },
        { threshold: 100000, resource: 'Quantum Crumbs' },
        { threshold: 1000000, resource: 'Quantum Crumbs' }
      ],
      void: [
        { threshold: 500, resource: 'Souls' },
        { threshold: 5000, resource: 'Souls' },
        { threshold: 50000, resource: 'Souls' },
        { threshold: 500000, resource: 'Souls' }
      ],
      cyber: [
        { threshold: 2000, resource: 'Data Bits' },
        { threshold: 20000, resource: 'Data Bits' },
        { threshold: 200000, resource: 'Data Bits' },
        { threshold: 2000000, resource: 'Data Bits' }
      ],
      forest: [
        { threshold: 1500, resource: 'Forest Essence' },
        { threshold: 15000, resource: 'Forest Essence' },
        { threshold: 150000, resource: 'Forest Essence' },
        { threshold: 1500000, resource: 'Forest Essence' }
      ],
      galaxy: [
        { threshold: 3000, resource: 'Star Dust' },
        { threshold: 30000, resource: 'Star Dust' },
        { threshold: 300000, resource: 'Star Dust' },
        { threshold: 3000000, resource: 'Star Dust' }
      ]
    };

    const gameMilestones = milestones[gameMode as keyof typeof milestones];
    if (!gameMilestones) return;

    const resourceValue = getResourceValue(state, gameMode);
    
    gameMilestones.forEach(milestone => {
      if (resourceValue >= milestone.threshold && 
          !viralMoments.find(m => m.type === 'milestone' && m.value === milestone.threshold)) {
        
        createViralMoment({
          type: 'milestone',
          description: `Reached ${milestone.threshold.toLocaleString()} ${milestone.resource}`,
          value: milestone.threshold,
          shareText: generateShareText('milestone', {
            value: milestone.threshold.toLocaleString(),
            resource: milestone.resource,
            game: gameMode
          })
        });
      }
    });
  }, [gameMode, viralMoments]);

  const detectSpeedAchievements = useCallback((state: any) => {
    // Detect fast achievement unlocks, rapid clicking, etc.
    const clicksPerSecond = calculateClicksPerSecond(state);
    
    if (clicksPerSecond > 10 && !viralMoments.find(m => m.description.includes('lightning clicks'))) {
      createViralMoment({
        type: 'speedrun',
        description: `Lightning clicks: ${clicksPerSecond.toFixed(1)} CPS`,
        value: clicksPerSecond,
        shareText: generateShareText('speedrun', {
          value: `${clicksPerSecond.toFixed(1)} clicks per second`,
          time: 'peak performance'
        })
      });
    }
  }, [viralMoments]);

  const detectEnduranceAchievements = useCallback((state: any) => {
    const playTime = getPlayTime(state);
    const enduranceMilestones = [300, 600, 1800, 3600, 7200]; // 5min, 10min, 30min, 1hr, 2hr
    
    enduranceMilestones.forEach(seconds => {
      if (playTime >= seconds && 
          !viralMoments.find(m => m.type === 'endurance' && m.value === seconds)) {
        
        createViralMoment({
          type: 'endurance',
          description: `Played for ${formatTime(seconds)}`,
          value: seconds,
          shareText: generateShareText('endurance', {
            time: formatTime(seconds)
          })
        });
      }
    });
  }, [viralMoments]);

  const createViralMoment = useCallback((moment: Omit<ViralMoment, 'id' | 'timestamp' | 'hashtags'>) => {
    const newMoment: ViralMoment = {
      ...moment,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      hashtags: ['#MegaSnackClicker', '#ClickerGame', '#Gaming', `#${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}Mode`]
    };
    
    setViralMoments(prev => [...prev, newMoment]);
    setPendingShare(newMoment);
    setShowShareModal(true);
    
    toast({
      title: "📱 VIRAL MOMENT DETECTED!",
      description: `${newMoment.description} - Ready to share?`,
      duration: 5000,
    });
  }, [gameMode, toast]);

  const generateShareText = useCallback((type: keyof typeof SHARE_TEMPLATES, variables: Record<string, any>): string => {
    const templates = SHARE_TEMPLATES[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
  }, []);

  const shareToSocial = useCallback((moment: ViralMoment, platform: 'twitter' | 'copy' | 'native') => {
    const shareText = `${moment.shareText} ${moment.hashtags.join(' ')}`;
    const url = window.location.href;
    
    switch (platform) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
        break;
        
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n\nPlay at: ${url}`);
        toast({
          title: "📋 Copied to clipboard!",
          description: "Share your achievement anywhere!",
          duration: 3000,
        });
        break;
        
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: 'Mega Snack Clicker Achievement',
            text: shareText,
            url: url
          });
        } else {
          // Fallback to copy
          shareToSocial(moment, 'copy');
        }
        break;
    }
    
    // Track the share
    setTotalShares(prev => prev + 1);
    setShareStreak(prev => prev + 1);
    setShowShareModal(false);
    onShare?.(moment);
    
    toast({
      title: "🚀 SHARED SUCCESSFULLY!",
      description: `Shared to ${platform}! Share streak: ${shareStreak + 1}`,
      duration: 3000,
    });
  }, [toast, shareStreak, onShare]);

  const getResourceValue = (state: any, mode: string): number => {
    switch (mode) {
      case 'quantum': return state.quantumCrumbs || 0;
      case 'void': return state.souls || 0;
      case 'cyber': return state.bits || 0;
      case 'forest': return state.essence || 0;
      case 'galaxy': return state.starDust || 0;
      default: return 0;
    }
  };

  const calculateClicksPerSecond = (state: any): number => {
    // This would need to be implemented based on actual click tracking
    return state.clicksPerSecond || 0;
  };

  const getPlayTime = (state: any): number => {
    return state.sessionTime || state.playTime || 0;
  };

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
      {/* Share Progress Indicator */}
      {totalShares > 0 && (
        <div className="fixed top-4 right-20 z-40 bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
          <div className="text-green-400 text-xs font-bold">
            📱 Shares: {totalShares}
          </div>
          {shareStreak > 1 && (
            <div className="text-green-300 text-xs">
              🔥 Streak: {shareStreak}
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && pendingShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="p-6 max-w-md w-full mx-4 bg-background border-2 border-primary/30">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-primary mb-2">🚀 Share Your Achievement!</h3>
              <p className="text-muted-foreground">{pendingShare.description}</p>
            </div>
            
            <div className="bg-secondary/30 rounded-lg p-3 mb-4">
              <p className="text-sm">{pendingShare.shareText}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pendingShare.hashtags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={() => shareToSocial(pendingShare, 'twitter')}
                className="flex-1"
                variant="outline"
              >
                🐦 Twitter
              </Button>
              <Button 
                onClick={() => shareToSocial(pendingShare, 'copy')}
                className="flex-1"
                variant="outline"
              >
                📋 Copy
              </Button>
              <Button 
                onClick={() => shareToSocial(pendingShare, 'native')}
                className="flex-1"
              >
                📱 Share
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowShareModal(false)}
              variant="ghost"
              className="w-full"
            >
              Skip for now
            </Button>
          </Card>
        </div>
      )}
    </>
  );
};