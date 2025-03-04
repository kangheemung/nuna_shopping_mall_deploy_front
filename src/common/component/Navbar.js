import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faBox, faSearch, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/user/userSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProductList, deleteProduct, setSelectedProduct } from '../../features/product/productSlice';
import { getCartQty ,updateQty} from '../../features/cart/cartSlice';
const Navbar = ({ user }) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useSearchParams();
    const isMobile = window.navigator.userAgent.indexOf('Mobile') !== -1;
    const [showSearchBox, setShowSearchBox] = useState(false);
    const menuList = ['여성', 'Divided', '남성', '신생아/유아', '아동', 'H&M HOME', 'Sale', '지속가능성'];
    const [searchQuery, setSearchQuery] = useState({
        page: query.get('page') || 1,
        name: query.get('name') || '',
    });
    let [width, setWidth] = useState(0);
    let navigate = useNavigate();
    const updateSearchQuery = (newSearchQuery) => {
        setQuery({ ...newSearchQuery });
    };
    const { cartItemCount } = useSelector((state) => state.cart);

    console.log('cartItemCountNavber임둥여길봐 ', cartItemCount);
    const onCheckEnter = (event) => {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value.trim();
            setSearchQuery({ ...searchQuery, name: searchTerm });
            updateSearchQuery(searchQuery);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        sessionStorage.removeItem('token');
        navigate('/');

        // Dispatch the logout action from userSlice
    };
    const handleFetchCartQty = () => {
        dispatch(getCartQty());
        navigate('/cart'); 
    };
    const handlePageClick = ({ selected }) => {
        setSearchQuery({ ...searchQuery, page: selected + 1 });
    };
    useEffect(() => {
        //console.log('qqq', searchQuery);
        const params = new URLSearchParams(searchQuery);
        const query = params.toString();
        //console.log('qqqquery', query);
        // const path = query ? `?${query}` : '/';
        // navigate(path);
        dispatch(getProductList({ ...searchQuery }));
        //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    }, [searchQuery]);

    // 2. カート数量の取得
    useEffect(() => {
        dispatch(updateQty());
    }, []);

    //console.log('user:,', user);
    //console.log('level:', user?.level);

    return (
        <div>
            {showSearchBox && (
                <div className="display-space-between mobile-search-box w-100">
                    <div className="search display-space-between w-100">
                        <div>
                            <FontAwesomeIcon className="search-icon" icon={faSearch} />
                            <input type="text" placeholder="제품검색" onKeyPress={onCheckEnter} />
                        </div>
                        <button className="closebtn" onClick={() => setShowSearchBox(false)}>
                            &times;
                        </button>
                    </div>
                </div>
            )}
            <div className="side-menu" style={{ width: width }}>
                <button className="closebtn" onClick={() => setWidth(0)}>
                    &times;
                </button>

                <div className="side-menu-list" id="menu-list">
                    {menuList.map((menu, index) => (
                        <button key={index}>{menu}</button>
                    ))}
                </div>
            </div>
            {user && user.level === 'admin' && (
                <Link to="/admin/product?" className="link-area">
                    Admin page
                </Link>
            )}
            <div className="nav-header">
                <div className="burger-menu hide">
                    <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
                </div>

                <div>
                    <div className="display-flex">
                        {user ? (
                            <div onClick={handleLogout} className="nav-icon">
                                <FontAwesomeIcon icon={faUser} />
                                {!isMobile && <span style={{ cursor: 'pointer' }}>로그아웃</span>}
                            </div>
                        ) : (
                            <div onClick={() => navigate('/login')} className="nav-icon">
                                <FontAwesomeIcon icon={faUser} />
                                {!isMobile && <span style={{ cursor: 'pointer' }}>로그인</span>}
                            </div>
                        )}
                        {user && (
    <div  className="nav-icon">
        <FontAwesomeIcon icon={faShoppingBag} />
        {!isMobile ? (
            <span style={{ cursor: 'pointer' }} onClick={() => handleFetchCartQty()}>{`쇼핑백(${cartItemCount})`}</span>
        ) : (
            <span style={{ cursor: 'pointer' }} onClick={() => handleFetchCartQty()}>쇼핑백(0)</span>
        )}
    </div>
)}

                        <div onClick={() => navigate('/account/purchase')} className="nav-icon">
                            <FontAwesomeIcon icon={faBox} />
                            {!isMobile && <span style={{ cursor: 'pointer' }}>내 주문</span>}
                        </div>
                        {isMobile && (
                            <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="nav-logo" onClick={() => navigate('/')}>
                <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
            </div>
            <div className="nav-menu-area">
                <ul className="menu">
                    {menuList.map((menu, index) => (
                        <li key={index}>
                            <a href="#">{menu}</a>
                        </li>
                    ))}
                </ul>
                {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
                    <div className="search-box landing-search-box ">
                        <FontAwesomeIcon icon={faSearch} />
                        <input type="text" placeholder="제품검색" onKeyPress={onCheckEnter} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
