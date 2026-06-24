import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Home.module.css";

function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language, t, formatCategory } = useLanguage();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await api.get("/restaurants");
                setRestaurants(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <main>
            <section className={styles.hero}>
                <div>
                    <h1>{t.welcome}</h1>
                    <p>{t.subtitle}</p>
                </div>
            </section>

            <section className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2>{t.restaurants}</h2>
                </div>

                {loading ? (
                    <p>{t.loading}</p>
                ) : (
                    <div className={styles.grid}>
                        {restaurants.map((restaurant) => {
                            const name =
                                language === "en" ? restaurant.nameEn : restaurant.nameAr;

                            const description =
                                language === "en"
                                    ? restaurant.descriptionEn
                                    : restaurant.descriptionAr;

                            return (
                                <Link
                                    to={`/restaurants/${restaurant._id}`}
                                    className={styles.restaurantCard}
                                    key={restaurant._id}
                                >
                                    <img src={restaurant.image} alt={name} />

                                    <div className={styles.cardContent}>
                                        <span className={styles.category}>
                                            {formatCategory(restaurant.cuisine)}
                                        </span>
                                        <h3>{name}</h3>
                                        <p>{description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;