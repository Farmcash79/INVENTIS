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

const itemInputStyle = {
  ...formInputStyle,
  padding: '8px',
  fontSize: '13px',
  width: '100%',
};

const itemsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
  maxHeight: '250px',
  overflowY: 'auto',
};

const itemRowStyle = {
  display: 'grid',
  gridTemplateColumns: '60px 1fr 120px 90px 120px',
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

const editButtonStyle = {
  padding: '4px 8px',
  background: 'transparent',
  color: 'var(--primary-gold)',
  border: '1px solid var(--primary-gold)',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const saveButtonStyle = {
  padding: '4px 8px',
  background: 'var(--primary-gold)',
  color: 'var(--dark-bg)',
  border: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const cancelButtonStyle = {
  padding: '4px 8px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
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

const categories = ['All', 'Computing', 'Accessories', 'Electronics', 'Kitchen', 'Gas'];

export default function EReceiptPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [items, setItems] = useState([]);
  const [newItems, setNewItems] = useState([{ id: Date.now(), qty: '', description: '', category: '', amount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ qty: '', description: '', category: '', unitAmount: '' });

  const handleAddItemField = () => {
    setNewItems([...newItems, { id: Date.now(), qty: '', description: '', category: '', amount: '' }]);
  };

  const handleUpdateItemField = (id, field, value) => {
    setNewItems(newItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItemField = (id) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter(item => item.id !== id));
    }
  };

  const handleAddItem = (newItem) => {
    if (newItem.qty && newItem.description && newItem.category && newItem.amount) {
      const item = {
        id: Date.now() + Math.random(),
        qty: parseInt(newItem.qty),
        description: newItem.description,
        category: newItem.category,
        unitAmount: parseFloat(newItem.amount),
        total: parseInt(newItem.qty) * parseFloat(newItem.amount),
      };
      setItems(prevItems => [...prevItems, item]);
      return true;
    }
    return false;
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };

  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemData({
      qty: String(item.qty),
      description: item.description,
      category: item.category,
      unitAmount: String(item.unitAmount),
    });
  };

  const handleSaveEditedItem = (id) => {
    if (editingItemData.qty && editingItemData.description && editingItemData.category && editingItemData.unitAmount) {
      const updatedQty = parseInt(editingItemData.qty) || 0;
      const updatedAmount = parseFloat(editingItemData.unitAmount) || 0;

      setItems(items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            qty: updatedQty,
            description: editingItemData.description,
            category: editingItemData.category,
            unitAmount: updatedAmount,
            total: updatedQty * updatedAmount,
          };
        }
        return item;
      }));
      setEditingItemId(null);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleGenerateReceipt = async () => {
    if (customerName && customerWhatsApp && items.length > 0) {
      setIsSubmitting(true);
      try {
        const receipt = {
          id: String(storage.eReceipts.getAll().length + 1),
          customerName,
          customerWhatsApp,
          items,
          total: parseFloat(calculateTotal()),
          createdAt: new Date(),
        };
        
        storage.eReceipts.create(receipt);

        const whatsappResponse = await fetch('/api/whatsapp/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: customerWhatsApp,
            customerName,
            items,
            total: parseFloat(calculateTotal()),
          }),
        });

        if (whatsappResponse.ok) {
          alert('E-Receipt generated and sent to WhatsApp successfully!');
        } else {
          alert('E-Receipt generated but failed to send WhatsApp. You can send it manually.');
        }

        setCustomerName('');
        setCustomerWhatsApp('');
        setItems([]);
        setNewItems([{ id: Date.now(), qty: '', description: '', category: '', amount: '' }]);
        setEditingItemId(null);
      } catch (error) {
        alert('E-Receipt generated but error sending WhatsApp. Please try again.');
        console.error('Error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div style={pageStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>E-Receipt</h1>
        </div>

        {/* Category Filter */}
        <div style={filterButtonsStyle}>
          {categories.map((category) => (
            <button
              key={category}
              style={selectedCategory === category ? filterButtonActiveStyle : filterButtonStyle}
              onClick={() => setSelectedCategory(category)}
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
              />
            </div>
          </div>

          {/* SECTION 1: ADDED ITEMS PREVIEW DISPLAY (MOVED ABOVE INPUTS) */}
          {items.length > 0 && (
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
              <div style={{ ...formLabelStyle, marginBottom: '10px', color: 'var(--primary-gold)' }}>
                Added Items List ({items.length})
              </div>
              <div style={itemsContainerStyle}>
                {items.map((item) => (
                  <div key={item.id} style={itemRowStyle}>
                    {editingItemId === item.id ? (
                      <>
                        <input
                          type="number"
                          style={itemInputStyle}
                          value={editingItemData.qty}
                          onChange={(e) => setEditingItemData({ ...editingItemData, qty: e.target.value })}
                        />
                        <input
                          type="text"
                          style={itemInputStyle}
                          value={editingItemData.description}
                          onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                        />
                        <select
                          style={itemInputStyle}
                          value={editingItemData.category}
                          onChange={(e) => setEditingItemData({ ...editingItemData, category: e.target.value })}
                        >
                          {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          style={itemInputStyle}
                          value={editingItemData.unitAmount}
                          onChange={(e) => setEditingItemData({ ...editingItemData, unitAmount: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button style={saveButtonStyle} onClick={() => handleSaveEditedItem(item.id)}>Save</button>
                          <button style={cancelButtonStyle} onClick={() => setEditingItemId(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
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
                        <div>
                          <button style={editButtonStyle} onClick={() => startEditingItem(item)}>Edit</button>
                        </div>
                        <div>
                          <button style={removeButtonStyle} onClick={() => handleRemoveItem(item.id)}>Remove</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: NEW ITEM DATA ENTRY FIELDS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...formLabelStyle, marginBottom: '10px' }}>Add New Items Below</div>
            
            <div style={{ ...itemsContainerStyle, maxHeight: '400px', marginBottom: '20px' }}>
              {newItems.map((newItem) => (
                <div key={newItem.id} style={{
                  padding: '16px',
                  background: 'var(--primary-dark)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 100px 80px 60px',
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  <div style={formGroupStyle}>
                    <label style={{ ...formLabelStyle, fontSize: '10px' }}>Qty</label>
                    <input
                      style={itemInputStyle}
                      type="number"
                      placeholder="Qty"
                      value={newItem.qty}
                      onChange={(e) => handleUpdateItemField(newItem.id, 'qty', e.target.value)}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={{ ...formLabelStyle, fontSize: '10px' }}>Item Description</label>
                    <input
                      style={itemInputStyle}
                      type="text"
                      placeholder="Item description"
                      value={newItem.description}
                      onChange={(e) => handleUpdateItemField(newItem.id, 'description', e.target.value)}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={{ ...formLabelStyle, fontSize: '10px' }}>Category</label>
                    <select
                      style={itemInputStyle}
                      value={newItem.category}
                      onChange={(e) => handleUpdateItemField(newItem.id, 'category', e.target.value)}
                    >
                      <option value="">Select</option>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div style={formGroupStyle}>
                    <label style={{ ...formLabelStyle, fontSize: '10px' }}>Amount</label>
                    <input
                      style={itemInputStyle}
                      type="number"
                      placeholder="Amount"
                      value={newItem.amount}
                      onChange={(e) => handleUpdateItemField(newItem.id, 'amount', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      style={{...removeButtonStyle, padding: '4px 6px', fontSize: '11px'}}
                      onClick={() => handleRemoveItemField(newItem.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{...addButtonStyle, flex: 1}}
                onClick={handleAddItemField}
              >
                + Add New Field
              </button>
              <button
                style={{
                  ...addButtonStyle,
                  background: 'var(--primary-gold)',
                  color: 'var(--dark-bg)',
                  border: 'none',
                  flex: 1
                }}
                onClick={() => {
                  newItems.forEach(newItem => {
                    handleAddItem(newItem);
                  });
                  setNewItems([{ id: Date.now(), qty: '', description: '', category: '', amount: '' }]);
                }}
              >
                ✓ Add All Items
              </button>
            </div>
          </div>

          {/* Total and Action Buttons */}
          {items.length > 0 && (
            <div style={totalStyle}>
              <span style={totalLabelStyle}>Receipt Total</span>
              <span style={totalValueStyle}>${calculateTotal()}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <button
              style={generateButtonStyle}
              onClick={handleGenerateReceipt}
              disabled={!customerName || !customerWhatsApp || items.length === 0 || editingItemId !== null}
            >
              Generate Receipt
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}