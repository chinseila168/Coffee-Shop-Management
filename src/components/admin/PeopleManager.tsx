import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Employee } from '../../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  User,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  X,
  Shield,
  Briefcase,
} from 'lucide-react';

export const CustomersManager: React.FC = () => {
  const { customers, updateCustomer, createCustomer, deleteCustomer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState('0');

  const filteredCustomers = customers.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.phone.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email);
    setAddress(c.addresses[0] || '');
    setLoyaltyPoints(c.loyaltyPoints.toString());
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setName('');
    setPhone('+1 (555) 123-4567');
    setEmail('');
    setAddress('100 Main St, Metropolis');
    setLoyaltyPoints('50');
    setIsCreating(true);
    setEditingCustomer(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        phone,
        email,
        addresses: address ? [address] : editingCustomer.addresses,
        loyaltyPoints: parseInt(loyaltyPoints) || 0,
      });
      setEditingCustomer(null);
    } else {
      createCustomer({
        name,
        phone,
        email,
        addresses: [address],
        favoriteProductIds: [],
        status: 'active',
      });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Customer Accounts & Loyalty Management
          </h2>
          <p className="text-xs text-stone-500">
            View customer order histories, adjust loyalty rewards points, and manage profiles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DFD5C7] focus:outline-none focus:border-[#C89B6D]"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Loyalty Balance</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF2E8] text-[#8C5828] flex items-center justify-center font-bold text-xs">
                        {cust.name[0]}
                      </div>
                      <span className="font-bold text-[#2C1810]">{cust.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-stone-600">
                    <div>{cust.email}</div>
                    <div className="text-[10px] text-stone-400">{cust.phone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-[#8C5828] bg-[#FAF2E8] px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-max">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{cust.loyaltyPoints} pts</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold">{cust.totalOrders} orders</td>

                  <td className="py-3 px-4 font-bold text-sm text-[#2C1810]">
                    ${cust.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cust.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1 rounded-lg text-stone-600 hover:bg-stone-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(cust.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Customer Modal */}
      {(isCreating || editingCustomer) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingCustomer ? `Edit Customer: ${editingCustomer.name}` : 'Register New Customer'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCustomer(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
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

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              {editingCustomer && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Loyalty Points Balance</label>
                  <input
                    type="number"
                    value={loyaltyPoints}
                    onChange={e => setLoyaltyPoints(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-mono font-bold"
                  />
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const StaffManager: React.FC = () => {
  const { employees, branches, createEmployee, updateEmployee, deleteEmployee } = useApp();

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState<Employee['position']>('Barista');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [salary, setSalary] = useState('42000');
  const [status, setStatus] = useState<Employee['status']>('active');

  const openCreateModal = () => {
    setName('');
    setPhone('+1 (555) 234-5566');
    setEmail('');
    setPosition('Barista');
    setBranchId(branches[0]?.id || '');
    setSalary('42000');
    setStatus('active');
    setIsCreating(true);
    setEditingEmployee(null);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setPhone(emp.phone);
    setEmail(emp.email);
    setPosition(emp.position);
    setBranchId(emp.branchId);
    setSalary(emp.salary.toString());
    setStatus(emp.status);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find(b => b.id === branchId);

    const payload = {
      name,
      phone,
      email,
      position,
      branchId,
      branchName: branch?.name || 'Roastery',
      hireDate: '2026-02-01',
      salary: parseFloat(salary) || 40000,
      status,
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, payload);
      setEditingEmployee(null);
    } else {
      createEmployee(payload);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Employee & Staff Directory
          </h2>
          <p className="text-xs text-stone-500">
            Manage store managers, head baristas, cashiers, kitchen team, and branch assignments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div
            key={emp.id}
            className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#F2ECE4] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#C89B6D] flex items-center justify-center font-bold text-sm">
                    {emp.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C1810]">{emp.name}</h4>
                    <span className="text-xs font-semibold text-[#8C5828] bg-[#FAF2E8] px-2 py-0.5 rounded-full">
                      {emp.position}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#C89B6D]" />
                  <span>{emp.branchName || 'Downtown Flagship'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C89B6D]" />
                  <span>{emp.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C89B6D]" />
                  <span>{emp.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F2ECE4] flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">${emp.salary.toLocaleString()}/yr</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                }`}
              >
                {emp.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Form Modal */}
      {(isCreating || editingEmployee) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Add Staff Member'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingEmployee(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Position</label>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white font-semibold"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Barista">Barista</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Delivery Staff">Delivery Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Branch</label>
                  <select
                    value={branchId}
                    onChange={e => setBranchId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#DFD5C7] bg-white"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Salary ($/year)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingEmployee(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
