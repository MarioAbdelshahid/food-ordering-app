import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Cart.module.css";

function Cart() {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
    } = useCart();

    const { user, authHeader } = useAuth();
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [error, setError] = useState("");

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError("");

        if (!user) {
            navigate("/login");
            return;
        }

        if (!address.trim()) {
            setError(t.enterAddress);
            return;
        }

        if (cartItems.length === 0) {
            setError(t.emptyCart);
            return;
        }

        try {
            const restaurantId =
                cartItems[0].restaurant?._id || cartItems[0].restaurant;

            const orderData = {
                restaurant: restaurantId,
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                })),
                paymentMethod,
                address,
            };

            await api.post("/orders", orderData, authHeader());

            clearCart();
            navigate("/orders");
        } catch (error) {
            setError(error.response?.data?.message || t.failedPlaceOrder);
        }
    };

    return (
        <main className={`${styles.container} ${styles.cartPage}`}>
            <h2>{t.cart}</h2>

            {cartItems.length === 0 ? (
                <p>{t.emptyCart}</p>
            ) : (
                <div className={styles.cartLayout}>
                    <div className={styles.cartItems}>
                        {cartItems.map((item) => {
                            const name = language === "en" ? item.nameEn : item.nameAr;

                            return (
                                <div className={styles.cartItem} key={item._id}>
                                    <img src={item.image} alt={name} />

                                    <div>
                                        <h3>{name}</h3>
                                        <p>
                                            {item.price} {t.price}
                                        </p>

                                        <div className={styles.quantityControls}>
                                            <button onClick={() => decreaseQuantity(item._id)}>
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item._id)}>
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <form className={styles.checkoutCard} onSubmit={handlePlaceOrder}>
                        <h3>{t.checkout}</h3>

                        {error && <p className={styles.error}>{error}</p>}

                        <label>{t.address}</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={t.addressPlaceholder}
                            required
                        />

                        <label>{t.paymentMethod}</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">{t.cash}</option>
                            <option value="online">{t.online}</option>
                        </select>

                        <div className={styles.totalRow}>
                            <strong>{t.total}</strong>
                            <strong>
                                {cartTotal} {t.price}
                            </strong>
                        </div>

                        <button type="submit">{t.placeOrder}</button>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Cart;