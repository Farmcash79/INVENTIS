const defaultUsers = [
  {
    id: '1',
    name: 'James Osei',
    email: 'owner@example.com',
    passwordHash: '',
    role: 'owner',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Sales',
    email: 'salesrep@example.com',
    passwordHash: '',
    role: 'sales_rep',
    createdAt: new Date().toISOString(),
  },
];

const defaultProducts = [
  {
    id: '1',
    name: 'Earpod',
    category: 'Audio',
    buyPrice: '$2k',
    sellPrice: '$3k',
    inStock: 300,
    stockSold: 3000,
    profit: '$300k',
    status: 'high',
  },
  {
    id: '2',
    name: 'Laptop bag',
    category: 'Accessories',
    buyPrice: '$1k',
    sellPrice: '$2k',
    inStock: 100,
    stockSold: 200,
    profit: '$100k',
    status: 'high',
  },
  {
    id: '3',
    name: 'USB Cable',
    category: 'Electronics',
    buyPrice: '$500',
    sellPrice: '$1k',
    inStock: 50,
    stockSold: 100,
    profit: '$50k',
    status: 'low',
  },
];

const defaultReports = [];
const defaultExpenses = [];
const defaultReceipts = [];
const defaultStock = [];

const fallbackStorage = globalThis.__trakitStorage ?? (globalThis.__trakitStorage = {});

const getLocalStorageValue = (key, fallbackValue) => {
  if (typeof window !== 'undefined') {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (!storedValue) {
        window.localStorage.setItem(key, JSON.stringify(fallbackValue));
        return fallbackValue;
      }

      return JSON.parse(storedValue);
    } catch {
      return fallbackValue;
    }
  }

  if (!(key in fallbackStorage)) {
    fallbackStorage[key] = fallbackValue;
  }

  return fallbackStorage[key];
};

const setLocalStorageValue = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
    return;
  }

  fallbackStorage[key] = value;
};

