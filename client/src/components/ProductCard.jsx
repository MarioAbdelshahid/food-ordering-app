import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  const [showCartError, setShowCartError] = useState(false);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { language, t, formatCategory } = useLanguage();
  const navigate = useNavigate();

  const name = language === "en" ? product.nameEn : product.nameAr;
  const description =
    language === "en" ? product.descriptionEn : product.descriptionAr;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
      return;
    }

    const addedSuccessfully = addToCart(product);

    if (!addedSuccessfully) {
      setShowCartError(true);
      return;
    }

    setShowCartError(false);
  };

  return (
    <div className={styles.productCard}>
      <img src={product.image} alt={name} />

      <div className={styles.productContent}>
        <span className={styles.category}>
          {formatCategory(product.category)}
        </span>

        <h3>{name}</h3>
        <p>{description}</p>

        <div className={styles.productFooter}>
          <strong>
            {product.price} {t.price}
          </strong>

          <button onClick={handleAddToCart}>{t.addToCart}</button>
        </div>

        {showCartError && (
          <p className={styles.cartError}>{t.mixedRestaurantCart}</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;