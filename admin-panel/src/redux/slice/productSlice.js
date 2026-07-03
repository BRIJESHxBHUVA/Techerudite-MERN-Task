import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../service/api"

export const addProduct = createAsyncThunk('product/addProduct', async(data, { rejectWithValue }) => {
    try {
        const res = await api.post("/product", data);
        console.log("api called", res.data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const initialState = {
    products: [],
    error: null,
    loading: false,
    totoalProducts: 0,
    totalPages: 0,
    currentPage: 1,
}


const productSlice = createSlice({
    name: "product",
    initialState,
    reducer: {},
    extraReducers: (builder) => {
        builder.addCase(addProduct.pending, (state, action)=> {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products;
        });

        builder.addCase(addProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    }
});

export const productReducer = productSlice.reducer;