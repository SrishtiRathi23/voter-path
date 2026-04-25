import React, { createContext, useState } from 'react';

export const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <ChecklistContext.Provider value={{ checkedItems, toggleItem, completedCount }}>
      {children}
    </ChecklistContext.Provider>
  );
};
