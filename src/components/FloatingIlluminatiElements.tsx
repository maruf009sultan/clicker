import React, { useState, useEffect, useCallback } from 'react';

interface FloatingElement {
  id: string;
  type: 'hacker_mask' | 'illuminati_eye' | 'pyramid' | 'skull' | 'owl' | 'masonic_symbol' | 'cosmic_portal';
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  opacity: number;
  lifespan: number;
  age: number;
  symbol: string;
  color: string;
}

const ILLUMINATI_SYMBOLS = {
  hacker_mask: '🎭',
  illuminati_eye: '👁️',
  pyramid: '🔺',
  skull: '☠️',
  owl: '🦉',
  masonic_symbol: '🏛️',
  cosmic_portal: '🌀'
};

const COSMIC_COLORS = [
  'rgb(148, 0, 211)', // Dark violet
  'rgb(255, 0, 102)', // Hot pink
  'rgb(0, 255, 255)', // Cyan
  'rgb(255, 215, 0)', // Gold
  'rgb(255, 69, 0)', // Red orange
  'rgb(50, 205, 50)', // Lime green
  'rgb(138, 43, 226)' // Blue violet
];

interface FloatingIlluminatiElementsProps {
  illuminatiLevel?: number;
  cosmicTruthLevel?: number;
  easterEggsFound?: string[];
  isActive?: boolean;
}

