import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './style/login.style.css';
import { loginWithEmail, loginWithGoogle } from '../../features/user/userSlice';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginError } = useSelector((state) => state.user);

    const handleLoginWithEmail = (event) => {
        event.preventDefault();
        dispatch(loginWithEmail({ email, password }));
    };

    const handleGoogleLogin = async (googleData) => {
        //구글 로그인 하기
        dispatch(loginWithGoogle(googleData.credential));
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);
    return (
        <>
            <Container className="login-area">
                {loginError && (
                    <div className="error-message">
                        <Alert variant="danger">{loginError}</Alert>
                    </div>
                )}
                <Form className="login-form" onSubmit={handleLoginWithEmail}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </Form.Group>
                    <div className="display-space-between login-button-area">
                        <Button variant="danger" type="submit">
                            Login
                        </Button>
                        <div>
                            Don't have an account yet?<Link to="/register">회원가입 하기</Link>{' '}
                        </div>
                    </div>
                    <div className="text-align-center mt-2">
                        <p>- Log in with an external account -</p>

                        <div className="display-center">
                            {/*1.구글 로그인 버튼 가져오기 ボタン持ってくるgoogle.login
                                2.Oauth로그인을 위해서 google api ログインのためGoogleAPI持ってぐっる사이트에 가입하고 클라이언트 키 시크릿 키
                                3.로그인 기능 만들기 ログイン機能作る
                                4.백엔드에서 로그인 バックアンドでログイントークン情報あげる
                                a. 이미 로그인을 한적이 있는 유저 =>로그인 시키고 토큰값 주면 ok
                                b. 처음 로그인시도 유저인 경우
                                =>유저 정보 새로 생성 => 토큰 값을 넘기면 끝
                                */}
                            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </GoogleOAuthProvider>
                        </div>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default Login;
