import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Orders.module.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authHeader } = useAuth();
    const { language, t } = useLanguage();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get("/orders/my-orders", authHeader());
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatOrderStatus = (status) => {
        return t.orderStatuses?.[status] || status;
    };

    const formatPaymentStatus = (status) => {
        return t.paymentStatuses?.[status] || status;
    };

    return (
        <main className={`${styles.container} ${styles.ordersPage}`}>
            <h2>{t.orders}</h2>

            {loading ? (
                <p>{t.loading}</p>
            ) : orders.length === 0 ? (
                <p>{t.noOrders}</p>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => {
                        const restaurantName =
                            language === "en"
                                ? order.restaurant?.nameEn
                                : order.restaurant?.nameAr;

                        return (
                            <div className={styles.orderCard} key={order._id}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <h3>Order #{order._id.slice(-6)}</h3>
                                        <p>{new Date(order.createdAt).toLocaleString()}</p>

                                        {restaurantName && (
                                            <p className={styles.restaurantName}>
                                                {t.restaurant}: {restaurantName}
                                            </p>
                                        )}
                                    </div>

                                    <strong>
                                        {order.totalPrice} {t.price}
                                    </strong>
                                </div>

                                <div className={styles.statusRow}>
                                    <span>
                                        {t.orderStatus}:{" "}
                                        <strong>{formatOrderStatus(order.orderStatus)}</strong>
                                    </span>

                                    <span>
                                        {t.paymentStatus}:{" "}
                                        <strong>{formatPaymentStatus(order.paymentStatus)}</strong>
                                    </span>
                                </div>

                                <div className={styles.orderItems}>
                                    {order.items.map((item) => {
                                        const name = language === "en" ? item.nameEn : item.nameAr;

                                        return (
                                            <div className={styles.miniItem} key={item.product}>
                                                <img src={item.image} alt={name} />
                                                <span>
                                                    {name} × {item.quantity}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p className={styles.addressText}>{order.address}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default MyOrders;