// Theme constants for the modern fitness app

export const COLORS = {
    // Primary colors
    primary: '#FF6B00', // Vibrant orange
    primaryLight: '#FF8F3C',
    primaryDark: '#CC5500',
    
    // Secondary colors
    secondary: '#000000', // Black
    secondaryLight: '#333333',
    secondaryDark: '#000000',
    
    // Accent colors
    accent: '#FFFFFF', // White
    accentDark: '#F0F0F0',
    accentLight: '#FFFFFF',
    
    // Status colors
    success: '#28C76F', // Green
    warning: '#FFAB00', // Yellow
    error: '#EA5455', // Red
    info: '#00CFE8', // Blue
    
    // Text colors
    textDark: '#000000',
    textLight: '#FFFFFF',
    textGrey: '#777777',
    textLightGrey: '#BBBBBB',
    
    // Background colors
    background: '#121212',
    backgroundLight: '#222222',
    card: '#1E1E1E',
    cardLight: '#2A2A2A',
    
    // Gradient colors
    gradientStart: '#FF6B00',
    gradientEnd: '#FF8F3C',
    
    // Transparent colors
    transparent: 'transparent',
    transparentWhite: 'rgba(255, 255, 255, 0.1)',
    transparentBlack: 'rgba(0, 0, 0, 0.7)',
    
    // Chart colors
    chartColors: ['#FF6B00', '#333333', '#555555', '#777777', '#999999']
  };
  
  export const SIZES = {
    // Global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    
    // Font sizes
    h1: 30,
    h2: 24,
    h3: 18,
    h4: 16,
    body1: 16,
    body2: 14,
    body3: 12,
    body4: 10,
    
    // App dimensions
    width: "100%",
    height: "100%"
  };
  
  export const FONTS = {
    h1: {
      fontFamily: 'Poppins_700Bold',
      fontSize: SIZES.h1,
      lineHeight: 36
    },
    h2: {
      fontFamily: 'Poppins_700Bold',
      fontSize: SIZES.h2,
      lineHeight: 30
    },
    h3: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: SIZES.h3,
      lineHeight: 24
    },
    h4: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: SIZES.h4,
      lineHeight: 22
    },
    body1: {
      fontFamily: 'Poppins_400Regular',
      fontSize: SIZES.body1,
      lineHeight: 22
    },
    body2: {
      fontFamily: 'Poppins_400Regular',
      fontSize: SIZES.body2,
      lineHeight: 20
    },
    body3: {
      fontFamily: 'Poppins_400Regular',
      fontSize: SIZES.body3,
      lineHeight: 18
    },
    body4: {
      fontFamily: 'Poppins_400Regular',
      fontSize: SIZES.body4,
      lineHeight: 14
    },
    button: {
      fontFamily: 'Poppins_500Medium',
      fontSize: SIZES.body2,
      lineHeight: 20
    },
    caption: {
      fontFamily: 'Poppins_300Light',
      fontSize: SIZES.body4,
      lineHeight: 14
    }
  };
  
  export const SHADOWS = {
    light: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    dark: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  };
  
  const appTheme = { COLORS, SIZES, FONTS, SHADOWS };
  
  export default appTheme;