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

const formContainerStyle = {
  background: 'var(--card-bg)',
  border: '2px solid var(--primary-gold)',
  borderRadius: '8px',
  padding: '24px',
};

const formTitleStyle = {
  fontSize: '16px',
  color: 'var(--text-primary)',
  fontWeight: 700,
  marginBottom: '20px',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
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

const itemGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  marginBottom: '20px',
  padding: '16px',
  background: 'var(--primary-dark)',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
};

const itemInputStyle = {
  ...formInputStyle,
  padding: '8px',
  fontSize: '13px',
};

const itemsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
  maxHeight: '300px',
  overflowY: 'auto',
};

const itemRowStyle = {
  display: 'grid',
  gridTemplateColumns: '80px 1fr 100px 80px',
  gap: '12px',
  padding: '12px',
  background: 'var(--primary-dark)',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  alignItems: 'center',
};

const totalStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '24px',
  padding: '16px',
  background: 'var(--primary-dark)',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  marginBottom: '20px',
};

const totalLabelStyle = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const totalValueStyle = {
  fontSize: '20px',
  color: 'var(--primary-gold)',
  fontWeight: 700,
  minWidth: '120px',
  textAlign: 'right',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
};

const addButtonStyle = {
  padding: '10px 16px',
  background: 'var(--primary-dark)',
  color: 'var(--primary-gold)',
  border: '1px solid var(--primary-gold)',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const removeButtonStyle = {
  padding: '4px 8px',
  background: 'transparent',
  color: 'var(--status-danger)',
  border: '1px solid var(--status-danger)',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const generateButtonStyle = {
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

const salesRepAllowedCategories = ['Computing', 'Accessories', 'Electronics'];

export default function SalesRepEReceiptPage() {
  const [selectedCategory, setSelectedCategory] = useState('Computing');
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    qty: '',
    description: '',
    category: '',
    amount: '',
  });

  const handleAddItem = () => {
    if (newItem.qty && newItem.description && newItem.category && newItem.amount) {
      if (!salesRepAllowedCategories.includes(newItem.category)) {
        alert('You can only create receipts for: ' + salesRepAllowedCategories.join(', '));
        return;
      }
      const item = {
        id: Date.now(),
        qty: parseInt(newItem.qty),
        description: newItem.description,
        category: newItem.category,
        unitAmount: parseFloat(newItem.amount),
        total: parseInt(newItem.qty) * parseFloat(newItem.amount),
      };
      setItems([...items, item]);
      setNewItem({ qty: '', description: '', category: '', amount: '' });
    }
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleGenerateReceipt = () => {
    if (customerName && customerWhatsApp && items.length > 0) {
      const receipt = {
        id: String(storage.eReceipts.getAll().length + 1),
        customerName,
        customerWhatsApp,
        items,
        total: parseFloat(calculateTotal()),
        createdAt: new Date(),
        createdBy: 'sales_rep',
      };
      storage.eReceipts.create(receipt);
      setCustomerName('');
      setCustomerWhatsApp('');
      setItems([]);
      alert('E-Receipt generated successfully!');
    }
  };

  return (
    <ProtectedRoute requiredRole="sales_rep">
      <div style={pageStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>E-Receipt</h1>
        </div>

        {/* Category Filter - Limited for Sales Rep */}
        <div style={filterButtonsStyle}>
          {salesRepAllowedCategories.map((category) => (
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

        {/* E-Receipt Form */}
        <div style={formContainerStyle}>
          <div style={formTitleStyle}>Create E-Receipt</div>

          {/* Customer Details */}
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>Customer Name</label>
              <input
                style={formInputStyle}
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>Customer WhatsApp Number</label>
              <input
                style={formInputStyle}
                type="tel"
                placeholder="Enter WhatsApp number"
                value={customerWhatsApp}
                onChange={(e) => setCustomerWhatsApp(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          {/* Items Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={formLabelStyle} className="mb-2">Add Items</div>
            <div style={itemGridStyle}>
              <div style={formGroupStyle}>
                <label style={{ ...formLabelStyle, fontSize: '11px' }}>Qty</label>
                <input
                  style={itemInputStyle}
                  type="number"
                  placeholder="Qty"
                  value={newItem.qty}
                  onChange={(e) => setNewItem({...newItem, qty: e.target.value})}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={{ ...formLabelStyle, fontSize: '11px' }}>Item Description</label>
                <input
                  style={itemInputStyle}
                  type="text"
                  placeholder="Item description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={{ ...formLabelStyle, fontSize: '11px' }}>Category</label>
                <select
                  style={itemInputStyle}
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="">Select</option>
                  {salesRepAllowedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={{ ...formLabelStyle, fontSize: '11px' }}>Amount</label>
                <input
                  style={itemInputStyle}
                  type="number"
                  placeholder="Amount"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                />
              </div>
            </div>
            <button
              style={addButtonStyle}
              onClick={handleAddItem}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              + Add Item
            </button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <>
              <div style={itemsContainerStyle}>
                {items.map((item) => (
                  <div key={item.id} style={itemRowStyle}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
                      {item.qty}x
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
                        {item.description}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {item.category} • ${item.unitAmount}
                      </div>
                    </div>
                    <div style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: 700 }}>
                      ${item.total.toFixed(2)}
                    </div>
                    <button
                      style={removeButtonStyle}
                      onClick={() => handleRemoveItem(item.id)}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={totalStyle}>
                <span style={totalLabelStyle}>Receipt Total</span>
                <span style={totalValueStyle}>${calculateTotal()}</span>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <button
              style={generateButtonStyle}
              onClick={handleGenerateReceipt}
              disabled={!customerName || !customerWhatsApp || items.length === 0}
              onMouseEnter={(e) => {
                if (customerName && customerWhatsApp && items.length > 0) {
                  e.target.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Generate Receipt
            </button>
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: '16px',
            background: 'rgba(255, 184, 28, 0.05)',
            border: '1px solid rgba(255, 184, 28, 0.2)',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ color: 'var(--status-warning)', fontSize: '14px' }}>⚠</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              You can only create receipts for: {salesRepAllowedCategories.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
