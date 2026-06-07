'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import ProtectedRoute from '@/components/ProtectedRoute';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  fontSize: '24px',
  color: 'var(--text-primary)',
  fontWeight: 700,
};

const addButtonStyle = {
  padding: '12px 24px',
  background: 'var(--primary-gold)',
  color: 'var(--dark-bg)',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const filterButtonsStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
};

const filterButtonStyle = {
  padding: '10px 16px',
  background: 'transparent',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const filterButtonActiveStyle = {
  ...filterButtonStyle,
  background: 'var(--primary-gold)',
  color: 'var(--dark-bg)',
  borderColor: 'var(--primary-gold)',
};

const tableContainerStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const tableHeaderStyle = {
  padding: '20px 24px',
  borderBottom: '1px solid var(--border-color)',
};

const tableTitleStyle = {
  fontSize: '16px',
  color: 'var(--text-primary)',
  fontWeight: 700,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeadRowStyle = {
  background: 'var(--primary-dark)',
  borderBottom: '1px solid var(--border-color)',
};

const tableHeadCellStyle = {
  padding: '16px 24px',
  textAlign: 'left',
  fontSize: '12px',
  color: 'var(--text-muted)',
  fontWeight: 600,
  letterSpacing: '0.5px',
};

const tableBodyCellStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-color)',
};

const actionsCellStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const editButtonStyle = {
  padding: '6px 12px',
  background: 'var(--primary-gold)',
  color: 'var(--dark-bg)',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  background: 'var(--status-danger)',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const statusHighStyle = {
  ...tableBodyCellStyle,
  backgroundColor: 'rgba(0, 204, 0, 0.1)',
  color: 'var(--status-success)',
  fontWeight: 600,
};

const statusMediumStyle = {
  ...tableBodyCellStyle,
  backgroundColor: 'rgba(255, 184, 28, 0.1)',
  color: 'var(--status-warning)',
  fontWeight: 600,
};

const statusLowStyle = {
  ...tableBodyCellStyle,
  backgroundColor: 'rgba(255, 51, 51, 0.1)',
  color: 'var(--status-danger)',
  fontWeight: 600,
};

const categories = [
  'All',
  'Computing',
  'Accessories',
  'Electronics',
  'Kitchen',
  'Gas',
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'high':
      return statusHighStyle;
    case 'medium':
      return statusMediumStyle;
    case 'low':
      return statusLowStyle;
    default:
      return tableBodyCellStyle;
  }
};

const getStatusDisplay = (status) => {
  switch (status) {
    case 'high':
      return '● High';
    case 'medium':
      return '● Medium';
    case 'low':
      return '● Low';
    default:
      return '● Unknown';
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRole, setUserRole] = useState('owner');

  useEffect(() => {
    const allProducts = storage.products.getAll();
    setProducts(allProducts);

    // Get user role
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
  };

  const handleDelete = (productId) => {
    if (userRole !== 'owner') {
      alert('Only owners can delete products');
      return;
    }
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    console.log('Delete product:', productId);
  };

  const isSalesRep = userRole === 'sales_rep';

  return (
    <ProtectedRoute requiredRole={['owner', 'sales_rep']}>
      <div style={pageStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Products</h1>
          {userRole === 'owner' && (
            <button
              style={addButtonStyle}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              + ADD PRODUCTS
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div style={filterButtonsStyle}>
          {categories.map((category) => (
            <button
              key={category}
              style={
                selectedCategory === category
                  ? filterButtonActiveStyle
                  : filterButtonStyle
              }
              onClick={() => setSelectedCategory(category)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.borderColor = 'var(--primary-gold)';
                  e.target.style.color = 'var(--primary-gold)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sales Rep Notice */}
        {isSalesRep && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 184, 28, 0.1)',
            border: '1px solid var(--status-warning)',
            borderRadius: '6px',
            color: 'var(--status-warning)',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            📌 Sales Rep View: Financial details (Buy price, Profit) are hidden. You can only update stock levels.
          </div>
        )}

        {/* Products Table */}
        <div style={tableContainerStyle}>
          <div style={tableHeaderStyle}>
            <div style={tableTitleStyle}>Product Inventory</div>
          </div>
          <table style={tableStyle}>
            <thead style={tableHeadRowStyle}>
              <tr>
                <th style={tableHeadCellStyle}>Product</th>
                <th style={tableHeadCellStyle}>Category</th>
                {!isSalesRep && <th style={tableHeadCellStyle}>Buy</th>}
                <th style={tableHeadCellStyle}>Sell</th>
                <th style={tableHeadCellStyle}>Stock</th>
                <th style={tableHeadCellStyle}>Sold</th>
                {!isSalesRep && <th style={tableHeadCellStyle}>Profit</th>}
                <th style={tableHeadCellStyle}>Status</th>
                <th style={tableHeadCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={tableBodyCellStyle}>{product.name}</td>
                  <td style={tableBodyCellStyle}>{product.category}</td>
                  {!isSalesRep && <td style={tableBodyCellStyle}>{product.buyPrice}</td>}
                  <td style={tableBodyCellStyle}>{product.sellPrice}</td>
                  <td style={tableBodyCellStyle}>{product.inStock}</td>
                  <td style={tableBodyCellStyle}>{product.stockSold}</td>
                  {!isSalesRep && <td style={tableBodyCellStyle}>{product.profit}</td>}
                  <td style={getStatusStyle(product.status)}>
                    {getStatusDisplay(product.status)}
                  </td>
                  <td style={actionsCellStyle}>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEdit(product.id)}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      {isSalesRep ? 'Update Stock' : 'Edit'}
                    </button>
                    {!isSalesRep && (
                      <button
                        style={deleteButtonStyle}
                        onClick={() => handleDelete(product.id)}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        DELETE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
