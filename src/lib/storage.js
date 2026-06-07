// Mock storage - In production, use a real database
let users = [
  {
    id: '1',
    name: 'James Osei',
    email: 'owner@example.com',
    passwordHash: '$2a$10$Z7T.X.U2I9.OiZ.Y8R.K8eZvZq0.nZq0.nZq0.nZq0.nZq0.nZ0me', // password: 'password123'
    role: 'owner',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: '2',
    name: 'John Sales',
    email: 'salesrep@example.com',
    passwordHash: '$2a$10$Z7T.X.U2I9.OiZ.Y8R.K8eZvZq0.nZq0.nZq0.nZq0.nZq0.nZ0me', // password: 'password123'
    role: 'sales_rep',
    createdAt: new Date('2026-02-01'),
  },
];

let products = [
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

let dailyReports = [
  {
    id: '1',
    date: '2026-05-23',
    product: 'Earpod',
    category: 'Audio',
    buy: '$2k',
    sell: '$3k',
    inStock: 300,
    stockSold: 3000,
    profit: '$300k',
    status: 'high',
  },
];

let eReceipts = [];

let stockControl = [
  {
    id: '1',
    product: 'Earpod',
    category: 'Audio',
    quantity: 20,
    unitPrice: 30000,
    totalPrice: 600000,
    date: new Date(),
  },
];

// User operations
export const storage = {
  users: {
    getAll: () => users,
    getById: (id) => users.find(u => u.id === id),
    getByEmail: (email) => users.find(u => u.email === email),
    create: (user) => {
      const newUser = { ...user, id: String(users.length + 1), createdAt: new Date() };
      users.push(newUser);
      return newUser;
    },
    update: (id, updates) => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },
  },

  products: {
    getAll: () => products,
    getById: (id) => products.find(p => p.id === id),
    create: (product) => {
      const newProduct = { ...product, id: String(products.length + 1) };
      products.push(newProduct);
      return newProduct;
    },
    update: (id, updates) => {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        return products[index];
      }
      return null;
    },
    delete: (id) => {
      products = products.filter(p => p.id !== id);
      return true;
    },
  },

  dailyReports: {
    getAll: () => dailyReports,
    getByDate: (date) => dailyReports.filter(r => r.date === date),
    getTodayReport: () => {
      const today = new Date().toISOString().split('T')[0];
      return dailyReports.filter(r => r.date === today);
    },
  },

  eReceipts: {
    getAll: () => eReceipts,
    getById: (id) => eReceipts.find(r => r.id === id),
    create: (receipt) => {
      const newReceipt = {
        ...receipt,
        id: String(eReceipts.length + 1),
        createdAt: new Date(),
      };
      eReceipts.push(newReceipt);
      return newReceipt;
    },
  },

  stockControl: {
    getAll: () => stockControl,
    create: (item) => {
      const newItem = {
        ...item,
        id: String(stockControl.length + 1),
        date: new Date(),
      };
      stockControl.push(newItem);
      return newItem;
    },
  },
};

// Summary data
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
