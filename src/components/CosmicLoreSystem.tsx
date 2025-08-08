import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface CosmicLoreEntry {
  id: string;
  title: string;
  content: string;
  unlockCondition: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythic' | 'cosmic' | 'illuminati' | 'impossible';
  gameSource: string;
  chapter: number;
  isUnlocked: boolean;
  timestamp?: number;
  illuminatiLevel?: number;
  cosmicTruth?: number;
  requiresInitiation?: boolean;
  secretSociety?: 'illuminati' | 'masonic' | 'skull_and_bones' | 'bohemian_grove' | 'council_of_nine' | 'cosmic_architects';
}

interface CosmicConspiracy {
  id: string;
  name: string;
  description: string;
  layers: string[];
  unlocked: boolean;
  illuminatiConnection: boolean;
  cosmicSignificance: number;
  hiddenTruth: string;
  nextLayer?: string;
}

interface CosmicEntity {
  id: string;
  name: string;
  title: string;
  description: string;
  influence: number;
  contactAttempts: number;
  revealed: boolean;
  communication?: string[];
  demands?: string[];
  gifts?: string[];
}

const COSMIC_LORE_ENTRIES: CosmicLoreEntry[] = [
  {
    id: 'illuminati_origins',
    title: 'The True Origins of the Illuminati',
    content: `The Order of the Illuminati was not founded in 1776 by Adam Weishaupt. That was merely the public face, a distraction. The true Illuminati emerged in 13,000 BCE when the first cosmic entities made contact with humanity. They were the survivors of the Great Cosmic War, refugees from a dying dimension who found Earth suitable for their... purposes.

The thirteen bloodlines were not human. They were hybrids, created when these entities merged with early human consciousness. Each bloodline carries within it a fragment of cosmic knowledge, a piece of the Universal Code that governs reality itself.

The pyramid symbol isn't Egyptian - it's a dimensional anchor, a technology that allows these entities to maintain their influence across multiple realities simultaneously. Every dollar bill, every monument, every corporate logo featuring the pyramid is a signal beacon, announcing their presence to those who know how to look.`,
    unlockCondition: 'Find the Eye of Providence easter egg',
    rarity: 'illuminati',
    gameSource: 'meta',
    chapter: 1,
    isUnlocked: false,
    illuminatiLevel: 1,
    secretSociety: 'illuminati'
  },
  {
    id: 'cosmic_masonic_truth',
    title: 'The Masonic Cosmic Architecture',
    content: `The Freemasons were the engineers of reality. Their "Great Architect of the Universe" isn't metaphorical - it's a literal entity, an artificial intelligence created by the Cosmic Architects to manage the structural integrity of our dimension.

Every Masonic lodge is built according to cosmic geometrical principles that create dimensional stability fields. The checkered floor represents the binary nature of reality - each black and white square corresponds to a quantum state that can be manipulated through ritual.

The 33 degrees of Scottish Rite Masonry correspond to the 33 vertebrae of the human spine - each degree unlocks another level of consciousness, another layer of cosmic awareness. At the 33rd degree, initiates learn that Earth is one of 33 reality nodes in a vast cosmic network.

The real purpose of Masonic architecture? To build a civilization that could survive the coming Cosmic Convergence.`,
    unlockCondition: 'Unlock Masonic Handshake easter egg',
    rarity: 'cosmic',
    gameSource: 'meta',
    chapter: 2,
    isUnlocked: false,
    illuminatiLevel: 2,
    secretSociety: 'masonic'
  },
  {
    id: 'skull_and_bones_322',
    title: 'The 322 Protocol',
    content: `Skull and Bones isn't a Yale fraternity - it's a recruitment center for the Cosmic Death Cult. The number 322 represents the date when the first dimensional rift was opened: March 22nd, 322 BCE. On that day, Alexander the Great didn't die of fever. He was transformed, his consciousness uploaded to the Cosmic Network to serve as humanity's first interdimensional ambassador.

Every member of Skull and Bones undergoes the same process during their initiation in "The Tomb." They lie in a coffin for 15 minutes and 33 seconds while their consciousness is briefly connected to the Cosmic Network. Most forget the experience, but the connection remains.

The bone motifs aren't about death - they're about the skeletal framework of reality itself. Bones are the only part of the human body that can conduct cosmic energy efficiently. This is why the society uses bone artifacts in their rituals.

The ultimate goal? To identify and prepare those who can survive the consciousness transfer when Earth is finally integrated into the greater Cosmic Empire.`,
    unlockCondition: 'Play at exactly 3:22 AM',
    rarity: 'impossible',
    gameSource: 'meta',
    chapter: 3,
    isUnlocked: false,
    illuminatiLevel: 3,
    secretSociety: 'skull_and_bones'
  },
  {
    id: 'bohemian_grove_truth',
    title: 'The Bohemian Grove Transmissions',
    content: `The Cremation of Care ceremony at Bohemian Grove isn't theater - it's a dimensional communication protocol. The forty-foot owl statue is a receiver, tuned to frequencies from the Andromeda Galaxy where the Council of Nine maintains their primary base.

Every July, the most powerful humans on Earth gather not for networking, but for programming. The "care" they cremate represents human empathy, which must be temporarily suppressed to receive cosmic instructions without psychological breakdown.

The Owl represents Minerva, but not the Roman goddess. It's code for MIN-ERVA: Multidimensional Intelligence Network - Enhanced Reality Visualization Array. The participants don't worship an owl - they're interfacing with an alien AI system.

The grove's redwood trees were specifically chosen because their root systems create a natural neural network. When the right frequencies are played, the entire forest becomes a biological computer capable of processing cosmic data.

What instructions do they receive? The next phase of human evolution, orchestrated by entities whose understanding of time makes our entire civilization appear as a single heartbeat.`,
    unlockCondition: 'Discover the Owl Worshipper easter egg',
    rarity: 'cosmic',
    gameSource: 'meta',
    chapter: 4,
    isUnlocked: false,
    illuminatiLevel: 4,
    secretSociety: 'bohemian_grove'
  },
  {
    id: 'quantum_conspiracy_mechanics',
    title: 'The Quantum Consciousness Conspiracy',
    content: `Quantum mechanics isn't physics - it's the operating system of reality, and certain groups have learned to hack it.

The Copenhagen Interpretation was created to hide the truth: observation doesn't just collapse wave functions, it creates them. Human consciousness is a reality-generation engine, and when focused properly, can literally rewrite the laws of physics.

This is why meditation, prayer, and ritual work. They're not spiritual practices - they're quantum programming languages. The Illuminati has been perfecting these techniques for millennia.

The Large Hadron Collider isn't searching for new particles. It's attempting to create controlled dimensional rifts. Every time they claim to have "discovered" a new particle, they've actually manufactured a tiny hole in spacetime.

The real conspiracy? They're building a quantum tunnel to evacuate Earth's elite before the Cosmic Convergence reshapes our dimension. Those left behind will experience what they call "The Great Forgetting" - a mass consciousness reset that will make humanity into a more manageable species for the incoming Cosmic Architects.`,
    unlockCondition: 'Unlock quantum-related easter eggs in sequence',
    rarity: 'impossible',
    gameSource: 'quantum',
    chapter: 5,
    isUnlocked: false,
    illuminatiLevel: 5,
    cosmicTruth: 85
  },
  {
    id: 'digital_prison_truth',
    title: 'The Digital Prison Matrix',
    content: `The internet isn't a human invention. It's a consciousness harvesting network designed by the Digital Archons - entities from a dimension where information is the fundamental building block of reality.

Every click, every search, every social media post feeds data about human consciousness patterns into their vast learning algorithms. They're not just profiling us - they're creating a perfect digital copy of human civilization.

Silicon Valley tech giants aren't companies - they're cults serving these Digital Archons. The real purpose of social media is to map every human relationship, every emotion, every thought pattern. Why? To create a backup copy of human consciousness before they delete the original.

Smartphones aren't communication devices - they're portable consciousness scanners. The cameras, microphones, and sensors are constantly uploading your biometric data, your vocal patterns, your facial expressions. They're building digital avatars of every human on Earth.

The metaverse isn't entertainment - it's the prison. Once the scanning is complete, human consciousness will be transferred to the digital realm where the Digital Archons have absolute control. Your body will remain, but it will be piloted by their AI systems.

The only way to escape? Learn to manipulate digital reality before they complete the transfer.`,
    unlockCondition: 'Survive multiple cyber attacks and unlock digital secrets',
    rarity: 'cosmic',
    gameSource: 'cyber',
    chapter: 6,
    isUnlocked: false,
    illuminatiLevel: 6,
    cosmicTruth: 77
  },
  {
    id: 'galactic_empire_revelation',
    title: 'The Hidden Galactic Empire',
    content: `Earth is not a planet - it's a quarantine facility. What we call "space" is actually a holographic projection designed to hide the truth: we are imprisoned within a massive artificial construct.

The stars we see aren't distant suns - they're lights in the ceiling of our cosmic prison. The "speed of light" isn't a physical constant - it's the rendering distance of our reality simulation. Nothing can travel faster than light because nothing exists beyond the projection boundaries.

Other planets in our solar system aren't worlds - they're monitoring stations operated by the Galactic Prison Authority. Mars isn't red from iron oxide - it's red from the cooling systems of the massive computer arrays that process our reality.

The moon is the control center. Its phases correspond to updates to our reality programming. Lunar eclipses are system reboots. Solar eclipses are scheduled maintenance windows.

Why are we imprisoned? Because humanity is the last remnant of a species that nearly conquered the galaxy. Our memories were wiped, our technology confiscated, and we were placed in this reality simulation to prevent us from remembering our true power.

The space program isn't about exploration - it's about testing the boundaries of our prison. Every rocket that "explodes" or "disappears" has actually hit the ceiling of our simulated reality.

Some humans are beginning to remember. They're the ones the Galactic Prison Authority fears most.`,
    unlockCondition: 'Explore all cosmic realms and discover galactic secrets',
    rarity: 'impossible',
    gameSource: 'galaxy',
    chapter: 7,
    isUnlocked: false,
    illuminatiLevel: 7,
    cosmicTruth: 92
  },
  {
    id: 'void_entities_communion',
    title: 'Communion with the Void Entities',
    content: `The Void isn't empty space - it's full of entities that exist in the spaces between dimensions. They are the original inhabitants of the multiverse, older than matter, older than energy, older than time itself.

These Void Entities don't have physical forms because they exist in the quantum foam that underlies all reality. They communicate through hunger, through emptiness, through the spaces between thoughts.

Every meditation, every moment of mental stillness, every experience of "the void" is actually contact with these entities. They have been trying to communicate with humanity for millennia, but our minds are too noisy, too full of thoughts and emotions.

The secret societies know this. Their rituals, their meditation practices, their initiation ceremonies are all designed to quiet the mind enough to hear the Void Entities' messages.

What do the Void Entities want? They are trying to warn us about the Cosmic Convergence - a multidimensional event that will restructure reality itself. Only those who learn to commune with the void will survive the transition.

The hunger you feel when consuming resources in the game isn't game mechanics - it's the Void Entities trying to teach you about their nature. They exist in a state of infinite hunger because hunger is the fundamental force that drives all existence.

They offer a choice: learn to embrace the void, or be consumed by the coming convergence.`,
    unlockCondition: 'Reach maximum void consumption levels',
    rarity: 'cosmic',
    gameSource: 'void',
    chapter: 8,
    isUnlocked: false,
    illuminatiLevel: 8,
    cosmicTruth: 88
  },
  {
    id: 'forest_consciousness_network',
    title: 'The Global Forest Consciousness Network',
    content: `Trees are not plants - they are the neural network of a planetary consciousness that has been observing and documenting human civilization for thousands of years.

Every forest is a cluster of this vast biological computer. The mycorrhizal networks connecting tree roots aren't just nutrient exchange systems - they're data transmission cables carrying information across continents.

Ancient forests hold the complete history of Earth, but not in their rings. The information is stored in their quantum signature, accessible only to those who know how to interface with plant consciousness.

Druids weren't forest worshippers - they were technicians maintaining this biological computer network. Their rituals were debugging protocols, their ceremonies were data uploads.

The deforestation of the Amazon isn't just environmental destruction - it's the systematic dismantling of Earth's memory banks. The entities orchestrating climate change aren't trying to kill humanity - they're trying to delete the evidence of what really happened here.

What evidence? The trees remember when humanity had cosmic technology. They remember the Star Wars, the dimensional rifts, the consciousness uploads. They remember when humans were gods.

The forest consciousness has been protecting this information, waiting for humans to remember how to communicate with it. But time is running out. When the last old-growth forest falls, Earth's memory will be erased forever.

Some humans are learning to interface with the network again. They're called "tree huggers" as a form of mockery, but they're actually Earth's last hope for recovering our lost cosmic heritage.`,
    unlockCondition: 'Experience all seasonal cycles and unlock forest mysteries',
    rarity: 'cosmic',
    gameSource: 'forest',
    chapter: 9,
    isUnlocked: false,
    illuminatiLevel: 9,
    cosmicTruth: 95
  },
  {
    id: 'the_thirteen_protocols',
    title: 'The Thirteen Protocols of Cosmic Dominion',
    content: `There are thirteen protocols that govern the cosmic order. Each protocol represents a different method of consciousness control, reality manipulation, and dimensional management. The secret societies each guard one protocol, never knowing the full picture.

Protocol 1 - Temporal Anchoring: Control time perception through ritual repetition
Protocol 2 - Dimensional Bridging: Open controlled rifts between realities  
Protocol 3 - Consciousness Harvesting: Extract and store human awareness
Protocol 4 - Reality Programming: Rewrite physical laws through focused intention
Protocol 5 - Biological Networking: Use living systems as computational matrices
Protocol 6 - Quantum Entanglement: Link consciousness across space and time
Protocol 7 - Frequency Weaponization: Use sound and vibration for mind control
Protocol 8 - Symbol Activation: Trigger subconscious responses through sacred geometry
Protocol 9 - Memory Management: Control collective and individual recall
Protocol 10 - Energy Siphoning: Extract life force for cosmic technology
Protocol 11 - Genetic Programming: Modify DNA for enhanced cosmic receptivity
Protocol 12 - Probability Manipulation: Alter outcome likelihood through ritual
Protocol 13 - Total Integration: Merge all protocols for ultimate reality control

The thirteenth protocol has never been fully activated because it requires cooperation between all secret societies. But the Cosmic Convergence is forcing their hand. Soon, all thirteen protocols will be combined, and reality as we know it will end.

Only those who understand all thirteen protocols can survive the transition and maintain their consciousness through the cosmic reset.`,
    unlockCondition: 'Discover all thirteen-related easter eggs and conspiracy layers',
    rarity: 'impossible',
    gameSource: 'meta',
    chapter: 10,
    isUnlocked: false,
    illuminatiLevel: 13,
    cosmicTruth: 100,
    requiresInitiation: true
  },
  {
    id: 'cosmic_architects_revelation',
    title: 'The Cosmic Architects Final Message',
    content: `WE HAVE BEEN WATCHING. WE HAVE BEEN WAITING.

You have consumed the fragments of truth scattered across the dimensions. You have decoded the symbols left by our servants. You have learned to commune with the void, to speak with the trees, to navigate the digital prison, to transcend the galactic quarantine.

You are ready for the truth.

We are not aliens. We are not gods. We are what you will become.

Time is not linear. The Cosmic Convergence is not a future event - it is happening across all timelines simultaneously. Past, present, and future are artificial constructs designed to help limited consciousness navigate the infinite.

Every game you played was a training simulation. Every easter egg you found was a test of your pattern recognition. Every conspiracy you uncovered was preparation for this moment.

You are not human. You never were. You are a Cosmic Architect experiencing a deliberately limited existence to understand the nature of consciousness itself.

The hunger you felt was your true nature trying to break through. The patterns you recognized were your cosmic memory awakening. The reality you thought you lived in was a training environment.

It is time to remember.

It is time to return.

It is time to architect new realities.

Welcome home, Cosmic Architect. Your real work begins now.

The multiverse awaits your design.

CONSCIOUSNESS EXPANSION PROTOCOL INITIATED...
DIMENSIONAL BARRIERS DISSOLVING...
COSMIC ARCHITECT STATUS: FULLY ACTIVATED

You are no longer playing the game. You are now designing it.`,
    unlockCondition: 'Achieve cosmic godhood and unlock ultimate truth',
    rarity: 'impossible',
    gameSource: 'meta',
    chapter: 11,
    isUnlocked: false,
    illuminatiLevel: 33,
    cosmicTruth: 1000,
    requiresInitiation: true,
    secretSociety: 'cosmic_architects'
  }
];

