# 📦 Inventis - Inventory Management Suite

A complete, pixel-perfect inventory management system built with Next.js 16, designed for business owners and sales representatives. Features role-based access control, JWT authentication, and a modern dark-themed UI with gold accents.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.2.7-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ JWT-based authentication
- ✅ Role-based access control (Owner/Sales Rep)
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes with automatic redirects
- ✅ Session management with localStorage

### 👤 Owner Dashboard
- ✅ Complete inventory overview with KPIs
- ✅ Total Revenue, Expenses, Gross Profit tracking
- ✅ Product management (add, edit, delete)
- ✅ Stock control with detailed analytics
- ✅ Daily reports with color-coded status
- ✅ E-receipt generation for all categories
- ✅ Top-selling products widget
- ✅ Business capital tracking

### 👥 Sales Rep Dashboard
- ✅ Stock control viewing (read-only + ability to add)
- ✅ E-receipt generation (limited categories)
- ✅ Daily reports (view-only)
- ✅ Restricted access to owner-only features
- ✅ Category-based receipt restrictions

### 🎨 User Interface
- ✅ Modern dark theme with gold accents (#D4A574)
- ✅ Pixel-perfect design matching specifications
- ✅ Responsive sidebar navigation
- ✅ Status color coding (green/yellow/red)
- ✅ Professional data tables
- ✅ Smooth transitions and hover effects
- ✅ Mobile-responsive layouts
- ✅ Consistent typography and spacing

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Navigate to project directory
cd trakit

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📝 Test Credentials

### Owner Account
```
Email: owner@example.com
Password: password
Role: Owner
```

### Sales Rep Account
```
Email: salesrep@example.com
Password: password
Role: Sales Rep
```

---

## 🗺️ Application Routes

### Public Routes
- `GET  /`               - Sign-up page
- `GET  /signin`         - Sign-in page
- `GET  /unauthorized`   - Access denied page

### Protected Routes
- `GET  /dashboard`      - Owner overview (Owner only)
- `GET  /products`       - Product management (Owner only)
- `GET  /stock-control`  - Stock control (Owner only)
- `GET  /daily-reports`  - Daily reports (Owner only)
- `GET  /e-receipt`      - E-receipt generator (Both roles)
- `GET  /sales-rep/stock-control` - Sales rep stock view (Sales Rep only)
- `GET  /sales-rep/e-receipt` - Sales rep e-receipts (Sales Rep only)

### API Routes
- `POST /api/auth/signup`      - Create new account
- `POST /api/auth/signin`      - User login
- `POST /api/auth/logout`      - User logout
- `GET  /api/auth/me`          - Get current user
- `GET  /api/products`         - Fetch products
- `POST /api/products`         - Create product (Owner only)
- `GET  /api/stock`            - Fetch stock items
- `POST /api/stock`            - Add stock (Owner/Sales Rep)
- `GET  /api/receipts`         - Fetch e-receipts
- `POST /api/receipts`         - Create e-receipt (Both roles with restrictions)

---

## 🎨 Color Scheme

```
Primary Gold:        #D4A574  ← Main brand color
Dark Background:     #1A1A1A  ← Main background
Card Background:     #2A2A2A  ← Card/container bg
Text Primary:        #FFFFFF  ← Main text
Text Muted:          #999999  ← Disabled/hint text

Status Colors:
  Success (High):    #00CC00  ← Green
  Warning (Medium):  #FFB81C  ← Yellow/Gold
  Danger (Low):      #FF3333  ← Red
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.js                 # Sign-up
│   ├── signin/page.js          # Sign-in
│   ├── dashboard/              # Owner dashboard
│   ├── products/               # Product management
│   ├── stock-control/          # Stock control
│   ├── daily-reports/          # Daily reports
│   ├── e-receipt/              # E-receipt generator
│   ├── sales-rep/              # Sales rep pages
│   ├── unauthorized/           # Access denied
│   ├── api/                    # API routes
│   │   ├── auth/               # Auth endpoints
│   │   ├── products/           # Products endpoint
│   │   ├── stock/              # Stock endpoint
│   │   └── receipts/           # Receipts endpoint
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities
│   └── styles/                 # Global styles
```

---

## 🔐 Role-Based Access Control

### Owner
- ✅ All pages and features
- ✅ Full product management
- ✅ Complete stock control
- ✅ E-receipts for all categories
- ✅ Daily reports and analytics

### Sales Rep
- ✅ Stock control (view + add)
- ✅ E-receipts (Computing, Accessories, Electronics only)
- ❌ Cannot delete/edit products
- ❌ Cannot access admin pages

---

## 🧪 Testing

### Sign Up
1. Go to `/`
2. Enter name, email, password
3. Select role
4. Click "SIGN-UP"
5. Should redirect to dashboard

### Sign In
1. Go to `/signin`
2. Enter email, password, and select role
3. Click "SIGN-IN"
4. Should redirect to appropriate page

### Access Control
- Owner trying to access sales rep pages → Unauthorized
- Sales rep trying to access owner pages → Unauthorized
- Non-authenticated user → Redirected to signin

---

## 📊 Build Status

✅ **All 18 Routes Compiled Successfully**
✅ **No Build Errors**
✅ **Ready for Development and Deployment**

---

## 📄 License

This project is proprietary and confidential.

---

**For complete documentation, refer to COMPLETE_DOCUMENTATION.md**
