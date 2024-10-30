import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';
import { initialCart } from '../cart/cartSlice';

export const loginWithEmail = createAsyncThunk(
    'user/loginWithEmail',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            // 1.localStorage 웹사이트 꺼져도 유지 2.SessionStorage 새로고침 하면 유지 안됨
            sessionStorage.setItem('token', res.data.token);
            // navigate('/');
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        rejectWithValue(error.error);
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
            state.user = null;
            state.loginError = null;
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
                state.loginError = action.payload || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요';
            })
            // .addCase(loginWithToken.pending)(state,action)=>{}
            .addCase(loginWithToken.fulfilled, (state, action) => {
                state.user = action.payload.user; //유저값 세팅
            });
        //             .addCase(loginWithToken.rejected,(state,action) => {
        // )
    },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
