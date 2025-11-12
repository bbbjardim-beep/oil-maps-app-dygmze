
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

type Language = 'en' | 'pt';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.phone': 'Phone (optional)',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signOut': 'Sign Out',
    
    // Search
    'search.title': 'Find Your Oil',
    'search.subtitle': 'Select your vehicle details',
    'search.brand': 'Brand',
    'search.model': 'Model',
    'search.year': 'Year',
    'search.version': 'Version (optional)',
    'search.selectBrand': 'Select Brand',
    'search.selectModel': 'Select Model',
    'search.selectYear': 'Select Year',
    'search.selectVersion': 'Select Version',
    'search.searchButton': 'Search',
    'search.searchesRemaining': 'Searches remaining: {{count}}',
    'search.unlimitedSearches': 'Unlimited searches',
    
    // Results
    'results.title': 'Oil Specifications',
    'results.engine': 'Engine',
    'results.gearbox': 'Gearbox',
    'results.differential': 'Differential',
    'results.save': 'Save',
    'results.share': 'Share',
    'results.noResults': 'No results found',
    
    // Profile
    'profile.title': 'Profile',
    'profile.account': 'Account',
    'profile.subscription': 'Subscription',
    'profile.settings': 'Settings',
    'profile.support': 'Support',
    'profile.privacy': 'Privacy Policy',
    'profile.language': 'Language',
    'profile.premium': 'Premium',
    'profile.free': 'Free',
    'profile.upgradeToPremium': 'Upgrade to Premium',
    'profile.manageSub': 'Manage Subscription',
    
    // Subscription
    'sub.title': 'Upgrade to Premium',
    'sub.unlimited': 'Unlimited Searches',
    'sub.price': 'R$9.99/month',
    'sub.promo': 'First month: R$4.99',
    'sub.subscribe': 'Subscribe Now',
    'sub.features': 'Premium Features:',
    'sub.feature1': 'Unlimited oil searches',
    'sub.feature2': 'Save search history',
    'sub.feature3': 'Share results easily',
    'sub.feature4': 'Priority support',
    
    // Common
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Tabs
    'tabs.search': 'Search',
    'tabs.profile': 'Profile',
    'tabs.settings': 'Settings',
  },
  pt: {
    // Auth
    'auth.signIn': 'Entrar',
    'auth.signUp': 'Cadastrar',
    'auth.email': 'E-mail',
    'auth.phone': 'Telefone (opcional)',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.signOut': 'Sair',
    
    // Search
    'search.title': 'Encontre Seu Óleo',
    'search.subtitle': 'Selecione os detalhes do seu veículo',
    'search.brand': 'Marca',
    'search.model': 'Modelo',
    'search.year': 'Ano',
    'search.version': 'Versão (opcional)',
    'search.selectBrand': 'Selecione a Marca',
    'search.selectModel': 'Selecione o Modelo',
    'search.selectYear': 'Selecione o Ano',
    'search.selectVersion': 'Selecione a Versão',
    'search.searchButton': 'Buscar',
    'search.searchesRemaining': 'Buscas restantes: {{count}}',
    'search.unlimitedSearches': 'Buscas ilimitadas',
    
    // Results
    'results.title': 'Especificações do Óleo',
    'results.engine': 'Motor',
    'results.gearbox': 'Câmbio',
    'results.differential': 'Diferencial',
    'results.save': 'Salvar',
    'results.share': 'Compartilhar',
    'results.noResults': 'Nenhum resultado encontrado',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.account': 'Conta',
    'profile.subscription': 'Assinatura',
    'profile.settings': 'Configurações',
    'profile.support': 'Suporte',
    'profile.privacy': 'Política de Privacidade',
    'profile.language': 'Idioma',
    'profile.premium': 'Premium',
    'profile.free': 'Gratuito',
    'profile.upgradeToPremium': 'Atualizar para Premium',
    'profile.manageSub': 'Gerenciar Assinatura',
    
    // Subscription
    'sub.title': 'Atualizar para Premium',
    'sub.unlimited': 'Buscas Ilimitadas',
    'sub.price': 'R$9,99/mês',
    'sub.promo': 'Primeiro mês: R$4,99',
    'sub.subscribe': 'Assinar Agora',
    'sub.features': 'Recursos Premium:',
    'sub.feature1': 'Buscas ilimitadas de óleo',
    'sub.feature2': 'Salvar histórico de buscas',
    'sub.feature3': 'Compartilhar resultados facilmente',
    'sub.feature4': 'Suporte prioritário',
    
    // Common
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.close': 'Fechar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    
    // Tabs
    'tabs.search': 'Buscar',
    'tabs.profile': 'Perfil',
    'tabs.settings': 'Configurações',
  },
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      } else {
        // Detect device language
        const deviceLanguage = Localization.getLocales()[0]?.languageCode;
        if (deviceLanguage === 'pt') {
          setLanguageState('pt');
        }
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
