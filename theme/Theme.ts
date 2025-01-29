import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const LightTheme: ThemeTypes = {
    name: 'LightTheme',
    dark: false,
    variables: {
        'border-color': '#eeeeee',
        'carousel-control-size': 10
    },
    colors: {
        primary: '#5D87FF',
        secondary: '#49BEFF',
        info: '#539BFF',
        success: '#00DC82',
        accent: '#FFAB91',
        warning: '#FFAE1F',
        error: '#FA896B',
        muted:'#5a6a85',
        lightprimary: '#ECF2FF',
        lightsecondary: '#E8F7FF',
        lightsuccess: '#E6FFFA',
        lighterror: '#FDEDE8',
        lightwarning: '#FEF5E5',
        textPrimary: '#2A3547',
        textSecondary: '#2A3547',
        borderColor: '#e5eaef',
        inputBorder: '#000',
        active: '#2A3547',
        containerBg: '#ffffff',
        hoverColor: '#f6f9fc',
        surface: '#fff',
        'on-surface-variant': '#fff',
        grey100: '#F2F6FA',
        grey200: '#EAEFF4'
    }
};

const DarkTheme: ThemeTypes = {
    name: 'DarkTheme',
    dark: true,
    variables: {
        'border-color': '#333333',  // Cor de borda mais escura
        'carousel-control-size': 10
    },
    colors: {
        primary: '#5D87FF',          // Azul principal
        secondary: '#49BEFF',        // Azul secundário
        info: '#539BFF',             // Azul informativo
        success: '#00DC82',          // Verde sucesso
        accent: '#FFAB91',           // Cor de destaque
        warning: '#FFAE1F',          // Amarelo de alerta
        error: '#FA896B',            // Vermelho de erro
        muted: '#5a6a85',            // Cor mais suave
        lightprimary: '#ECF2FF',     // Cor de fundo clara para o modo escuro
        lightsecondary: '#E8F7FF',
        lightsuccess: '#E6FFFA',
        lighterror: '#FDEDE8',
        lightwarning: '#FEF5E5',
        textPrimary: '#F1F1F1',      // Cor de texto principal mais clara
        textSecondary: '#B0B0B0',    // Cor de texto secundário mais suave
        active: '#2A2A2A',
        borderColor: '#222222',      // Cor de borda mais escura
        inputBorder: '#00DC82',      // Cor de borda de input
        containerBg: '#2A2A2A',      // Cor de fundo do container escuro
        hoverColor: '#444444',       // Cor de hover mais escura
        surface: '#121212',          // Cor de fundo da superfície
        'on-surface-variant': '#444444',
        grey100: '#222222',          // Cor de fundo de cinza mais escuro
        grey200: '#1A1A1A'           // Cor de cinza mais profundo
    }
};
export { LightTheme, DarkTheme};
