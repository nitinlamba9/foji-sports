'use client';

import { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Settings, LogOut, Eye, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Product } from '@/domain/product';
import { LegacyAdminProduct, toCanonicalProduct, toLegacyAdminProduct } from '@/adapters/product.admin';
import { generateSlug, isValidSlug, normalizeSlug } from '@/lib/slug';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  phone?: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: number;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
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
  shipping: number;
  platformFee: number;
}

interface AdminDashboardProps {
  userData: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboard({ userData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<LegacyAdminProduct[]>([]);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [lastProductCount, setLastProductCount] = useState(0);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    visible: boolean;
  } | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Product management states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LegacyAdminProduct | null>(null);
  const [productForm, setProductForm] = useState<LegacyAdminProduct>({
    id: '', // Empty ID for new products, will be set after creation
    name: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    stock: 0,
    category: '',
    status: 'active',
    featured: false,
    description: '',
    sku: '',
    brand: '',
    sizes: [],
    colors: [],
    weight: '',
    dimensions: '',
    material: '',
    tags: [],
    images: [],
    videos: [],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    rating: 0,
    reviews: 0,
    reviewText: ''
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAdminData();
    
    // Set up real-time updates
    const interval = setInterval(fetchAdminData, 10000); // Update every 10 seconds
    
    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ORDERS_UPDATED' || e.key === 'PRODUCTS_UPDATED') {
        fetchAdminData();
      }
    };
    
    // Listen for custom events (for same-tab updates)
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'ORDERS_UPDATED' || e.data.type === 'PRODUCTS_UPDATED') {
        fetchAdminData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      const usersData = await usersResponse.json();
      setUsers(usersData.users || []);

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        credentials: 'include',
      });
      const ordersData = await ordersResponse.json();
      const newOrders = ordersData.orders || [];
      setOrders(newOrders);

      // Check for new orders
      if (lastOrderCount > 0 && newOrders.length > lastOrderCount) {
        const newOrderCount = newOrders.length - lastOrderCount;
        showNotification('success', `${newOrderCount} new order${newOrderCount > 1 ? 's' : ''} received!`);
      }
      setLastOrderCount(newOrders.length);

      // Fetch products
      const productsResponse = await fetch('/api/admin/products', {
        credentials: 'include',
      });
      const productsData = await productsResponse.json();
      const canonicalProducts = productsData.products || [];
      
      // Convert canonical products to legacy admin products
      const legacyProducts = canonicalProducts.map((product: Product) => 
        toLegacyAdminProduct(product)
      );
      setProducts(legacyProducts);

      // Check for new products
      if (lastProductCount > 0 && legacyProducts.length > lastProductCount) {
        const newProductCount = legacyProducts.length - lastProductCount;
        showNotification('info', `${newProductCount} new product${newProductCount > 1 ? 's' : ''} added!`);
      }
      setLastProductCount(legacyProducts.length);

      console.log('Admin data updated at:', new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error fetching admin data:', error);
      showNotification('error', 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleManualRefresh = () => {
    fetchAdminData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        console.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      id: '', // Empty ID for new products
      name: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      stock: 0,
      category: '',
      status: 'active',
      description: '',
      sku: '',
      brand: '',
      sizes: [],
      colors: [],
      weight: '',
      dimensions: '',
      material: '',
      tags: [],
      images: [],
      videos: [],
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      featured: false,
      slug: '',
      rating: 0,
      reviews: 0,
      reviewText: ''
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: LegacyAdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      stock: product.stock,
      category: product.category,
      status: product.status,
      description: product.description || '',
      sku: product.sku || '',
      brand: product.brand || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      material: product.material || '',
      tags: product.tags || [],
      images: product.images || [],
      videos: product.videos || [],
      image: product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      featured: product.featured || false,
      slug: product.slug || '',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      reviewText: product.reviewText || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          // ALWAYS refetch from source of truth
          const freshResponse = await fetch('/api/admin/products', { cache: 'no-store' });
          const freshData = await freshResponse.json();
          setProducts(freshData.products);
          
          // Trigger shop page refresh by broadcasting a message
          if (typeof window !== 'undefined') {
            const timestamp = Date.now();
            window.postMessage({ type: 'PRODUCTS_UPDATED', timestamp }, '*');
            localStorage.setItem('PRODUCTS_UPDATED', timestamp.toString());
            // PRODUCTION-SAFE: Removed PRODUCTS_CACHE writing to avoid stale data issues
            console.log('Admin delete: PRODUCTS_UPDATED broadcast with', freshData.products.length, 'products');
            if ('BroadcastChannel' in window) {
              const channel = new BroadcastChannel('products');
              channel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp });
              channel.close();
            }
          }
        } else {
          console.error('Admin delete: API response not ok');
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async () => {
    try {
      // Validate and generate slug using production-safe function
      let slug = normalizeSlug(productForm.slug || '');
      
      if (!slug) {
        // Generate slug from name if not provided
        slug = generateSlug(productForm.name);
      } else if (!isValidSlug(slug)) {
        alert('Invalid slug format. Please use only lowercase letters, numbers, and hyphens.');
        return;
      }

      const legacyProductData = {
        ...productForm,
        slug,
        featured: productForm.featured || false
      };

      // Convert legacy product to canonical for API
      const canonicalProductData = toCanonicalProduct(legacyProductData);

      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = editingProduct 
        ? { productId: editingProduct.id, ...canonicalProductData }
        : canonicalProductData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        let nextProducts = products;
        if (editingProduct) {
          const updatedProduct = { ...editingProduct, ...legacyProductData };
          nextProducts = products.map(product => 
            product.id === editingProduct.id 
              ? updatedProduct
              : product
          );
          setProducts(nextProducts);
        } else {
          const newProduct = await response.json();
          // Convert the response back to legacy format
          const legacyNewProduct = toLegacyAdminProduct(newProduct.product);
          nextProducts = [...products, legacyNewProduct];
          setProducts(nextProducts);
        }
        setShowProductModal(false);
        setEditingProduct(null);
        
        // Trigger shop page refresh by broadcasting a message and localStorage
        if (typeof window !== 'undefined') {
          const timestamp = Date.now();
          window.postMessage({ type: 'PRODUCTS_UPDATED', timestamp }, '*');
          localStorage.setItem('PRODUCTS_UPDATED', timestamp.toString());
          // PRODUCTION-SAFE: Removed PRODUCTS_CACHE writing to avoid stale data issues
          if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('products');
            channel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp });
            channel.close();
          }
        }
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleToggleProductStatus = async (product: LegacyAdminProduct) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.id, 
          status: newStatus 
        }),
      });

      if (response.ok) {
        const nextProducts = products.map(p => 
          p.id === product.id ? { ...p, status: newStatus } : p
        );
        setProducts(nextProducts);
        
        // Trigger shop page refresh by broadcasting a message and localStorage
        if (typeof window !== 'undefined') {
          const timestamp = Date.now();
          window.postMessage({ type: 'PRODUCTS_UPDATED', timestamp }, '*');
          localStorage.setItem('PRODUCTS_UPDATED', timestamp.toString());
          if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('products');
            channel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp });
            channel.close();
          }
        }
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Media management functions
  const handleAddImage = (imageUrl: string) => {
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrl],
      // Always set main image to the latest uploaded image
      image: imageUrl
    }));
  };

  const handleRemoveImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddVideo = (videoUrl: string) => {
    setProductForm(prev => ({
      ...prev,
      videos: [...(prev.videos || []), videoUrl]
    }));
  };

  const handleRemoveVideo = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      videos: (prev.videos || []).filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    
    for (const file of files) {
      if (type === 'images' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            handleAddImage(result);
          }
        };
        reader.readAsDataURL(file);
      } else if (type === 'videos' && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            handleAddVideo(result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePriceChange = (field: 'originalPrice' | 'price', value: number) => {
    const updatedForm = { ...productForm, [field]: value };
    
    // Auto-calculate discount if both prices are set
    if ((updatedForm.originalPrice || 0) > 0 && updatedForm.price > 0) {
      const discount = Math.round(((updatedForm.originalPrice! - updatedForm.price) / updatedForm.originalPrice!) * 100);
      updatedForm.discount = discount;
    } else if (field === 'originalPrice' && value === 0) {
      updatedForm.discount = 0;
    } else if (field === 'price' && (updatedForm.originalPrice || 0) > 0) {
      const discount = Math.round(((updatedForm.originalPrice! - updatedForm.price) / updatedForm.originalPrice!) * 100);
      updatedForm.discount = discount;
    } else {
      updatedForm.discount = 0;
    }
    
    setProductForm(updatedForm);
  };

  const handleSizeToggle = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }));
  };

  // Get size options based on category
  const getSizeOptions = () => {
    if (productForm.category === 'Footwear') {
      return ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15'];
    } else {
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'];
    }
  };

  const handleLogout = () => {
    // Clear cookies and redirect
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                ADMIN
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleManualRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Refresh Data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('ORDERS_UPDATED');
                  localStorage.removeItem('PRODUCTS_UPDATED');
                  fetchAdminData();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Clear Cache"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Cache</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userData.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          } border`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L10 8.586l1.293-1.293a1 1 0 00-1.414-1.414L8.586 8l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'warning' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.984.826 3.486l-5.58 9.92c-.75 1.334-2.722 1.334-3.486 0L8.257 3.099zM7.5 12.5l1.5-1.5m0 0l3-3m-3 3l-3-3" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 01-1.414-1.414L10 8.586 4.293 4.293a1 1 0 001.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['dashboard', 'users', 'orders', 'products', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-sm text-gray-600">₹{order.total.toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.id !== userData.id && (
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.userName}</div>
                          <div className="text-sm text-gray-500">{order.userEmail}</div>
                          <div className="text-xs text-gray-400">{order.shippingAddress.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {order.products.map((item: any, index: number) => {
                              const product = products.find(p => p.id === item.productId);
                              return (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                  {product?.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {product?.name || `Product ${item.productId}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {product?.sku && (
                                        <span className="font-mono bg-gray-200 px-1 rounded">{product.sku}</span>
                                      )}
                                      {item.size && (
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                          Size: {item.size}
                                        </span>
                                      )}
                                      {item.color && (
                                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                          Color: {item.color}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Qty: {item.quantity} × ₹{item.price}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="capitalize">{order.paymentMethod}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <a 
                              href={`/admin/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
              
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products by name, brand, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                                ) : (
                                  <Package className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category} • {product.brand || 'No Brand'}</div>
                              {product.discount && product.discount > 0 && (
                                <div className="text-xs text-red-600 font-medium">
                                  {product.discount}% OFF
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sku || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              product.stock <= 10 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {product.stock}
                            </span>
                            {product.stock <= 10 && (
                              <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            {product.sizes && product.sizes.length > 0 && (
                              <div className="mb-1">Sizes: {product.sizes.join(', ')}</div>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex gap-1">
                                {product.colors.slice(0, 3).map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                                {product.colors.length > 3 && (
                                  <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleProductStatus(product)}
                            className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer transition-colors ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {product.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <a 
                              href={`/product/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Send email notifications for new orders</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-gray-600">Put the site in maintenance mode</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="font-medium">Development</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Backup:</span>
                      <span className="font-medium">Never</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4xl max-h-[90vh] overflow-y-auto shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => handlePriceChange('originalPrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({...productForm, discount: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="100"
                        readOnly
                      />
                      <span className="absolute right-2 top-2 text-xs text-gray-500">Auto-calculated</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Price (₹) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => handlePriceChange('price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                    {(productForm.discount || 0) > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Save ₹{((productForm.originalPrice || 0) - productForm.price).toLocaleString()} ({productForm.discount}% off)
                      </p>
                    )}
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input
                      type="text"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500g"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({...productForm, dimensions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 30x20x10 cm"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes 
                    {productForm.category === 'Footwear' && (
                      <span className="text-xs text-gray-500 ml-2">(Numeric sizes for footwear)</span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getSizeOptions().map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                          (productForm.sizes || []).includes(size)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {productForm.category === 'Footwear' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Common shoe sizes: 5-15 (US sizes)
                    </p>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Pink', 'Purple', 'Orange', 'Brown', 'Navy', 'Maroon', 'Teal', 'Gold', 'Silver'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors flex items-center gap-2 ${
                          (productForm.colors || []).includes(color)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
                    <input
                      type="text"
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Enter main image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Primary image for the product</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(productForm.images || []).map((image, index) => (
                          <div key={index} className="relative group">
                            <img src={image} alt={`Product ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* URL Input */}
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Enter image URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              handleAddImage(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Press Enter to add image URL</p>
                      </div>
                      
                      {/* File Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or upload from device</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'images')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 file:mr-2 file:mb-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">Select multiple image files</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Videos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(productForm.videos || []).map((video, index) => (
                          <div key={index} className="relative group">
                            <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">Video {index + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* URL Input */}
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Enter video URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              handleAddVideo(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Press Enter to add video URL</p>
                      </div>
                      
                      {/* File Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or upload from device</label>
                        <input
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'videos')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 file:mr-2 file:mb-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">Select multiple video files</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <input
                      type="text"
                      value={productForm.material}
                      onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Cotton, Polyester, Leather"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      value={(productForm.tags || []).join(', ')}
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., running, sports, fitness"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Detailed product description..."
                  />
                </div>

                {/* Review Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Reviews</h3>
                  
                  {/* Star Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating (Stars)</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setProductForm({...productForm, rating: star})}
                          className="text-2xl transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (productForm.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {productForm.rating || 0} out of 5 stars
                      </span>
                    </div>
                  </div>

                  {/* Written Review */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Review</label>
                    <textarea
                      value={productForm.reviewText || ''}
                      onChange={(e) => setProductForm({...productForm, reviewText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add a featured review for this product..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This review will be displayed prominently on the product page
                    </p>
                  </div>

                  {/* Review Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Reviews Count</label>
                    <input
                      type="number"
                      value={productForm.reviews || 0}
                      onChange={(e) => setProductForm({...productForm, reviews: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="Number of reviews this product has"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Total number of customer reviews for this product
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({...productForm, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