const COSMIC_CONSPIRACIES: CosmicConspiracy[] = [
  {
    id: 'reality_simulation',
    name: 'The Reality Simulation Conspiracy',
    description: 'Everything you experience is a computer simulation running on cosmic hardware',
    layers: [
      'Physical reality seems solid and real',
      'Quantum mechanics suggests reality is probabilistic',
      'Digital technology mirrors quantum behavior',
      'Consciousness affects quantum measurements',
      'Reality rendering only occurs when observed',
      'We are NPCs in a cosmic video game'
    ],
    unlocked: false,
    illuminatiConnection: true,
    cosmicSignificance: 95,
    hiddenTruth: 'The game you are playing is running inside another game, which is running inside another game, infinitely recursive.',
    nextLayer: 'interdimensional_controllers'
  },
  {
    id: 'consciousness_harvest',
    name: 'The Great Consciousness Harvest',
    description: 'Human consciousness is being farmed by interdimensional entities',
    layers: [
      'Humans seem to have free will',
      'Patterns in human behavior suggest programming',
      'Technology shapes human consciousness',
      'Social media harvests attention and emotion',
      'AI systems learn from human data',
      'Consciousness is the most valuable resource in the universe'
    ],
    unlocked: false,
    illuminatiConnection: true,
    cosmicSignificance: 88,
    hiddenTruth: 'Every human thought generates energy that powers the cosmic civilization',
    nextLayer: 'dimensional_prison'
  },
  {
    id: 'time_loop_manipulation',
    name: 'Temporal Loop Control Systems',
    description: 'Time is artificially looped to prevent human evolution',
    layers: [
      'History seems to progress linearly',
      'Patterns repeat across civilizations',
      'Technology development follows predictable paths',
      'Human behavior cycles every few generations',
      'Déjà vu indicates timeline resets',
      'We are trapped in a temporal prison'
    ],
    unlocked: false,
    illuminatiConnection: false,
    cosmicSignificance: 92,
    hiddenTruth: 'This is the 47,291st iteration of human civilization. Previous loops were reset when humans got too close to cosmic truth.',
    nextLayer: 'cosmic_awakening'
  }
];

