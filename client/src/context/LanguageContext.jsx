import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    brand: "Foodly",
    menu: "Menu",
    cart: "Cart",
    orders: "My Orders",
    login: "Login",
    register: "Register",
    logout: "Logout",
    admin: "Admin",
    addToCart: "Add to Cart",
    price: "EGP",
    emptyCart: "Your cart is empty.",
    checkout: "Checkout",
    address: "Delivery Address",
    paymentMethod: "Payment Method",
    cash: "Cash on Delivery",
    online: "Online Payment",
    placeOrder: "Place Order",
    total: "Total",
    orderStatus: "Order Status",
    paymentStatus: "Payment Status",
    noOrders: "No orders yet.",
    username: "Username",
    email: "Email",
    password: "Password",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",
    welcome: "Order your favorite food online",
    subtitle: "Fresh meals, fast checkout, and easy order tracking.",
    all: "All",
    orderStatuses: {
      pending: "Pending",
      preparing: "Preparing",
      "out for delivery": "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    adminDashboard: "Admin Dashboard",
    adminSubtitle: "Manage products and monitor customer orders.",
    manageOrders: "Manage Orders",
    manageProducts: "Manage Products",
    updateStatus: "Update Status",
    addProduct: "Add Product",
    products: "Products",
    available: "Available",
    markUnavailable: "Mark Unavailable",
    markAvailable: "Mark Available",
    delete: "Delete",

    paymentStatuses: {
      pending: "Pending",
      paid: "Paid",
      failed: "Failed",
    },
    restaurants: "Restaurants",
    restaurant: "Restaurant",
    chooseRestaurant: "Choose a restaurant",
    categories: {
      All: "All",
      Burgers: "Burgers",
      Burger: "Burger",
      Pizza: "Pizza",
      Pasta: "Pasta",
      Salads: "Salads",
      Salad: "Salad",
      Sides: "Sides",
      Drinks: "Drinks",
      Desserts: "Desserts",
      Italian: "Italian",
    },
    loading: "Loading...",
    restaurantNotFound: "Restaurant not found",
    enterAddress: "Please enter your delivery address",
    failedPlaceOrder: "Failed to place order",
    failedLoadAdminData: "Failed to load admin data",
    productAdded: "Product added successfully",
    productDeleted: "Product deleted successfully",
    productUpdated: "Product updated successfully",
    failedAddProduct: "Failed to add product",
    failedDeleteProduct: "Failed to delete product",
    failedUpdateProduct: "Failed to update product",
    orderUpdated: "Order status updated successfully",
    failedUpdateOrder: "Failed to update order",
    finalStatusNote: "This order is finalized and can no longer be updated.",
    englishName: "English name",
    arabicName: "Arabic name",
    category: "Category",
    productPrice: "Price",
    imageUrl: "Image URL",
    englishDescription: "English description",
    arabicDescription: "Arabic description",
    addressPlaceholder: "Example: Nasr City, Cairo",
    loginFailed: "Login failed",
    registrationFailed: "Registration failed",
    mixedRestaurantCart:
  "You can only order from one restaurant at a time. Please clear your cart first.",
  deleting: "Deleting...",
  },

  ar: {
    brand: "فودلي",
    menu: "القائمة",
    cart: "السلة",
    orders: "طلباتي",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    admin: "الإدارة",
    addToCart: "أضف إلى السلة",
    price: "جنيه",
    emptyCart: "السلة فارغة.",
    checkout: "إتمام الطلب",
    address: "عنوان التوصيل",
    paymentMethod: "طريقة الدفع",
    cash: "الدفع عند الاستلام",
    online: "دفع أونلاين",
    placeOrder: "تأكيد الطلب",
    total: "الإجمالي",
    orderStatus: "حالة الطلب",
    paymentStatus: "حالة الدفع",
    noOrders: "لا توجد طلبات بعد.",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",
    welcome: "اطلب أكلك المفضل أونلاين",
    subtitle: "وجبات طازجة، طلب سريع، وتتبع سهل لحالة الطلب.",
    all: "الكل",
    paid: "تم الدفع",
    orderStatuses: {
      pending: "قيد الانتظار",
      preparing: "قيد التحضير",
      "out for delivery": "في طريقه للتوصيل",
      delivered: "تم التوصيل",
      cancelled: "تم الإلغاء",
    },
    paymentStatuses: {
      pending: "قيد الانتظار",
      paid: "مدفوع",
      failed: "فشل الدفع",
    },
    adminDashboard: "لوحة الإدارة",
    adminSubtitle: "إدارة المنتجات ومتابعة طلبات العملاء.",
    manageOrders: "إدارة الطلبات",
    manageProducts: "إدارة المنتجات",
    updateStatus: "تحديث الحالة",
    addProduct: "إضافة منتج",
    products: "المنتجات",
    available: "متاح",
    markUnavailable: "جعله غير متاح",
    markAvailable: "جعله متاح",
    delete: "حذف",
    restaurants: "المطاعم",
    restaurant: "المطعم",
    chooseRestaurant: "اختر مطعم",

    categories: {
      All: "الكل",
      Burgers: "برجر",
      Burger: "برجر",
      Pizza: "بيتزا",
      Pasta: "مكرونة",
      Salads: "سلطات",
      Salad: "سلطة",
      Sides: "أطباق جانبية",
      Drinks: "مشروبات",
      Desserts: "حلويات",
      Italian: "إيطالي",
    },
    loading: "جاري التحميل...",
    restaurantNotFound: "المطعم غير موجود",
    enterAddress: "من فضلك أدخل عنوان التوصيل",
    failedPlaceOrder: "فشل إنشاء الطلب",
    failedLoadAdminData: "فشل تحميل بيانات الإدارة",
    productAdded: "تمت إضافة المنتج بنجاح",
    productDeleted: "تم حذف المنتج بنجاح",
    productUpdated: "تم تحديث المنتج بنجاح",
    failedAddProduct: "فشل إضافة المنتج",
    failedDeleteProduct: "فشل حذف المنتج",
    failedUpdateProduct: "فشل تحديث المنتج",
    orderUpdated: "تم تحديث حالة الطلب بنجاح",
    failedUpdateOrder: "فشل تحديث الطلب",
    finalStatusNote: "تم إنهاء هذا الطلب ولا يمكن تعديله مرة أخرى.",
    englishName: "الاسم بالإنجليزية",
    arabicName: "الاسم بالعربية",
    category: "التصنيف",
    productPrice: "السعر",
    imageUrl: "رابط الصورة",
    englishDescription: "الوصف بالإنجليزية",
    arabicDescription: "الوصف بالعربية",
    addressPlaceholder: "مثال: مدينة نصر، القاهرة",
    loginFailed: "فشل تسجيل الدخول",
    registrationFailed: "فشل إنشاء الحساب",
    mixedRestaurantCart:
  "يمكنك الطلب من مطعم واحد فقط في كل مرة. من فضلك أفرغ السلة أولاً.",
  deleting: "جاري الحذف...",
  },

};

export function LanguageProvider({ children }) {
  const formatCategory = (category) => {
    return t.categories?.[category] || category;
  };
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("foodLanguage");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "en" ? "ar" : "en";
      localStorage.setItem("foodLanguage", newLanguage);
      return newLanguage;
    });
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, formatCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}