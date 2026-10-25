import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { themes } from './themes';

export default function ThemeWrapper({ children }) {
  const { user } = useApp();
  
  // FIX: Use optional chaining (user?.theme) so it doesn't crash if user is null
  const activeTheme = themes[user?.theme] || themes.cute;

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--font-main', activeTheme.font);
    root.style.setProperty('--bg-color', activeTheme.bgColor);
    root.style.setProperty('--bg-pattern', activeTheme.bgPattern);
    root.style.setProperty('--bg-size', activeTheme.bgSize);
    root.style.setProperty('--bg-position', activeTheme.bgPosition);
    
    root.style.setProperty('--primary', activeTheme.primaryColor);
    root.style.setProperty('--secondary', activeTheme.secondaryColor);
    
    root.style.setProperty('--card-bg', activeTheme.cardBg);
    root.style.setProperty('--card-border', activeTheme.cardBorder);
    root.style.setProperty('--card-shadow', activeTheme.cardShadow);
    
    root.style.setProperty('--text-main', activeTheme.textColor);
    root.style.setProperty('--text-muted', activeTheme.textMuted);
    root.style.setProperty('--text-on-primary', activeTheme.textOnPrimary);
    
    root.style.setProperty('--chip-bg', activeTheme.chipBg);
    root.style.setProperty('--chip-color', activeTheme.chipColor);

    if (activeTheme.id === 'space') {
      document.body.style.backgroundImage = activeTheme.bgPattern;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = activeTheme.bgPattern;
      document.body.style.backgroundSize = activeTheme.bgSize;
      document.body.style.backgroundAttachment = 'initial';
    }
    
  }, [activeTheme]);

  return children;
}