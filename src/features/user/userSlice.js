import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';
import { initialCart } from '../cart/cartSlice';

export const loginWithEmail = createAsyncThunk(
    'user/loginWithEmail',
    async ({ email, password, navigate }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            // 1.localStorage 웹사이트 꺼져도 유지 2.SessionStorage 새로고침 하면 유지 안됨
            //token_save
            dispatch(
                showToastMessage({
                    message: 'Your login was successful!',
                    status: 'success',
                })
            );
            sessionStorage.setItem('token', res.data.token);
            return res.data;
        } catch (error) {
            console.error('Login with email failed:', error);
            dispatch(showToastMessage({ message: 'Login failed. Redirecting to login page.', status: 'error' }));

            dispatch(userSlice.actions.logout());
            navigate('/login');
            return rejectWithValue(error.error);
        }
    }
);

export const loginWithGoogle = createAsyncThunk('/user/loginWithGoogle', async (token, { rejectWithValue }) => {
    try {
        // Add logic to handle Google login here
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

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
        } catch (error) {
            //실페 메세지
            //2. 에러값 저장
            dispatch(showToastMessage({ message: '회원가입을  실패했습니다.!', status: 'error' }));
            return rejectWithValue(error.error);
        }
    }
);
//토근 가지고 오기 누구의 토큰인지 확인
export const loginWithToken = createAsyncThunk('/user/loginWithToken', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/user/me');
        return res.data;
    } catch (error) {
        return rejectWithValue(error.error);
    }
});
//logout
export const logout = (dispatch, navigate) => {
    sessionStorage.removeItem('token');
    dispatch(showToastMessage({ message: 'logout_sucess!', status: 'success' }));
    dispatch(userSlice.actions.logout());
    navigate('/login');
};
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        loginError: null,
        registrationError: null,
        success: false,
        email: '', // Add email field to store in Redux state
        password: '', // Add password field to store in Redux state
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload; // Set the user state based on the payload
        },
        clearErrors: (state) => {
            state.user = {};
            state.registrationError = null;
            state.email = ''; // Reset email field to empty string
            state.password = '';
        },
        logout: (state) => {
            state.user = {};
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
                if (action.payload && action.payload.user) {
                    state.user = action.payload.user;
                    state.loginError = null;
                }
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
                state.user = action.payload;
                state.loginError = null;
            })
            .addCase(loginWithEmail.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action.payload;
            })
            .addCase(loginWithToken.pending, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(loginWithToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(loginWithToken.rejected, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            });
    },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
