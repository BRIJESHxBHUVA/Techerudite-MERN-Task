import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../service/api";

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/product", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ page = 1, limit = 10, search, categories }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      search && queryParams.append("search", search);
      categories && queryParams.append("categories", categories.join(","));

      const res = await api.get(`/products?${queryParams.toString()}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/product/${productId}`);
      return { ...res.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  products: [],
  error: null,
  loading: false,
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducer: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProduct.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });



    builder.addCase(getProducts.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.products = action.payload.products;
      state.totalProducts = action.payload.totalProducts;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    });

    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });



    builder.addCase(deleteProduct.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    //   state.products = state.products.filter(
    //     (product) => product._id !== action.payload.productId,
    //   );
    //   state.totalProducts = Math.max(state.totalProducts - 1, 0);
    });

    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = null;
      state.error = action.payload.message;
    });
  },
});

export const productReducer = productSlice.reducer;
