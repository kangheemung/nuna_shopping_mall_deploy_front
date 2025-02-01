import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// 비동기 액션 생성
export const getProductList = createAsyncThunk('products/getProductList', async (query, { rejectWithValue }) => {
    try {
        if (!query || Object.keys(query).length === 0) {
            throw new Error('Query parameters are undefined or empty');
        }
        // Check and ensure non-empty 'name' parameter before constructing the API request
        const response = await api.get('/product', { params: { ...query } });
        console.log('Query object:', query);
        console.log('Response Data rrr여기를 보아라', response.data);
        if (response.status !== 200) {
            throw new Error(response.error); // 例: response.data.message は実際のエラーメッセージに置き換える
        }

        return response.data; // Assuming the total page count is available in res.totalPages
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
            console.log('PRoductrrrr', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { dispatch, rejectWithValue }) => {}
);

export const editProduct = createAsyncThunk(
    'products/editProduct',
    async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error('Product ID is undefined');
            }

            const response = await api.put(`/product/${id}`, formData);
            console.log('Edited Data:', response.data);
            if (response.status !== 200) throw new Error(response.error);
            console.log('編集データ', response.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.error);
        }
    }
);

// 슬라이스 생성
const productSlice = createSlice({
    name: 'products',
    initialState: {
        productList: [],
        selectedProduct: null, //選択したデータ
        loading: false,
        error: '',
        totalPageNum: 5,
        success: false,
    },
    reducers: {
        //saveしたデータ情報＝＞NewItemDialog確認
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
                state.productList = action.payload.data; // Make sure the payload contains the array of products
                state.error = '';
                state.totalPageNum = action.payload.totalPageNum;
                //state.totalPageNum = action.payload.totalPageNum || 1;
            })
            .addCase(getProductList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(editProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.success = true;
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;
