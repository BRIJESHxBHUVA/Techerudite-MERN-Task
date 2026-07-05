import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../service/api";

export const getCategories = createAsyncThunk("category/getCategories", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/categories");
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

const initialState = {
    categories: [],
    error: null,
    loading: false,
}

const categorySlice= createSlice({
    name: 'category',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        });

        builder.addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});


export const categoryReducer = categorySlice.reducer;