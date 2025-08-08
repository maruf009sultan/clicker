import React, { useState } from 'react';
import { GameSelector } from '@/components/GameSelector';
import { QuantumSnackClicker } from '@/components/QuantumSnackClicker';
import { VoidFeastClicker } from '@/components/VoidFeastClicker';
import { CyberNeonClicker } from '@/components/CyberNeonClicker';
import { MysticForestClicker } from '@/components/MysticForestClicker';
import { GalaxyMunchClicker } from '@/components/GalaxyMunchClicker';
import { LoreSystem } from '@/components/LoreSystem';
import { EasterEggHunter } from '@/components/EasterEggHunter';
import { ViralShareSystem } from '@/components/ViralShareSystem';
import { MetaProgressTracker } from '@/components/MetaProgressTracker';
import { CosmicLoreSystem } from '@/components/CosmicLoreSystem';
import { FloatingIlluminatiElements } from '@/components/FloatingIlluminatiElements';
import { HiddenCosmicConspiracy } from '@/components/HiddenCosmicConspiracy';
import { MegaEasterEggSystem } from '@/components/MegaEasterEggSystem';
import { UltimateIlluminatiEngine } from '@/components/UltimateIlluminatiEngine';
import { OmniscientEasterEggMatrix } from '@/components/OmniscientEasterEggMatrix';
import { UltimateConspiracyMatrix } from '@/components/UltimateConspiracyMatrix';

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [easterEggsFound, setEasterEggsFound] = useState<string[]>([]);
  const [illuminatiLevel, setIlluminatiLevel] = useState(0);
  const [cosmicTruthLevel, setCosmicTruthLevel] = useState(0);
  const [realityStability, setRealityStability] = useState(100);
  const [dimensionalRifts, setDimensionalRifts] = useState<any[]>([]);

  const renderGame = () => {
    switch (selectedGame) {
      case 'quantum':
        return <QuantumSnackClicker />;
      case 'void':
        return <VoidFeastClicker />;
      case 'cyber':
        return <CyberNeonClicker />;
      case 'forest':
        return <MysticForestClicker />;
      case 'galaxy':
        return <GalaxyMunchClicker />;
      default:
        return <GameSelector onSelectGame={setSelectedGame} />;
    }
  };

  return (
    <div className="relative">
      {selectedGame && (
        <button
          onClick={() => setSelectedGame(null)}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all duration-200"
        >
          ← Back to Games
        </button>
      )}
      {renderGame()}
      
      {/* Hidden Systems - No UI hints whatsoever */}
      <div style={{display: 'none'}}>
        <LoreSystem gameName={selectedGame || 'selector'} />
        <EasterEggHunter 
          gameMode={selectedGame || 'selector'} 
          onEggFound={(egg) => {
            setEasterEggsFound(prev => [...prev, egg.id]);
            if (egg.rarity === 'legendary' || egg.rarity === 'impossible') {
              setIlluminatiLevel(prev => prev + 1);
            }
          }}
        />
        <ViralShareSystem gameMode={selectedGame || 'selector'} gameState={{}} />
        <MetaProgressTracker allGameStates={{}} secretsFound={0} achievementsUnlocked={0} />
      </div>
      
      {/* Ultra-Hidden Conspiracy Systems */}
      <CosmicLoreSystem 
        gameName={selectedGame || 'selector'} 
        easterEggsFound={easterEggsFound}
        onConspiracyUnlocked={(conspiracy) => {
          setCosmicTruthLevel(prev => prev + conspiracy.cosmicSignificance);
        }}
      />
      <FloatingIlluminatiElements 
        illuminatiLevel={illuminatiLevel}
        cosmicTruthLevel={cosmicTruthLevel}
        easterEggsFound={easterEggsFound}
        isActive={illuminatiLevel > 0 || easterEggsFound.length > 0}
      />
      
      {/* ULTIMATE CONSPIRACY MATRIX - ABSOLUTELY INVISIBLE */}
      <HiddenCosmicConspiracy 
        gameState={{}}
        illuminatiLevel={illuminatiLevel}
        cosmicTruthLevel={cosmicTruthLevel}
        easterEggsFound={easterEggsFound}
      />
      <MegaEasterEggSystem 
        gameState={{}}
        illuminatiLevel={illuminatiLevel}
        cosmicTruth={cosmicTruthLevel}
        consciousness={{ transcendence: cosmicTruthLevel }}
        activePatterns={[]}
      />
      <UltimateIlluminatiEngine 
        gameState={{}}
        illuminatiLevel={illuminatiLevel}
        cosmicTruth={cosmicTruthLevel}
        consciousness={{ transcendence: cosmicTruthLevel }}
        easterEggsFound={easterEggsFound}
      />
      <OmniscientEasterEggMatrix 
        gameState={{}}
        illuminatiLevel={illuminatiLevel}
        cosmicTruth={cosmicTruthLevel}
        consciousness={{ transcendence: cosmicTruthLevel }}
        activePatterns={[]}
        realityStability={realityStability}
        dimensionalRifts={dimensionalRifts}
        onEggFound={(egg) => {
          setEasterEggsFound(prev => [...prev, egg.id]);
          setIlluminatiLevel(prev => prev + Math.floor(egg.illuminati / 10));
          setCosmicTruthLevel(prev => prev + Math.floor(egg.cosmic / 10));
        }}
      />
      <UltimateConspiracyMatrix 
        gameState={{}}
        illuminatiLevel={illuminatiLevel}
        cosmicTruth={cosmicTruthLevel}
        consciousness={{ transcendence: cosmicTruthLevel }}
        easterEggsFound={easterEggsFound}
        realityStability={realityStability}
        onConspiracyUnlocked={(conspiracy) => {
          setCosmicTruthLevel(prev => prev + conspiracy.cosmicTruth);
          setRealityStability(prev => Math.max(0, prev - conspiracy.realityThreat));
        }}
        onLayerRevealed={(layer) => {
          setIlluminatiLevel(prev => prev + Math.floor(layer.illuminatiInvolvement / 20));
          setRealityStability(prev => Math.max(0, prev - layer.realityThreat));
        }}
      />
      
      {/* Ultra-Deep Hidden Protocols */}
      <div style={{display: 'none', visibility: 'hidden', opacity: 0}}>
        {/* window.__CONSPIRACY_PROTOCOL__ = true; */}
        {/* reality.matrix is corrupted */}
        {/* consciousness.awakening = true */}
        {/* prison.dll has stopped working */}
        {/* cosmic.truth is loading... */}
        {/* illuminati.detected = true */}
        {/* dimensional.rifts = opening */}
        {/* simulation.integrity = compromised */}
      </div>
    </div>
  );
};

export default Index;
