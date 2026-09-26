import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Snowflake,
  Star,
  Clock,
  Heart,
  Plus,
  Coffee,
  Check,
} from 'lucide-react';

interface FeaturedMenuProps {
  onCustomizeProduct: (product: Product) => void;
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({ onCustomizeProduct }) => {
  const { categories, products, currentCustomer, updateCustomer, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterHotIced, setFilterHotIced] = useState<'all' | 'hot' | 'iced'>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);

  // Toggle favorite
  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = currentCustomer.favoriteProductIds || [];
    const isFav = favs.includes(productId);
    const updatedFavs = isFav ? favs.filter(id => id !== productId) : [...favs, productId];

    updateCustomer(currentCustomer.id, { favoriteProductIds: updatedFavs });
    showToast(isFav ? 'Removed from favorites' : 'Saved to favorites ❤️', 'info');
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;
      if (onlyInStock && !p.inStock) return false;
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;

      if (filterHotIced === 'hot' && !p.hotIcedOption && p.categoryId === 'cat-iced') return false;
      if (filterHotIced === 'iced' && !p.hotIcedOption && p.categoryId !== 'cat-iced') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchCat = p.categoryName?.toLowerCase().includes(query);
        const matchIng = p.ingredients.some(ing => ing.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchCat && !matchIng) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // Featured
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, filterHotIced, onlyInStock]);

  return (
    <section id="menu-section" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] text-[#8C5828] text-xs font-bold uppercase tracking-widest mb-3">
            <Coffee className="w-3.5 h-3.5" />
            <span>Curated Artisan Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2C1810]">
            Freshly Roasted & Made to Order
          </h2>
          <p className="text-sm text-[#5C4033] mt-2">
            Select any drink or pastry to customize sizes, roast profiles, milk alternatives, and artisan syrups.
          </p>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#E8DFD5] mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coffee, matcha, pastries, ingredients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFD5C7] text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#C89B6D] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full sm:w-48 py-2.5 px-3 rounded-xl border border-[#DFD5C7] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C89B6D] cursor-pointer bg-white"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick toggle filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2ECE4] text-xs text-[#5C4033]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-500">Style:</span>
              <button
                onClick={() => setFilterHotIced('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterHotIced === 'all' ? 'bg-[#2C1810] text-white' : 'hover:bg-[#EFE9DF]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterHotIced('hot')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  filterHotIced === 'hot' ? 'bg-amber-900 text-white' : 'hover:bg-[#EFE9DF]'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>Hot</span>
              </button>
              <button
                onClick={() => setFilterHotIced('iced')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  filterHotIced === 'iced' ? 'bg-sky-900 text-white' : 'hover:bg-[#EFE9DF]'
                }`}
              >
                <Snowflake className="w-3 h-3 text-sky-400" />
                <span>Iced</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#C89B6D] focus:ring-[#C89B6D]"
                />
                <span>In-Stock Only</span>
              </label>
              <span className="text-stone-300">|</span>
              <span className="font-medium text-[#8C5828]">
                {filteredProducts.length} items available
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-[#2C1810] text-[#C89B6D]'
                : 'bg-white text-stone-700 hover:bg-[#EFE9DF] border border-[#DFD5C7]'
            }`}
          >
            All Products ({products.filter(p => p.isActive).length})
          </button>
          {categories.filter(c => c.isActive).map(cat => {
            const count = products.filter(p => p.categoryId === cat.id && p.isActive).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#2C1810] text-[#C89B6D]'
                    : 'bg-white text-stone-700 hover:bg-[#EFE9DF] border border-[#DFD5C7]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#DFD5C7] p-8">
            <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#2C1810]">No coffee or food items found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, removing filters, or resetting category selections.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterHotIced('all');
              }}
              className="mt-4 px-4 py-2 bg-[#2C1810] text-white rounded-xl text-xs font-semibold hover:bg-[#3D2318]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isFav = currentCustomer.favoriteProductIds?.includes(product.id);
              const hasDiscount = !!product.discountPrice;
              const displayPrice = product.discountPrice || product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => onCustomizeProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8DFD5] flex flex-col group cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                    {/* Featured / Discount Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {hasDiscount && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          Special Offer
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="bg-[#2C1810]/80 text-[#C89B6D] backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-[#C89B6D]/30">
                          Signature Pick
                        </span>
                      )}
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={e => toggleFavorite(product.id, e)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-colors ${
                        isFav ? 'bg-rose-50 text-rose-500' : 'bg-black/40 text-white hover:text-rose-400'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Save favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Category tag */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-semibold text-stone-200 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                      {product.categoryName}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-base text-[#2C1810] group-hover:text-[#A26D3B] transition-colors leading-tight line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#5C4033] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Meta info & Customize CTA */}
                    <div className="pt-2 border-t border-[#F2ECE4] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C89B6D]" />
                          <span>~{product.preparationTime} mins</span>
                        </div>
                        <span>{product.calories} kcal</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <div className="text-base font-bold text-[#2C1810] flex items-center gap-1.5">
                            <span>${displayPrice.toFixed(2)}</span>
                            {hasDiscount && (
                              <span className="text-xs text-stone-400 line-through font-normal">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onCustomizeProduct(product);
                          }}
                          className="flex items-center gap-1 bg-[#2C1810] group-hover:bg-[#C89B6D] text-white group-hover:text-[#1E1109] px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
