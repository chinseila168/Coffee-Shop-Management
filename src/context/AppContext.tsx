import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  Product,
  Category,
  Order,
  CartItem,
  InventoryItem,
  InventoryTransaction,
  Recipe,
  Branch,
  TableItem,
  Customer,
  Employee,
  Supplier,
  Promotion,
  LoyaltyReward,
  LoyaltyTransaction,
  Review,
  NotificationItem,
  AuditLog,
  CMSContent,
  SystemSettings,
  OrderStatus,
  SelectedCustomizations,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialBranches,
  initialSuppliers,
  initialInventory,
  initialRecipes,
  initialPromotions,
  initialLoyaltyRewards,
  initialCustomers,
  initialEmployees,
  initialTables,
  initialOrders,
  initialReviews,
  initialCMS,
  initialSettings,
  initialAuditLogs,
  initialNotifications,
} from '../data/seedData';

export type PlatformView = 'website' | 'mobile_app' | 'admin_dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Roles & View
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  platformView: PlatformView;
  setPlatformView: (view: PlatformView) => void;
  selectedBranchId: string;
  setSelectedBranchId: (branchId: string) => void;

  // Data Collections
  categories: Category[];
  products: Product[];
  orders: Order[];
  inventory: InventoryItem[];
  inventoryTransactions: InventoryTransaction[];
  recipes: Recipe[];
  branches: Branch[];
  tables: TableItem[];
  customers: Customer[];
  employees: Employee[];
  suppliers: Supplier[];
  promotions: Promotion[];
  loyaltyRewards: LoyaltyReward[];
  loyaltyTransactions: LoyaltyTransaction[];
  reviews: Review[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  cms: CMSContent;
  settings: SystemSettings;

  // Active Customer profile
  currentCustomer: Customer;
  setCurrentCustomerId: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomizations) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Promotion | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };

  // Order Placement & Management
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // CRUD Actions
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string, permanent?: boolean) => void;

  createCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  createInventoryItem: (data: Omit<InventoryItem, 'id' | 'updatedAt'>) => InventoryItem;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  adjustStock: (itemId: string, quantity: number, type: InventoryTransaction['type'], reason: string) => void;

  createRecipe: (data: Omit<Recipe, 'id' | 'updatedAt'>) => Recipe;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  createBranch: (data: Omit<Branch, 'id'>) => Branch;
  updateBranch: (id: string, data: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  createTable: (data: Omit<TableItem, 'id'>) => TableItem;
  updateTable: (id: string, data: Partial<TableItem>) => void;
  deleteTable: (id: string) => void;

  createCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent' | 'loyaltyPoints'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  createEmployee: (data: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  createSupplier: (data: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  createPromotion: (data: Omit<Promotion, 'id' | 'usageCount'>) => Promotion;
  updatePromotion: (id: string, data: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;

  createLoyaltyReward: (data: Omit<LoyaltyReward, 'id'>) => LoyaltyReward;
  updateLoyaltyReward: (id: string, data: Partial<LoyaltyReward>) => void;
  deleteLoyaltyReward: (id: string) => void;
  redeemReward: (customerId: string, rewardId: string) => boolean;

  createReview: (data: Omit<Review, 'id' | 'date'>) => Review;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;

  updateCMS: (data: Partial<CMSContent>) => void;
  updateSettings: (data: Partial<SystemSettings>) => void;

  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // System Utilities
  resetToSampleData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;

  // Feedback Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Modals & triggers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeOrderTrackerId: string | null;
  setActiveOrderTrackerId: (id: string | null) => void;
  customizingProduct: Product | null;
  setCustomizingProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'aura_roast_db_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state or local storage
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  };

  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [platformView, setPlatformView] = useState<PlatformView>('website');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-1');

  // Entities
  const [categories, setCategories] = useState<Category[]>(() => loadInitial('categories', initialCategories));
  const [products, setProducts] = useState<Product[]>(() => loadInitial('products', initialProducts));
  const [orders, setOrders] = useState<Order[]>(() => loadInitial('orders', initialOrders));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadInitial('inventory', initialInventory));
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(() => loadInitial('inv_tx', []));
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadInitial('recipes', initialRecipes));
  const [branches, setBranches] = useState<Branch[]>(() => loadInitial('branches', initialBranches));
  const [tables, setTables] = useState<TableItem[]>(() => loadInitial('tables', initialTables));
  const [customers, setCustomers] = useState<Customer[]>(() => loadInitial('customers', initialCustomers));
  const [employees, setEmployees] = useState<Employee[]>(() => loadInitial('employees', initialEmployees));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadInitial('suppliers', initialSuppliers));
  const [promotions, setPromotions] = useState<Promotion[]>(() => loadInitial('promotions', initialPromotions));
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(() => loadInitial('loyalty_rewards', initialLoyaltyRewards));
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() => loadInitial('loyalty_tx', []));
  const [reviews, setReviews] = useState<Review[]>(() => loadInitial('reviews', initialReviews));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', initialNotifications));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadInitial('audit_logs', initialAuditLogs));
  const [cms, setCms] = useState<CMSContent>(() => loadInitial('cms', initialCMS));
  const [settings, setSettings] = useState<SystemSettings>(() => loadInitial('settings', initialSettings));

  // Current customer (defaults to Maya Henderson)
  const [currentCustomerId, setCurrentCustomerId] = useState<string>('cust-01');
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === currentCustomerId) || customers[0] || initialCustomers[0];
  }, [customers, currentCustomerId]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => loadInitial('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Promotion | null>(null);

  // Modals & View States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderTrackerId, setActiveOrderTrackerId] = useState<string | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    const save = (key: string, data: unknown) => {
      try {
        localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to sync to localStorage', e);
      }
    };
    save('categories', categories);
    save('products', products);
    save('orders', orders);
    save('inventory', inventory);
    save('inv_tx', inventoryTransactions);
    save('recipes', recipes);
    save('branches', branches);
    save('tables', tables);
    save('customers', customers);
    save('employees', employees);
    save('suppliers', suppliers);
    save('promotions', promotions);
    save('loyalty_rewards', loyaltyRewards);
    save('loyalty_tx', loyaltyTransactions);
    save('reviews', reviews);
    save('notifications', notifications);
    save('audit_logs', auditLogs);
    save('cms', cms);
    save('settings', settings);
    save('cart', cart);
  }, [
    categories,
    products,
    orders,
    inventory,
    inventoryTransactions,
    recipes,
    branches,
    tables,
    customers,
    employees,
    suppliers,
    promotions,
    loyaltyRewards,
    loyaltyTransactions,
    reviews,
    notifications,
    auditLogs,
    cms,
    settings,
    cart,
  ]);

  // Audit Log helper
  const addAuditLog = (
    action: AuditLog['action'],
    module: string,
    recordId: string,
    details: string,
    recordTitle?: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userName: currentRole === 'customer' ? currentCustomer.name : currentRole.replace('_', ' ').toUpperCase(),
      userRole: currentRole,
      action,
      module,
      recordId,
      recordTitle,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Cart Calculations
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    let discount = 0;

    if (appliedCoupon && subtotal >= appliedCoupon.minimumPurchase) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = (subtotal * appliedCoupon.discountAmount) / 100;
        if (appliedCoupon.maximumDiscount && discount > appliedCoupon.maximumDiscount) {
          discount = appliedCoupon.maximumDiscount;
        }
      } else if (appliedCoupon.discountType === 'fixed_amount') {
        discount = Math.min(appliedCoupon.discountAmount, subtotal);
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const deliveryFee = subtotal > 0 && subtotal < settings.freeDeliveryThreshold ? settings.deliveryFee : 0;
    const tax = (discountedSubtotal * settings.taxRatePercent) / 100;
    const total = discountedSubtotal + deliveryFee + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [cart, appliedCoupon, settings]);

  const addToCart = (product: Product, quantity: number, customizations: SelectedCustomizations) => {
    const unitPrice =
      (product.discountPrice || product.price) +
      customizations.sizePrice +
      (customizations.milkPrice || 0) +
      (customizations.extras?.reduce((sum, ex) => sum + ex.price, 0) || 0);

    const totalPrice = unitPrice * quantity;
    const cartItemId = `${product.id}-${customizations.size}-${customizations.temperature || ''}-${customizations.milk || ''}-${Date.now()}`;

    const newItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      product,
      quantity,
      customizations,
      unitPrice: Number(unitPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: Number((item.unitPrice * newQty).toFixed(2)),
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const promo = promotions.find(p => p.couponCode.toUpperCase() === cleanCode && p.isActive);

    if (!promo) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    if (subtotal < promo.minimumPurchase) {
      return {
        success: false,
        message: `Order subtotal must be at least $${promo.minimumPurchase.toFixed(2)} to use this coupon.`,
      };
    }

    setAppliedCoupon(promo);
    showToast(`Coupon ${cleanCode} applied!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Place Order
  const placeOrder = (orderData: Partial<Order>): Order => {
    const branch = branches.find(b => b.id === (orderData.branchId || selectedBranchId)) || branches[0];
    const orderNum = `AR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const pointsEarned = Math.round(cartTotals.total * settings.loyaltyEarnRate);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      customerEmail: currentCustomer.email,
      branchId: branch.id,
      branchName: branch.name,
      orderType: orderData.orderType || 'dine_in',
      tableNumber: orderData.tableNumber,
      pickupTime: orderData.pickupTime,
      deliveryAddress: orderData.deliveryAddress,
      items: cart.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        customizations: item.customizations,
      })),
      subtotal: cartTotals.subtotal,
      discount: cartTotals.discount,
      couponCode: appliedCoupon?.couponCode,
      deliveryFee: cartTotals.deliveryFee,
      tax: cartTotals.tax,
      total: cartTotals.total,
      paymentMethod: orderData.paymentMethod || 'credit_card',
      paymentStatus: 'paid',
      orderStatus: 'pending',
      notes: orderData.notes,
      estimatedMinutes: orderData.orderType === 'delivery' ? 25 : 12,
      loyaltyPointsEarned: pointsEarned,
      createdAt: now,
      updatedAt: now,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update customer points and totals
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === currentCustomer.id) {
          return {
            ...c,
            loyaltyPoints: c.loyaltyPoints + pointsEarned,
            totalOrders: c.totalOrders + 1,
            totalSpent: Number((c.totalSpent + newOrder.total).toFixed(2)),
            lastOrderDate: now,
          };
        }
        return c;
      })
    );

    // Record Loyalty Transaction
    setLoyaltyTransactions(prev => [
      {
        id: `ltx-${Date.now()}`,
        customerId: currentCustomer.id,
        orderId: newOrder.id,
        points: pointsEarned,
        description: `Earned points from order ${newOrder.orderNumber}`,
        createdAt: now,
      },
      ...prev,
    ]);

    // Update Promotion usage if coupon was used
    if (appliedCoupon) {
      setPromotions(prev =>
        prev.map(p => (p.id === appliedCoupon.id ? { ...p, usageCount: p.usageCount + 1 } : p))
      );
    }

    // Add customer notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        customerId: currentCustomer.id,
        title: `Order Received #${newOrder.orderNumber}`,
        message: `Your order for $${newOrder.total.toFixed(2)} is being prepared. Earned ${pointsEarned} loyalty points!`,
        type: 'order',
        isRead: false,
        createdAt: now,
      },
      ...prev,
    ]);

    // Audit Log
    addAuditLog('CREATE', 'Orders', newOrder.id, `New ${newOrder.orderType} order placed for $${newOrder.total.toFixed(2)}`, newOrder.orderNumber);

    clearCart();
    setActiveOrderTrackerId(newOrder.id);
    showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  // Update order status with auto-inventory deduction on "completed"
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let targetOrder: Order | undefined;

    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          targetOrder = order;
          return {
            ...order,
            orderStatus: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    if (!targetOrder) return;

    // Automatic Recipe Ingredient Deduction on order completion
    if (newStatus === 'completed' && settings.autoDeductInventory) {
      const now = new Date().toISOString();
      const transactionsToAdd: InventoryTransaction[] = [];

      setInventory(prevInventory => {
        const updated = [...prevInventory];

        targetOrder?.items.forEach(orderItem => {
          const recipe = recipes.find(r => r.productId === orderItem.productId);
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              const invIndex = updated.findIndex(inv => inv.id === ing.ingredientId);
              if (invIndex !== -1) {
                const totalDeduction = ing.quantity * orderItem.quantity;
                const prevStock = updated[invIndex].currentStock;
                const newStock = Math.max(0, Number((prevStock - totalDeduction).toFixed(3)));

                updated[invIndex] = {
                  ...updated[invIndex],
                  currentStock: newStock,
                  status: newStock <= 0 ? 'out_of_stock' : newStock <= updated[invIndex].minimumStock ? 'low' : 'optimal',
                  updatedAt: now,
                };

                transactionsToAdd.push({
                  id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  itemId: updated[invIndex].id,
                  itemName: updated[invIndex].name,
                  type: 'order_consumption',
                  quantity: totalDeduction,
                  previousStock: prevStock,
                  newStock: newStock,
                  unit: updated[invIndex].unit,
                  reason: `Auto deduction for completed Order #${targetOrder?.orderNumber}`,
                  referenceId: targetOrder?.id,
                  performedBy: currentRole,
                  createdAt: now,
                });
              }
            });
          }
        });

        return updated;
      });

      if (transactionsToAdd.length > 0) {
        setInventoryTransactions(prev => [...transactionsToAdd, ...prev]);
      }
    }

    // Customer Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        customerId: targetOrder?.customerId,
        title: `Order Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
        message: `Order #${targetOrder?.orderNumber} is now ${newStatus.replace('_', ' ')}.`,
        type: 'order',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addAuditLog('STATUS_CHANGE', 'Orders', orderId, `Order status changed to ${newStatus}`, targetOrder.orderNumber);
    showToast(`Order status updated to ${newStatus.replace('_', ' ')}!`, 'info');
  };

  // Product CRUD
  const createProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Product => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setProducts(prev => [newProduct, ...prev]);
    addAuditLog('CREATE', 'Products', newProduct.id, `Created product "${newProduct.name}" at $${newProduct.price}`, newProduct.name);
    showToast(`Product "${newProduct.name}" created!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
    );
    addAuditLog('UPDATE', 'Products', id, `Updated product attributes`, data.name);
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string, permanent: boolean = false) => {
    const prod = products.find(p => p.id === id);
    if (permanent) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addAuditLog('DELETE', 'Products', id, `Permanently deleted product "${prod?.name}"`, prod?.name);
    } else {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: false } : p)));
      addAuditLog('UPDATE', 'Products', id, `Deactivated (soft deleted) product "${prod?.name}"`, prod?.name);
    }
    showToast('Product removed successfully!', 'info');
  };

  // Category CRUD
  const createCategory = (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
    const now = new Date().toISOString();
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setCategories(prev => [...prev, newCat]);
    addAuditLog('CREATE', 'Categories', newCat.id, `Created category "${newCat.name}"`, newCat.name);
    showToast(`Category "${newCat.name}" created!`, 'success');
    return newCat;
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
    );
    addAuditLog('UPDATE', 'Categories', id, `Updated category`, data.name);
    showToast('Category updated!', 'success');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE', 'Categories', id, `Deleted category "${cat?.name}"`, cat?.name);
    showToast('Category deleted', 'info');
  };

  // Inventory CRUD
  const createInventoryItem = (data: Omit<InventoryItem, 'id' | 'updatedAt'>): InventoryItem => {
    const newItem: InventoryItem = {
      ...data,
      id: `inv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setInventory(prev => [newItem, ...prev]);
    addAuditLog('CREATE', 'Inventory', newItem.id, `Added ingredient "${newItem.name}"`, newItem.name);
    showToast(`Ingredient "${newItem.name}" added to inventory!`, 'success');
    return newItem;
  };

  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
    setInventory(prev =>
      prev.map(i => {
        if (i.id === id) {
          const updated = { ...i, ...data, updatedAt: new Date().toISOString() };
          // Re-evaluate status
          if (updated.currentStock <= 0) updated.status = 'out_of_stock';
          else if (updated.currentStock <= updated.minimumStock) updated.status = 'low';
          else updated.status = 'optimal';
          return updated;
        }
        return i;
      })
    );
    addAuditLog('UPDATE', 'Inventory', id, 'Updated inventory item details');
    showToast('Inventory item updated!', 'success');
  };

  const deleteInventoryItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(i => i.id !== id));
    addAuditLog('DELETE', 'Inventory', id, `Deleted inventory item "${item?.name}"`, item?.name);
    showToast('Item deleted from inventory', 'info');
  };

  const adjustStock = (
    itemId: string,
    quantity: number,
    type: InventoryTransaction['type'],
    reason: string
  ) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const previousStock = item.currentStock;
    let newStock = previousStock;

    if (type === 'stock_in') newStock += quantity;
    else if (type === 'stock_out' || type === 'waste') newStock = Math.max(0, previousStock - quantity);
    else if (type === 'adjustment') newStock = quantity;

    updateInventoryItem(itemId, { currentStock: Number(newStock.toFixed(3)) });

    const newTx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      itemId,
      itemName: item.name,
      type,
      quantity,
      previousStock,
      newStock,
      unit: item.unit,
      reason,
      performedBy: currentRole,
      createdAt: new Date().toISOString(),
    };

    setInventoryTransactions(prev => [newTx, ...prev]);
    addAuditLog('UPDATE', 'Inventory', itemId, `Adjusted stock (${type}): ${previousStock} -> ${newStock} ${item.unit}`, item.name);
    showToast(`Inventory stock adjusted for ${item.name}`, 'success');
  };

  // Recipe CRUD
  const createRecipe = (data: Omit<Recipe, 'id' | 'updatedAt'>): Recipe => {
    const newRec: Recipe = {
      ...data,
      id: `rec-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setRecipes(prev => [newRec, ...prev]);
    addAuditLog('CREATE', 'Recipes', newRec.id, `Created recipe for ${newRec.productName}`, newRec.productName);
    showToast(`Recipe for "${newRec.productName}" created!`, 'success');
    return newRec;
  };

  const updateRecipe = (id: string, data: Partial<Recipe>) => {
    setRecipes(prev =>
      prev.map(r => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r))
    );
    addAuditLog('UPDATE', 'Recipes', id, `Updated recipe`);
    showToast('Recipe updated successfully!', 'success');
  };

  const deleteRecipe = (id: string) => {
    const rec = recipes.find(r => r.id === id);
    setRecipes(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE', 'Recipes', id, `Deleted recipe for ${rec?.productName}`, rec?.productName);
    showToast('Recipe deleted', 'info');
  };

  // Branch CRUD
  const createBranch = (data: Omit<Branch, 'id'>): Branch => {
    const newBranch: Branch = {
      ...data,
      id: `branch-${Date.now()}`,
    };
    setBranches(prev => [...prev, newBranch]);
    addAuditLog('CREATE', 'Branches', newBranch.id, `Created branch "${newBranch.name}"`, newBranch.name);
    showToast(`Branch "${newBranch.name}" added!`, 'success');
    return newBranch;
  };

  const updateBranch = (id: string, data: Partial<Branch>) => {
    setBranches(prev => prev.map(b => (b.id === id ? { ...b, ...data } : b)));
    addAuditLog('UPDATE', 'Branches', id, `Updated branch details`);
    showToast('Branch updated!', 'success');
  };

  const deleteBranch = (id: string) => {
    const b = branches.find(br => br.id === id);
    setBranches(prev => prev.filter(br => br.id !== id));
    addAuditLog('DELETE', 'Branches', id, `Deleted branch "${b?.name}"`, b?.name);
    showToast('Branch removed', 'info');
  };

  // Table CRUD
  const createTable = (data: Omit<TableItem, 'id'>): TableItem => {
    const newTbl: TableItem = {
      ...data,
      id: `tbl-${Date.now()}`,
    };
    setTables(prev => [...prev, newTbl]);
    showToast(`Table ${newTbl.tableNumber} added!`, 'success');
    return newTbl;
  };

  const updateTable = (id: string, data: Partial<TableItem>) => {
    setTables(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    showToast('Table status updated!', 'success');
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
    showToast('Table removed', 'info');
  };

  // Customer CRUD
  const createCustomer = (
    data: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent' | 'loyaltyPoints'>
  ): Customer => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog('CREATE', 'Customers', newCust.id, `Registered customer ${newCust.name}`, newCust.name);
    showToast(`Customer ${newCust.name} registered!`, 'success');
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    addAuditLog('UPDATE', 'Customers', id, 'Updated customer details');
    showToast('Customer profile updated!', 'success');
  };

  const deleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, status: 'inactive' } : c)));
    addAuditLog('UPDATE', 'Customers', id, `Deactivated customer ${cust?.name}`, cust?.name);
    showToast('Customer account deactivated', 'info');
  };

  // Employee CRUD
  const createEmployee = (data: Omit<Employee, 'id'>): Employee => {
    const newEmp: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
    };
    setEmployees(prev => [newEmp, ...prev]);
    addAuditLog('CREATE', 'Employees', newEmp.id, `Hired ${newEmp.name} as ${newEmp.position}`, newEmp.name);
    showToast(`Staff member ${newEmp.name} added!`, 'success');
    return newEmp;
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
    addAuditLog('UPDATE', 'Employees', id, 'Updated employee record');
    showToast('Employee updated!', 'success');
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, status: 'inactive' } : e)));
    addAuditLog('UPDATE', 'Employees', id, `Deactivated employee ${emp?.name}`, emp?.name);
    showToast('Employee deactivated', 'info');
  };

  // Supplier CRUD
  const createSupplier = (data: Omit<Supplier, 'id'>): Supplier => {
    const newSup: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
    };
    setSuppliers(prev => [...prev, newSup]);
    addAuditLog('CREATE', 'Suppliers', newSup.id, `Added supplier ${newSup.name}`, newSup.name);
    showToast(`Supplier ${newSup.name} added!`, 'success');
    return newSup;
  };

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
    showToast('Supplier updated!', 'success');
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    showToast('Supplier deleted', 'info');
  };

  // Promotion CRUD
  const createPromotion = (data: Omit<Promotion, 'id' | 'usageCount'>): Promotion => {
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`,
      usageCount: 0,
    };
    setPromotions(prev => [newPromo, ...prev]);
    addAuditLog('CREATE', 'Promotions', newPromo.id, `Created promo campaign ${newPromo.name} [${newPromo.couponCode}]`, newPromo.name);
    showToast(`Promotion "${newPromo.name}" created!`, 'success');
    return newPromo;
  };

  const updatePromotion = (id: string, data: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
    addAuditLog('UPDATE', 'Promotions', id, 'Updated promotion campaign');
    showToast('Promotion updated!', 'success');
  };

  const deletePromotion = (id: string) => {
    const promo = promotions.find(p => p.id === id);
    setPromotions(prev => prev.map(p => (p.id === id ? { ...p, isActive: false } : p)));
    addAuditLog('UPDATE', 'Promotions', id, `Deactivated promotion "${promo?.name}"`, promo?.name);
    showToast('Promotion deactivated', 'info');
  };

  // Loyalty Rewards CRUD & Redemption
  const createLoyaltyReward = (data: Omit<LoyaltyReward, 'id'>): LoyaltyReward => {
    const newReward: LoyaltyReward = {
      ...data,
      id: `rew-${Date.now()}`,
    };
    setLoyaltyRewards(prev => [...prev, newReward]);
    showToast(`Reward "${newReward.title}" created!`, 'success');
    return newReward;
  };

  const updateLoyaltyReward = (id: string, data: Partial<LoyaltyReward>) => {
    setLoyaltyRewards(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
    showToast('Reward updated!', 'success');
  };

  const deleteLoyaltyReward = (id: string) => {
    setLoyaltyRewards(prev => prev.filter(r => r.id !== id));
    showToast('Reward removed', 'info');
  };

  const redeemReward = (customerId: string, rewardId: string): boolean => {
    const cust = customers.find(c => c.id === customerId);
    const rew = loyaltyRewards.find(r => r.id === rewardId);
    if (!cust || !rew) return false;

    if (cust.loyaltyPoints < rew.pointsCost) {
      showToast('Insufficient loyalty points balance.', 'error');
      return false;
    }

    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, loyaltyPoints: c.loyaltyPoints - rew.pointsCost } : c))
    );

    setLoyaltyTransactions(prev => [
      {
        id: `ltx-${Date.now()}`,
        customerId,
        points: -rew.pointsCost,
        description: `Redeemed: ${rew.title}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`🎉 Redeemed "${rew.title}"! Voucher applied.`, 'success');
    return true;
  };

  // Reviews CRUD
  const createReview = (data: Omit<Review, 'id' | 'date'>): Review => {
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Thank you for your rating & review!', 'success');
    return newRev;
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    showToast(`Review status set to ${status}`, 'info');
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review deleted', 'info');
  };

  // CMS & Settings
  const updateCMS = (data: Partial<CMSContent>) => {
    setCms(prev => ({ ...prev, ...data }));
    addAuditLog('UPDATE', 'CMS', 'cms-main', 'Updated website CMS content');
    showToast('Website content updated live!', 'success');
  };

  const updateSettings = (data: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
    addAuditLog('UPDATE', 'Settings', 'sys-settings', 'Updated system preferences');
    showToast('System settings saved!', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Reset & Backup
  const resetToSampleData = () => {
    setCategories(initialCategories);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setInventory(initialInventory);
    setInventoryTransactions([]);
    setRecipes(initialRecipes);
    setBranches(initialBranches);
    setTables(initialTables);
    setCustomers(initialCustomers);
    setEmployees(initialEmployees);
    setSuppliers(initialSuppliers);
    setPromotions(initialPromotions);
    setLoyaltyRewards(initialLoyaltyRewards);
    setLoyaltyTransactions([]);
    setReviews(initialReviews);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setCms(initialCMS);
    setSettings(initialSettings);
    setCart([]);
    setAppliedCoupon(null);
    showToast('Reset database to pristine sample data!', 'info');
  };

  const exportDatabaseJSON = () => {
    const data = {
      categories,
      products,
      orders,
      inventory,
      inventoryTransactions,
      recipes,
      branches,
      tables,
      customers,
      employees,
      suppliers,
      promotions,
      loyaltyRewards,
      reviews,
      cms,
      settings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && data.categories) {
        if (data.categories) setCategories(data.categories);
        if (data.products) setProducts(data.products);
        if (data.orders) setOrders(data.orders);
        if (data.inventory) setInventory(data.inventory);
        if (data.recipes) setRecipes(data.recipes);
        if (data.branches) setBranches(data.branches);
        if (data.customers) setCustomers(data.customers);
        if (data.employees) setEmployees(data.employees);
        if (data.promotions) setPromotions(data.promotions);
        if (data.settings) setSettings(data.settings);
        if (data.cms) setCms(data.cms);
        showToast('Database imported successfully!', 'success');
        return true;
      }
      showToast('Invalid backup JSON format', 'error');
      return false;
    } catch (e) {
      showToast('Failed to parse JSON file', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        platformView,
        setPlatformView,
        selectedBranchId,
        setSelectedBranchId,
        categories,
        products,
        orders,
        inventory,
        inventoryTransactions,
        recipes,
        branches,
        tables,
        customers,
        employees,
        suppliers,
        promotions,
        loyaltyRewards,
        loyaltyTransactions,
        reviews,
        notifications,
        auditLogs,
        cms,
        settings,
        currentCustomer,
        setCurrentCustomerId,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        placeOrder,
        updateOrderStatus,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustStock,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        createBranch,
        updateBranch,
        deleteBranch,
        createTable,
        updateTable,
        deleteTable,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        createPromotion,
        updatePromotion,
        deletePromotion,
        createLoyaltyReward,
        updateLoyaltyReward,
        deleteLoyaltyReward,
        redeemReward,
        createReview,
        updateReviewStatus,
        deleteReview,
        updateCMS,
        updateSettings,
        markNotificationAsRead,
        clearNotifications,
        resetToSampleData,
        exportDatabaseJSON,
        importDatabaseJSON,
        toasts,
        showToast,
        removeToast,
        isCartOpen,
        setIsCartOpen,
        activeOrderTrackerId,
        setActiveOrderTrackerId,
        customizingProduct,
        setCustomizingProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
