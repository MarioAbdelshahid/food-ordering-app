import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
    const { authHeader } = useAuth();
    const { language, t } = useLanguage();

    const [deletingProductId, setDeletingProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("orders");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [productForm, setProductForm] = useState({
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        category: "",
        price: "",
        image: "",
        available: true,
    });

    const fetchAdminData = async () => {
        try {
            const [productsResponse, ordersResponse] = await Promise.all([
                api.get("/products/admin/my-products", authHeader()),
                api.get("/orders", authHeader()),
            ]);

            setProducts(productsResponse.data);
            setOrders(ordersResponse.data);
        } catch (error) {
            console.error(error.response?.data || error);
            setMessage(error.response?.data?.message || t.failedLoadAdminData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProductForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const productData = {
                ...productForm,
                price: Number(productForm.price),
            };

            const { data } = await api.post("/products", productData, authHeader());

            setProducts((prev) => [data, ...prev]);

            setProductForm({
                nameEn: "",
                nameAr: "",
                descriptionEn: "",
                descriptionAr: "",
                category: "",
                price: "",
                image: "",
                available: true,
            });

            setMessage(t.productAdded);
        } catch (error) {
            setMessage(error.response?.data?.message || t.failedAddProduct);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (deletingProductId) return;

        setMessage("");
        setDeletingProductId(productId);

        try {
            await api.delete(`/products/${productId}`, authHeader());

            setProducts((prev) =>
                prev.filter((product) => product._id !== productId)
            );

            setMessage(t.productDeleted);
        } catch (error) {
            setMessage(error.response?.data?.message || t.failedDeleteProduct);
        } finally {
            setDeletingProductId(null);
        }
    };

    const handleToggleAvailability = async (product) => {
        setMessage("");

        try {
            const { data } = await api.put(
                `/products/${product._id}`,
                { available: !product.available },
                authHeader()
            );

            setProducts((prev) =>
                prev.map((item) => (item._id === product._id ? data : item))
            );

            setMessage(t.productUpdated);
        } catch (error) {
            setMessage(error.response?.data?.message || t.failedUpdateProduct);
        }
    };

    const handleUpdateOrderStatus = async (orderId, orderStatus) => {
        setMessage("");

        try {
            const { data } = await api.patch(
                `/orders/${orderId}/status`,
                { orderStatus },
                authHeader()
            );

            setOrders((prev) =>
                prev.map((order) => (order._id === orderId ? data : order))
            );

            setMessage(t.orderUpdated);
        } catch (error) {
            setMessage(error.response?.data?.message || t.failedUpdateOrder);
        }
    };

    const formatOrderStatus = (status) => {
        return t.orderStatuses?.[status] || status;
    };

    const formatPaymentStatus = (status) => {
        return t.paymentStatuses?.[status] || status;
    };

    const formatPaymentMethod = (method) => {
        if (method === "cash") return t.cash;
        if (method === "online") return t.online;

        return method;
    };

    if (loading) {
        return (
            <main className={styles.adminPage}>
                <p>{t.loading}</p>
            </main>
        );
    }

    return (
        <main className={styles.adminPage}>
            <div className={styles.adminHeader}>
                <div>
                    <h2>{t.adminDashboard}</h2>
                    <p>{t.adminSubtitle}</p>
                </div>

                <div className={styles.adminTabs}>
                    <button
                        className={activeTab === "orders" ? styles.activeTab : ""}
                        onClick={() => setActiveTab("orders")}
                    >
                        {t.manageOrders}
                    </button>

                    <button
                        className={activeTab === "products" ? styles.activeTab : ""}
                        onClick={() => setActiveTab("products")}
                    >
                        {t.manageProducts}
                    </button>
                </div>
            </div>

            {message && <p className={styles.adminMessage}>{message}</p>}

            {activeTab === "orders" && (
                <section className={styles.adminSection}>
                    <h3>{t.manageOrders}</h3>

                    {orders.length === 0 ? (
                        <p>{t.noOrders}</p>
                    ) : (
                        <div className={styles.adminOrders}>
                            {orders.map((order) => {
                                const isFinalStatus =
                                    order.orderStatus === "delivered" || order.orderStatus === "cancelled";

                                return (
                                    <div className={styles.adminOrderCard} key={order._id}>
                                        <div className={styles.adminOrderTop}>
                                            <div>
                                                <h4>Order #{order._id.slice(-6)}</h4>
                                                <p>
                                                    {order.user?.username} — {order.user?.email}
                                                </p>
                                                <p>{new Date(order.createdAt).toLocaleString()}</p>
                                            </div>

                                            <strong>
                                                {order.totalPrice} {t.price}
                                            </strong>
                                        </div>

                                        <div className={styles.adminOrderInfo}>
                                            <span>
                                                {t.paymentMethod}:{" "}
                                                <strong>{formatPaymentMethod(order.paymentMethod)}</strong>
                                            </span>

                                            <span>
                                                {t.paymentStatus}:{" "}
                                                <strong>{formatPaymentStatus(order.paymentStatus)}</strong>
                                            </span>

                                            <span>
                                                <strong>{formatOrderStatus(order.orderStatus)}</strong>
                                            </span>
                                        </div>

                                        <div className={styles.adminOrderItems}>
                                            {order.items.map((item) => {
                                                const name = language === "en" ? item.nameEn : item.nameAr;

                                                return (
                                                    <span key={item.product}>
                                                        {name} × {item.quantity}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <p className={styles.addressText}>{order.address}</p>

                                        <label>{t.updateStatus}</label>
                                        <select
                                            value={order.orderStatus}
                                            disabled={isFinalStatus}
                                            onChange={(e) =>
                                                handleUpdateOrderStatus(order._id, e.target.value)
                                            }
                                        >
                                            <option value="pending">{formatOrderStatus("pending")}</option>
                                            <option value="preparing">{formatOrderStatus("preparing")}</option>
                                            <option value="out for delivery">
                                                {formatOrderStatus("out for delivery")}
                                            </option>
                                            <option value="delivered">
                                                {formatOrderStatus("delivered")}
                                            </option>
                                            <option value="cancelled">
                                                {formatOrderStatus("cancelled")}
                                            </option>
                                        </select>
                                        {isFinalStatus && (
                                            <p className={styles.finalStatusNote}>{t.finalStatusNote}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {activeTab === "products" && (
                <section className={styles.adminSection}>
                    <h3>{t.addProduct}</h3>

                    <form className={styles.productForm} onSubmit={handleCreateProduct}>
                        <div className={styles.formGrid}>
                            <input
                                type="text"
                                name="nameEn"
                                placeholder={t.englishName}
                                value={productForm.nameEn}
                                onChange={handleProductChange}
                                required
                            />

                            <input
                                type="text"
                                name="nameAr"
                                placeholder={t.arabicName}
                                value={productForm.nameAr}
                                onChange={handleProductChange}
                                required
                            />

                            <input
                                type="text"
                                name="category"
                                placeholder={t.category}
                                value={productForm.category}
                                onChange={handleProductChange}
                                required
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder={t.productPrice}
                                value={productForm.price}
                                onChange={handleProductChange}
                                required
                            />

                            <input
                                type="text"
                                name="image"
                                placeholder={t.imageUrl}
                                value={productForm.image}
                                onChange={handleProductChange}
                                required
                            />
                        </div>

                        <textarea
                            name="descriptionEn"
                            placeholder={t.englishDescription}
                            value={productForm.descriptionEn}
                            onChange={handleProductChange}
                            required
                        />

                        <textarea
                            name="descriptionAr"
                            placeholder={t.arabicDescription}
                            value={productForm.descriptionAr}
                            onChange={handleProductChange}
                            required
                        />

                        <label className={styles.checkboxRow}>
                            <input
                                type="checkbox"
                                name="available"
                                checked={productForm.available}
                                onChange={handleProductChange}
                            />
                            {t.available}
                        </label>

                        <button type="submit">{t.addProduct}</button>
                    </form>

                    <h3>{t.products}</h3>

                    <div className={styles.adminProductsGrid}>
                        {products.map((product) => {
                            const name = language === "en" ? product.nameEn : product.nameAr;

                            return (
                                <div className={styles.adminProductCard} key={product._id}>
                                    <img src={product.image} alt={name} />

                                    <div className={styles.adminProductContent}>
                                        <h4>{name}</h4>
                                        <p>{product.category}</p>
                                        <strong>
                                            {product.price} {t.price}
                                        </strong>

                                        <div className={styles.adminProductActions}>
                                            <button type="button" onClick={() => handleToggleAvailability(product)}>
                                                {product.available
                                                    ? t.markUnavailable
                                                    : t.markAvailable}
                                            </button>

                                            <button
                                                type="button"
                                                className={styles.deleteAdminBtn}
                                                disabled={deletingProductId === product._id}
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                {deletingProductId === product._id ? t.deleting : t.delete}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}

export default AdminDashboard;