import {
    addToWishlist as addWishlist,
    removeFromWishlist as removeWishlist,
    getCustomerWishlist as getWishlist,
    isProductWishlisted
} from "../../models/customer_models/customerWishlistModel.js";



export const addToWishlist = async (req, res) => {

    try {

        const customerId = req.customer.customerId;
        const { productId } = req.params;


        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });

        }


        const existingWishlist =
            await isProductWishlisted(
                customerId,
                productId
            );


        if (existingWishlist) {

            return res.status(409).json({
                success: false,
                message: "Product is already in your wishlist."
            });

        }


        const wishlist =
            await addWishlist(
                customerId,
                productId
            );


        return res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully.",
            wishlist
        });

    } catch (error) {

        console.error(
            "Add Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist."
        });

    }

};



export const removeFromWishlist = async (req, res) => {

    try {

        const customerId = req.customer.customerId;
        const { productId } = req.params;


        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });

        }


        const wishlist =
            await removeWishlist(
                customerId,
                productId
            );


        if (!wishlist) {

            return res.status(404).json({
                success: false,
                message: "Product is not in your wishlist."
            });

        }


        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully.",
            wishlist
        });

    } catch (error) {

        console.error(
            "Remove Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist."
        });

    }

};



export const getCustomerWishlist = async (req, res) => {

    try {

        const customerId = req.customer.customerId;


        const wishlist =
            await getWishlist(
                customerId
            );


        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully.",
            count: wishlist.length,
            wishlist
        });

    } catch (error) {

        console.error(
            "Get Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist."
        });

    }

};



export const checkWishlist = async (req, res) => {

    try {

        const customerId = req.customer.customerId;
        const { productId } = req.params;


        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });

        }


        const isWishlisted =
            await isProductWishlisted(
                customerId,
                productId
            );


        return res.status(200).json({
            success: true,
            isWishlisted
        });

    } catch (error) {

        console.error(
            "Check Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to check wishlist status."
        });

    }

};