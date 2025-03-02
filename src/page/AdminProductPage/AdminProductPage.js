import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import SearchBox from '../../common/component/SearchBox';
import NewItemDialog from './component/NewItemDialog';
import ProductTable from './component/ProductTable';
import { getProductList, deleteProduct, setSelectedProduct } from '../../features/product/productSlice';

const AdminProductPage = () => {
    const navigate = useNavigate();
    const productList = useSelector((state) => state.product.productList);
    const [query, setQuery] = useSearchParams();
    const dispatch = useDispatch();
    const [showDialog, setShowDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        page: query.get('page') || 1,
        name: query.get('name') || '',
    }); //검색 조건들을 저장하는 객체

    const [mode, setMode] = useState('new');
    const totalPageNum = useSelector((state) => state.product.totalPageNum);
    const tableHeader = ['#', 'Sku', 'Name', 'Price', 'Stock', 'Image', 'Status', ''];

    //상품리스트 가져오기 (url쿼리 맞춰서)

    // Update the URL with the new query parameters
    //     const params = new URLSearchParams(updatedQuery);
    //     navigate('?' + params.toString());
    // };

    useEffect(() => {
        //상품리스트 가져오기//검색조건들 같이
        dispatch(getProductList({ ...searchQuery }));
    }, [query]);

    useEffect(() => {
        if (searchQuery.name === '') {
            delete searchQuery.name;
        }
        console.log('qqq', searchQuery);
        const params = new URLSearchParams(searchQuery);
        const query = params.toString();
        console.log('qqqquery', query);
        navigate('?' + query);
        //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    }, [searchQuery]);
    const deleteItem = (id) => {
        //아이템 삭제하기
        dispatch(deleteProduct(id));
    };

    const openEditForm = (product) => {
        //edit모드로 설정하고
        setMode('edit');
        // 다이얼로그 열어주기
        dispatch(setSelectedProduct(product));
        setShowDialog(true);
        // 아이템 수정다이얼로그 열어주기
    };

    const handleClickNewItem = () => {
        //new 모드로 설정하고
        setMode('new');
        // 다이얼로그 열어주기
        setShowDialog(true);
    };

    const handlePageClick = ({ selected }) => {
        //  쿼리에 페이지값 바꿔주기
        console.log('selected', selected);
        setSearchQuery({ ...searchQuery, page: selected + 1 });
    };
    //searchboxから検索語を読んでくる。=> エンターをしたら => search Queryがアップデートになる。{name:ストレートパンツ}
    //search Query객체 안에 아이템 기준으로 url을 새로 생성해서 호출 $name = 스트레이트+팬츠
    ///url쿼리 읽어 오기 =>URL쿼리기준으로BE에 검색 조건과 함께 호출한다.
    console.log('Total Page Number:', totalPageNum);
    return (
        <div className="locate-center">
            <Container>
                <div className="mt-2">
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="Search by product name"
                        field="name"
                    />
                </div>
                <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
                    Add New Item +
                </Button>

                <ProductTable
                    header={tableHeader}
                    data={productList}
                    deleteItem={deleteItem}
                    openEditForm={openEditForm}
                />
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPageNum} //全体ページ
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

            <NewItemDialog mode={mode} showDialog={showDialog} setShowDialog={setShowDialog} />
        </div>
    );
};

export default AdminProductPage;