const browserStorage = {
  users: {
    getAll: () => getLocalStorageValue('trakit_users', defaultUsers),
    getById: (id) => {
      const users = getLocalStorageValue('trakit_users', defaultUsers);
      return users.find((user) => user.id === id) || null;
    },
    getByEmail: (email) => {
      const users = getLocalStorageValue('trakit_users', defaultUsers);
      return users.find((user) => user.email === email) || null;
    },
    create: (user) => {
      const users = getLocalStorageValue('trakit_users', defaultUsers);
      const newUser = { ...user, id: String(Date.now()), createdAt: new Date().toISOString() };
      const nextUsers = [...users, newUser];
      setLocalStorageValue('trakit_users', nextUsers);
      return newUser;
    },
    update: (id, updates) => {
      const users = getLocalStorageValue('trakit_users', defaultUsers);
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        return null;
      }
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      setLocalStorageValue('trakit_users', users);
      return updatedUser;
    },
  },

  products: {
    getAll: () => getLocalStorageValue('trakit_products', defaultProducts),
    getById: (id) => {
      const products = getLocalStorageValue('trakit_products', defaultProducts);
      return products.find((product) => product.id === id) || null;
    },
    create: (product) => {
      const products = getLocalStorageValue('trakit_products', defaultProducts);
      const newProduct = { ...product, id: String(Date.now()) };
      const nextProducts = [...products, newProduct];
      setLocalStorageValue('trakit_products', nextProducts);
      return newProduct;
    },
    update: (id, updates) => {
      const products = getLocalStorageValue('trakit_products', defaultProducts);
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        return null;
      }
      const updatedProduct = { ...products[index], ...updates };
      products[index] = updatedProduct;
      setLocalStorageValue('trakit_products', products);
      return updatedProduct;
    },
    delete: (id) => {
      const products = getLocalStorageValue('trakit_products', defaultProducts).filter((product) => product.id !== id);
      setLocalStorageValue('trakit_products', products);
      return true;
    },
    saveAll: (products) => {
      setLocalStorageValue('trakit_products', products);
      return true;
    },
  },

  dailyReports: {
    getAll: () => getLocalStorageValue('trakit_daily_reports', defaultReports),
    getByDate: (date) => {
      const reports = getLocalStorageValue('trakit_daily_reports', defaultReports);
      return reports.filter((report) => report.date === date);
    },
    getTodayReport: () => {
      const today = new Date().toISOString().split('T')[0];
      return browserStorage.dailyReports.getByDate(today);
    },
  },

  expenses: {
    getAll: () => getLocalStorageValue('trakit_expenses', defaultExpenses),
    getById: (id) => {
      const expenses = getLocalStorageValue('trakit_expenses', defaultExpenses);
      return expenses.find((expense) => expense.id === id) || null;
    },
    create: (expense) => {
      const expenses = getLocalStorageValue('trakit_expenses', defaultExpenses);
      const newExpense = {
        ...expense,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      const nextExpenses = [...expenses, newExpense];
      setLocalStorageValue('trakit_expenses', nextExpenses);
      return newExpense;
    },
    update: (id, updates) => {
      const expenses = getLocalStorageValue('trakit_expenses', defaultExpenses);
      const index = expenses.findIndex((expense) => expense.id === id);
      if (index === -1) {
        return null;
      }
      const updatedExpense = { ...expenses[index], ...updates };
      expenses[index] = updatedExpense;
      setLocalStorageValue('trakit_expenses', expenses);
      return updatedExpense;
    },
    delete: (id) => {
      const expenses = getLocalStorageValue('trakit_expenses', defaultExpenses).filter(
        (expense) => expense.id !== id
      );
      setLocalStorageValue('trakit_expenses', expenses);
      return true;
    },
    saveAll: (expenses) => {
      setLocalStorageValue('trakit_expenses', expenses);
      return true;
    },
  },

  eReceipts: {
    getAll: () => getLocalStorageValue('trakit_receipts', defaultReceipts),
    getById: (id) => {
      const receipts = getLocalStorageValue('trakit_receipts', defaultReceipts);
      return receipts.find((receipt) => receipt.id === id) || null;
    },
    create: (receipt) => {
      const receipts = getLocalStorageValue('trakit_receipts', defaultReceipts);
      const newReceipt = { ...receipt, id: String(Date.now()), createdAt: new Date().toISOString() };
      const nextReceipts = [...receipts, newReceipt];
      setLocalStorageValue('trakit_receipts', nextReceipts);
      return newReceipt;
    },
  },

  stockControl: {
    getAll: () => getLocalStorageValue('trakit_stock_control', defaultStock),
    create: (item) => {
      const stockItems = getLocalStorageValue('trakit_stock_control', defaultStock);
      const newItem = { ...item, id: String(Date.now()), date: new Date().toISOString() };
      const nextStock = [...stockItems, newItem];
      setLocalStorageValue('trakit_stock_control', nextStock);
      return newItem;
    },
  },
};

let serverStoragePromise = null;

const getServerStorage = () => {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!serverStoragePromise) {
    serverStoragePromise = import('./serverStorage.js')
      .then((module) => module.serverStorage)
      .catch(() => null);
  }

  return serverStoragePromise;
};

const withServerStorage = (browserHandler, serverHandler) => (...args) => {
  if (typeof window !== 'undefined') {
    return browserHandler(...args);
  }

  return getServerStorage().then((server) => {
    if (server) {
      return serverHandler(server, ...args);
    }

    return browserHandler(...args);
  });
};

