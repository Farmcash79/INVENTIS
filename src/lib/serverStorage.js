import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

let prisma = null;

const fallbackPasswordHash = bcrypt.hashSync('password', 10);
const fallbackStoragePath = path.join(process.cwd(), 'data', 'fallback-storage.json');

const defaultUsers = [
  {
    id: '1',
    name: 'James Osei',
    email: 'owner@example.com',
    passwordHash: fallbackPasswordHash,
    role: 'owner',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Sales',
    email: 'salesrep@example.com',
    passwordHash: fallbackPasswordHash,
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
];

const defaultExpenses = [];

const defaultFallbackState = {
  users: [...defaultUsers],
  products: [...defaultProducts],
  reports: [],
  expenses: [...defaultExpenses],
  receipts: [],
  stock: [],
};

const loadFallbackState = async () => {
  try {
    await fs.mkdir(path.dirname(fallbackStoragePath), { recursive: true });
    const raw = await fs.readFile(fallbackStoragePath, 'utf8');
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [...defaultUsers],
      products: Array.isArray(parsed.products) ? parsed.products : [...defaultProducts],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [...defaultExpenses],
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

let fallbackUsers = [...defaultUsers];
let fallbackProducts = [...defaultProducts];
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
      console.warn('Prisma client unavailable, using fallback storage.', error.message);
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
    await getPrisma();
    return await operation();
  } catch (error) {
    console.warn('Prisma unavailable, using fallback storage.', error.message);
    return fallbackValue;
  }
};

export const serverStorage = {
  users: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const currentPrisma = await getPrisma();
          if (!currentPrisma) {
            const state = await loadFallbackState();
            return state.users.map((row) => ({ ...row, createdAt: new Date(row.createdAt) }));
          }

          const results = await currentPrisma.user.findMany();
          return results.map((row) => ({ ...row, createdAt: new Date(row.createdAt) }));
        },
        fallbackUsers.map((row) => ({ ...row, createdAt: new Date(row.createdAt) }))
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async () => {
          const currentPrisma = await getPrisma();
          if (!currentPrisma) {
            const state = await loadFallbackState();
            const found = state.users.find((row) => row.id === id);
            return found ? { ...found, createdAt: new Date(found.createdAt) } : null;
          }

          const row = await currentPrisma.user.findUnique({ where: { id } });
          return row ? { ...row, createdAt: new Date(row.createdAt) } : null;
        },
        fallbackUsers.find((row) => row.id === id) ? { ...fallbackUsers.find((row) => row.id === id), createdAt: new Date(fallbackUsers.find((row) => row.id === id).createdAt) } : null
      );
    },
    getByEmail: async (email) => {
      return runWithFallback(
        async () => {
          const currentPrisma = await getPrisma();
          if (!currentPrisma) {
            const state = await loadFallbackState();
            const found = state.users.find((row) => row.email === email);
            return found ? { ...found, createdAt: new Date(found.createdAt) } : null;
          }

          const row = await currentPrisma.user.findUnique({ where: { email } });
          return row ? { ...row, createdAt: new Date(row.createdAt) } : null;
        },
        fallbackUsers.find((row) => row.email === email) ? { ...fallbackUsers.find((row) => row.email === email), createdAt: new Date(fallbackUsers.find((row) => row.email === email).createdAt) } : null
      );
    },
    create: async ({ name, email, passwordHash, role }) => {
      return runWithFallback(
        async () => {
          const currentPrisma = await getPrisma();
          if (!currentPrisma) {
            const state = await loadFallbackState();
            const created = {
              id: String(Date.now()),
              name,
              email,
              passwordHash,
              role,
              createdAt: new Date().toISOString(),
            };
            const nextState = {
              ...state,
              users: [...state.users, created],
            };
            await saveFallbackState(nextState);
            return created;
          }

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
        (() => {
          const created = {
            id: String(Date.now()),
            name,
            email,
            passwordHash,
            role,
            createdAt: new Date().toISOString(),
          };
          fallbackUsers = [...fallbackUsers, created];
          return created;
        })()
      );
    },
    update: async (id, updates) => {
      return runWithFallback(
        async () => {
          const currentPrisma = await getPrisma();
          if (!currentPrisma) {
            const state = await loadFallbackState();
            const index = state.users.findIndex((row) => row.id === id);
            if (index === -1) return null;
            state.users[index] = { ...state.users[index], ...updates };
            await saveFallbackState(state);
            return { ...state.users[index], createdAt: new Date(state.users[index].createdAt) };
          }

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
        (() => {
          const index = fallbackUsers.findIndex((row) => row.id === id);
          if (index === -1) return null;
          fallbackUsers[index] = { ...fallbackUsers[index], ...updates };
          return { ...fallbackUsers[index], createdAt: new Date(fallbackUsers[index].createdAt) };
        })()
      );
    },
  },

  products: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const results = await prisma.product.findMany();
          return results.map(mapProduct);
        },
        fallbackProducts.map(mapProduct)
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async () => {
          const row = await prisma.product.findUnique({ where: { id } });
          return row ? mapProduct(row) : null;
        },
        fallbackProducts.find((row) => row.id === id) ? mapProduct(fallbackProducts.find((row) => row.id === id)) : null
      );
    },
    create: async (product) => {
      return runWithFallback(
        async () => {
          const created = await prisma.product.create({
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
        (() => {
          const created = {
            id: String(Date.now()),
            ...product,
            inStock: Number(product.inStock),
            stockSold: Number(product.stockSold),
          };
          fallbackProducts = [...fallbackProducts, created];
          return mapProduct(created);
        })()
      );
    },
    update: async (id, updates) => {
      return runWithFallback(
        async () => {
          const existing = await prisma.product.findUnique({ where: { id } });
          if (!existing) return null;
          const updated = await prisma.product.update({
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
        (() => {
          const index = fallbackProducts.findIndex((row) => row.id === id);
          if (index === -1) return null;
          fallbackProducts[index] = { ...fallbackProducts[index], ...updates };
          return mapProduct(fallbackProducts[index]);
        })()
      );
    },
    delete: async (id) => {
      return runWithFallback(
        async () => {
          await prisma.product.delete({ where: { id } });
          return true;
        },
        (() => {
          fallbackProducts = fallbackProducts.filter((row) => row.id !== id);
          return true;
        })()
      );
    },
  },

  dailyReports: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const results = await prisma.dailyReport.findMany();
          return results.map(mapReport);
        },
        fallbackReports.map(mapReport)
      );
    },
    getByDate: async (date) => {
      return runWithFallback(
        async () => {
          const results = await prisma.dailyReport.findMany({ where: { date } });
          return results.map(mapReport);
        },
        fallbackReports.filter((row) => row.date === date).map(mapReport)
      );
    },
    getTodayReport: async () => {
      const today = new Date().toISOString().split('T')[0];
      return runWithFallback(
        async () => {
          const results = await prisma.dailyReport.findMany({ where: { date: today } });
          return results.map(mapReport);
        },
        fallbackReports.filter((row) => row.date === today).map(mapReport)
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
        fallbackUsers.length ? fallbackUsers.map(() => []) : []
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async () => {
          const state = await loadFallbackState();
          return state.expenses.find((row) => row.id === id) || null;
        },
        []
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
        true
      );
    },
  },

  eReceipts: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const results = await prisma.eReceipt.findMany();
          return results.map(mapReceipt);
        },
        fallbackReceipts.map(mapReceipt)
      );
    },
    getById: async (id) => {
      return runWithFallback(
        async () => {
          const row = await prisma.eReceipt.findUnique({ where: { id } });
          return row ? mapReceipt(row) : null;
        },
        fallbackReceipts.find((row) => row.id === id) ? mapReceipt(fallbackReceipts.find((row) => row.id === id)) : null
      );
    },
    create: async (receipt) => {
      return runWithFallback(
        async () => {
          const created = await prisma.eReceipt.create({
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
        (() => {
          const created = {
            id: String(Date.now()),
            ...receipt,
            items: receipt.items || [],
            createdAt: new Date().toISOString(),
          };
          fallbackReceipts = [...fallbackReceipts, created];
          return mapReceipt(created);
        })()
      );
    },
  },

  stockControl: {
    getAll: async () => {
      return runWithFallback(
        async () => {
          const results = await prisma.stockControl.findMany();
          return results.map(mapStockControl);
        },
        fallbackStock.map(mapStockControl)
      );
    },
    create: async (item) => {
      return runWithFallback(
        async () => {
          const created = await prisma.stockControl.create({
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
        (() => {
          const created = {
            id: String(Date.now()),
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
            date: new Date().toISOString(),
          };
          fallbackStock = [...fallbackStock, created];
          return mapStockControl(created);
        })()
      );
    },
  },
};
