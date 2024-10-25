import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';

import { initialCart } from '../cart/cartSlice';

export const loginWithEmail = createAsyncThunk(
    'user/loginWithEmail',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            // dispatch(
            //     //성공
            //     showToastMessage({
            //         message: 'Your membership login was successful!',
            //         status: 'success',
            //     })
            // );
            // navigate('/');
            return res.data;
        } catch (err) {
            // dispatch(showToastMessage({ message: 'Login failed.!', status: 'error' }));
            return rejectWithValue(err.error);
        }
    }
);

export const loginWithGoogle = createAsyncThunk('user/loginWithGoogle', async (token, { rejectWithValue }) => {
    try {
        // Add logic to handle Google login here
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const logout = () => (dispatch) => {};
//회원가입
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post('/user', { email, name, password });
            dispatch(
                showToastMessage({
                    message: 'Your membership registration was successful!',
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
            })
            .addCase(loginWithEmail.pending, (state) => {
                state.loading = true;
                //로딩 스핀어 보여주기
            })
            .addCase(loginWithEmail.fulfilled, (state, action) => {
                state.loading = false;
                //로딩 스핀어 끄기
                state.user = action.payload.user;
                state.loginError = null;
            })
            .addCase(loginWithEmail.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action.payload;
            });
    },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
