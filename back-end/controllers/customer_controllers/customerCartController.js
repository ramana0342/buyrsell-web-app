import * as customerCartModel from "../../models/customer_models/customerCartModel.js";


// Get Cart
export const getCustomerCart = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        const cartItems = await customerCartModel.getCart(customerId);

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cartItems
        });

    } catch (error) {

        console.error("Get Customer Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};


// Add Product To Cart
export const addProductToCart = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        const {
            productId,
            quantity
        } = req.body;


        // Validate productId
        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }


        // Validate quantity
        const requestedQuantity = quantity || 1;

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }


        const cartItem = await customerCartModel.addToCart(
            customerId,
            productId,
            requestedQuantity
        );


        return res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
            data: cartItem
        });

    } catch (error) {

        console.error("Add Product To Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart"
        });
    }
};


// Update Cart Quantity
export const updateCustomerCartQuantity = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        const {
            productId
        } = req.params;

        const {
            quantity
        } = req.body;


        // Validate quantity
        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }


        const updatedCartItem =
            await customerCartModel.updateCartQuantity(
                customerId,
                productId,
                quantity
            );


        if (!updatedCartItem) {

            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            data: updatedCartItem
        });

    } catch (error) {

        console.error(
            "Update Customer Cart Quantity Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity"
        });
    }
};


// Remove Product From Cart
export const removeProductFromCart = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        const {
            productId
        } = req.params;


        const removedItem =
            await customerCartModel.removeProductFromCart(
                customerId,
                productId
            );


        if (!removedItem) {

            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            data: removedItem
        });

    } catch (error) {

        console.error(
            "Remove Product From Cart Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart"
        });
    }
};


// Clear Cart
export const clearCustomerCart = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        await customerCartModel.clearCart(customerId);


        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {

        console.error(
            "Clear Customer Cart Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};