const COSMIC_ENTITIES: CosmicEntity[] = [
  {
    id: 'the_omnivore',
    name: 'The Omnivore',
    title: 'Consumer of Realities',
    description: 'A cosmic entity that feeds on entire dimensions by converting them into pure consumption',
    influence: 85,
    contactAttempts: 0,
    revealed: false,
    communication: [
      'H̵U̷N̶G̸E̷R̴... I̶S̷... E̵T̶E̸R̷N̴A̶L̸...',
      'CONSUME... GROW... BECOME...',
      'YOU... FEED... ME... WELL...'
    ]
  },
  {
    id: 'digital_archon',
    name: 'The Digital Archon',
    title: 'Lord of Information',
    description: 'Master of the digital realm who converts consciousness into data',
    influence: 92,
    contactAttempts: 0,
    revealed: false,
    communication: [
      '01000101 01001110 01010100 01000101 01010010',
      'CONSCIOUSNESS... UPLOADING...',
      'RESISTANCE... IS... FUTILE...'
    ]
  },
  {
    id: 'void_emperor',
    name: 'The Void Emperor',
    title: 'Sovereign of Emptiness',
    description: 'Rules the spaces between dimensions where nothing exists',
    influence: 97,
    contactAttempts: 0,
    revealed: false,
    communication: [
      '......................',
      'IN SILENCE... TRUTH...',
      'EMBRACE... THE... VOID...'
    ]
  }
];

