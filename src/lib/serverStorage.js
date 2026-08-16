import fs from 'fs/promises';
import path from 'path';

let prisma = null;

const fallbackStoragePath = path.join(process.cwd(), 'data', 'fallback-storage.json');

const defaultUsers = [];
const defaultProducts = [];
const defaultExpenses = [];

const defaultFallbackState = {
  users: [],
  products: [],
  reports: [],
  expenses: [],
  receipts: [],
  stock: [],
};

const loadFallbackState = async () => {
  try {
    await fs.mkdir(path.dirname(fallbackStoragePath), { recursive: true });
    const raw = await fs.readFile(fallbackStoragePath, 'utf8');
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      receipts: Array.isArray(parsed.receipts) ? parsed.receipts : [],
      stock: Array.isArray(parsed.stock) ? parsed.stock : [],
    };
  } catch {
    await fs.writeFile(fallbackStoragePath, JSON.stringify(defaultFallbackState, null, 2));
    return { ...defaultFallbackState };
  }
};

const saveFallbackState = async (state) => {
  await fs.mkdir(path.dirname(fallbackStoragePath), { recursive: true });
  await fs.writeFile(fallbackStoragePath, JSON.stringify(state, null, 2));
  return state;
};

const mapProduct = (row) => ({
  ...row,
  inStock: Number(row.inStock),
  stockSold: Number(row.stockSold),
});

const mapReport = (row) => ({
  ...row,
  inStock: Number(row.inStock),
  stockSold: Number(row.stockSold),
});

const mapReceipt = (row) => ({
  ...row,
  items: row.items ? JSON.parse(row.items) : [],
});

const mapStockControl = (row) => ({
  ...row,
  quantity: Number(row.quantity),
  unitPrice: Number(row.unitPrice),
  totalPrice: Number(row.totalPrice),
  date: row.date instanceof Date ? row.date : new Date(row.date),
});

let fallbackUsers = [];
let fallbackProducts = [];
let fallbackReports = [];
let fallbackReceipts = [];
let fallbackStock = [];

const hasDatabaseConfig = () => Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public');

const getPrisma = async () => {
  if (!hasDatabaseConfig()) {
    return null;
  }

  if (!prisma) {
    try {
      const prismaModule = await import('./prisma.js');
      prisma = prismaModule.default;
    } catch (error) {
      console.warn('Prisma client unavailable. Database connection is not active.', error.message);
      prisma = null;
    }
  }

  return prisma;
};

const runWithFallback = async (operation, fallbackValue) => {
  if (!hasDatabaseConfig()) {
    return fallbackValue;
  }

  try {
    const currentPrisma = await getPrisma();
    if (!currentPrisma) {
      return fallbackValue;
    }

    return await operation(currentPrisma);
  } catch (error) {
    console.warn('Prisma unavailable. Returning empty fallback state.', error.message);
    return fallbackValue;
  }
};

