import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <Link
        to={user?.role === "admin" ? "/admin" : user ? "/" : "/login"}
        className={styles.logo}
      >
        {t.brand}
      </Link>

      <nav className={styles.navLinks}>
        {user?.role === "user" && (
          <>
            <NavLink to="/" className={getLinkClass}>
              {t.restaurants}
            </NavLink>

            <NavLink to="/cart" className={getLinkClass}>
              {t.cart} ({cartCount})
            </NavLink>

            <NavLink to="/orders" className={getLinkClass}>
              {t.orders}
            </NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin" className={getLinkClass}>
            {t.admin}
          </NavLink>
        )}

        <button className={styles.langBtn} onClick={toggleLanguage}>
          {language === "en" ? "عربي" : "EN"}
        </button>

        {user ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            {t.logout}
          </button>
        ) : (
          <>
            <NavLink to="/login" className={getLinkClass}>
              {t.login}
            </NavLink>

            <NavLink to="/register" className={getLinkClass}>
              {t.register}
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;