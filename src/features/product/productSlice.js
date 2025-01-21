import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// 비동기 액션 생성
export const getProductList = createAsyncThunk('products/getProductList', async (query, { rejectWithValue }) => {
    try {
        const res = await api.get('/product');
        if (res.status !== 200) throw new Error(res.error);
        console.log('productslice_data', res);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.error);
    }
});

export const getProductDetail = createAsyncThunk('products/getProductDetail', async (id, { rejectWithValue }) => {});

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/product', formData);
            if (response.status !== 200) throw new Error(response.error);
            dispatch(showToastMessage({ message: 'Product creation complete', status: 'success' }));
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.error);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { dispatch, rejectWithValue }) => {}
);

export const editProduct = createAsyncThunk(
    'products/editProduct',
    async ({ id, ...formData }, { dispatch, rejectWithValue }) => {}
);

// 슬라이스 생성
const productSlice = createSlice({
    name: 'products',
    initialState: {
        productList: [],
        selectedProduct: null,
        loading: false,
        error: '',
        totalPageNum: 1,
        success: false,
    },
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setFilteredList: (state, action) => {
            state.filteredList = action.payload;
        },
        clearError: (state) => {
            state.error = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.success = true;
                //상품생성 성공 했다? 다이얼로그를 닫고 ,
                //실패? 실패 매세지를 다이어 로그에 보여주고,
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(getProductList.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getProductList.fulfilled, (state, action) => {
                state.loading = false;
                state.productList = action.payload;
                state.error = '';
            })
            .addCase(getProductList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;
