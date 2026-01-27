import fs from 'fs';
import path from 'path';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  shipping: number;
  platformFee: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'cod' | 'card' | 'upi';
  createdAt: string;
  updatedAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read orders from file
const readOrders = (): Order[] => {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

// Write orders to file
const writeOrders = (orders: Order[]): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders file:', error);
  }
};

// Shared file-based order storage
class OrdersStore {
  getOrders(): Order[] {
    return readOrders();
  }

  addOrder(order: Order): void {
    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);
  }

  getOrdersByUserId(userId: string): Order[] {
    const orders = readOrders();
    return orders.filter(order => order.userId === userId);
  }

  getOrderById(orderId: string): Order | undefined {
    const orders = readOrders();
    return orders.find(order => order.id === orderId);
  }

  updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const orders = readOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      writeOrders(orders);
      return true;
    }
    return false;
  }

  clearOrders(): void {
    writeOrders([]);
  }
}

// Export a singleton instance
export const ordersStore = new OrdersStore();
