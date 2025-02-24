import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';
import { DELETE_CART_ITEM_FAIL, DELETE_CART_ITEM_REQUEST } from '../../constants/cart.constants';

const initialState = {
    loading: false,
    error: '',
    cartList: [],
    selectedItem: {},
    cartItemCount: 0,
    totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk('cart/addToCart', async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.post('/cart', { productId: id, size, qty: 1 });
        if (res.status !== 200) throw new Error(res.error);
        dispatch(
            showToastMessage({
                message: 'add_to_cart_success',
                status: 'success',
            })
        );
        console.log('カーとデータを見ましょう', res.data);
        return res.data.cartItemQty; //todo!
    } catch (e) {
        dispatch(showToastMessage({ message: e.error, status: 'error' }));
        return rejectWithValue(e.error);
    }
});

export const getCartList = createAsyncThunk('cart/getCartList', async (_, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.get('/cart');
        if (res.status !== 200) throw new Error(res.error);
        return res.data.data;
    } catch (e) {
        return rejectWithValue(e.error);
    }
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.delete(`/cart/${id}`);
        if (res.status !== 200) {
            // If the response status is not 200, throw an error
            throw new Error(res.error);
        }
    } catch (error) {
        return rejectWithValue(error.error);
    }
});

export const updateQty = createAsyncThunk('cart/updateQty', async ({ id, value }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/cart/${id}`, { qty: value });
        if (res.status !== 200) throw new Error(res.error);
        return res.data.data;
    } catch (e) {
        return rejectWithValue(e.error);
    }
});

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.get('/cart/qty');
        if (res.status !== 200) throw new Error(res.error);
        console.log('Sliceでcart', res.data.qty);
        return res.data.qty;
    } catch (e) {
        return rejectWithValue(e.error);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        initialCart(state, action) {
            state.cartItemCount = getCartList;
        },
        // You can still add reducers here for non-async actions if necessary
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.cartItemCount = action.payload;
                //ショッピングバックに入ってる数
                //Todostate.cartList = payload.cartList;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCartList.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCartList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.cartList = action.payload;
                state.totalPrice = action.payload.reduce((total, item) => total + item.productId.price * item.qty, 0); // 選択した製品に関する値段の総価格。
            })
            .addCase(getCartList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCartItem.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.payloadCart = action.payload;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCartQty.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCartQty.fulfilled, (state, action) => {
                console.log('API Response여기는getCartQty :', action.payload);
                state.loading = false;
                state.error = '';
                state.cartItemCount = action.payload; // Set cartItemCount to the value returned by getCartQty
            })
            .addCase(getCartQty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
