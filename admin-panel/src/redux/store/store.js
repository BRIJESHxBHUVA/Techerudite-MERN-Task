import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "../slice/productSlice";
import { categoryReducer } from "../slice/categorySlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer,
    }
})