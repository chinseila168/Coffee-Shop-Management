import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe, RecipeIngredient } from '../../types';
import { Plus, Trash2, Edit2, Coffee, Check, X, Sparkles } from 'lucide-react';

export const RecipesManager: React.FC = () => {
  const { recipes, products, inventory, createRecipe, updateRecipe, deleteRecipe } = useApp();

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [instructions, setInstructions] = useState('');
  const [ingredientsList, setIngredientsList] = useState<RecipeIngredient[]>([]);

  // Add ingredient line
  const [newIngredientId, setNewIngredientId] = useState(inventory[0]?.id || '');
  const [newIngredientQty, setNewIngredientQty] = useState('0.018');

  const openCreateModal = () => {
    setSelectedProductId(products[0]?.id || '');
    setInstructions('Brew espresso double shot. Steam milk to 65C. Combine with microfoam.');
    setIngredientsList([
      { ingredientId: inventory[0]?.id || '', ingredientName: inventory[0]?.name || '', quantity: 0.018, unit: 'kg' },
    ]);
    setIsCreating(true);
    setEditingRecipe(null);
  };

  const openEditModal = (rec: Recipe) => {
    setEditingRecipe(rec);
    setSelectedProductId(rec.productId);
    setInstructions(rec.instructions || '');
    setIngredientsList([...rec.ingredients]);
    setIsCreating(false);
  };

  const handleAddIngredient = () => {
    const inv = inventory.find(i => i.id === newIngredientId);
    if (!inv) return;

    setIngredientsList(prev => [
      ...prev,
      {
        ingredientId: inv.id,
        ingredientName: inv.name,
        quantity: parseFloat(newIngredientQty) || 1,
        unit: inv.unit,
      },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);

    const payload = {
      productId: selectedProductId,
      productName: prod?.name || 'Coffee Product',
      instructions,
      ingredients: ingredientsList,
    };

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, payload);
      setEditingRecipe(null);
    } else {
      createRecipe(payload);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2C1810]">
            Recipe & Ingredient Consumption Engine
          </h2>
          <p className="text-xs text-stone-500">
            Define exact portion measurements for every menu drink so orders automatically decrement raw beans, milk, and cups.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#C89B6D] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Recipe</span>
        </button>
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white p-5 rounded-2xl border border-[#DFD5C7] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#F2ECE4] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#8C5828] flex items-center justify-center font-bold">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C1810]">{recipe.productName}</h4>
                    <span className="text-[10px] text-stone-400">
                      {recipe.ingredients.length} required ingredients
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(recipe)}
                    className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Ingredients Breakdown */}
              <div className="mt-3 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Ingredients per unit:
                </span>
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#FAF7F2] p-2 rounded-lg">
                    <span className="text-stone-700 font-medium truncate max-w-[170px]">
                      {ing.ingredientName}
                    </span>
                    <span className="font-mono font-bold text-[#8C5828]">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>

              {recipe.instructions && (
                <div className="mt-3 text-[11px] text-stone-500 italic border-t border-[#F2ECE4] pt-2">
                  "{recipe.instructions}"
                </div>
              )}
            </div>

            <div className="pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Auto-deducts on order complete</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Builder Modal */}
      {(isCreating || editingRecipe) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 border border-[#DFD5C7] space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-display font-bold text-lg text-[#2C1810]">
                {editingRecipe ? 'Edit Recipe Portions' : 'New Recipe Builder'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingRecipe(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-4 text-xs text-[#2C1810]">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Product</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white font-semibold text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Ingredients in Recipe */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">Recipe Ingredients</label>
                {ingredientsList.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#DFD5C7]">
                    <span className="font-semibold">{ing.ingredientName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8C5828]">
                        {ing.quantity} {ing.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Ingredient Form Row */}
              <div className="p-3 bg-white rounded-xl border border-[#DFD5C7] space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Add Ingredient</span>
                <div className="flex gap-2">
                  <select
                    value={newIngredientId}
                    onChange={e => setNewIngredientId(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-[#DFD5C7] text-xs"
                  >
                    {inventory.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} ({inv.unit})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.001"
                    placeholder="Qty"
                    value={newIngredientQty}
                    onChange={e => setNewIngredientQty(e.target.value)}
                    className="w-20 p-2 rounded-xl border border-[#DFD5C7] text-xs font-mono"
                  />

                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-3 py-2 bg-[#2C1810] text-[#C89B6D] rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Barista Prep Instructions</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C7] bg-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingRecipe(null);
                  }}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-[#C89B6D] hover:bg-[#3D2318] font-bold rounded-xl shadow-md"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