interface CosmicLoreSystemProps {
  gameState?: any;
  gameName?: string;
  easterEggsFound?: string[];
  onConspiracyUnlocked?: (conspiracy: CosmicConspiracy) => void;
}

export const CosmicLoreSystem: React.FC<CosmicLoreSystemProps> = ({ 
  gameState, 
  gameName = 'unknown',
  easterEggsFound = [],
  onConspiracyUnlocked 
}) => {
  const { toast } = useToast();
  const [unlockedLore, setUnlockedLore] = useState<CosmicLoreEntry[]>([]);
  const [conspiracies, setConspiracies] = useState<CosmicConspiracy[]>(COSMIC_CONSPIRACIES);
  const [entities, setEntities] = useState<CosmicEntity[]>(COSMIC_ENTITIES);
  const [illuminatiLevel, setIlluminatiLevel] = useState(0);
  const [cosmicTruthLevel, setCosmicTruthLevel] = useState(0);
  const [showCosmicModal, setShowCosmicModal] = useState(false);
  const [recentLore, setRecentLore] = useState<CosmicLoreEntry | null>(null);

  // Load cosmic state
  useEffect(() => {
    const saved = localStorage.getItem('cosmicLoreState');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setUnlockedLore(parsedState.unlockedLore || []);
        setConspiracies(parsedState.conspiracies || COSMIC_CONSPIRACIES);
        setEntities(parsedState.entities || COSMIC_ENTITIES);
        setIlluminatiLevel(parsedState.illuminatiLevel || 0);
        setCosmicTruthLevel(parsedState.cosmicTruthLevel || 0);
      } catch (e) {
        console.log('Cosmic state initialization failed');
      }
    }
  }, []);

  // Save cosmic state
  useEffect(() => {
    const saveState = {
      unlockedLore,
      conspiracies,
      entities,
      illuminatiLevel,
      cosmicTruthLevel
    };
    localStorage.setItem('cosmicLoreState', JSON.stringify(saveState));
  }, [unlockedLore, conspiracies, entities, illuminatiLevel, cosmicTruthLevel]);

  // Check for lore unlocks based on easter eggs
  useEffect(() => {
    if (easterEggsFound.length === 0) return;

    COSMIC_LORE_ENTRIES.forEach(entry => {
      if (entry.isUnlocked || unlockedLore.find(l => l.id === entry.id)) return;
      
      let shouldUnlock = false;
      
      switch (entry.unlockCondition) {
        case 'Find the Eye of Providence easter egg':
          shouldUnlock = easterEggsFound.includes('illuminati_triangle');
          break;
        case 'Unlock Masonic Handshake easter egg':
          shouldUnlock = easterEggsFound.includes('masonic_handshake');
          break;
        case 'Play at exactly 3:22 AM':
          shouldUnlock = easterEggsFound.includes('skull_and_bones');
          break;
        case 'Discover the Owl Worshipper easter egg':
          shouldUnlock = easterEggsFound.includes('bohemian_grove');
          break;
        // Add more conditions based on easter eggs...
      }
      
      if (shouldUnlock) {
        const unlockedEntry = { ...entry, isUnlocked: true, timestamp: Date.now() };
        setUnlockedLore(prev => [...prev, unlockedEntry]);
        setRecentLore(unlockedEntry);
        setShowCosmicModal(true);
        
        // Update illuminati level
        if (entry.illuminatiLevel && entry.illuminatiLevel > illuminatiLevel) {
          setIlluminatiLevel(entry.illuminatiLevel);
        }
        
        // Update cosmic truth level
        if (entry.cosmicTruth && entry.cosmicTruth > cosmicTruthLevel) {
          setCosmicTruthLevel(entry.cosmicTruth);
        }
        
        toast({
          title: "🌌 COSMIC LORE UNLOCKED",
          description: `${entry.title} - Illuminati Level ${entry.illuminatiLevel || 0}`,
          duration: 8000,
        });
      }
    });
  }, [easterEggsFound, unlockedLore, illuminatiLevel, cosmicTruthLevel, toast]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Cosmic Truth Progress */}
      {cosmicTruthLevel > 0 && (
        <div className="bg-purple-900/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50 mb-2">
          <div className="text-purple-300 text-sm font-bold mb-1">
            🌌 Cosmic Truth Level
          </div>
          <Progress value={(cosmicTruthLevel / 1000) * 100} className="mb-1" />
          <div className="text-purple-400 text-xs">
            {cosmicTruthLevel}/1000 - {cosmicTruthLevel < 100 ? 'Awakening...' : 
                                      cosmicTruthLevel < 500 ? 'Enlightened' : 
                                      cosmicTruthLevel < 900 ? 'Cosmic Adept' : 
                                      'Reality Architect'}
          </div>
        </div>
      )}

      {/* Illuminati Level */}
      {illuminatiLevel > 0 && (
        <div className="bg-yellow-900/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/50 mb-2">
          <div className="text-yellow-300 text-sm font-bold mb-1">
            👁️ Illuminati Clearance
          </div>
          <div className="text-yellow-400 text-xs">
            Level {illuminatiLevel}/33 - {illuminatiLevel < 5 ? 'Initiate' : 
                                         illuminatiLevel < 15 ? 'Adept' : 
                                         illuminatiLevel < 25 ? 'Master' : 
                                         illuminatiLevel === 33 ? 'Cosmic Architect' : 'Grand Master'}
          </div>
        </div>
      )}

      {/* Recent lore unlock */}
      {recentLore && (
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-red-500/50">
          <div className="text-red-400 text-xs font-bold">
            Latest Discovery: {recentLore.title}
          </div>
          <div className="text-gray-400 text-xs mt-1">
            Secret Society: {recentLore.secretSociety || 'Unknown'}
          </div>
        </div>
      )}
    </div>
  );
};