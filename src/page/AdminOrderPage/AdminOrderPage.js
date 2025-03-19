import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderDetailDialog from './component/OrderDetailDialog';
import OrderTable from './component/OrderTable';
import SearchBox from '../../common/component/SearchBox';
import { getOrderList, setSelectedOrder } from '../../features/order/orderSlice';
import './style/adminOrder.style.css';

const AdminOrderPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useSearchParams();
    const dispatch = useDispatch();
    const { orderList, totalPageNum } = useSelector((state) => state.order);
    const [searchQuery, setSearchQuery] = useState({
        page: query.get('page') || 1,
        ordernum: query.get('ordernum') || '',
    });
    const [open, setOpen] = useState(false);

    const tableHeader = ['#', 'Order#', 'Order Date', 'User', 'Order Item', 'Address', 'Total Price', 'Status'];

    useEffect(() => {
        //상품리스트 가져오기//검색조건들 같이
        dispatch(getOrderList({ ...searchQuery }));
    }, [query]);

    useEffect(() => {
        if (searchQuery.ordernum === '') {
            delete searchQuery.ordernum;
        }
        const params = new URLSearchParams(searchQuery);
        const queryString = params.toString();
        console.log('qqqquery', queryString);
        navigate('?' + queryString);
        //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    }, [searchQuery]);

    const openEditForm = (order) => {
        setOpen(true);
        dispatch(setSelectedOrder(order));
    };

    const handlePageClick = ({ selected }) => {
        setSearchQuery({ ...searchQuery, page: selected + 1 });
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="locate-center">
            <Container>
                <div className="mt-2 display-center mb-2">
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="오더번호"
                        field="ordernum"

                    />
                </div>

                <OrderTable header={tableHeader} data={orderList} openEditForm={openEditForm} />
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPageNum}
                    forcePage={searchQuery.page - 1}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    className="display-center list-style-none"
                />
            </Container>

            {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
        </div>
    );
};

export default AdminOrderPage;
