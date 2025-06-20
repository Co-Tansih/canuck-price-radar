import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    storeLocator: 'Store Locator',
    signOut: 'Sign Out',
    
    // Homepage
    heroTitle: 'Find the Best Deals',
    heroSubtitle: 'Across Canada',
    heroDescription: 'Compare prices from Amazon, Walmart, Home Depot and more. Get real-time pricing data and never overpay again.',
    realTimePricing: 'Real-time pricing',
    canadianStores: 'Canadian stores',
    priceHistoryTracking: 'Price history tracking',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    trustedBy: 'Trusted by',
    canadians: 'Canadians',
    
    // Stats
    productsTracked: 'Products Tracked',
    priceComparisons: 'Price Comparisons',
    moneySaved: 'Money Saved',
    
    // Categories
    shopByCategory: 'Shop by Category',
    electronics: 'Electronics',
    homeGarden: 'Home & Garden',
    tools: 'Tools',
    clothing: 'Clothing',
    sports: 'Sports',
    automotive: 'Automotive',
    viewMore: 'View More',
    
    // Sections
    featuredDeals: 'Featured Deals',
    trendingNow: 'Trending Now',
    howItWorks: 'How PriceTrackr Works',
    searchProducts: 'Search Products',
    comparePrice: 'Compare Prices',
    saveMoney: 'Save Money',
    
    // Descriptions
    searchProductsDesc: 'Search for any product across multiple Canadian retailers',
    comparePricesDesc: 'See real-time prices from Amazon, Walmart, Home Depot and more',
    saveMoneyDesc: 'Get the best deals and track price history to buy at the right time',
    
    // Actions
    viewAllDeals: 'View all deals →',
    viewAllTrending: 'View all trending →',
    loadProducts: 'Load Products',
    searchAgain: 'Search Again',
    backToHome: 'Back to Home',

    // Trust indicators
    over: 'Over',
    thousand: 'K+',
    million: 'M+',

    // Admin Dashboard
    dashboardOverview: 'Dashboard Overview',
    monitorPlatformPerformance: 'Monitor your platform\'s performance and key metrics',
    totalUsers: 'Total Users',
    dailySearches: 'Daily Searches',
    revenue: 'Revenue',
    userGrowth: 'User Growth',
    monthlyUserRegistration: 'Monthly user registration trends',
    searchVolume: 'Search Volume',
    dailySearchActivity: 'Daily search activity',
    scraperStatus: 'Scraper Status',
    realTimeScraperStatus: 'Real-time status of all price scrapers',
    recentActivity: 'Recent Activity',
    latestSystemEvents: 'Latest system events and user actions',
    
    // Scraper Control
    scraperControlPanel: 'Scraper Control Panel',
    monitorScrapingOperations: 'Monitor and control your price scraping operations',
    exportLogs: 'Export Logs',
    runAllScrapers: 'Run All Scrapers',
    activeScrapers: 'Active Scrapers',
    productsScraped: 'Products Scraped',
    today: 'Today',
    successRate: 'Success Rate',
    totalErrors: 'Total Errors',
    last24h: 'Last 24h',
    monitorIndividualScrapers: 'Monitor and control individual scraper instances',
    lastRun: 'Last Run',
    nextRun: 'Next Run',
    products: 'Products',
    avgResponse: 'Avg Response',
    errors: 'Errors',
    liveScraperLogs: 'Live Scraper Logs',
    realTimeActivity: 'Real-time activity from all scrapers',
    
    // Products Management
    productsManagement: 'Products Management',
    manageProductCatalog: 'Manage your product catalog and pricing data',
    addProduct: 'Add Product',
    priceUpdates: 'Price Updates',
    avgPriceDrop: 'Avg. Price Drop',
    thisWeek: 'This week',
    moreFilters: 'More Filters',
    product: 'Product',
    category: 'Category',
    priceRange: 'Price Range',
    stores: 'Stores',
    rating: 'Rating',
    actions: 'Actions',
    manageProductCatalogDesc: 'Manage your product catalog and monitor pricing data'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    search: 'Rechercher',
    storeLocator: 'Localisateur de Magasins',
    signOut: 'Se Déconnecter',
    
    // Homepage
    heroTitle: 'Trouvez les Meilleures Offres',
    heroSubtitle: 'À Travers le Canada',
    heroDescription: 'Comparez les prix d\'Amazon, Walmart, Home Depot et plus encore. Obtenez des données de prix en temps réel et ne payez plus jamais trop cher.',
    realTimePricing: 'Tarification en temps réel',
    canadianStores: 'Magasins canadiens',
    priceHistoryTracking: 'Suivi de l\'historique des prix',
    getStarted: 'Commencer',
    learnMore: 'En Savoir Plus',
    trustedBy: 'Approuvé par',
    canadians: 'Canadiens',
    
    // Stats
    productsTracked: 'Produits Suivis',
    priceComparisons: 'Comparaisons de Prix',
    moneySaved: 'Argent Économisé',
    
    // Categories
    shopByCategory: 'Magasiner par Catégorie',
    electronics: 'Électronique',
    homeGarden: 'Maison et Jardin',
    tools: 'Outils',
    clothing: 'Vêtements',
    sports: 'Sports',
    automotive: 'Automobile',
    viewMore: 'Voir Plus',
    
    // Sections
    featuredDeals: 'Offres en Vedette',
    trendingNow: 'Tendances Actuelles',
    howItWorks: 'Comment Fonctionne PriceTrackr',
    searchProducts: 'Rechercher des Produits',
    comparePrice: 'Comparer les Prix',
    saveMoney: 'Économiser de l\'Argent',
    
    // Descriptions
    searchProductsDesc: 'Recherchez n\'importe quel produit dans plusieurs détaillants canadiens',
    comparePricesDesc: 'Voyez les prix en temps réel d\'Amazon, Walmart, Home Depot et plus encore',
    saveMoneyDesc: 'Obtenez les meilleures offres et suivez l\'historique des prix pour acheter au bon moment',
    
    // Actions
    viewAllDeals: 'Voir toutes les offres →',
    viewAllTrending: 'Voir toutes les tendances →',
    loadProducts: 'Charger les Produits',
    searchAgain: 'Rechercher à Nouveau',
    backToHome: 'Retour à l\'Accueil',

    // Trust indicators
    over: 'Plus de',
    thousand: 'K+',
    million: 'M+',

    // Admin Dashboard
    dashboardOverview: 'Aperçu du Tableau de Bord',
    monitorPlatformPerformance: 'Surveillez les performances de votre plateforme et les métriques clés',
    totalUsers: 'Total des Utilisateurs',
    dailySearches: 'Recherches Quotidiennes',
    revenue: 'Revenus',
    userGrowth: 'Croissance des Utilisateurs',
    monthlyUserRegistration: 'Tendances d\'inscription mensuelle des utilisateurs',
    searchVolume: 'Volume de Recherche',
    dailySearchActivity: 'Activité de recherche quotidienne',
    scraperStatus: 'Statut du Scraper',
    realTimeScraperStatus: 'Statut en temps réel de tous les scrapers de prix',
    recentActivity: 'Activité Récente',
    latestSystemEvents: 'Derniers événements système et actions des utilisateurs',
    
    // Scraper Control
    scraperControlPanel: 'Panneau de Contrôle du Scraper',
    monitorScrapingOperations: 'Surveillez et contrôlez vos opérations de scraping de prix',
    exportLogs: 'Exporter les Journaux',
    runAllScrapers: 'Exécuter Tous les Scrapers',
    activeScrapers: 'Scrapers Actifs',
    productsScraped: 'Produits Scrapés',
    today: 'Aujourd\'hui',
    successRate: 'Taux de Réussite',
    totalErrors: 'Total des Erreurs',
    last24h: 'Dernières 24h',
    monitorIndividualScrapers: 'Surveillez et contrôlez les instances individuelles de scraper',
    lastRun: 'Dernière Exécution',
    nextRun: 'Prochaine Exécution',
    products: 'Produits',
    avgResponse: 'Réponse Moy.',
    errors: 'Erreurs',
    liveScraperLogs: 'Journaux de Scraper en Direct',
    realTimeActivity: 'Activité en temps réel de tous les scrapers',
    
    // Products Management
    productsManagement: 'Gestion des Produits',
    manageProductCatalog: 'Gérez votre catalogue de produits et les données de prix',
    addProduct: 'Ajouter un Produit',
    priceUpdates: 'Mises à Jour des Prix',
    avgPriceDrop: 'Baisse Moy. des Prix',
    thisWeek: 'cette semaine',
    moreFilters: 'Plus de Filtres',
    product: 'Produit',
    category: 'Catégorie',
    priceRange: 'Gamme de Prix',
    stores: 'Magasins',
    rating: 'Évaluation',
    actions: 'Actions',
    manageProductCatalogDesc: 'Gérez votre catalogue de produits et surveillez les données de prix'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as 'en' | 'fr';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
