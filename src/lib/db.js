import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'trakit.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    buyPrice TEXT NOT NULL,
    sellPrice TEXT NOT NULL,
    inStock INTEGER NOT NULL,
    stockSold INTEGER NOT NULL,
    profit TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dailyReports (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    product TEXT NOT NULL,
    category TEXT NOT NULL,
    buy TEXT NOT NULL,
    sell TEXT NOT NULL,
    inStock INTEGER NOT NULL,
    stockSold INTEGER NOT NULL,
    profit TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS eReceipts (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    items TEXT NOT NULL,
    totalAmount TEXT,
    createdBy TEXT NOT NULL,
    createdByRole TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stockControl (
    id TEXT PRIMARY KEY,
    product TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unitPrice INTEGER NOT NULL,
    totalPrice INTEGER NOT NULL,
    date TEXT NOT NULL
  );
`);

const defaultUsers = [
  {
    id: '1',
    name: 'James Osei',
    email: 'owner@example.com',
    password: 'password',
    role: 'owner',
  },
  {
    id: '2',
    name: 'John Sales',
    email: 'salesrep@example.com',
    password: 'password',
    role: 'sales_rep',
  },
];

const existingUserCount = db.prepare('SELECT COUNT(*) AS count FROM users;').get().count;
if (existingUserCount === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (id, name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?);'
  );

  for (const user of defaultUsers) {
    insertUser.run(
      user.id,
      user.name,
      user.email,
      bcrypt.hashSync(user.password, 10),
      user.role,
      new Date().toISOString()
    );
  }
}

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

const existingProductCount = db.prepare('SELECT COUNT(*) AS count FROM products;').get().count;
if (existingProductCount === 0) {
  const insertProduct = db.prepare(
    'INSERT INTO products (id, name, category, buyPrice, sellPrice, inStock, stockSold, profit, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
  );
  for (const product of defaultProducts) {
    insertProduct.run(
      product.id,
      product.name,
      product.category,
      product.buyPrice,
      product.sellPrice,
      product.inStock,
      product.stockSold,
      product.profit,
      product.status
    );
  }
}

export default db;
