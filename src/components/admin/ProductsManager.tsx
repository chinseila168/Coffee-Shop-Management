import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Coffee,
  AlertTriangle,
  Flame,
  Star,
  Sparkles,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { products, categories, createProduct, updateProduct, deleteProduct } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('4.50');
  const [discountPrice, setDiscountPrice] = useState('');
  const [size, setSize] = useState('Medium (12oz)');
  const [hotIcedOption, setHotIcedOption] = useState(true);
  const [calories, setCalories] = useState('150');
  const [allergens, setAllergens] = useState('Dairy');
  const [preparationTime, setPreparationTime] = useState('3');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80');
    setPrice('4.75');
    setDiscountPrice('');
    setSize('Medium (12oz)');
    setHotIcedOption(true);
    setCalories('120');
    setAllergens('Dairy');
    setPreparationTime('3');
    setInStock(true);
    setIsFeatured(false);
    setIsActive(true);
    setIsCreating(true);
    setEditingProduct(null);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setImage(p.image);
    setPrice(p.price.toString());
    setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
    setSize(p.size);
    setHotIcedOption(p.hotIcedOption);
    setCalories(p.calories.toString());
    setAllergens(p.allergens.join(', '));
    setPreparationTime(p.preparationTime.toString());
    setInStock(p.inStock);
    setIsFeatured(p.isFeatured);
    setIsActive(p.isActive);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === categoryId);
    const allergensList = allergens.split(',').map(s => s.trim()).filter(Boolean);

    const productPayload = {
      name,
      categoryId,
      categoryName: cat?.name || 'Beverage',
      description,
      image: image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      price: parseFloat(price) || 0,
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      size,
      availableSizes: ['Small (8oz)', 'Medium (12oz)', 'Large (16oz)'],
      hotIcedOption,
      ingredients: ['Fresh brewed coffee', 'Whole milk'],
      calories: parseInt(calories) || 0,
      allergens: allergensList,
      preparationTime: parseInt(preparationTime) || 3,
      inStock,
      isFeatured,
      isActive,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      setEditingProduct(null);
    } else {
      createProduct(productPayload);
      setIsCreating(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Product Catalog Management
          </h2>
          <p className="text-xs text-stone-500">
            Create, edit, toggle availability, and configure recipes for menu items.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DFD5C7] focus:outline-none focus:border-[#C89B6D]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 py-2 px-3 rounded-xl border border-[#DFD5C7] text-xs text-[#2C1810] focus:outline-none"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#DFD5C7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider border-b border-[#DFD5C7]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Calories / Prep</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-[#2C1810]">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-[#2C1810] flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.isFeatured && (
                            <span className="bg-[#FAF2E8] text-[#8C5828] text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[200px]">
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-stone-600">{p.categoryName}</td>

                  <td className="py-3 px-4 font-bold">
                    <span>${p.price.toFixed(2)}</span>
                    {p.discountPrice && (
                      <span className="text-[10px] text-emerald-600 block">
                        Special: ${p.discountPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-stone-500">
                    <div>{p.calories} kcal</div>
                    <div className="text-[10px]">~{p.preparationTime} mins</div>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProduct(p.id, { isActive: !p.isActive })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        p.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Archived'}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        p.inStock ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete product"
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

      {/* Create / Edit Modal */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#DFD5C7] flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-[#E8DFD5] bg-white flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Menu Product'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs text-[#2C1810]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Vanilla Bean Flat White"
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price (Optional)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value)}
                    placeholder="e.g. 4.00"
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tasting notes, beans provenance, brew methodology..."
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Preparation Time (mins)</label>
                  <input
                    type="number"
                    value={preparationTime}
                    onChange={e => setPreparationTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Allergens (Comma separated)</label>
                  <input
                    type="text"
                    value={allergens}
                    onChange={e => setAllergens(e.target.value)}
                    placeholder="e.g. Dairy, Gluten, Tree Nuts"
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C7] text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[#F2ECE4] flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hotIcedOption}
                    onChange={e => setHotIcedOption(e.target.checked)}
                    className="rounded text-[#C89B6D]"
                  />
                  <span className="font-semibold">Hot & Iced Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded text-[#C89B6D]"
                  />
                  <span className="font-semibold">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={e => setInStock(e.target.checked)}
                    className="rounded text-[#C89B6D]"
                  />
                  <span className="font-semibold">Currently In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-[#C89B6D]"
                  />
                  <span className="font-semibold">Active in Catalog</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Product Removal</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Are you sure you want to deactivate this product? Existing order histories will preserve record references.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
