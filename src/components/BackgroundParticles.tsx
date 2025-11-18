import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'square' | 'triangle';
}

export const BackgroundParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 5,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute opacity-10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float-slow ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.shape === 'circle' && (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-xl" />
          )}
          {particle.shape === 'square' && (
            <div className="w-full h-full rotate-45 bg-gradient-to-br from-accent/20 to-primary/20 blur-xl" />
          )}
          {particle.shape === 'triangle' && (
            <div 
              className="w-full h-full bg-gradient-to-br from-primary/25 to-accent/25 blur-xl"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
