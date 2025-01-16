import axios from 'axios';
// 상황따라 주소 다름
const LOCAL_BACKEND = process.env.REACT_APP_BACKEND_PROXY;
// const PROD_BACKEND = process.env.REACT__PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
// console.log("proxy", BACKEND_PROXY);
const api = axios.create({
    baseURL: LOCAL_BACKEND,
    headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});
/**
 * console.log all requests and responses
 */
api.interceptors.response.use(
    (response) => {
        if (response.data && response.data.status === 'success') {
            const { user, ...responseDataWithUser } = response.data;
            console.log('Response Data:', { user });
        }
        return response;
    },
    function (error) {
        error = error.response.data;
        console.log('RESPONSE ERROR', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        error = error.response.data;
        console.log('RESPONSE ERROR', error);
        return Promise.reject(error);
    }
);

export default api;
