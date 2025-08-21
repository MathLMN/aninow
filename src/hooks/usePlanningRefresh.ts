
import { useState, useCallback } from 'react';

export const usePlanningRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const forceRefresh = useCallback(() => {
    console.log('🔄 Forcing planning refresh');
    setRefreshKey(prev => prev + 1);
  }, []);

  return {
    refreshKey,
    forceRefresh
  };
};
