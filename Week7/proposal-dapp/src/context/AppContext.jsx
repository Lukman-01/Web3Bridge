import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingProposals, setIsCreatingProposals] = useState(false)


    return (
      <AppContext.Provider value={{ 
        isLoading,
        setIsLoading, 
        isCreatingProposals, 
        setIsCreatingProposals, 
      }}>
          {children}
      </AppContext.Provider>
    );
};