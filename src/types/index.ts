export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'qr_payment'
  | 'mobile_banking'
  | 'online_payment';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type InventoryTransactionType =
  | 'stock_in'
  | 'stock_out'
  | 'adjustment'
  | 'waste'
  | 'transfer'
  | 'order_consumption';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCustomizationOption {
  id: string;
  name: string;
  type: 'size' | 'temperature' | 'milk' | 'sugar' | 'extra';
  priceDelta: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  image: string;
  price: number;
  discountPrice?: number;
  size: string;
  availableSizes: string[];
  hotIcedOption: boolean;
  ingredients: string[];
  calories: number;
  allergens: string[];
  preparationTime: number; // in minutes
  inStock: boolean;
  stockCount?: number;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedCustomizations {
  size: string;
  sizePrice: number;
  temperature?: 'Hot' | 'Iced';
  milk?: string;
  milkPrice?: number;
  sugar?: string;
  extras?: { name: string; price: number }[];
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  product: Product;
  quantity: number;
  customizations: SelectedCustomizations;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: SelectedCustomizations;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  branchId: string;
  branchName: string;
  orderType: OrderType;
  tableNumber?: string;
  pickupTime?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  estimatedMinutes?: number;
  loyaltyPointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'coffee_beans' | 'dairy' | 'syrup' | 'tea' | 'bakery_supplies' | 'packaging' | 'other';
  unit: string; // kg, L, units, g, ml
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number;
  supplierId: string;
  supplierName?: string;
  expiryDate?: string;
  status: 'optimal' | 'low' | 'out_of_stock';
  branchId?: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: InventoryTransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unit: string;
  reason: string;
  referenceId?: string; // orderId or PO number
  performedBy: string;
  createdAt: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // e.g. 18 (grams), 200 (ml), 1 (cup)
  unit: string;
}

export interface Recipe {
  id: string;
  productId: string;
  productName: string;
  instructions?: string;
  ingredients: RecipeIngredient[];
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  openingHours: string;
  closingHours: string;
  latitude: number;
  longitude: number;
  managerName: string;
  image: string;
  status: 'active' | 'inactive';
  tableCount: number;
}

export interface TableItem {
  id: string;
  branchId: string;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: 'Manager' | 'Barista' | 'Cashier' | 'Kitchen Staff' | 'Delivery Staff';
  branchId: string;
  branchName?: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'inactive';
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: string[];
  favoriteProductIds: string[];
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastOrderDate?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_item';
  discountAmount: number; // percentage (e.g. 20) or fixed dollars (e.g. 5)
  minimumPurchase: number;
  maximumDiscount?: number;
  couponCode: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  rewardType: 'free_coffee' | 'discount_fixed' | 'discount_percent';
  value: number;
  iconName: string;
  isActive: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  orderId?: string;
  points: number; // positive for earned, negative for redeemed
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  customerId?: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'loyalty' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsSupplied: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'STATUS_CHANGE';
  module: string;
  recordId: string;
  recordTitle?: string;
  details: string;
  timestamp: string;
}

export interface CMSContent {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  announcementText: string;
  showAnnouncement: boolean;
  aboutStory: string;
  aboutMission: string;
  aboutQuality: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  faqs: { question: string; answer: string }[];
}

export interface SystemSettings {
  shopName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  taxRatePercent: number;
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  loyaltyEarnRate: number; // points per $1 spent
  autoDeductInventory: boolean;
  openingTime: string;
  closingTime: string;
}
