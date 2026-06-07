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

const formContainerStyle = {
  background: 'var(--card-bg)',
  border: '2px solid var(--primary-gold)',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '12px',
};

const formTitleStyle = {
  fontSize: '16px',
  color: 'var(--text-primary)',
  fontWeight: 700,
  marginBottom: '20px',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gap: '16px',
  marginBottom: '20px',
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabelStyle = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const formInputStyle = {
  padding: '10px 12px',
  background: 'var(--primary-dark)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  borderRadius: '4px',
  fontSize: '14px',
  transition: 'all 0.3s ease',
};

const formButtonsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
};

const submitButtonStyle = {
  padding: '10px 24px',
  background: 'var(--primary-gold)',
  color: 'var(--dark-bg)',
  border: 'none',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const cancelButtonStyle = {
  padding: '10px 24px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
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

export default function StockControlPage() {
  const [stockItems, setStockItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    category: '',
    quantity: '',
    unitPrice: '',
  });

  useEffect(() => {
    const items = storage.stockControl.getAll();
    setStockItems(items);
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? stockItems
    : stockItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleAddClick = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({ product: '', category: '', quantity: '', unitPrice: '' });
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.product && formData.category && formData.quantity && formData.unitPrice) {
      const newItem = storage.stockControl.create({
        product: formData.product,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unitPrice: parseInt(formData.unitPrice),
        totalPrice: parseInt(formData.quantity) * parseInt(formData.unitPrice),
      });
      setStockItems([...stockItems, newItem]);
      setFormData({ product: '', category: '', quantity: '', unitPrice: '' });
      setShowForm(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="owner">
      <div style={pageStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Stock Control</h1>
          <button
            style={addButtonStyle}
            onClick={handleAddClick}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            + ADD STOCK
          </button>
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

        {/* Add Stock Form */}
        {showForm && (
          <div style={formContainerStyle}>
            <div style={formTitleStyle}>Add New Stock Entry</div>
            <div style={formGridStyle}>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Product Name</label>
                <input
                  style={formInputStyle}
                  type="text"
                  placeholder="Enter product name"
                  value={formData.product}
                  onChange={(e) => handleFormChange('product', e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Category</label>
                <select
                  style={formInputStyle}
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Quantity</label>
                <input
                  style={formInputStyle}
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Unit Price</label>
                <input
                  style={formInputStyle}
                  type="number"
                  placeholder="0"
                  value={formData.unitPrice}
                  onChange={(e) => handleFormChange('unitPrice', e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>
            <div style={formButtonsStyle}>
              <button
                style={cancelButtonStyle}
                onClick={() => {
                  setShowForm(false);
                  setFormData({ product: '', category: '', quantity: '', unitPrice: '' });
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Cancel
              </button>
              <button
                style={submitButtonStyle}
                onClick={handleSubmit}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Add Entry
              </button>
            </div>
          </div>
        )}

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
              {filteredItems.map((item) => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
