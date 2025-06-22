import { createContext, useContext } from 'react';

interface ActiveCardContextProps {
  activeCard: string | undefined;
  setActiveCard: (id: string | undefined) => void;
}

export const ActiveCardContext = createContext<ActiveCardContextProps | undefined>(undefined);

export const useActiveCard = () => {
  const context = useContext(ActiveCardContext);
  if (!context) {
    throw new Error('useActiveCard must be used within an ActiveCardProvider');
  }
  return context;
};
