import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./Home.scss";

import HeroBanner from "./HeroBanner/HeroBanner";
import CategorySection from "./CategorySection/CategorySection";
import FeaturedProducts from "./FeaturedProducts";

import { getAllProducts, getHomepageCategoryProducts } from "../../../network/publicApiService/productService";
import CategoryProducts from "./CategoryProducts";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [categoryGroups, setCategoryGroups] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {

        try {

            const response = await getAllProducts({ featured: true, limit: 5 });

            if (response?.status?.success) {

                setProducts(response.response || []);

            }

        }

        catch (error) {

            console.log(error);
            setLoadError(true);

        }

        finally {

            setLoading(false);

        }

    };

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await getHomepageCategoryProducts();
            if (response?.status?.success) setCategoryGroups(response.response || []);
            else setCategoriesError(true);
        } catch (error) {
            console.error("Homepage category products failed to load", error);
            setCategoriesError(true);
        } finally { setCategoriesLoading(false); }
    };

    return (

        <>
            <Header />

            <main className="home-page">

                <HeroBanner products={products} categoryProducts={categoryGroups} />

                <CategorySection />

                <FeaturedProducts
                    loading={loading}
                    error={loadError}
                    onRetry={() => { setLoading(true); setLoadError(false); fetchProducts(); }}
                    products={products}
                />

                <CategoryProducts
                    categories={categoryGroups}
                    loading={categoriesLoading}
                    error={categoriesError}
                    onRetry={() => { setCategoriesError(false); fetchCategories(); }}
                />

            </main>

        </>

    );

};

export default Home;
