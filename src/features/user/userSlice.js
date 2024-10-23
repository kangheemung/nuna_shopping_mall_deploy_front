import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';
import { initialCart } from '../cart/cartSlice';

export const loginWithEmail = createAsyncThunk(
    'user/loginWithEmail',
    async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk('user/loginWithGoogle', async (token, { rejectWithValue }) => {});

export const logout = () => (dispatch) => {};
//회원가입
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post('/user', { email, name, password });
            dispatch(
                showToastMessage({
                    message: '회원가입을 성공했습니다!',
                    status: 'success',
                })
            );
            //성공
            //1.토스트 메세지
            //2.리다이렉스 로그인 페이지
            navigate('/login');
            return res.data.data;
        } catch (e) {
            //실페 메세지
            //2. 에러값 저장
            dispatch(showToastMessage({ message: '회원가입을  실패했습니다.!', status: 'error' }));
            return rejectWithValue(e.error);
        }
    }
);

export const loginWithToken = createAsyncThunk('user/loginWithToken', async (_, { rejectWithValue }) => {});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        loginError: null,
        registrationError: null,
        success: false,
    },
    reducers: {
        clearErrors: (state) => {
            state.loginError = null;
            state.registrationError = null;
        },
    },
    //밖에서 호출 한거여
    extraReducers: (builder) => {
        //logingspaner
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registrationError = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registrationError = action.payload;
            });
    },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
