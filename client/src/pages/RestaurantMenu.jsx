import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Home.module.css";

function RestaurantMenu() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const { language, t, formatCategory } = useLanguage();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restaurantResponse, productsResponse] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/products?restaurant=${id}`),
                ]);

                setRestaurant(restaurantResponse.data);
                setProducts(productsResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((product) => product.category === selectedCategory);

    if (loading) {
        return (
            <main className={styles.container}>
                <p>{t.loading}</p>
            </main>
        );
    }

    if (!restaurant) {
        return (
            <main className={styles.container}>
                <p>{t.restaurantNotFound}</p>
            </main>
        );
    }

    const restaurantName =
        language === "en" ? restaurant.nameEn : restaurant.nameAr;

    const restaurantDescription =
        language === "en" ? restaurant.descriptionEn : restaurant.descriptionAr;

    return (
        <main>
            <section className={styles.hero}>
                <div>
                    <h1>{restaurantName}</h1>
                    <p>{restaurantDescription}</p>
                </div>
            </section>

            <section className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2>{t.menu}</h2>
                </div>

                <div className={styles.categoryList}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={
                                selectedCategory === category ? styles.activeCategory : ""
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {formatCategory(category)}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default RestaurantMenu;