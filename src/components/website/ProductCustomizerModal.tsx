import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SelectedCustomizations } from '../../types';
import { X, Flame, Snowflake, Plus, Minus, ShoppingBag, Sparkles, AlertTriangle } from 'lucide-react';

interface ProductCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useApp();

  const [size, setSize] = useState<string>('Medium (12oz)');
  const [temperature, setTemperature] = useState<'Hot' | 'Iced'>('Hot');
  const [milk, setMilk] = useState<string>('Whole Milk');
  const [sugar, setSugar] = useState<string>('50%');
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Available extras
  const availableExtras = [
    { name: 'Extra Espresso Shot', price: 1.0 },
    { name: 'Whipped Cream', price: 0.75 },
    { name: 'Caramel Drizzle', price: 0.6 },
    { name: 'Vanilla Bean Syrup', price: 0.6 },
    { name: 'Belgian Chocolate Ganache', price: 0.8 },
  ];

  // Milk choices with price delta
  const milkOptions = [
    { name: 'Whole Milk', price: 0 },
    { name: 'Skim / Low Fat', price: 0 },
    { name: 'Barista Oat Milk', price: 0.75 },
    { name: 'Organic Almond Milk', price: 0.75 },
    { name: 'Soy Milk', price: 0.6 },
  ];

  const sugarLevels = ['0%', '25%', '50%', '75%', '100%'];

  useEffect(() => {
    if (product) {
      setSize(product.size || 'Medium (12oz)');
      setTemperature(product.hotIcedOption ? 'Hot' : 'Hot');
      setMilk('Whole Milk');
      setSugar('50%');
      setSelectedExtras([]);
      setSpecialNotes('');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Size price delta
  const getSizeDelta = (s: string) => {
    if (s.includes('Large') || s.includes('16oz')) return 0.75;
    if (s.includes('Small') || s.includes('8oz')) return -0.5;
    return 0;
  };

  const selectedMilkOption = milkOptions.find(m => m.name === milk);
  const milkPrice = selectedMilkOption ? selectedMilkOption.price : 0;
  const sizePrice = getSizeDelta(size);
  const extrasTotal = selectedExtras.reduce((sum, ex) => sum + ex.price, 0);

  const basePrice = product.discountPrice || product.price;
  const unitPrice = basePrice + sizePrice + milkPrice + extrasTotal;
  const grandTotal = unitPrice * quantity;

  const toggleExtra = (extra: { name: string; price: number }) => {
    if (selectedExtras.some(e => e.name === extra.name)) {
      setSelectedExtras(prev => prev.filter(e => e.name !== extra.name));
    } else {
      setSelectedExtras(prev => [...prev, extra]);
    }
  };

  const handleAddToCart = () => {
    const customizations: SelectedCustomizations = {
      size,
      sizePrice,
      temperature: product.hotIcedOption ? temperature : undefined,
      milk: product.categoryId.includes('espresso') || product.categoryId.includes('tea') ? milk : undefined,
      milkPrice: milkPrice > 0 ? milkPrice : undefined,
      sugar: sugar !== '0%' ? sugar : '0%',
      extras: selectedExtras.length > 0 ? selectedExtras : undefined,
      notes: specialNotes.trim() ? specialNotes.trim() : undefined,
    };

    addToCart(product, quantity, customizations);
    onClose();
  };

  const isBeverage =
    product.categoryId === 'cat-espresso' ||
    product.categoryId === 'cat-signature' ||
    product.categoryId === 'cat-iced' ||
    product.categoryId === 'cat-tea' ||
    product.categoryId === 'cat-noncoffee';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8DFD5] transition-all animate-scale-in">
        {/* Header with image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C89B6D] bg-[#2C1810]/70 px-2 py-0.5 rounded">
              {product.categoryName}
            </span>
            <h3 className="text-2xl font-display font-bold mt-1 leading-tight">{product.name}</h3>
            <div className="flex items-center gap-3 text-xs text-stone-200 mt-1">
              <span>{product.calories} kcal</span>
              <span>•</span>
              <span>Prep: ~{product.preparationTime} mins</span>
              <span>•</span>
              <span className="font-semibold text-[#C89B6D]">
                ${(product.discountPrice || product.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-[#2C1810]">
          {/* Description */}
          <p className="text-xs text-[#5C4033] leading-relaxed">{product.description}</p>

          {/* Allergens warning if any */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Contains:</strong> {product.allergens.join(', ')}
              </span>
            </div>
          )}

          {/* Size Choice */}
          {product.availableSizes && product.availableSizes.length > 1 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
                1. Select Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.availableSizes.map(s => {
                  const delta = getSizeDelta(s);
                  const isSelected = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                        isSelected
                          ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] shadow-sm'
                          : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                      }`}
                    >
                      <div className="font-semibold">{s}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {delta > 0 ? `+$${delta.toFixed(2)}` : delta < 0 ? `-$${Math.abs(delta).toFixed(2)}` : 'Included'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Temperature Choice (Hot / Iced) */}
          {product.hotIcedOption && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
                2. Temperature
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTemperature('Hot')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    temperature === 'Hot'
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                      : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-amber-700'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Steamed Hot</span>
                </button>
                <button
                  onClick={() => setTemperature('Iced')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    temperature === 'Iced'
                      ? 'bg-sky-900 text-white border-sky-900 shadow-sm'
                      : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-sky-600'
                  }`}
                >
                  <Snowflake className="w-4 h-4 text-sky-400" />
                  <span>Chilled Over Ice</span>
                </button>
              </div>
            </div>
          )}

          {/* Milk Options for drinks */}
          {isBeverage && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
                3. Milk Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {milkOptions.map(m => {
                  const isSelected = milk === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => setMilk(m.name)}
                      className={`p-2 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-[#2C1810] text-[#C89B6D] border-[#2C1810] font-semibold'
                          : 'bg-white text-stone-700 border-[#DFD5C7] hover:border-[#C89B6D]'
                      }`}
                    >
                      <div>{m.name}</div>
                      <div className="text-[10px] text-stone-400">
                        {m.price > 0 ? `+$${m.price.toFixed(2)}` : 'Default'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness / Sugar Level */}
          {isBeverage && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
                4. Sweetness Level
              </label>
              <div className="flex items-center justify-between gap-1.5 bg-white p-1 rounded-xl border border-[#DFD5C7]">
                {sugarLevels.map(s => {
                  const isSelected = sugar === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSugar(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#C89B6D] text-[#1E1109] font-bold shadow-sm'
                          : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Extras */}
          {isBeverage && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-2">
                5. Add-ons & Flavors
              </label>
              <div className="space-y-1.5">
                {availableExtras.map(ex => {
                  const isSelected = selectedExtras.some(e => e.name === ex.name);
                  return (
                    <div
                      key={ex.name}
                      onClick={() => toggleExtra(ex)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#EFE9DF] border-[#C89B6D] font-semibold text-[#2C1810]'
                          : 'bg-white border-[#DFD5C7] text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-[#C89B6D] focus:ring-[#C89B6D]"
                        />
                        <span>{ex.name}</span>
                      </div>
                      <span className="text-[#8C5828] font-bold">+${ex.price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6F4E37] block mb-1">
              Barista Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder="e.g. Extra hot, light ice, in my personal tumbler..."
              className="w-full text-xs p-3 rounded-xl border border-[#DFD5C7] bg-white text-[#2C1810] focus:outline-none focus:border-[#C89B6D]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart CTA */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-t border-[#E8DFD5] flex items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center bg-white border border-[#DFD5C7] rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-[#EFE9DF] transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#2C1810]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-[#EFE9DF] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-[#2C1810] hover:bg-[#3D2318] text-white px-5 py-3 rounded-xl shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              <ShoppingBag className="w-4 h-4 text-[#C89B6D]" />
              <span>Add to Order</span>
            </div>
            <span className="font-bold text-sm text-[#C89B6D]">${grandTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
