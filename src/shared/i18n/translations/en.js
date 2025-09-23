// English translations
export const en = {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    search: 'Search',
    filter: 'Filter',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    viewAll: 'View All',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    confirmLogout: 'Confirm Logout',
    logoutConfirmation: 'Are you sure you want to logout from this account?',
    appName: 'Xspend',
    loadError: 'Unable to load data',
  },

  // WalletSelector
  walletSelector: {
    selectWallet: 'Select Wallet',
    total: 'Total',
    manageWallets: 'Manage Wallets',
  },

  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    wallets: 'Wallets',
    reports: 'Reports',
    currency: 'Exchange Rates',
    profile: 'Profile',
    settings: 'Settings',
    addWallet: 'Add Wallet',
    changePassword: 'Change Password',
  },

  // Authentication
  auth: {
    login: {
      title: 'Welcome to XSPEND',
      subtitle: 'Sign in to your account',
      emailOrUsername: 'Email or username',
      emailOrUsernamePlaceholder: 'Enter email or username',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      forgotPassword: 'Forgot password?',
      loginWithGoogle: 'Sign in with Google',
      orLoginWith: 'or sign in with email',
      termsAgreement: 'By signing in, you agree to our {terms} and {privacy}',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      processing: 'Processing...',
      loginButton: 'Sign In',
      noAccount: 'Don\'t have an account?',
      signUpNow: 'Sign up now',
      termsRequired: 'Please agree to the Terms of Service and Privacy Policy to continue.',
    },

    register: {
      title: 'Create New Account',
      googleSignUp: 'Sign up with Google',
      orSignUpWithEmail: 'or sign up with email',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      enterPassword: 'Enter password',
      confirmPasswordPlaceholder: 'Confirm password',
      termsText: {
        prefix: 'By signing up, I agree to the',
        terms: 'Terms of Service',
        and: 'and',
        privacy: 'Privacy Policy'
      },
      processing: 'Processing...',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      loginLink: 'Sign in',
      success: 'Registration successful! Please check your email to activate your account.',
      error: 'Registration failed. Please try again.',
      validation: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        confirmPasswordRequired: 'Confirm password is required',
        passwordMismatch: 'Passwords do not match',
        termsRequired: 'Please agree to the Terms of Service and Privacy Policy to continue.'
      }
    },

    forgotPassword: {
      title: 'Forgot Password',
      description: 'Enter your email to receive a password reset link.',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your registered email address',
      sending: 'Sending...',
      sendResetLink: 'Send Reset Link',
      rememberPassword: 'Remember your password?',
      loginNow: 'Sign in now',
      success: {
        title: 'Check Your Email',
        description: 'If your email exists in our system, a password reset link has been sent to it.',
        instruction: 'Please check your inbox (including spam folder) and follow the instructions to complete your password reset.',
        resendLink: 'Resend Link',
        resendCountdown: 'Resend in {seconds}s',
        backToLogin: 'Back to Sign In'
      },
      validation: {
        emailInvalid: 'Invalid email address'
      }
    },

    resetPassword: {
      title: 'Reset Password',
      description: 'Enter a new password for your account',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmNewPassword: 'Confirm New Password',
      confirmNewPasswordPlaceholder: 'Re-enter new password',
      processing: 'Processing...',
      resetPassword: 'Reset Password',
      success: 'Password has been changed successfully.',
      error: 'Unable to reset password',
      tokenError: 'Token does not exist or is invalid.',
      tokenInvalid: 'Token is invalid or has expired.',
      invalidRequest: 'Invalid Request',
      requestNewLink: 'Request New Link',
      validation: {
        passwordRequired: 'Password is required',
        passwordMismatch: 'Passwords do not match'
      }
    },

    activateAccount: {
      title: 'Activate Account',
      invalidLink: 'Invalid activation link or missing token.',
      successMessage: 'Account has been activated successfully! Please sign in.',
      errorMessage: 'Account activation failed. Token may have expired or is invalid.',
      activating: 'Activating your account...',
      pleaseWait: 'Please wait a moment.',
      successTitle: 'Activation Successful!',
      successDescription: 'Your account is ready. Will automatically redirect to login page in 3 seconds.',
      errorTitle: 'Activation Failed',
      backToLogin: 'Back to Login'
    },
  },

  // Profile & Settings
  profile: {
    title: 'Personal Profile',
    subtitle: 'Manage account information and settings',
    avatar: 'Avatar',
    avatarDesc: 'Click on the image to change.',
    avatarSupport: 'Supports JPG, PNG. Max 5MB.',
    uploading: 'Uploading...',
    accountInfo: 'Account Information',
    accountInfoDesc: 'Update your personal information.',
    username: 'Username',
    email: 'Email',
    firstName: 'First Name',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Enter your last name',
    phoneNumber: 'Phone Number',
    phoneNumberPlaceholder: 'Enter phone number',
    saving: 'Saving...',
    saveButton: 'Save Changes',
    
    menu: {
      account: 'Account',
      accountDesc: 'Personal information and avatar',
      security: 'Login & Security',
      securityDesc: 'Change password, account security',
      appearance: 'Appearance',
      appearanceLight: 'Light Mode',
      appearanceDark: 'Dark Mode',
      general: 'General Settings',
      generalDesc: 'Language, timezone, format',
      logout: 'Sign Out',
      logoutConfirm: 'Confirm Sign Out',
      logoutDesc: 'Are you sure you want to sign out of this account?',
      loggingOut: 'Signing out...',
    },

    changePassword: {
      title: 'Security',
      subtitle: 'Manage password and account security options.',
      changePasswordTitle: 'Change Password',
      changePasswordDesc: 'Enter current password and new password.',
      currentPassword: 'Current Password',
      currentPasswordPlaceholder: 'Enter current password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmPassword: 'Confirm New Password',
      confirmPasswordPlaceholder: 'Re-enter new password',
      updating: 'Updating...',
      updateButton: 'Change Password',
      dangerZone: 'Danger Zone',
      dangerZoneDesc: 'These actions cannot be undone.',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Permanently delete account and all data.',
      deleting: 'Deleting...',
      deleteButton: 'Delete Account',
      deleteConfirm: {
        title: 'Are you sure you want to delete your account?',
        description: 'This action cannot be undone. To confirm, please type exactly {phrase} in the box below.',
        placeholder: 'delete account',
        confirm: 'I understand, delete account',
      },
      validationErrors: {
        passwordMismatch: 'Password confirmation does not match',
      },
      successMessage: 'Password changed successfully!',
      updateError: 'Failed to change password',
      deleteAccountError: 'Failed to delete account from component',
    },
  },

  // Currency
  currency: {
    title: 'Exchange Rates Reference',
    subtitle: 'Exchange rates of popular currencies compared to Vietnamese Dong (VND)',
    lastUpdated: 'Updated {time}',
    updating: 'Updating...',
    
    converter: {
      title: 'Currency Converter',
      subtitle: 'Convert Vietnamese Dong to foreign currencies',
      vndAmount: 'Amount (VND)',
      vndAmountPlaceholder: 'Enter VND amount',
      convertTo: 'Convert to',
      result: 'Result',
    },

    rates: {
      title: 'Today\'s Exchange Rates',
      subtitle: 'Exchange rates of popular currencies converted to VND',
      convertTo: '1 {currency} converts to VND',
    },

    errors: {
      loadingError: 'Error',
      noDataForVND: 'No exchange rate data for VND.',
    },
  },

  // Reports
  reports: {
    title: 'Reports & Analytics',
    subtitle: 'Analyze spending and track your financial situation',

    tabs: {
      transactions: 'Transactions',
      today: 'Today',
      budget: 'Budget',
      emailSettings: 'Email Reports',
    },

    filter: {
      title: 'Filters & Search',
      fromDate: 'From date',
      toDate: 'To date',
      fromDatePlaceholder: 'Select start date',
      toDatePlaceholder: 'Select end date',
      wallet: 'Wallet',
      walletPlaceholder: 'Select wallet',
      allWallets: 'All wallets',
      fromAmount: 'From amount',
      toAmount: 'To amount',
      noLimit: 'No limit',
      filterData: 'Filter Data',
      clearFilters: 'Clear Filters',
      totalLabel: 'Total',
      filteredByAmount: 'Filtered by amount',
    },

    table: {
      stt: 'No.',
      date: 'Transaction Date',
      amount: 'Amount',
      description: 'Description',
      wallet: 'Wallet',
      noData: 'No data available',
    },

    today: {
      title: 'Today\'s Statistics ({date})',
    },

    export: {
      exportFile: 'Export File',
      exportTitle: 'Export {title}',
      fileFormat: 'File format',
      transactionReport: 'Transaction Report',
      exporting: 'Exporting...',
      exportFormat: 'Export {format}',
      success: 'Successfully exported {title}!',
      errors: {
        missingParams: 'Missing time parameters to export report',
        exportFailed: 'Error occurred while exporting data',
      },
    },

    email: {
      emailSettings: 'Email Settings',
      emailReportSettings: 'Email Report Settings',
      targetEmail: 'Recipient email',
      sendHour: 'Send hour',
      sendMinute: 'Send minute',
      dailyReport: 'Daily report',
      weeklyReport: 'Weekly report',
      monthlyReport: 'Monthly report',
      weekDay: 'Weekday (1-7)',
      monthDay: 'Day of month (1-31)',
      saving: 'Saving...',
      sending: 'Sending...',
      saveSettings: 'Save Settings',
      sendNow: 'Send Now',
      warnings: {
        loadSettingsFailed: 'Unable to load email settings',
      },
      errors: {
        invalidEmail: 'Please enter a valid email address!',
        emailRequired: 'Please enter recipient email before sending!',
        invalidEmailFormat: 'Please enter a valid email address!',
        sendFailed: 'Failed to send email',
        saveFailed: 'Error occurred while saving settings',
      },
      success: {
        settingsSaved: 'Email settings saved successfully!',
        emailSent: 'Report email sent immediately!',
      },
    },

    helpers: {
      addToWallet: 'Add money to {walletName}',
      defaultIncome: 'Income transaction',
      defaultExpense: 'Expense transaction', 
      pagination: 'Page {current} / {total}',
      errors: {
        loadingError: 'Unable to load email settings',
      },
    },
  },

  // Settings Page
  settings: {
    title: 'Settings',
    subtitle: 'Customize your application settings.',
    
    // Tabs
    tabs: {
      interface: 'Interface Settings',
      language: 'Language Settings',
      format: 'Format Settings',
    },

    // Interface Settings
    interface: {
      displayMode: 'Display Mode',
      displayModeDesc: 'Choose light, dark or system theme',
      light: 'Light',
      lightDesc: 'Light theme for daytime',
      dark: 'Dark',
      darkDesc: 'Dark theme for nighttime',
      system: 'System',
      systemDesc: 'Follow system settings automatically',
      
      primaryColor: 'Primary Color',
      primaryColorDesc: 'Choose primary color for the interface',
      blue: 'Blue',
      green: 'Green',
      purple: 'Purple',
      red: 'Red',
      orange: 'Orange',
      pink: 'Pink',

      interfaceInfo: 'Information',
      interfaceInfoList: [
        'Interface settings are automatically saved in browser',
        'System mode will automatically switch according to device settings',
        'Primary color affects important buttons and links'
      ]
    },

    // Language Settings
    language: {
      chooseLanguage: 'Choose Language',
      chooseLanguageDesc: 'Language is automatically saved and applied to the entire application',
      vietnamese: 'Vietnamese',
      english: 'English',

      languageInfo: 'Information',
      languageInfoList: [
        'Language is automatically saved in browser',
        'Language changes will be applied immediately',
        'Supports Vietnamese and English'
      ]
    },

    // Format Settings
    format: {
      currencyFormat: 'Currency Format',
      currencyFormatDesc: 'Choose how to display currency separators.',
      dotSeparator: 'Dot separator',
      dotExample: '1.000.000',
      commaSeparator: 'Comma separator',
      commaExample: '1,000,000',

      dateFormat: 'Date Format',
      dateFormatDesc: 'Choose how to display dates throughout the application.',
      dayMonthYear: 'Day/Month/Year',
      monthDayYear: 'Month/Day/Year',
      yearMonthDay: 'Year/Month/Day',

      previewFormat: 'Preview Format',
      previewFormatDesc: 'See how dates will be displayed with current format.',
    },

    // Messages
    messages: {
      updateSuccess: 'Settings updated successfully!',
      updateError: 'Error updating settings.',
    }
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Your financial overview - Updated',
    selectWallet: 'Select wallet to view',
    allWallets: 'All wallets',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpense: 'Monthly Expense',
    totalWallets: 'Total Wallets',
    monthlyGrowth: 'Monthly Growth',
    totalTransactions: 'Total Monthly Transactions',
    income: 'Income',
    expense: 'Expense',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    savings: 'Savings',
    incomeVsExpense: 'Income vs Expense',
    trendAnalysis: 'Financial trends for the past 9 months',
    weeklySpending: 'Weekly Spending',
    weeklySpendingDesc: 'Daily spending habits',
    dailySpending: 'Daily Spending',
    recentTransactions: 'Recent Transactions',
    recentTransactionsDesc: 'Latest 5 transactions',
    topCategories: 'Top Spending Categories',
    topCategoriesDesc: 'Largest expenses this month',
    categoryBreakdown: 'Spending by Category',
    categoryBreakdownDesc: 'Expense analysis for this month',
    quickActions: 'Quick Actions',
    quickActionsDesc: 'Frequently used actions',
    addWallet: 'Add New Wallet',
    addWalletDesc: 'Create a new wallet to manage',
    addCategory: 'Add Transaction Category',
    addCategoryDesc: 'Add, edit, delete categories',
    viewWalletList: 'View Wallet List',
    viewWalletListDesc: 'Manage all wallets',
    noTransactions: 'No recent transactions.',
    noSpending: 'No spending this month.',
    noCategories: 'No spending.',
    loadingDashboard: 'Loading dashboard data...',
    errors: {
      loadData: 'Unable to load dashboard data. Please try again later.',
    },
  },

  // Profile
  profile: {
    account: 'Account',
    personalInfo: 'Personal Information',
    personalInfoDesc: 'Manage your account information',
    security: 'Security',
    changePassword: 'Change Password',
    changePasswordDesc: 'Update your password',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Toggle dark mode',
    language: 'Language',
    appLanguage: 'App Language',
    appLanguageDesc: 'Change display language',
    appSettings: 'App Settings',
    appSettingsDesc: 'Customize app settings',
    logout: 'Logout',
    logoutDesc: 'Sign out of your account',
    logoutConfirm: 'Are you sure you want to logout?',
    logoutConfirmDesc: 'You will need to log in again to continue using the app.',
    verified: 'Verified',
  },

  // Error Page
  error: {
    pageNotFound: 'Page Not Found',
    pageNotFoundDesc: 'Sorry, the page you are looking for does not exist or has been moved.',
    goHome: 'Go Home',
    goBack: 'Go Back',
    error404: '404',
  },

  // Currency Page
  currency: {
    title: 'Exchange Rates',
    subtitle: 'Track exchange rates and convert currencies',
    conversion: 'Currency Conversion',
    conversionDesc: 'Convert Vietnamese Dong to foreign currencies',
    amountVND: 'Amount (VND)',
    amountVNDPlaceholder: 'Enter VND amount',
    convertTo: 'Convert to',
    result: 'Result',
    todayRates: "Today's Rates",
    todayRatesDesc: 'Popular currency rates converted to VND',
    noRateData: 'No exchange rate data available for VND.',
    rateError: 'Error loading exchange rates',
  },

  // Sidebar
  sidebar: {
    themeTooltip: 'Dark/Light mode',
    settingsTooltip: 'Settings',
    logoutTooltip: 'Logout',
    logoutConfirm: 'Confirm Logout',
    logoutConfirmDesc: 'Are you sure you want to logout from your account?',
  },

  // Wallet Panel
  walletPanel: {
    title: 'Wallet List & Categories',
    loadingWallets: 'Loading wallet list...',
    currentWallet: 'Current Wallet',
    noWallets: 'No wallets yet',
    categories: 'Categories',
    manage: 'Manage',
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    subtitle: 'Recent updates and alerts.',
    noNotifications: 'You have no new notifications.',
  },

  // Date Format Demo
  dateFormatDemo: {
    currentFormat: 'Current Format',
    formatDate: 'Date format (formatDate)',
    formatDateTime: 'Date and time format (formatDateTime)',
    input: 'Input: {date}',
    output: 'Output: {result}',
    note: 'Note: Format will change according to your language and region settings.',
  },

  // Auth
  auth: {
    welcomeToXSpend: 'Welcome to XSPEND',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter password',
    loginButton: 'Login',
    registerButton: 'Register',
    forgotPassword: 'Forgot password?',
    orLoginWith: 'Or login with',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    createAccount: 'Create account',
    loginHere: 'Login here',
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all as read',
  },

  // Reports
  reports: {
    title: 'Reports',
    transactions: 'Transactions',
    today: 'Today',
    budget: 'Budget',
    emailSettings: 'Email Reports',
  },

  // Wallet
  wallet: {
    title: 'Wallets',
    addWallet: 'Add Wallet',
    balance: 'Balance',
    income: 'Income',
    expense: 'Expense',
    transactions: 'Transactions',
  },

  // Wallets
  wallets: {
    add: {
      title: 'Add New Wallet',
      subtitle: 'Create a new wallet to manage your finances',
      backButton: 'Back',
      walletInformation: 'Wallet Information',
      nameLabel: 'Wallet name',
      namePlaceholder: 'Cash wallet, Bank account...',
      iconLabel: 'Wallet icon',
      currency: 'Currency',
      currencyVND: 'Vietnamese Dong (₫)',
      description: 'Description (optional)',
      descriptionPlaceholder: 'Description about this wallet...',
      creating: 'Creating wallet...',
      createButton: 'Create New Wallet',
      preview: 'Preview',
      previewName: 'Wallet name',
      balance: 'Balance',
      tips: 'Helpful Tips',
      tip1: 'Choose a suitable icon to help you easily identify the wallet when making transactions.',
      tip2: 'You can create multiple wallets for different purposes like spending, saving.',
      validation: {
        nameRequired: 'Wallet name is required.',
        nameMaxLength: 'Wallet name cannot exceed 50 characters.',
        descriptionMaxLength: 'Description cannot exceed 200 characters.',
      },
      checkFormMessage: 'Please check the information entered.',
      successMessage: 'Wallet "{walletName}" has been created successfully!',
      createError: 'An error occurred while creating wallet. Please try again.',
    },

    edit: {
      title: 'Edit Wallet',
      subtitle: 'Update information for your wallet',
      backButton: 'Back',
      loading: 'Loading wallet data...',
      walletNotFound: 'Wallet not found.',
      loadError: 'Error loading wallet information.',
      validationError: 'Please check the information entered.',
      updateSuccess: 'Wallet "{name}" has been updated successfully!',
      updateError: 'Error updating wallet.',
      formTitle: 'Edit Information',
      nameLabel: 'Wallet Name',
      namePlaceholder: 'Cash wallet, Bank account...',
      currentBalance: 'Current Balance',
      currencyLabel: 'Currency',
      iconLabel: 'Wallet Icon',
      descriptionLabel: 'Description (Optional)',
      descriptionPlaceholder: 'Describe the purpose of this wallet...',
      saveButton: 'Save Changes',
      savingButton: 'Saving...',
      previewTitle: 'Preview',
      previewBalance: 'Balance',
      previewName: 'Wallet Name',
      tipsTitle: 'Helpful Tips',
      tipsDescription: 'A clear description helps you remember the purpose of the wallet later.',
      noTransactionsTitle: 'Wallet has no transactions',
      noTransactionsDescription: 'This wallet has no transactions yet. You can add money to the wallet to start using it.',
      currency: {
        vnd: 'Vietnamese Dong (₫)'
      },
      validation: {
        nameRequired: 'Wallet name is required.',
        nameLength: 'Wallet name cannot exceed 50 characters.',
        descriptionLength: 'Description cannot exceed 200 characters.'
      }
    },

    list: {
      title: 'Wallets & Functions',
      subtitle: 'Manage wallets and perform transactions quickly.',
      loading: 'Loading data...',
      loadError: 'Unable to load wallet list.',
      controlPanel: 'Wallet Control Panel',
      walletListTitle: 'Your Wallet List',
      activeWalletsTab: 'Active Wallets ({count})',
      archivedWalletsTab: 'Archived Wallets ({count})',
      overview: 'Balance Overview',
      overviewDesc: 'Total balance of all active wallets',
      exchangeRate: 'Check exchange rates',
      totalWallets: 'Total Wallets',
      activeWallets: 'Active wallets:',
      archivedWallets: 'Archived wallets:',
      balance: 'Balance',
      tips: 'Helpful Tips',
      tip1: 'Set unique names and icons for each wallet to easily distinguish them.',
      tip2: 'Use archived wallets for rarely used accounts to keep interface clean.',
      
      // Actions
      actions: {
        viewList: 'View Wallet List',
        viewListDesc: 'Navigate to your wallet list',
        addWallet: 'Add New Wallet',
        addWalletDesc: 'Create a new wallet account to track',
        transferMoney: 'Transfer Money',
        transferMoneyDesc: 'Move balance between your wallets',
        addMoney: 'Add Money to Wallet',
        addMoneyDesc: 'Record income or add money',
        shareWallet: 'Share Wallet',
        shareWalletDesc: 'Invite others to manage expenses together',
        
        // Dropdown actions
        viewDetails: 'View details',
        editWallet: 'Edit wallet',
        setDefault: 'Set default',
        archive: 'Archive',
        restore: 'Restore',
        delete: 'Delete wallet',
      },

      // Empty states
      noActiveWallets: 'No active wallets yet',
      noArchivedWallets: 'No wallets in archive',
      noActiveWalletsDesc: 'Create a new wallet or restore from archive to display them here.',
      noArchivedWalletsDesc: 'You can restore archived wallets to continue using them.',

      // Permissions
      permissions: {
        view: 'View only',
        edit: 'Edit', 
        owner: 'Full access',
      },

      // Messages
      sharedBy: 'Shared by {owner}',
      archiveRestoreInfo: 'You need to restore the wallet before deleting.',
      deleteSuccess: 'Wallet "{walletName}" has been deleted successfully.',
      deleteError: 'An error occurred while deleting wallet.',
      archiveSuccess: 'Wallet "{walletName}" has been {action} successfully.',
      archiveError: 'Error {action} wallet.',
      setDefaultSuccess: 'Wallet "{walletName}" has been set as default.',
      setDefaultError: 'An error occurred while setting default wallet.',
      archiveActions: {
        archived: 'archived',
        restored: 'restored',
      },

      // Delete confirmation
      deleteConfirm: {
        title: 'Are you sure you want to delete this wallet?',
        description: 'This action cannot be undone. This will permanently delete wallet "{walletName}" and all related transaction data.',
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },

    detail: {
      notFound: 'Wallet not found.',
      loadError: 'Error loading wallet data.',
      loadTransactionsError: 'Error loading transaction history.',
      currentBalance: 'Current Balance',
      noDescription: 'No description',
      monthlyIncome: 'Monthly Income',
      monthlyExpense: 'Monthly Expense',
      netChange: 'Net Change',
      balanceTrend: 'Balance Trend',
      expenseByCategory: 'Expense by Category',
      transactionHistory: 'Transaction History',
      addMoney: 'Add Money',
      editWallet: 'Edit',
      shareWallet: 'Share',
      archiveWallet: 'Archive',
      restoreWallet: 'Restore',
      deleteWallet: 'Delete',
      filterButton: 'Filter',
      exportButton: 'Export',
      noTransactions: 'No transactions in this wallet yet',
      noChartData: 'Not enough data to draw chart.',
      noCategoryData: 'No expense data by category.',
      uncategorized: 'Uncategorized',
      archivedTitle: 'Wallet is archived',
      archivedDescription: 'This wallet is currently in view-only mode. To make changes, you need to restore the wallet.',
      pagination: {
        previous: 'Previous',
        next: 'Next',
        pageOf: 'Page {current} / {total}',
      },
      deleteConfirm: {
        title: 'Confirm wallet deletion',
        description: 'Are you sure you want to delete this wallet? This action cannot be undone.',
        confirmButton: 'Delete wallet',
      },
      deleteSuccess: 'Wallet "{walletName}" has been deleted successfully.',
      deleteError: 'Error deleting wallet.',
      archiveSuccess: 'Wallet "{walletName}" has been {action} successfully.',
      archiveActions: {
        archived: 'archived',
        restored: 'restored',
      },
      archiveError: 'Error {action} wallet.',
    },

    addMoney: {
      title: 'Add Money',
      subtitle: 'Add money to your wallet',
      formTitle: 'Add Money Information',
      selectWallet: 'Select wallet',
      selectWalletPlaceholder: 'Choose wallet to add money',
      amount: 'Amount',
      amountPlaceholder: 'Enter amount',
      quickAmounts: 'Quick amounts',
      note: 'Note',
      notePlaceholder: 'Note about this transaction...',
      addingMoney: 'Processing...',
      addMoneyButton: 'Add Money',
      noWalletsAvailable: 'No wallets available',
      recentTransactions: 'Recent Transactions',
      clickToAddSimilar: 'Click to add similar amount',
      addToWallet: 'Add money to {walletName}',
      noTransactions: 'No transactions yet',
      tips: 'Helpful Tips',
      tip1: 'Use notes to track the source of money.',
      tip2: 'Double-check wallet information and amount before confirming.',
      tip3: 'Regularly check transaction history for better financial management.',
      noteHelp: 'Enter up to 500 characters, line breaks allowed',
      noteSupport: 'Supports emoji and special characters',
      wordCount: 'words',
      method: 'Add Money',
      loadDataError: 'Unable to load required data.',
      addError: 'Error occurred while adding money',
      validationErrors: {
        walletRequired: 'Please select a wallet',
        amountRequired: 'Please enter amount',
        amountMinimum: 'Minimum amount is 1,000 ₫',
        amountMaximum: 'Maximum amount per transaction is 1,000,000,000 ₫',
        balanceExceeded: 'Balance after adding will be {newBalance}, exceeding limit of {maxBalance}',
        noteMaxLength: 'Note cannot exceed 500 characters',
      },
      confirmDialog: {
        title: 'Confirm Add Money',
        description: 'Please review the information before confirming.',
        wallet: 'Add to wallet:',
        amount: 'Amount:',
        note: 'Note:',
        confirm: 'Confirm',
        cancel: 'Cancel',
      },
      successDialog: {
        title: 'Money Added Successfully!',
        description: 'Successfully added {amount} to wallet {walletName}.',
        newBalance: 'New balance:',
        close: 'Close',
        viewWallet: 'View wallet',
      },
    },

    share: {
      title: 'Share Wallet',
      subtitle: 'Send invitations and manage access permissions for your wallets.',
      sending: 'Sending invitation...',
      
      tabs: {
        sendInvitation: 'Send Invitation',
        sharedByMe: 'My Shared Wallets ({count})',
        sharedWithMe: 'Shared With Me ({count})',
      },
      
      form: {
        title: 'Send wallet sharing invitation',
        selectWallet: 'Select wallet',
        selectWalletPlaceholder: 'Choose a wallet to share',
        accessType: 'Access permission type',
        recipientEmail: 'Recipient email',
        emailPlaceholder: 'example@email.com',
        message: 'Message (optional)',
        messagePlaceholder: 'Send a message to recipient...',
        charactersCount: '{current}/{max} characters',
        sendInvitation: 'Send Invitation',
      },
      
      permissions: {
        view: 'View Only',
        edit: 'Edit',
        owner: 'Owner',
        viewTitle: 'Viewer',
        viewDescription: 'View only, cannot make changes.',
        viewExplanation: 'View balance, transaction history. Cannot modify.',
        editTitle: 'Editor',
        editDescription: 'Add, edit, delete transactions.',
        editExplanation: 'Full view permission, add/edit/delete transactions.',
        ownerTitle: 'Owner',
        ownerDescription: 'Full permissions like yours.',
        ownerExplanation: 'All your permissions, including sharing and deleting wallet.',
        explanation: 'Permission Explanation',
      },
      
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        revoked: 'Revoked',
        expired: 'Expired',
      },
      
      actions: {
        revoke: 'Revoke',
      },
      
      selectPermission: 'Select permission',
      sharedTo: 'Shared to',
      sentDate: 'Sent date',
      sharedWith: 'Shared with',
      from: 'From',
      
      empty: {
        sharedByMe: 'You haven\'t shared any wallets with others yet.',
        sharedWithMe: 'No wallets have been shared with you.',
      },
      
      tips: {
        title: 'Safe Sharing Tips',
        tip1: 'Only share with people you completely trust.',
        tip2: 'Start with "View Only" permission and upgrade later if needed.',
        tip3: 'Regularly check your "My Shared Wallets" list.',
      },
      
      confirmRevoke: {
        title: 'Confirm revoke sharing',
        question: 'Are you sure you want to revoke this sharing?',
        warning: 'The user will immediately lose access to this wallet and cannot be recovered.',
        confirm: 'Confirm Revoke',
      },
      
      validation: {
        emailRequired: 'Please enter recipient email.',
      },
      
      success: {
        invitationSent: 'Wallet sharing invitation sent successfully!',
        revokeShare: 'Sharing revoked/deleted successfully.',
        updatePermission: 'Permission updated successfully.',
      },
      
      errors: {
        loadMyWallets: 'Unable to load your wallet list.',
        loadSharedByMe: 'Unable to load list of wallets shared by you.',
        loadSharedWithMe: 'Unable to load list of wallets shared with you.',
        sendInvitation: 'An error occurred while sending the invitation.',
        actionFailed: 'Unable to perform this action.',
        updatePermission: 'Unable to update permission.',
      },
    },

    transfer: {
      title: 'Transfer Money',
      subtitle: 'Transfer money quickly and securely between your wallets',
      recentTransfers: 'Recent Transfers',
      noTransactions: 'No transactions yet',
      
      form: {
        title: 'Transfer Information',
        fromWallet: 'From wallet',
        toWallet: 'To wallet',
        selectFromWallet: 'Select source wallet',
        selectToWallet: 'Select destination wallet',
        amount: 'Transfer amount',
        amountPlaceholder: 'Enter amount',
        note: 'Note (optional)',
        notePlaceholder: 'Enter note for transaction...',
        noteHelp: 'Enter up to 500 characters, line breaks allowed',
        noteSupport: 'Supports emoji and special characters',
        wordCount: 'words',
        noValidToWallets: 'No valid destination wallets (need same currency).',
        swapWallets: 'Swap wallets',
        transferring: 'Transferring...',
        transferButton: 'Transfer Money',
      },
      
      validation: {
        fromWalletRequired: 'Please select source wallet',
        toWalletRequired: 'Please select destination wallet',
        differentWallets: 'Destination wallet must be different from source wallet',
        sameCurrency: 'Both wallets must have the same currency',
        amountRequired: 'Amount must be greater than 0',
        minimumAmount: 'Minimum amount is 1,000',
        insufficientBalance: 'Insufficient balance for this transaction',
      },
      
      tips: {
        title: 'Helpful Tips',
        tip1: 'Can only transfer money between wallets with the same currency.',
        tip2: 'Double-check balance and wallet information before confirming.',
        tip3: 'Use notes to track transfer purposes more easily.',
      },
      
      confirmDialog: {
        title: 'Confirm Transfer',
        description: 'Please review the transfer information before confirming.',
        fromWallet: 'From wallet:',
        toWallet: 'To wallet:',
        amount: 'Amount:',
        note: 'Note:',
        confirm: 'Confirm',
      },
      
      successDialog: {
        title: 'Transfer Successful!',
        description: 'Successfully transferred {amount} from {fromWallet} to {toWallet}.',
      },
      
      actions: {
        retry: 'Retry',
        createWallet: 'Create wallet',
      },
      
      errors: {
        errorTitle: 'An error occurred',
        loadData: 'Unable to load required data. Please try again.',
        transferFailed: 'An error occurred while transferring money',
        noWallets: 'You don\'t have any wallets yet. Create a new wallet to get started.',
        needTwoWallets: 'You need at least two wallets to perform money transfer.',
        notReady: 'Not ready to transfer money',
      },
    },

    acceptInvitation: {
      title: 'Wallet Sharing Invitation',
      description: '{ownerName} has invited you to join wallet {walletName}.',
      errorTitle: 'An Error Occurred',
      messageFrom: 'Message from {ownerName}:',
      currentBalance: 'Current balance:',
      permissionGranted: 'Permission granted:',
      authRequiredText: 'You need to',
      or: 'or',
      toAccept: 'to accept',
      accept: 'Accept',
      reject: 'Reject',
      backHome: 'Back to Home',
      acceptSuccess: 'You have accepted the invitation to join wallet "{walletName}"!',
      rejectSuccess: 'You have rejected the invitation.',
      
      permissions: {
        view: 'View',
        edit: 'Edit & Transactions',
        owner: 'Owner',
      },
      
      errors: {
        invalidLink: 'Invalid link or missing invitation token.',
        verifyFailed: 'Unable to verify invitation.',
        invalidToken: 'Invalid invitation, expired or already processed.',
        loginRequired: 'Please log in to accept the invitation.',
        processError: 'An error occurred while processing your request.',
      },
    },
  },

  // Transactions
  transactions: {
    title: 'Transaction Management',
    subtitle: 'Track, categorize and manage all your income and expenses in one place.',
    
    // Tabs
    tabs: {
      transactions: 'Transactions',
      categories: 'Spending Categories'
    },

    // Transaction List
    list: {
      title: 'Transaction List',
      empty: {
        title: 'No transactions yet',
        subtitle: 'No transactions found matching your filters.'
      },
      defaultIncome: 'Income transaction',
      defaultExpense: 'Expense transaction',
      uncategorized: 'Uncategorized'
    },

    // Summary
    summary: {
      title: 'Overview',
      subtitle: 'Summary of income and expenses for this period',
      totalIncome: 'Total Income',
      totalExpense: 'Total Expense',
      balance: 'Balance'
    },

    // Actions
    actions: {
      title: 'Actions',
      addExpense: 'Expense',
      addIncome: 'Income',
      viewReports: 'View Detailed Reports'
    },

    // Filters
    filters: {
      title: 'Filters',
      byCategory: 'Filter by category',
      byDate: 'Filter by date',
      selectCategory: 'Select category',
      allCategories: 'All categories',
      selectDate: 'Select date',
      quickSelect: 'Quick select date',
      today: 'Today',
      yesterday: 'Yesterday'
    },

    // Add/Edit Transaction Modal
    modal: {
      addTitle: 'Add Transaction',
      editTitle: 'Edit Transaction',
      
      form: {
        amount: 'Amount',
        amountPlaceholder: '0',
        category: 'Category',
        categoryPlaceholder: 'Select category',
        wallet: 'Wallet',
        walletPlaceholder: 'Select wallet',
        description: 'Note',
        descriptionPlaceholder: {
          income: 'Note about income...',
          expense: 'Note about expense...'
        },
        date: 'Date & Time',
        datePlaceholder: 'Select date and time',
        
        // Form hints
        descriptionHints: {
          maxLength: 'Enter up to 500 characters, line breaks allowed',
          features: 'Supports emoji and special characters',
          wordCount: 'words'
        },

        // Submit buttons
        addIncome: 'Add Income',
        addExpense: 'Add Expense',
        updateTransaction: 'Update Transaction',
        deleteTransaction: 'Delete Transaction'
      },

      // Validation errors
      validation: {
        amountRequired: 'Please enter amount',
        amountInvalid: 'Invalid amount',
        amountExceedsBalance: 'Amount cannot exceed current balance',
        categoryRequired: 'Please select category',
        walletRequired: 'Please select wallet',
        dateRequired: 'Please select date and time',
        descriptionTooLong: 'Note cannot exceed 500 characters'
      },

      // Confirmation dialogs
      confirmDelete: {
        title: 'Confirm delete transaction',
        description: 'Are you sure you want to delete this transaction? This action cannot be undone.',
        confirm: 'Delete',
        cancel: 'Cancel'
      },

      confirmFutureDate: {
        title: 'Confirm future date',
        description: 'You have selected transaction time at',
        futureDate: '(future date)',
        transactionInfo: 'Transaction Information:',
        transactionType: 'Type',
        transactionAmount: 'Amount',
        transactionDate: 'Date',
        confirmMessage: 'Are you sure you want to continue?',
        confirm: 'Continue',
        cancel: 'Cancel'
      }
    },

    // Categories Management
    categories: {
      title: 'Category Management',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      deleteCategory: 'Delete Category',
      viewCategory: 'View Details',
      
      form: {
        name: 'Category name',
        namePlaceholder: 'e.g: Food & Dining, Transportation...',
        description: 'Notes',
        descriptionPlaceholder: 'Enter notes (optional)',
        budgetAmount: 'Monthly spending budget (optional)',
        budgetAmountPlaceholder: 'e.g: 5000000',
        incomeTargetAmount: 'Monthly income target (optional)',
        incomeTargetAmountPlaceholder: 'e.g: 10000000',
        add: 'Add',
        edit: 'Save Changes',
        cancel: 'Cancel',
        
        validation: {
          nameRequired: 'Category name is required',
          nameTooLong: 'Category name cannot exceed 100 characters',
          descriptionTooLong: 'Description cannot exceed 500 characters'
        }
      },

      stats: {
        totalTransactions: 'Total transactions',
        totalAmount: 'Total amount',
        budgetUsed: 'Used',
        budgetRemaining: 'Remaining',
        incomeProgress: 'Income progress'
      },

      empty: {
        title: 'No transactions yet',
        subtitle: 'No transactions have been recorded for this category.',
        chart: 'No income and expense data available.',
        categories: 'No categories yet',
        categoriesSubtitle: 'Start by adding your first category.'
      },

      progress: {
        spent: 'Spent',
        earned: 'Earned',
        remaining: 'Remaining'
      },

      status: {
        notSet: 'Not set',
        noBudgetOrTarget: 'No budget or target set'
      },

      summary: {
        totalIncome: 'Total Income',
        totalExpense: 'Total Expense',
        balance: 'Balance',
        overview: 'Overview',
        history: 'Transaction history'
      },

      detail: {
        title: 'Category Details',
        subtitle: 'Income and expense overview with transaction list.'
      },

      confirmDelete: {
        title: 'Are you sure you want to delete?',
        description: 'This action cannot be undone. All transactions belonging to category {categoryName} will be removed from this category.',
        instruction: 'To confirm, please type {categoryName} in the box below.',
        inputPlaceholder: 'Enter category name to confirm',
        confirm: 'Delete Category',
        cancel: 'Cancel'
      },

      confirmLargeAmount: {
        title: 'Confirm large amount',
        budgetMessage: 'Your spending budget is {amount} VND (over 100 billion). Are you sure you want to continue?',
        incomeMessage: 'Your income target is {amount} VND (over 100 billion). Are you sure you want to continue?',
        confirmMessage: 'Are you sure you want to continue with this amount?',
        confirm: 'Confirm',
        cancel: 'Cancel'
      }
    },

    // Edit Transaction
    edit: {
      title: 'Details',
      incomeTitle: 'Income Transaction',
      expenseTitle: 'Expense Transaction',
      subtitle: 'Edit or delete your transaction here.',
      
      form: {
        amount: 'Amount',
        amountPlaceholder: 'Enter amount',
        category: 'Category',
        categoryPlaceholder: 'Select category',
        wallet: 'Wallet',
        walletPlaceholder: 'Select wallet',
        description: 'Notes',
        descriptionPlaceholder: 'Enter notes (optional)',
        date: 'Date & Time',
        cancel: 'Cancel',
        save: 'Save Changes',
        delete: 'Delete Transaction'
      },

      validation: {
        invalidAmount: 'Invalid amount',
        amountExceedsBalance: 'Amount cannot exceed current balance ({balance})',
        descriptionTooLong: 'Notes too long (maximum 500 characters)',
        fieldNameDescription: 'Notes'
      },

      confirmDelete: {
        title: 'Delete this transaction?',
        description: 'This action will permanently delete the transaction and cannot be undone.',
        confirm: 'Delete',
        cancel: 'Cancel'
      },

      confirmFutureDate: {
        title: 'Confirm future date',
        description: 'You are updating a transaction with date {date} (future date).',
        transactionInfo: 'Transaction information:',
        transactionType: 'Type',
        transactionAmount: 'Amount',
        transactionDate: 'Date',
        confirmMessage: 'Are you sure you want to continue?',
        confirm: 'Confirm',
        cancel: 'Select again'
      }
    },

    // Toast messages
    messages: {
      transactionAdded: 'Transaction added successfully',
      transactionUpdated: 'Transaction updated successfully',
      transactionDeleted: 'Transaction deleted successfully',
      categoryAdded: 'Category added successfully',
      categoryUpdated: 'Category updated successfully',
      categoryDeleted: 'Category deleted successfully',
      budgetExceeded: 'You have exceeded the budget for category',
      incomeTargetReached: 'Congratulations! You have reached the income target for this category',
      
      errors: {
        loadTransactions: 'Unable to load transaction list',
        loadCategories: 'Unable to load category list',
        loadCategoryDetails: 'Category not found to view',
        addTransaction: 'Error occurred while adding transaction',
        updateTransaction: 'Error occurred while updating transaction',
        deleteTransaction: 'Error occurred while deleting transaction',
        addCategory: 'Error occurred while adding category',
        updateCategory: 'Error occurred while updating category',
        deleteCategory: 'Error occurred while deleting category',
        general: 'An error occurred'
      }
    }
  },

  // Time
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    thisYear: 'This year',
    lastYear: 'Last year',
  },

  // Charts
  charts: {
    balanceTrend: {
      date: 'Date',
      balance: 'Balance',
    },
  },

  // Date Format Demo
  dateFormatDemo: {
    formatDate: 'Date Format (formatDate)',
    input: 'Input: {date}',
    output: 'Output: {result}',
  },
};