export const storage = {
  users: {
    getAll: withServerStorage(
      () => browserStorage.users.getAll(),
      (server) => server.users.getAll()
    ),
    getById: withServerStorage(
      (id) => browserStorage.users.getById(id),
      (server, id) => server.users.getById(id)
    ),
    getByEmail: withServerStorage(
      (email) => browserStorage.users.getByEmail(email),
      (server, email) => server.users.getByEmail(email)
    ),
    create: withServerStorage(
      (user) => browserStorage.users.create(user),
      (server, user) => server.users.create(user)
    ),
    update: withServerStorage(
      (id, updates) => browserStorage.users.update(id, updates),
      (server, id, updates) => server.users.update(id, updates)
    ),
  },

  products: {
    getAll: withServerStorage(
      () => browserStorage.products.getAll(),
      (server) => server.products.getAll()
    ),
    getById: withServerStorage(
      (id) => browserStorage.products.getById(id),
      (server, id) => server.products.getById(id)
    ),
    create: withServerStorage(
      (product) => browserStorage.products.create(product),
      (server, product) => server.products.create(product)
    ),
    update: withServerStorage(
      (id, updates) => browserStorage.products.update(id, updates),
      (server, id, updates) => server.products.update(id, updates)
    ),
    delete: withServerStorage(
      (id) => browserStorage.products.delete(id),
      (server, id) => server.products.delete(id)
    ),
    saveAll: (products) => browserStorage.products.saveAll(products),
  },

  dailyReports: {
    getAll: withServerStorage(
      () => browserStorage.dailyReports.getAll(),
      (server) => server.dailyReports.getAll()
    ),
    getByDate: withServerStorage(
      (date) => browserStorage.dailyReports.getByDate(date),
      (server, date) => server.dailyReports.getByDate(date)
    ),
    getTodayReport: withServerStorage(
      () => browserStorage.dailyReports.getTodayReport(),
      (server) => server.dailyReports.getTodayReport()
    ),
  },

  expenses: {
    getAll: withServerStorage(
      () => browserStorage.expenses.getAll(),
      (server) => server.expenses.getAll()
    ),
    getById: withServerStorage(
      (id) => browserStorage.expenses.getById(id),
      (server, id) => server.expenses.getById(id)
    ),
    create: withServerStorage(
      (expense) => browserStorage.expenses.create(expense),
      (server, expense) => server.expenses.create(expense)
    ),
    update: withServerStorage(
      (id, updates) => browserStorage.expenses.update(id, updates),
      (server, id, updates) => server.expenses.update(id, updates)
    ),
    delete: withServerStorage(
      (id) => browserStorage.expenses.delete(id),
      (server, id) => server.expenses.delete(id)
    ),
    saveAll: (expenses) => browserStorage.expenses.saveAll(expenses),
  },

  eReceipts: {
    getAll: withServerStorage(
      () => browserStorage.eReceipts.getAll(),
      (server) => server.eReceipts.getAll()
    ),
    getById: withServerStorage(
      (id) => browserStorage.eReceipts.getById(id),
      (server, id) => server.eReceipts.getById(id)
    ),
    create: withServerStorage(
      (receipt) => browserStorage.eReceipts.create(receipt),
      (server, receipt) => server.eReceipts.create(receipt)
    ),
  },

  stockControl: {
    getAll: withServerStorage(
      () => browserStorage.stockControl.getAll(),
      (server) => server.stockControl.getAll()
    ),
    create: withServerStorage(
      (item) => browserStorage.stockControl.create(item),
      (server, item) => server.stockControl.create(item)
    ),
  },
};

const parseCurrency = (value) => {
  const raw = String(value ?? '').replace(/[$,\s]/g, '').toLowerCase();
  if (!raw) return 0;

  const multiplierMap = { k: 1000, m: 1000000 };
  const unit = raw.slice(-1);
  const multiplier = multiplierMap[unit] || 1;
  const numeric = Number.parseFloat(raw.replace(/[a-z]/gi, '')) || 0;

  return numeric * multiplier;
};

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return `$${numeric.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const calculateDailyMetrics = ({ products = [], expenses = [] }) => {
  const totalRevenue = products.reduce((sum, product) => {
    const soldUnits = Number(product.stockSold ?? 0) || 0;
    return sum + parseCurrency(product.sellPrice) * soldUnits;
  }, 0);

  const totalCost = products.reduce((sum, product) => {
    const soldUnits = Number(product.stockSold ?? 0) || 0;
    return sum + parseCurrency(product.buyPrice) * soldUnits;
  }, 0);

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + (Number(expense.amount) || 0);
  }, 0);

  const grossProfit = totalRevenue - totalCost - totalExpenses;

  return {
    totalRevenue: formatCurrency(totalRevenue),
    totalCost: formatCurrency(totalCost),
    totalExpenses: formatCurrency(totalExpenses),
    grossProfit: formatCurrency(grossProfit),
  };
};

export const getSummaryData = () => ({
  totalRevenue: '$97.40K',
  totalExpenses: '$27.40K',
  grossProfit: '$40.10K',
  businessCapital: '$600k',
  lowStockCount: 2,
  currentDate: new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
});
