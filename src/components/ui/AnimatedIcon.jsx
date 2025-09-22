import React, { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';

const AnimatedIcon = ({ 
  animationData, 
  size = 50, 
  className = "",
  autoplay = false,
  loop = false,
  play = false
}) => {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current) {
      if (play) {
        lottieRef.current.play();
      } else if (!loop) {
        lottieRef.current.stop();
      }
    }
  }, [play, loop]);

  if (!animationData) {
    return (
      <div
        className={`inline-block ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-500">?</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={autoplay}
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedIcon;