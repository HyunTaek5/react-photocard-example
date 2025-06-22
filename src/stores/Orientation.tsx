import React, { type ReactNode, useEffect, useState } from 'react';
import { defaultOrientation, type Orientation, OrientationContext } from './orientation/useOrientation.ts';

export const OrientationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orientation, setOrientation] = useState<Orientation>(defaultOrientation);
  const [baseOrientation, setBaseOrientation] = useState<Orientation['relative'] | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta == null || event.gamma == null || event.alpha == null) return;

    const relative = {
      beta: event.beta,
      gamma: event.gamma,
      alpha: event.alpha,
    };

    if (!baseOrientation) {
      setBaseOrientation({ ...relative });
    }

    const rel = {
      beta: baseOrientation ? event.beta - baseOrientation.beta : 0,
      gamma: baseOrientation ? event.gamma - baseOrientation.gamma : 0,
      alpha: baseOrientation ? event.alpha - baseOrientation.alpha : 0,
    };

    setOrientation({
      absolute: event.absolute,
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      relative: rel,
    });
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [baseOrientation, handleOrientation]);

  return <OrientationContext.Provider value={orientation}>{children}</OrientationContext.Provider>;
};
