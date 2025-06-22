import { createContext, useContext } from 'react';

export interface Orientation {
  absolute: boolean;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  relative: {
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export const defaultOrientation: Orientation = {
  absolute: false,
  alpha: null,
  beta: null,
  gamma: null,
  relative: {
    alpha: 0,
    beta: 0,
    gamma: 0,
  },
};

export const OrientationContext = createContext<Orientation>(defaultOrientation);

export const useOrientation = () => useContext(OrientationContext);
