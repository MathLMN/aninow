
// Configuration mode utilities
const CONFIG_MODE_KEY = 'aninow_config_mode';

export interface ConfigMode {
  enabled: boolean;
  enabledAt: number;
  expiresAt: number;
}

export const enableConfigMode = (durationMinutes: number = 60): ConfigMode => {
  const now = Date.now();
  const config: ConfigMode = {
    enabled: true,
    enabledAt: now,
    expiresAt: now + (durationMinutes * 60 * 1000)
  };
  
  localStorage.setItem(CONFIG_MODE_KEY, JSON.stringify(config));
  console.log('🔧 Configuration mode enabled for', durationMinutes, 'minutes');
  
  return config;
};

export const disableConfigMode = (): void => {
  localStorage.removeItem(CONFIG_MODE_KEY);
  console.log('🔧 Configuration mode disabled');
};

export const getConfigMode = (): ConfigMode | null => {
  try {
    const stored = localStorage.getItem(CONFIG_MODE_KEY);
    if (!stored) return null;
    
    const config: ConfigMode = JSON.parse(stored);
    const now = Date.now();
    
    // Check if expired
    if (now > config.expiresAt) {
      disableConfigMode();
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('Error reading config mode:', error);
    disableConfigMode();
    return null;
  }
};

export const isConfigModeEnabled = (): boolean => {
  const config = getConfigMode();
  return config?.enabled === true;
};

export const getRemainingConfigTime = (): number => {
  const config = getConfigMode();
  if (!config) return 0;
  
  const remaining = Math.max(0, config.expiresAt - Date.now());
  return Math.ceil(remaining / (60 * 1000)); // Return minutes
};