export const FloatingIlluminatiElements: React.FC<FloatingIlluminatiElementsProps> = ({
  illuminatiLevel = 0,
  cosmicTruthLevel = 0,
  easterEggsFound = [],
  isActive = true
}) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [nextId, setNextId] = useState(0);

  // Create floating element
  const createFloatingElement = useCallback((type?: keyof typeof ILLUMINATI_SYMBOLS) => {
    const elementType = type || (Object.keys(ILLUMINATI_SYMBOLS) as Array<keyof typeof ILLUMINATI_SYMBOLS>)[
      Math.floor(Math.random() * Object.keys(ILLUMINATI_SYMBOLS).length)
    ];

    const element: FloatingElement = {
      id: `element-${nextId}`,
      type: elementType,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.4,
      lifespan: 10000 + Math.random() * 20000, // 10-30 seconds
      age: 0,
      symbol: ILLUMINATI_SYMBOLS[elementType],
      color: COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)]
    };

    setNextId(prev => prev + 1);
    return element;
  }, [nextId]);

  // Add elements based on illuminati level and activities
  useEffect(() => {
    if (!isActive || illuminatiLevel === 0) return;

    const spawnRate = Math.max(100, 5000 - (illuminatiLevel * 150)); // More frequent at higher levels
    const maxElements = Math.min(20, illuminatiLevel * 2);

    const interval = setInterval(() => {
      setElements(prev => {
        if (prev.length >= maxElements) return prev;
        
        // Determine what type of element to spawn based on recent activities
        let elementType: keyof typeof ILLUMINATI_SYMBOLS | undefined;
        
        if (easterEggsFound.includes('illuminati_triangle')) {
          elementType = Math.random() < 0.3 ? 'illuminati_eye' : undefined;
        }
        if (easterEggsFound.includes('browser_detective') || easterEggsFound.includes('console_conspirator')) {
          elementType = Math.random() < 0.4 ? 'hacker_mask' : elementType;
        }
        if (easterEggsFound.includes('skull_and_bones')) {
          elementType = Math.random() < 0.3 ? 'skull' : elementType;
        }
        if (easterEggsFound.includes('bohemian_grove')) {
          elementType = Math.random() < 0.3 ? 'owl' : elementType;
        }
        if (cosmicTruthLevel > 50) {
          elementType = Math.random() < 0.2 ? 'cosmic_portal' : elementType;
        }

        return [...prev, createFloatingElement(elementType)];
      });
    }, spawnRate);

    return () => clearInterval(interval);
  }, [illuminatiLevel, cosmicTruthLevel, easterEggsFound, isActive, createFloatingElement]);

  // Update element positions and remove expired ones
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setElements(prev => prev
        .map(element => ({
          ...element,
          x: element.x + element.vx,
          y: element.y + element.vy,
          rotation: element.rotation + 1,
          age: element.age + 16, // ~60fps
          opacity: element.opacity * (1 - element.age / element.lifespan)
        }))
        .filter(element => {
          // Remove if expired or out of bounds
          const expired = element.age >= element.lifespan;
          const outOfBounds = element.x < -100 || element.x > window.innerWidth + 100 ||
                             element.y < -100 || element.y > window.innerHeight + 100;
          return !expired && !outOfBounds;
        })
      );
    }, 16); // ~60fps

    return () => clearInterval(animationInterval);
  }, []);

  // Special events that trigger element bursts
  useEffect(() => {
    const handleSpecialEvent = (eventType: string) => {
      let burstCount = 5;
      let burstType: keyof typeof ILLUMINATI_SYMBOLS = 'hacker_mask';

      switch (eventType) {
        case 'illuminati_discovered':
          burstCount = 13;
          burstType = 'illuminati_eye';
          break;
        case 'masonic_activated':
          burstCount = 7;
          burstType = 'masonic_symbol';
          break;
        case 'cosmic_breakthrough':
          burstCount = 9;
          burstType = 'cosmic_portal';
          break;
      }

      // Create burst of elements
      const burstElements = Array.from({ length: burstCount }, () => createFloatingElement(burstType));
      setElements(prev => [...prev, ...burstElements]);
    };

    // Check for special events based on easter eggs
    const recentEgg = easterEggsFound[easterEggsFound.length - 1];
    if (recentEgg) {
      if (recentEgg.includes('illuminati')) {
        handleSpecialEvent('illuminati_discovered');
      } else if (recentEgg.includes('masonic')) {
        handleSpecialEvent('masonic_activated');
      } else if (recentEgg.includes('cosmic') || cosmicTruthLevel > 90) {
        handleSpecialEvent('cosmic_breakthrough');
      }
    }
  }, [easterEggsFound, cosmicTruthLevel, createFloatingElement]);

  // Handle mouse interaction - elements are attracted to cursor
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (illuminatiLevel < 5) return; // Only activate at higher levels

      setElements(prev => prev.map(element => {
        const dx = event.clientX - element.x;
        const dy = event.clientY - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = 0.1 * (1 - distance / 200);
          return {
            ...element,
            vx: element.vx + (dx / distance) * force,
            vy: element.vy + (dy / distance) * force
          };
        }
        return element;
      }));
    };

    if (illuminatiLevel >= 5) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [illuminatiLevel]);

  if (!isActive || illuminatiLevel === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute select-none"
          style={{
            left: element.x,
            top: element.y,
            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
            opacity: element.opacity,
            color: element.color,
            textShadow: `0 0 10px ${element.color}`,
            fontSize: '2rem',
            transition: 'transform 0.1s ease-out',
            animation: element.type === 'cosmic_portal' ? 'spin 2s linear infinite' : 
                      element.type === 'illuminati_eye' ? 'pulse 1s ease-in-out infinite' :
                      'none'
          }}
        >
          {element.symbol}
        </div>
      ))}
      
      {/* Hidden messages that appear at high illuminati levels */}
      {illuminatiLevel >= 10 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div 
            className="text-red-500 text-xs opacity-20 animate-pulse"
            style={{ 
              textShadow: '0 0 20px red',
              animation: 'flicker 3s ease-in-out infinite'
            }}
          >
            WE ARE WATCHING
          </div>
        </div>
      )}
      
      {illuminatiLevel >= 20 && (
        <div className="fixed bottom-10 left-10 pointer-events-none">
          <div 
            className="text-yellow-500 text-xs opacity-15 animate-pulse"
            style={{ 
              textShadow: '0 0 20px yellow',
              animation: 'flicker 4s ease-in-out infinite reverse'
            }}
          >
            THE TRUTH IS IN THE CODE
          </div>
        </div>
      )}

      {illuminatiLevel >= 30 && (
        <div className="fixed top-10 right-10 pointer-events-none">
          <div 
            className="text-purple-500 text-xs opacity-10 animate-pulse"
            style={{ 
              textShadow: '0 0 20px purple',
              animation: 'flicker 5s ease-in-out infinite'
            }}
          >
            // illuminati
          </div>
        </div>
      )}

    </div>
  );
};