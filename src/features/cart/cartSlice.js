import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

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

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, { rejectWithValue, dispatch }) => {});

export const updateQty = createAsyncThunk('cart/updateQty', async ({ id, value }, { rejectWithValue }) => {});

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.get('/cart');
        if (res.status !== 200) throw new Error(res.error);
        return res.data.data;
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
            .addCase(initialCart, (state) => {
                let newCartItemCount;
                if (!state.cartList || state.cartList.length === 0) {
                    state.cartItemCount = 0;
                } else {
                    newCartItemCount = state.cartList.reduce(
                        (total, item) => total + Number(item.productId.price) * item.qty,
                        0
                    );
                    state.cartItemCount = newCartItemCount;
                }
            });
    },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