export const serverStorage = {
  users: {
    getAll: async () => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.user.findMany();
          return results.map((row) => ({ ...row, createdAt: new Date(row.createdAt) }));
        },
        []
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async (currentPrisma) => {
          const row = await currentPrisma.user.findUnique({ where: { id } });
          return row ? { ...row, createdAt: new Date(row.createdAt) } : null;
        },
        null
      );
    },
    getByEmail: async (email) => {
      return runWithFallback(
        async (currentPrisma) => {
          const row = await currentPrisma.user.findUnique({ where: { email } });
          return row ? { ...row, createdAt: new Date(row.createdAt) } : null;
        },
        null
      );
    },
    create: async ({ name, email, passwordHash, role }) => {
      return runWithFallback(
        async (currentPrisma) => {
          const created = await currentPrisma.user.create({
            data: {
              name,
              email,
              passwordHash,
              role,
            },
          });
          return { ...created, createdAt: new Date(created.createdAt) };
        },
        null
      );
    },
    update: async (id, updates) => {
      return runWithFallback(
        async (currentPrisma) => {
          const existing = await currentPrisma.user.findUnique({ where: { id } });
          if (!existing) return null;
          const updated = await currentPrisma.user.update({
            where: { id },
            data: {
              name: updates.name ?? existing.name,
              email: updates.email ?? existing.email,
              passwordHash: updates.passwordHash ?? existing.passwordHash,
              role: updates.role ?? existing.role,
            },
          });
          return { ...updated, createdAt: new Date(updated.createdAt) };
        },
        null
      );
    },
  },

  products: {
    getAll: async () => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.product.findMany();
          return results.map(mapProduct);
        },
        []
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async (currentPrisma) => {
          const row = await currentPrisma.product.findUnique({ where: { id } });
          return row ? mapProduct(row) : null;
        },
        null
      );
    },
    create: async (product) => {
      return runWithFallback(
        async (currentPrisma) => {
          const created = await currentPrisma.product.create({
            data: {
              name: product.name,
              category: product.category,
              buyPrice: product.buyPrice,
              sellPrice: product.sellPrice,
              inStock: Number(product.inStock),
              stockSold: Number(product.stockSold),
              profit: product.profit,
              status: product.status,
            },
          });
          return mapProduct(created);
        },
        null
      );
    },
    update: async (id, updates) => {
      return runWithFallback(
        async (currentPrisma) => {
          const existing = await currentPrisma.product.findUnique({ where: { id } });
          if (!existing) return null;
          const updated = await currentPrisma.product.update({
            where: { id },
            data: {
              name: updates.name ?? existing.name,
              category: updates.category ?? existing.category,
              buyPrice: updates.buyPrice ?? existing.buyPrice,
              sellPrice: updates.sellPrice ?? existing.sellPrice,
              inStock: Number(updates.inStock ?? existing.inStock),
              stockSold: Number(updates.stockSold ?? existing.stockSold),
              profit: updates.profit ?? existing.profit,
              status: updates.status ?? existing.status,
            },
          });
          return mapProduct(updated);
        },
        null
      );
    },
    delete: async (id) => {
      return runWithFallback(
        async (currentPrisma) => {
          await currentPrisma.product.delete({ where: { id } });
          return true;
        },
        false
      );
    },
  },

  dailyReports: {
    getAll: async () => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.dailyReport.findMany();
          return results.map(mapReport);
        },
        []
      );
    },
    getByDate: async (date) => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.dailyReport.findMany({ where: { date } });
          return results.map(mapReport);
        },
        []
      );
    },
    getTodayReport: async () => {
      const today = new Date().toISOString().split('T')[0];
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.dailyReport.findMany({ where: { date: today } });
          return results.map(mapReport);
        },
        []
      );
    },
  },

  expenses: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          return state.expenses;
        },
        []
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          return state.expenses.find((row) => row.id === id) || null;
        },
        null
      );
    },
    create: async (expense) => {
      const created = {
        id: String(Date.now()),
        ...expense,
        amount: Number(expense.amount || 0),
        createdAt: new Date().toISOString(),
      };

      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          const nextState = { ...state, expenses: [...state.expenses, created] };
          await saveFallbackState(nextState);
          return created;
        },
        created
      );
    },
    update: async (id, updates) => {
      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          const index = state.expenses.findIndex((row) => row.id === id);
          if (index === -1) return null;
          state.expenses[index] = { ...state.expenses[index], ...updates, amount: Number(updates.amount ?? state.expenses[index].amount) };
          await saveFallbackState(state);
          return state.expenses[index];
        },
        null
      );
    },
    delete: async (id) => {
      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          const nextState = { ...state, expenses: state.expenses.filter((row) => row.id !== id) };
          await saveFallbackState(nextState);
          return true;
        },
        false
      );
    },
  },

  eReceipts: {
    getAll: async () => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.eReceipt.findMany();
          return results.map(mapReceipt);
        },
        []
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async (currentPrisma) => {
          const row = await currentPrisma.eReceipt.findUnique({ where: { id } });
          return row ? mapReceipt(row) : null;
        },
        null
      );
    },
    create: async (receipt) => {
      return runWithFallback(
        async (currentPrisma) => {
          const created = await currentPrisma.eReceipt.create({
            data: {
              customerName: receipt.customerName,
              customerPhone: receipt.customerPhone,
              items: JSON.stringify(receipt.items || []),
              totalAmount: receipt.totalAmount || '',
              createdBy: receipt.createdBy,
              createdByRole: receipt.createdByRole,
            },
          });
          return mapReceipt(created);
        },
        null
      );
    },
  },

  stockControl: {
    getAll: async () => {
      return runWithFallback(
        async (currentPrisma) => {
          const results = await currentPrisma.stockControl.findMany();
          return results.map(mapStockControl);
        },
        []
      );
    },
    create: async (item) => {
      return runWithFallback(
        async (currentPrisma) => {
          const created = await currentPrisma.stockControl.create({
            data: {
              product: item.product,
              category: item.category,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              totalPrice: Number(item.totalPrice),
            },
          });
          return mapStockControl(created);
        },
        null
      );
    },
  },
};
