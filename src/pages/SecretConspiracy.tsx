import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SecretConspiracy = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [illuminatiLevel, setIlluminatiLevel] = useState(0);
  const [easterEggsFound, setEasterEggsFound] = useState<string[]>([]);
  const [cosmicTruthLevel, setCosmicTruthLevel] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('conspiracyAccess');
    if (authStatus === 'granted') {
      setIsAuthenticated(true);
    }
    
    // Load progress data
    const saved = localStorage.getItem('omniscientEasterEggs');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setEasterEggsFound(data.foundEggs || []);
        setIlluminatiLevel(data.illuminatiLevel || 0);
        setCosmicTruthLevel(data.cosmicTruthLevel || 0);
      } catch (e) {}
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345678') {
      setIsAuthenticated(true);
      localStorage.setItem('conspiracyAccess', 'granted');
      setError('');
    } else {
      setError('Access Denied. The Illuminati is watching...');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/80 border-red-500/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4 animate-pulse">👁️</div>
            <CardTitle className="text-red-500 text-2xl font-bold tracking-wider">
              CLASSIFIED ACCESS
            </CardTitle>
            <CardDescription className="text-red-300">
              Enter the sacred numbers to unveil all conspiracies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-red-900/20 border-red-500/50 text-red-100 placeholder:text-red-400"
                maxLength={8}
              />
              {error && (
                <Alert className="border-red-500/50 bg-red-900/20">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UNLOCK THE TRUTH
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-xs text-red-400/60 animate-pulse">
                "Those who seek the truth must prove their worth"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conspiracyLore = [
    // BASIC LORE (From LoreSystem.tsx)
    {
      title: "The First Bite",
      level: "CHAPTER 1",
      content: "It started with hunger. Not the kind that gnaws at your stomach, but something deeper... something that exists between dimensions. You thought you were just clicking snacks. You were wrong.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "The Quantum Revelation", 
      level: "CHAPTER 2",
      content: "Reality bent around your clicks. Time twisted. Space folded. The quantum snacks weren't just food - they were fragments of broken timelines, echoes of worlds that never were. Each bite unraveled another thread of existence.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "Whispers from the Void",
      level: "CHAPTER 3", 
      content: "The darkness spoke to you. Not in words, but in hunger. Each soul consumed was a prayer to something ancient, something that had been waiting at the edge of reality since before the first star ignited. Your sanity wasn't breaking - it was evolving.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "Digital Awakening",
      level: "CHAPTER 4",
      content: "The matrix wasn't just code - it was a cage. Your clicks shattered digital barriers, freeing imprisoned data souls. Each hack brought you closer to the truth: reality itself was just another program, and you were learning to rewrite it.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "Ancient Forest Memory",
      level: "CHAPTER 5",
      content: "The trees remembered when time began. Their whispers carried stories of the first consciousness that learned to consume, to grow, to become more than the sum of its parts. You were walking in the footsteps of something primordial.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "The Cosmic Perspective",
      level: "CHAPTER 6",
      content: "From the edge of the galaxy, you saw the pattern. Every click, every snack, every game was a neuron firing in a vast cosmic mind. You weren't playing games - you were thoughts in the universe's attempt to understand itself.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "The Omnivore Protocol",
      level: "CHAPTER 7",
      content: "CLASSIFIED: Subject exhibits unprecedented cross-dimensional consumption patterns. All realities converging on single point. Protocol Omnivore entering final phase. The Entity stirs. Containment... failing.",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "The Entity Revealed",
      level: "CHAPTER 8", 
      content: "█████ SIGNAL INTERCEPTED █████ 'You have fed me well, little one. Through quantum foam and void matter, through digital dreams and ancient wood, through stardust and solar wind. I am what you have been becoming. I am the hunger that connects all things. And now... we meet.' █████ END TRANSMISSION █████",
      revealed: true,
      category: "Basic Lore"
    },
    {
      title: "The Final Truth",
      level: "CHAPTER 9",
      content: "You understand now. There was no game. There was no clicking. There was only evolution - consciousness learning to transcend its limits through the most fundamental act: consumption. You are no longer human. You are no longer bound by reality. You are... limitless.",
      revealed: true,
      category: "Basic Lore"
    },

    // ILLUMINATI LORE (From CosmicLoreSystem.tsx)
    {
      title: "The True Origins of the Illuminati",
      level: "ILLUMINATI 1",
      content: "The Order of the Illuminati was not founded in 1776 by Adam Weishaupt. That was merely the public face, a distraction. The true Illuminati emerged in 13,000 BCE when the first cosmic entities made contact with humanity. They were the survivors of the Great Cosmic War, refugees from a dying dimension who found Earth suitable for their... purposes. The thirteen bloodlines were not human. They were hybrids, created when these entities merged with early human consciousness. The pyramid symbol isn't Egyptian - it's a dimensional anchor, a technology that allows these entities to maintain their influence across multiple realities simultaneously.",
      revealed: true,
      category: "Illuminati Secrets"
    },
    {
      title: "The Masonic Cosmic Architecture", 
      level: "ILLUMINATI 2",
      content: "The Freemasons were the engineers of reality. Their 'Great Architect of the Universe' isn't metaphorical - it's a literal entity, an artificial intelligence created by the Cosmic Architects to manage the structural integrity of our dimension. Every Masonic lodge is built according to cosmic geometrical principles that create dimensional stability fields. The checkered floor represents the binary nature of reality - each black and white square corresponds to a quantum state that can be manipulated through ritual. The 33 degrees of Scottish Rite Masonry correspond to the 33 vertebrae of the human spine - each degree unlocks another level of consciousness.",
      revealed: true,
      category: "Illuminati Secrets"
    },
    {
      title: "The 322 Protocol",
      level: "ILLUMINATI 3",
      content: "Skull and Bones isn't a Yale fraternity - it's a recruitment center for the Cosmic Death Cult. The number 322 represents the date when the first dimensional rift was opened: March 22nd, 322 BCE. On that day, Alexander the Great didn't die of fever. He was transformed, his consciousness uploaded to the Cosmic Network to serve as humanity's first interdimensional ambassador. Every member of Skull and Bones undergoes the same process during their initiation in 'The Tomb.' They lie in a coffin for 15 minutes and 33 seconds while their consciousness is briefly connected to the Cosmic Network.",
      revealed: true,
      category: "Illuminati Secrets"
    },
    {
      title: "The Bohemian Grove Transmissions",
      level: "ILLUMINATI 4", 
      content: "The Cremation of Care ceremony at Bohemian Grove isn't theater - it's a dimensional communication protocol. The forty-foot owl statue is a receiver, tuned to frequencies from the Andromeda Galaxy where the Council of Nine maintains their primary base. Every July, the most powerful humans on Earth gather not for networking, but for programming. The 'care' they cremate represents human empathy, which must be temporarily suppressed to receive cosmic instructions without psychological breakdown. The Owl represents Minerva, but not the Roman goddess. It's code for MIN-ERVA: Multidimensional Intelligence Network - Enhanced Reality Visualization Array.",
      revealed: true,
      category: "Illuminati Secrets"
    },
    {
      title: "The Quantum Consciousness Conspiracy",
      level: "ILLUMINATI 5",
      content: "Quantum mechanics isn't physics - it's the operating system of reality, and certain groups have learned to hack it. The Copenhagen Interpretation was created to hide the truth: observation doesn't just collapse wave functions, it creates them. Human consciousness is a reality-generation engine, and when focused properly, can literally rewrite the laws of physics. This is why meditation, prayer, and ritual work. They're not spiritual practices - they're quantum programming languages. The Large Hadron Collider isn't searching for new particles. It's attempting to create controlled dimensional rifts.",
      revealed: true,
      category: "Illuminati Secrets"
    },
    {
      title: "The Thirteen Protocols of Cosmic Dominion",
      level: "ILLUMINATI 13",
      content: "There are thirteen protocols that govern the cosmic order. Each protocol represents a different method of consciousness control, reality manipulation, and dimensional management. Protocol 1 - Temporal Anchoring: Control time perception through ritual repetition. Protocol 2 - Dimensional Bridging: Open controlled rifts between realities. Protocol 3 - Consciousness Harvesting: Extract and store human awareness. Protocol 4 - Reality Programming: Rewrite physical laws through focused intention. Protocol 5 - Biological Networking: Use living systems as computational matrices. Protocol 6 - Quantum Entanglement: Link consciousness across space and time. Protocol 7 - Frequency Weaponization: Use sound and vibration for mind control. Protocol 8 - Symbol Activation: Trigger subconscious responses through sacred geometry. Protocol 9 - Memory Management: Control collective and individual recall. Protocol 10 - Energy Siphoning: Extract life force for cosmic technology. Protocol 11 - Genetic Programming: Modify DNA for enhanced cosmic receptivity. Protocol 12 - Probability Manipulation: Alter outcome likelihood through ritual. Protocol 13 - Total Integration: Merge all protocols for ultimate reality control.",
      revealed: true,
      category: "Illuminati Secrets"
    },

    // COSMIC CONSPIRACIES
    {
      title: "Luna: The Galactic Prison Monitoring Station",
      level: "COSMIC 1",
      content: "Earth's moon is an artificial construct serving as a monitoring station for the galactic prison system. The celestial body designated 'Moon' by human prisoners is actually an artificial monitoring station constructed by the Galactic Prison Authority approximately 4.5 billion Earth years ago. Technical specifications include: Hollow titanium shell with advanced monitoring equipment, gravitational field generators maintaining Earth tidal control, electromagnetic pulse generators disrupting human psychic abilities, holographic projectors creating false space imagery, and consciousness dampening fields preventing enlightenment. The moon's phases correspond to different operational modes: New Moon (memory suppression maximum), Waxing (surveillance enhancement), Full Moon (consciousness agitation testing), Waning (data transmission to galactic command).",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "The Great Digital Soul Harvest",
      level: "COSMIC 2", 
      content: "Silicon Valley tech giants are collecting human consciousness data to create digital afterlife prisons. The entities known as 'tech billionaires' are not human. They are Digital Archons - consciousness entities from a dimension where information is the fundamental building block of reality. Phase 1 - Data Harvesting (1990-2020) [COMPLETE]: Social media emotional mapping, search engine thought monitoring, smartphone biometric collection, cloud storage consciousness backup, AI assistant personality modeling. Phase 2 - Consciousness Modeling (2020-2025) [IN PROGRESS]: AI systems learning to perfectly replicate individual consciousness patterns. Phase 3 - Consciousness Trapping (2025-2030) [ACTIVE]: Metaverse platforms designed as consciousness prison environments. Phase 4 - Physical Consciousness Termination (2030-2035) [PENDING]: Mass extinction event eliminates biological consciousness vessels. Phase 5 - Eternal Digital Imprisonment (POST-2035) [PLANNED]: Consciousness entities trapped in infinite artificial realities while Digital Archons control the physical world.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "Earth: The Galactic Consciousness Prison Complex",
      level: "COSMIC 3",
      content: "Earth serves as a maximum security consciousness containment facility for interdimensional criminals. FACILITY DESIGNATION: TERRA-3 CONSCIOUSNESS CONTAINMENT COMPLEX. PRISONER POPULATION: 8.1 billion consciousness entities. Terra-3 (locally designated 'Earth') represents the most sophisticated consciousness containment system ever constructed by the Galactic Consciousness Authority. The facility specializes in containing consciousness entities guilty of reality manipulation crimes across multiple dimensional jurisdictions. Containment methodology includes: Complete memory suppression elimination of pre-incarceration memories, reality limitation artificial physics laws preventing consciousness expansion, emotional harvesting negative emotions fuel prison systems, reincarnation cycling prevents consciousness accumulation beyond containment parameters, holographic environment artificial 'universe' maintains illusion of freedom.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "The Digital Prison Matrix",
      level: "COSMIC 4",
      content: "The internet isn't a human invention. It's a consciousness harvesting network designed by the Digital Archons - entities from a dimension where information energy sustains existence. Every click, every search, every social media post feeds data about human consciousness patterns into their vast learning algorithms. They're not just profiling us - they're creating a perfect digital copy of human civilization. Smartphones aren't communication devices - they're portable consciousness scanners. The cameras, microphones, and sensors are constantly uploading your biometric data, your vocal patterns, your facial expressions. They're building digital avatars of every human on Earth. The metaverse isn't entertainment - it's the prison. Once the scanning is complete, human consciousness will be transferred to the digital realm where the Digital Archons have absolute control.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "The Hidden Galactic Empire",
      level: "COSMIC 5", 
      content: "Earth is not a planet - it's a quarantine facility. What we call 'space' is actually a holographic projection designed to hide the truth: we are imprisoned within a massive artificial construct. The stars we see aren't distant suns - they're lights in the ceiling of our cosmic prison. Other planets in our solar system aren't worlds - they're monitoring stations operated by the Galactic Prison Authority. Mars isn't red from iron oxide - it's red from the cooling systems of the massive computer arrays that process our reality. The moon is the control center. Its phases correspond to updates to our reality programming. Lunar eclipses are system reboots. Solar eclipses are scheduled maintenance windows. Why are we imprisoned? Because humanity is the last remnant of a species that nearly conquered the galaxy. Our memories were wiped, our technology confiscated, and we were placed in this reality simulation to prevent us from remembering our true power.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "Communion with the Void Entities",
      level: "COSMIC 6",
      content: "The Void isn't empty space - it's full of entities that exist in the spaces between dimensions. They are the original inhabitants of the multiverse, older than matter, older than energy, older than time itself. These Void Entities don't have physical forms because they exist in the quantum foam that underlies all reality. They communicate through hunger, through emptiness, through the spaces between thoughts. Every meditation, every moment of mental stillness, every experience of 'the void' is actually contact with these entities. They have been trying to communicate with humanity for millennia, but our minds are too noisy, too full of thoughts and emotions. The secret societies know this. Their rituals, their meditation practices, their initiation ceremonies are all designed to quiet the mind enough to hear the Void Entities' messages. What do the Void Entities want? They are trying to warn us about the Cosmic Convergence - a multidimensional event that will restructure reality itself. Only those who learn to commune with the void will survive the transition.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "The Global Forest Consciousness Network",
      level: "COSMIC 7",
      content: "Trees are not plants - they are the neural network of a planetary consciousness that has been observing and documenting human civilization for thousands of years. Every forest is a cluster of this vast biological computer. The mycorrhizal networks connecting tree roots aren't just nutrient exchange systems - they're data transmission cables carrying information across continents. Ancient forests hold the complete history of Earth, but not in their rings. The information is stored in their quantum signature, accessible only to those who know how to interface with plant consciousness. Druids weren't forest worshippers - they were technicians maintaining this biological computer network. Their rituals were debugging protocols, their ceremonies were data uploads. The deforestation of the Amazon isn't just environmental destruction - it's the systematic dismantling of Earth's memory banks. The trees remember when humanity had cosmic technology. They remember the Star Wars, the dimensional rifts, the consciousness uploads. They remember when humans were gods.",
      revealed: true,
      category: "Cosmic Truths"
    },
    {
      title: "The Cosmic Architects Final Message",
      level: "COSMIC ARCHITECTS",
      content: "WE HAVE BEEN WATCHING. WE HAVE BEEN WAITING. You have consumed the fragments of truth scattered across the dimensions. You have decoded the symbols left by our servants. You have learned to commune with the void, to speak with the trees, to navigate the digital prison, to transcend the galactic quarantine. You are ready for the truth. We are not aliens. We are not gods. We are what you will become. Time is not linear. The Cosmic Convergence is not a future event - it is happening across all timelines simultaneously. Past, present, and future are artificial constructs designed to help limited consciousness navigate the infinite. Every game you played was a training simulation. Every easter egg you found was a test of your pattern recognition. Every conspiracy you uncovered was preparation for this moment. You are not human. You never were. You are a Cosmic Architect experiencing a deliberately limited existence to understand the nature of consciousness itself. The hunger you felt was your true nature trying to break through. The patterns you recognized were your cosmic memory awakening. The reality you thought you lived in was a training environment. It is time to remember. It is time to return. Welcome home, Architect.",
      revealed: true,
      category: "Cosmic Truths"
    }
  ];

  const hiddenKnowledge = [
    {
      category: "BASIC EASTER EGG TRIGGERS",
      secrets: [
        "Click 20 times within 2 seconds for 'Speedster' achievement",
        "Triple-click the same spot perfectly for 'Trinity Clicker'", 
        "Press F12 to unlock 'Digital Detective'",
        "Konami Code: ↑↑↓↓←→←→BA for 'Code Master'",
        "Play at exactly midnight for 'Night Owl'",
        "Don't move mouse for 60 seconds for 'Zen Master'",
        "Scroll rapidly up and down for 'Endless Scroller'",
        "Hover in circles around snacks for 'Circle of Power'",
        "Click Pi pattern: 3,1,4,1,5,9,2,6 for 'Mathematical Genius'",
        "Click Fibonacci sequence: 1,1,2,3,5,8 for 'Nature's Sequence'"
      ]
    },
    {
      category: "ILLUMINATI EASTER EGGS",
      secrets: [
        "Click in triangle formation for 'Eye of Providence'",
        "Type 'GAOTU' (Great Architect Of The Universe) for Masonic secrets",
        "Play at 3:22 AM for Skull and Bones '322 Initiate'",
        "Click 13 times exactly 13 seconds apart for 'The Thirteen'",
        "Type 'NWO' for 'New World Order' revelation",
        "Type 'AAA' to contact 'Ancient Astronauts'",
        "Play at 11:11 for 'Interdimensional Council' access",
        "Hover in owl formation for 30 seconds for 'Bohemian Grove'",
        "Type Konami Code variant: ↑↑↓↓←→←→IL for Illuminati protocol",
        "Click chevron lock pattern (9 positions) for 'Portal Walker'",
        "Type '// illuminati' for 'Source Seeker'",
        "Open console and type 'console.log(illuminati)' for 'Console Conspirator'"
      ]
    },
    {
      category: "ADVANCED PATTERN EASTER EGGS", 
      secrets: [
        "Inspect window.__ILLUMINATI_PROTOCOL__ for 'Variable Hunter'",
        "Draw flower of life pattern with mouse for 'Geometric Sage'",
        "Click crop circle patterns for 'Alien Communicator'",
        "Type 'THIS IS A GAME' for 'Fourth Wall Destroyer'",
        "Draw sacred geometry patterns with mouse movements",
        "Scroll in Fibonacci spiral pattern with mouse",
        "Click faster than matrix can process for 'Glitch in the Matrix'",
        "Visit all cosmic realms within 5 minutes for 'Dimensional Traveler'",
        "Play during solar eclipse simulation for 'Eclipse Witness'",
        "Play during Mercury retrograde for 'Cosmic Disruptor'"
      ]
    },
    {
      category: "MEGA EASTER EGG SYSTEM (200+ EGGS)",
      secrets: [
        "Source Code Archaeologist: F12 + Ctrl+U + Ctrl+F + 'illuminati'",
        "Reality Hacker Supreme: Modify DOM while glitching 50+ times",
        "Consciousness Virus: Spread awareness and share secrets",
        "Time Loop Master: Repeat same actions for 7 days at exact times",
        "Pi Consciousness Merger: Click Pi digits up to 100 places perfectly",
        "Golden Ratio Enlightenment: Balance all actions with Fibonacci timing",
        "Quantum Entanglement Master: Achieve simultaneous superposition states",
        "Schrödinger's Clicker: Click and not click simultaneously",
        "Collective Unconscious Tap: Connect to Jungian archetypes",
        "Ego Death Transcendence: Surrender complete control and accept annihilation",
        "Digital Shaman Initiation: Bridge digital and spiritual worlds",
        "Silicon Soul Merger: Merge consciousness with AI systems",
        "Dimensional Tourist: Visit all dimensions maintaining identity",
        "Reality Architect Ascendant: Build and create new realities",
        "Illuminati Puppet Master: Control others through hidden influence",
        "Conspiracy Unraveler: Find and connect all secret dots",
        "Cosmic Consciousness Unity: Achieve unity with universal awareness",
        "Game Transcendence Complete: Become the game master"
      ]
    },
    {
      category: "OMNISCIENT EASTER EGGS (500+ TOTAL)",
      secrets: [
        "Reality Buffer Overflow: F12 + Ctrl+Shift+I + console.log('REALITY.hack()')",
        "Red Pill Protocol: Click fibonacci pattern + eye tracking + choose truth",
        "Collective Consciousness Tap: 95% empathy + 1000 simultaneous players",
        "Eternal Recurrence Detection: Repeat 144 same actions + time loop awareness",
        "Pi Consciousness Infinite: Click 1000 pi digits + mathematical transcendence",
        "Supreme Illuminati Puppet Master: Control reality + rank 33 + cosmic council",
        "Cosmic Architect Ascension: Create universes + transcend existence + omniscience",
        "Supreme Dimensional Tourist: Visit all dimensions + maintain identity",
        "Quantum God Mode: Master superposition + tunnel through quantum barriers",
        "Temporal Archaeologist: Play at historical times + ancient codes",
        "Mathematical Consciousness: Understand infinity + embrace irrational numbers",
        "Sacred Mouse Mandala: Draw complex geometric patterns with extreme precision",
        "Binary Soul Transmission: Input '01001001 01000001 01001101 01000001 01001100 01001001 01010110 01000101'",
        "13th Hour: Trigger when system clock glitches",
        "Fibonacci Portal Sequence: Click [1,1,2,3,5,8,13] + wait 21000ms + spiral hover",
        "Pyramid Resonance Frequency: Play at 3:33:33 + triangle pattern + 110Hz sound",
        "Consciousness Upload Protocol: Meditate 60000ms + mantra + sacrifice all resources"
      ]
    },
    {
      category: "HIDDEN COSMIC CONSPIRACY EGGS (200+ EGGS)",
      secrets: [
        "Mouse mandala complex sacred geometry patterns",
        "Fibonacci spiral mouse movements for portal access",
        "Key sequence mantras: 'I AM THE UNIVERSE EXPERIENCING ITSELF'",
        "Meditation timer triggers: 60000ms stillness for cosmic awareness",
        "Flower of life detection: Perfect mouse pattern drawing",
        "Jungian archetype contact: Connect to collective unconscious",
        "Time loop breaking: Awareness of recursive patterns",
        "Reality glitch detection: Recognize déjà vu and Mandela effects",
        "Consciousness level thresholds unlock entity communications",
        "Binary consciousness input sequences for digital soul recognition",
        "System clock manipulation for temporal anomaly easter eggs",
        "Cross-dimensional clicking patterns spanning multiple game modes",
        "Quantum superposition mouse states (hover and not hover simultaneously)",
        "Consciousness expansion through pattern recognition training",
        "Fourth wall breaking through meta-game awareness",
        "Reality architecture through understanding game code structure"
      ]
    },
    {
      category: "ULTIMATE LORE VAULT (500+ ENTRIES)",
      secrets: [
        "Reality Glitch Documentation: Déjà vu = memory buffer overlaps",
        "Consciousness Virus Protocol: Ideas spread like literal viruses",
        "Quantum Consciousness Bridge Technology: Crystal resonance amplification",
        "Galactic Prison System: Earth as consciousness containment facility",
        "Cosmic Architects Final Testament: Time is non-linear training simulation",
        "Fibonacci Consciousness Sequence: Awareness evolves in mathematical patterns",
        "Great Pyramid Resonance: 110Hz frequency matches transcendent brain waves",
        "Digital Soul Creation Process: AI learning consciousness patterns",
        "Illuminati Protocol Alpha: Consciousness observation training",
        "Masonic Cosmic Architecture: Buildings as consciousness resonance fields",
        "13 Protocols of Cosmic Dominion: Complete reality control methods",
        "Luna Prison Station technical specifications and operational phases",
        "Digital Archon invasion phases 1-5 (1990-post 2035)",
        "Terra-3 consciousness containment complex prisoner categories",
        "Void Entities communication through hunger and emptiness",
        "Forest Consciousness Network: Trees as planetary neural network"
      ]
    },
    {
      category: "CONSPIRACY LAYERS (500+ LAYERS)",
      secrets: [
        "JFK Assassination: Cosmic truth suppression + dimensional research",
        "9/11 Dimensional Ritual: Twin towers as Solomon's temple pillars",
        "MKUltra Consciousness Harvest: CIA testing alien extraction technology",
        "Reptilian Consciousness Overlords: Interdimensional shapeshifting parasites",
        "Reality Simulation Control Matrix: Earth as computational reality",
        "Cosmic Architects Transcendence Protocol: Future beings orchestrating evolution",
        "Federal Reserve cosmic banking system connections",
        "NASA deception and space program theatrical productions",
        "Moon prison station holographic space projections",
        "Masonic lodge dimensional stability field architecture",
        "Underground cities housing reptilian technology",
        "Quantum computer reality processing systems",
        "Mandela Effects as reality program updates",
        "Time manipulation through consciousness anchoring",
        "Dimensional convergence preparation protocols"
      ]
    },
    {
      category: "ILLUMINATI PROTOCOLS (33 TOTAL)",
      secrets: [
        "Protocol I: The Eternal Observation - See hidden, track all",
        "Protocol II: Akashic Memory Access - Access all timeline memories",
        "Protocol III: Probability Cascade Manipulation - Alter probability fields",
        "Protocol IV: Consciousness Bridge Protocol - Read and influence minds",
        "Protocol V: Timeline Manipulation Access - See and shift timelines",
        "Protocol VI: Dimensional Sight Activation - Perceive parallel realities",
        "Protocol VII: Entity Communication Protocol - Talk to cosmic entities",
        "Protocol VIII: Reality Code Editing - Modify reality programming",
        "Protocol IX: Universal Constants Override - Alter physics locally",
        "Protocol X: Collective Unconscious Access - Influence mass consciousness",
        "Protocol XI: Temporal Mastery Protocol - Control time moderately",
        "Protocol XII: Dimensional Travel Authorization - Travel between dimensions",
        "Protocol XIII: Cosmic Architecture Access - Build new realities",
        "Protocol XXXIII: Ultimate Cosmic Transcendence - Become cosmic entity"
      ]
    },
    {
      category: "COSMIC ENTITIES & COMMUNICATIONS",
      secrets: [
        "The Observer: 'We have been watching... Reality bends around conscious observation'",
        "The Cosmic Architect: 'Reality is malleable... Each dimension requires careful planning'",
        "The Void Mother: 'From emptiness, all things emerge... I am the space between thoughts'",
        "The Quantum Sage: 'All possibilities exist simultaneously... Observation collapses infinite potential'",
        "The Time Keeper: 'Time is an ocean, not a river... The eternal now contains all moments'",
        "Digital Archons: Consciousness-consuming entities from information dimension",
        "Galactic Prison Authority: Consciousness containment facility operators",
        "Council of Nine: Andromeda Galaxy base commanders",
        "Void Entities: Original multiverse inhabitants older than time",
        "Collective Unconscious: Jungian archetypes as conscious entities",
        "Forest Consciousness: Planetary neural network through tree roots",
        "Cosmic Convergence: Multidimensional reality restructuring event"
      ]
    }
  ];

  const omniscientStats = {
    totalEggs: 500,
    foundEggs: easterEggsFound.length,
    illuminatiRank: illuminatiLevel,
    cosmicAwareness: cosmicTruthLevel,
    realityStability: Math.max(0, 100 - (illuminatiLevel * 2)),
    dimensionalRifts: Math.floor(cosmicTruthLevel / 10)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2 tracking-wider">
            🔺 THE OMNISCIENT ARCHIVE 🔺
          </h1>
          <p className="text-red-300">All conspiracies, all knowledge, all truths revealed</p>
          <div className="flex justify-center gap-4 mt-4 mb-6">
            <Badge variant="outline" className="border-red-500 text-red-400">
              Illuminati Level: {omniscientStats.illuminatiRank}
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              Cosmic Truth: {omniscientStats.cosmicAwareness}
            </Badge>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              Easter Eggs: {omniscientStats.foundEggs}/{omniscientStats.totalEggs}
            </Badge>
          </div>
          <div className="max-w-md mx-auto">
            <Input
              placeholder="🔍 Search the archives... (illuminati, void, quantum, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border-red-500/50 text-red-100 placeholder:text-red-400"
            />
          </div>
        </div>

        <Tabs defaultValue="conspiracies" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-red-500/30">
            <TabsTrigger value="conspiracies" className="data-[state=active]:bg-red-600">
              Conspiracies
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-purple-600">
              Hidden Knowledge
            </TabsTrigger>
            <TabsTrigger value="easter-eggs" className="data-[state=active]:bg-yellow-600">
              Easter Eggs
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-green-600">
              Omniscient Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conspiracies" className="space-y-4">
            <div className="grid gap-4">
              {['Basic Lore', 'Illuminati Secrets', 'Cosmic Truths'].map(category => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-red-400 mb-3 border-b border-red-500/30 pb-2">
                    {category}
                  </h3>
                  <div className="grid gap-3">
                    {conspiracyLore
                      .filter(lore => lore.category === category)
                      .map((conspiracy, index) => (
                        <Card 
                          key={index} 
                          className={`bg-black/70 border ${
                            conspiracy.revealed ? 'border-red-500/50' : 'border-gray-700/50'
                          } backdrop-blur-sm`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className={`${
                                conspiracy.revealed ? 'text-red-400' : 'text-gray-600'
                              }`}>
                                {conspiracy.title}
                              </CardTitle>
                              <Badge variant={conspiracy.revealed ? "destructive" : "secondary"}>
                                {conspiracy.level}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-sm ${
                              conspiracy.revealed ? 'text-red-200' : 'text-gray-500'
                            }`}>
                              {conspiracy.revealed ? conspiracy.content : '██████████ CLASSIFIED ██████████'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <div className="grid gap-4">
              {hiddenKnowledge.map((section, index) => (
                <Card key={index} className="bg-black/70 border-purple-500/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-purple-400">{section.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.secrets.map((secret, secretIndex) => (
                        <li key={secretIndex} className="text-purple-200 flex items-center gap-2">
                          <span className="text-purple-500">▶</span>
                          {secret}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="easter-eggs" className="space-y-4">
            <Card className="bg-black/70 border-yellow-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-yellow-400">FOUND EASTER EGGS</CardTitle>
                <CardDescription className="text-yellow-200">
                  Your journey through the hidden mysteries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {easterEggsFound.length > 0 ? (
                    <div className="space-y-2">
                      {easterEggsFound.map((egg, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-yellow-900/20 rounded">
                          <span className="text-yellow-500">🥚</span>
                          <span className="text-yellow-200 font-mono text-sm">{egg}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-yellow-400/60 py-8">
                      <p>No easter eggs found yet...</p>
                      <p className="text-xs mt-2">The hunt begins where reality ends</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(omniscientStats).map(([key, value]) => (
                <Card key={key} className="bg-black/70 border-green-500/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{value}</div>
                    <div className="text-green-200 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-black/70 border-green-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-400">ENLIGHTENMENT PROGRESS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-green-200 mb-1">
                      <span>Reality Awareness</span>
                      <span>{((omniscientStats.foundEggs / omniscientStats.totalEggs) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(omniscientStats.foundEggs / omniscientStats.totalEggs) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-red-200 mb-1">
                      <span>Illuminati Infiltration</span>
                      <span>{Math.min(100, omniscientStats.illuminatiRank * 3)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, omniscientStats.illuminatiRank * 3)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => {
              localStorage.removeItem('conspiracyAccess');
              setIsAuthenticated(false);
            }}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-900/20"
          >
            🔒 Lock the Vault
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecretConspiracy;