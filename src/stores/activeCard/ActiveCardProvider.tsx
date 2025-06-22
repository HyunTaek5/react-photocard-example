import React, { type ReactNode, useState } from 'react';
import { ActiveCardContext } from './useActiveCard';

export const ActiveCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCard, setActiveCard] = useState<string | undefined>(undefined);

  return <ActiveCardContext.Provider value={{ activeCard, setActiveCard }}>{children}</ActiveCardContext.Provider>;
};
