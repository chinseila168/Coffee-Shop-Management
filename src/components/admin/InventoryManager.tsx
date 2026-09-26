import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, InventoryTransactionType } from '../../types';
import {
  Plus,
  Search,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Package,
  Trash2,
  Edit2,
  X,
  History,
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const {
    inventory,
    inventoryTransactions,
    suppliers,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stock Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<InventoryTransactionType>('stock_in');
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustReason, setAdjustReason] = useState('Weekly supplier restock');

  // New Item Modal
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('coffee_beans');
  const [unit, setUnit] = useState('kg');
  const [currentStock, setCurrentStock] = useState('20');
  const [minimumStock, setMinimumStock] = useState('10');
  const [maximumStock, setMaximumStock] = useState('100');
  const [costPerUnit, setCostPerUnit] = useState('22.00');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const filteredItems = inventory.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setName('');
    setCategory('coffee_beans');
    setUnit('kg');
    setCurrentStock('20');
    setMinimumStock('10');
    setMaximumStock('100');
    setCostPerUnit('22.00');
    setSupplierId(suppliers[0]?.id || '');
    setExpiryDate('2026-12-31');
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.unit);
    setCurrentStock(item.currentStock.toString());
    setMinimumStock(item.minimumStock.toString());
    setMaximumStock(item.maximumStock.toString());
    setCostPerUnit(item.costPerUnit.toString());
    setSupplierId(item.supplierId);
    setExpiryDate(item.expiryDate || '');
    setIsCreating(false);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId);
    const stockVal = parseFloat(currentStock) || 0;
    const minVal = parseFloat(minimumStock) || 0;

    const payload = {
      name,
      category,
      unit,
      currentStock: stockVal,
      minimumStock: minVal,
      maximumStock: parseFloat(maximumStock) || 100,
      costPerUnit: parseFloat(costPerUnit) || 0,
      supplierId,
      supplierName: sup?.name,
      expiryDate: expiryDate || undefined,
      status: (stockVal <= 0 ? 'out_of_stock' : stockVal <= minVal ? 'low' : 'optimal') as InventoryItem['status'],
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, payload);
      setEditingItem(null);
    } else {
      createInventoryItem(payload);
      setIsCreating(false);
    }
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    adjustStock(adjustingItem.id, parseFloat(adjustQty) || 0, adjustType, adjustReason);
    setAdjustingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Inventory & Ingredient Management
          </h2>
          <p className="text-xs text-stone-500">
            Track green beans, organic milks, syrups, cups, packaging, and automatic recipe consumption.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ingredient</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ingredients, syrups, cups..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DFD5C7] focus:outline-none focus:border-[#C89B6D]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full sm:w-44 py-2 px-3 rounded-xl border border-[#DFD5C7] text-[#2C1810]"
        >
          <option value="all">All Categories</option>
          <option value="coffee_beans">Coffee Beans</option>
          <option value="dairy">Dairy & Milks</option>
          <option value="syrup">Syrups & Sauces</option>
          <option value="tea">Tea & Botanicals</option>
          <option value="bakery_supplies">Bakery Raw Materials</option>
          <option value="packaging">Cups & Packaging</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-40 py-2 px-3 rounded-xl border border-[#DFD5C7] text-[#2C1810]"
        >
          <option value="all">All Statuses</option>
          <option value="optimal">Optimal Stock</option>
          <option value="low">⚠️ Low Stock</option>
          <option value="out_of_stock">⛔ Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3.5 px-4">Ingredient Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Min / Max Stock</th>
                <th className="py-3.5 px-4">Cost / Unit</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {filteredItems.map(item => {
                const isLow = item.currentStock <= item.minimumStock;
                const isOut = item.currentStock <= 0;

                return (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold flex items-center gap-2">
                        <span>{item.name}</span>
                        {isOut ? (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Low Stock
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-stone-400">Unit: {item.unit}</div>
                    </td>

                    <td className="py-3 px-4 capitalize text-stone-600">
                      {item.category.replace('_', ' ')}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-sm">
                      <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-700' : 'text-stone-800'}>
                        {item.currentStock.toFixed(item.unit === 'units' ? 0 : 2)} {item.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-500">
                      {item.minimumStock} / {item.maximumStock} {item.unit}
                    </td>

                    <td className="py-3 px-4 font-medium">
                      ${item.costPerUnit.toFixed(2)} / {item.unit}
                    </td>

                    <td className="py-3 px-4 text-stone-600 text-[11px]">
                      {item.supplierName || 'Equator Trade'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingItem(item);
                            setAdjustQty('10');
                            setAdjustType('stock_in');
                          }}
                          className="px-2 py-1 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] rounded-lg font-bold text-[10px] flex items-center gap-1"
                          title="Record Stock In, Out, or Waste"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Adjust</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#8C5828]">Inventory Movement</span>
                <h3 className="font-display font-bold text-lg text-[#2C1810]">
                  {adjustingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs text-[#2C1810]">
              <div className="p-3 rounded-xl bg-white border border-[#DFD5C7] flex justify-between">
                <span>Current Stock Balance:</span>
                <strong className="text-base text-[#8C5828]">
                  {adjustingItem.currentStock} {adjustingItem.unit}
                </strong>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stock_in', label: '📥 Stock In (Restock)' },
                    { id: 'stock_out', label: '📤 Stock Out' },
                    { id: 'waste', label: '🗑️ Waste / Spoilage' },
                    { id: 'adjustment', label: '⚙️ Set Direct Count' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAdjustType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        adjustType === t.id
                          ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810]'
                          : 'bg-white text-stone-700 border-[#DFD5C7]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Quantity ({adjustingItem.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reason / Reference</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Weekly Restock Invoice #4492, Spilled pitcher, etc."
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Ingredient Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingItem ? 'Edit Ingredient' : 'Add Inventory Ingredient'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Guatemala Huehuetenango Beans"
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  >
                    <option value="coffee_beans">Coffee Beans</option>
                    <option value="dairy">Dairy</option>
                    <option value="syrup">Syrup</option>
                    <option value="tea">Tea</option>
                    <option value="bakery_supplies">Bakery Supplies</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="kg, L, units, g"
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentStock}
                    onChange={e => setCurrentStock(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min (Low Alert)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minimumStock}
                    onChange={e => setMinimumStock(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cost / Unit ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={costPerUnit}
                    onChange={e => setCostPerUnit(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Supplier</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
