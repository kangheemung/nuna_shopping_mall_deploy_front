import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';

export const loginWithEmail = createAsyncThunk(
    'user/loginWithEmail',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            // 1.localStorage 웹사이트 꺼져도 유지 2.SessionStorage 새로고침 하면 유지 안됨
            //token_save
            if (res.data && res.data.token) {
                sessionStorage.setItem('token', res.data.token);
                return res.data;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Login with email failed:', error);
            return rejectWithValue(error.error);
        }
    }
);

export const loginWithGoogle = createAsyncThunk(
    '/user/loginWithGoogle',
 async (token, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/google', { token });
        sessionStorage.setItem('token', res.data.token);
        return res.data.user;
        // Add logic to handle Google login here
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

//회원가입
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ email, name, password }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post('/user', { email, name, password });
            //성공
            //1.토스트 메세지
            //2.리다이렉스 로그인 페이지
            if (res.data && res.data.data) {
                dispatch(showToastMessage({ message: 'register success!', status: 'success' }));
                return res.data.data;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            //실페 메세지
            //2. 에러값 저장
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message === 'Duplicate email and name'
            ) {
                // Handle specific error message for duplicate email and name
                dispatch(showToastMessage({ message: 'Email and name combination already exists', status: 'error' }));
            } else {
                // For other status code 400 errors
                dispatch(showToastMessage({ message: 'Failed to register user', status: 'error' }));
            }
            return rejectWithValue(error.message);
        }
    }
);
//토근 가지고 오기 누구의 토큰인지 확인
export const loginWithToken = createAsyncThunk('/user/loginWithToken', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/user/me');
        //console.log(res.data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const getUserData = createAsyncThunk('products/getUserData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user/me');

        if (response.status !== 200) {
            throw new Error(response.error);
        }

        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

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
        logout: (state) => {
            // Add logic here to handle logout functionality and reset user state
            state.user = null;
            sessionStorage.removeItem('token');
        },
    },

    //밖에서 호출 한거여
    extraReducers: (builder) => {
        //logingspaner
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
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
            })

            .addCase(loginWithToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                //로딩 스핀어 끄기
                state.user = action.payload;
                state.loginError = null;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action.payload;
            });
    },
});

export const { clearErrors, logout } = userSlice.actions;
export default userSlice.reducer;
