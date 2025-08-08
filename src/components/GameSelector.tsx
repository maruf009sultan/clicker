import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameMode {
  id: string;
  title: string;
  description: string;
  emoji: string;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  features: string[];
}

const GAME_MODES: GameMode[] = [
  {
    id: 'quantum',
    title: 'Quantum Snack Clicker',
    description: 'Click cosmic snacks to harvest Quantum Crumbs and bend reality! Features time effects, event horizons, and reality glitches.',
    emoji: '⚛️',
    theme: 'cosmic',
    difficulty: 'Medium',
    features: ['Time Effects', 'Event Horizons', 'Reality Glitches', 'Quantum Mechanics']
  },
  {
    id: 'void',
    title: 'Void Feast Clicker',
    description: 'Descend into madness as you consume cursed snacks! Track your sanity while harvesting souls in this dark, addictive experience.',
    emoji: '💀',
    theme: 'dark',
    difficulty: 'Insane',
    features: ['Sanity System', 'Void Storms', 'Achievement System', 'Withdrawal Mechanics']
  },
  {
    id: 'cyber',
    title: 'Cyber Neon Clicker',
    description: 'Hack the matrix and consume digital snacks! Navigate through cyberspace with glitch effects and DDOS attacks.',
    emoji: '💻',
    theme: 'neon',
    difficulty: 'Medium',
    features: ['Matrix Theme', 'DDOS Defense', 'Digital Glitches', 'Firewall System']
  },
  {
    id: 'forest',
    title: 'Mystic Forest Clicker',
    description: 'Commune with ancient forest spirits and gather mystical essence! Experience seasonal changes and lunar magic.',
    emoji: '🌲',
    theme: 'nature',
    difficulty: 'Easy',
    features: ['Seasonal Cycles', 'Moon Phases', 'Forest Spirits', 'Mystical Effects']
  },
  {
    id: 'galaxy',
    title: 'Galaxy Munch Clicker',
    description: 'Explore the cosmos and devour intergalactic snacks! Discover new planets and survive asteroid storms.',
    emoji: '🌌',
    theme: 'space',
    difficulty: 'Hard',
    features: ['Planet Exploration', 'Asteroid Storms', 'Warp Travel', 'Cosmic Effects']
  }
];

interface GameSelectorProps {
  onSelectGame: (gameId: string) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      case 'Hard': return 'bg-orange-500/20 text-orange-400 border-orange-400';
      case 'Insane': return 'bg-red-500/20 text-red-400 border-red-400';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'cosmic': return 'from-purple-500/20 to-blue-500/20';
      case 'dark': return 'from-red-500/20 to-purple-900/20';
      case 'neon': return 'from-cyan-500/20 to-blue-500/20';
      case 'nature': return 'from-green-500/20 to-emerald-500/20';
      case 'space': return 'from-indigo-500/20 to-purple-500/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
            🔺 CONSPIRACY CLICKER 🔺
          </h1>
          <p className="text-2xl text-muted-foreground mb-4">
            Uncover the Hidden Truth
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each click brings you closer to cosmic revelations. Multiple reality layers hide ancient secrets and forbidden knowledge.
            How deep will you dare to descend?
          </p>
        </div>

        {/* Game Mode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {GAME_MODES.map((game) => (
            <Card 
              key={game.id} 
              className={`p-6 bg-gradient-to-br ${getThemeGradient(game.theme)} backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer group`}
              onClick={() => onSelectGame(game.id)}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {game.emoji}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {game.title}
                </h3>
                <Badge className={`${getDifficultyColor(game.difficulty)} mb-3`}>
                  {game.difficulty}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {game.description}
              </p>
              
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-semibold text-white">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {game.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-white/10 border-white/30 text-white"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white font-semibold"
                variant="outline"
              >
                Start Clicking! 🖱️
              </Button>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-12 bg-card/60 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 text-center">🎮 How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <p className="mb-2">🖱️ <strong>Click snacks</strong> to earn resources</p>
              <p className="mb-2">💰 <strong>Buy upgrades</strong> to increase your power</p>
              <p className="mb-2">⚡ <strong>Trigger special effects</strong> for massive bonuses</p>
            </div>
            <div>
              <p className="mb-2">🌟 <strong>Unlock achievements</strong> and new features</p>
              <p className="mb-2">🔄 <strong>Auto-save</strong> keeps your progress safe</p>
              <p className="mb-2">🎯 <strong>Each mode</strong> has unique mechanics to master</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};