import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Branch, TableItem } from '../../types';
import {
  Plus,
  MapPin,
  Clock,
  Phone,
  Mail,
  Edit2,
  Trash2,
  X,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const BranchesAndTablesManager: React.FC = () => {
  const {
    branches,
    tables,
    createBranch,
    updateBranch,
    deleteBranch,
    createTable,
    updateTable,
    deleteTable,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'branches' | 'tables'>('branches');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');

  // Branch Modal State
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openingHours, setOpeningHours] = useState('07:00 AM');
  const [closingHours, setClosingHours] = useState('09:00 PM');
  const [managerName, setManagerName] = useState('');
  const [image, setImage] = useState('');

  // Table Modal State
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');

  const openCreateBranch = () => {
    setName('');
    setAddress('');
    setCity('Metropolis');
    setPhone('+1 (555) 234-9900');
    setEmail('branch@auraroast.com');
    setOpeningHours('07:00 AM');
    setClosingHours('09:00 PM');
    setManagerName('Alex Mercer');
    setImage('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80');
    setIsCreatingBranch(true);
    setEditingBranch(null);
  };

  const openEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setName(b.name);
    setAddress(b.address);
    setCity(b.city);
    setPhone(b.phone);
    setEmail(b.email);
    setOpeningHours(b.openingHours);
    setClosingHours(b.closingHours);
    setManagerName(b.managerName);
    setImage(b.image);
    setIsCreatingBranch(false);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      address,
      city,
      phone,
      email,
      openingHours,
      closingHours,
      latitude: 37.7749,
      longitude: -122.4194,
      managerName,
      image: image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      status: 'active' as Branch['status'],
      tableCount: 12,
    };

    if (editingBranch) {
      updateBranch(editingBranch.id, payload);
      setEditingBranch(null);
    } else {
      createBranch(payload);
      setIsCreatingBranch(false);
    }
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    createTable({
      branchId: selectedBranchId,
      tableNumber: tableNumber.toUpperCase(),
      capacity: parseInt(capacity) || 4,
      status: 'available',
    });
    setTableNumber('');
    setIsCreatingTable(false);
  };

  const currentBranchTables = tables.filter(t => t.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Branch & Cafe Table Management
          </h2>
          <p className="text-xs text-stone-500">
            Control multi-location roasteries, operating hours, managers, and live floor table availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'branches' ? (
            <button
              onClick={openCreateBranch}
              className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Branch</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTableNumber(`T-0${currentBranchTables.length + 1}`);
                setIsCreatingTable(true);
              }}
              className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DFD5C7] gap-4 text-xs font-bold text-[#6F4E37]">
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'branches' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
          }`}
        >
          Branches ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'tables' ? 'border-[#2C1810] text-[#2C1810]' : 'border-transparent text-stone-500'
          }`}
        >
          Dine-In Tables Layout
        </button>
      </div>

      {/* TAB 1: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#DFD5C7] shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-xl p-1">
                  <button
                    onClick={() => openEditBranch(b)}
                    className="p-1 text-white hover:text-[#C89B6D]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBranch(b.id)}
                    className="p-1 text-white hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold bg-[#C89B6D] text-black px-2 py-0.5 rounded">
                    {b.city}
                  </span>
                  <h3 className="font-display font-bold text-base mt-1 leading-tight">{b.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-2.5 text-xs text-[#5C4033]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C89B6D] shrink-0" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C89B6D] shrink-0" />
                  <span>
                    {b.openingHours} – {b.closingHours}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C89B6D] shrink-0" />
                  <span>{b.phone}</span>
                </div>

                <div className="pt-2 border-t border-[#F2ECE4] flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Manager: <strong className="text-stone-800">{b.managerName}</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TABLES */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Branch Filter for Tables */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-700">Select Store Floor:</span>
              <select
                value={selectedBranchId}
                onChange={e => setSelectedBranchId(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-stone-500">
              Showing <strong>{currentBranchTables.length} tables</strong> for this floor
            </div>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentBranchTables.map(tbl => {
              const isOccupied = tbl.status === 'occupied';
              const isAvailable = tbl.status === 'available';
              const isReserved = tbl.status === 'reserved';
              const isCleaning = tbl.status === 'cleaning';

              return (
                <div
                  key={tbl.id}
                  className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 transition-all ${
                    isAvailable
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : isOccupied
                      ? 'bg-amber-50/70 border-amber-300'
                      : isReserved
                      ? 'bg-blue-50/60 border-blue-300'
                      : 'bg-stone-100 border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-[#2C1810]">
                      {tbl.tableNumber}
                    </span>
                    <button
                      onClick={() => deleteTable(tbl.id)}
                      className="text-stone-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#C89B6D]" />
                    <span>Seats {tbl.capacity} guests</span>
                  </div>

                  {/* Status Toggle Button */}
                  <select
                    value={tbl.status}
                    onChange={e => updateTable(tbl.id, { status: e.target.value as any })}
                    className="w-full p-1.5 rounded-lg border border-[#DFD5C7] bg-white text-[11px] font-bold capitalize cursor-pointer"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="occupied">🟡 Occupied</option>
                    <option value="reserved">🔵 Reserved</option>
                    <option value="cleaning">⚪ Cleaning</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {(isCreatingBranch || editingBranch) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingBranch ? 'Edit Roastery Branch' : 'Add New Branch'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingBranch(false);
                  setEditingBranch(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Westside Innovation Cafe"
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Opening</label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={e => setOpeningHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Closing</label>
                  <input
                    type="text"
                    value={closingHours}
                    onChange={e => setClosingHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Store Manager Name</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={e => setManagerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingBranch(false);
                    setEditingBranch(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Create Modal */}
      {isCreatingTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-xs w-full p-5 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <h4 className="font-display font-bold text-base text-[#2C1810]">Add Dine-in Table</h4>
            <form onSubmit={handleSaveTable} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  placeholder="e.g. T-09, B-01"
                  className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTable(false)}
                  className="px-3 py-1.5 bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2C1810] text-[#C89B6D] font-bold rounded-xl"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
