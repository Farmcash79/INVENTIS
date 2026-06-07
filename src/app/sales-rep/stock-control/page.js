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

const badgeStyle = {
  display: 'inline-block',
  padding: '6px 12px',
  background: 'rgba(0, 204, 0, 0.1)',
  color: 'var(--status-success)',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
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

const categories = ['All', 'Computing', 'Accessories', 'Electronics', 'Kitchen', 'Gas'];

const getQuantityStatus = (quantity) => {
  if (quantity >= 100) return 'high';
  if (quantity >= 50) return 'medium';
  return 'low';
};

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

export default function SalesRepStockControlPage() {
  const [stockItems, setStockItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const items = storage.stockControl.getAll();
    setStockItems(items);
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? stockItems
    : stockItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <ProtectedRoute requiredRole="sales_rep">
      <div style={pageStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Stock Control</h1>
          <div style={badgeStyle}>
            VIEW ONLY
          </div>
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

        {/* Stock Table */}
        <div style={tableContainerStyle}>
          <div style={tableHeaderStyle}>
            <div style={tableTitleStyle}>Stock Inventory</div>
          </div>
          <table style={tableStyle}>
            <thead style={tableHeadRowStyle}>
              <tr>
                <th style={tableHeadCellStyle}>Product</th>
                <th style={tableHeadCellStyle}>Category</th>
                <th style={tableHeadCellStyle}>Quantity</th>
                <th style={tableHeadCellStyle}>Unit Price</th>
                <th style={tableHeadCellStyle}>Total Price</th>
                <th style={tableHeadCellStyle}>Date</th>
                <th style={tableHeadCellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getQuantityStatus(item.quantity);
                  return (
                    <tr key={item.id}>
                      <td style={tableBodyCellStyle}>{item.product}</td>
                      <td style={tableBodyCellStyle}>{item.category}</td>
                      <td style={tableBodyCellStyle}>{item.quantity}</td>
                      <td style={tableBodyCellStyle}>${item.unitPrice}</td>
                      <td style={tableBodyCellStyle}>${item.totalPrice}</td>
                      <td style={tableBodyCellStyle}>
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td style={getStatusStyle(status)}>
                        {status === 'high' ? '● High' : status === 'medium' ? '● Medium' : '● Low'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{...tableBodyCellStyle, textAlign: 'center'}}>
                    No stock items available in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(0, 204, 0, 0.05)',
          border: '1px solid rgba(0, 204, 0, 0.2)',
          borderRadius: '6px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ color: 'var(--status-success)', fontSize: '14px' }}>ℹ</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            This is a read-only view. Contact your manager to request stock additions.
          </span>
        </div>
      </div>
    </ProtectedRoute>
  );
}
