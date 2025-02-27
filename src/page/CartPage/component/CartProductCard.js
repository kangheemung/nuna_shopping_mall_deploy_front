import React, { useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { currencyFormat } from '../../../utils/number';

import { updateQty, deleteCartItem } from '../../../features/cart/cartSlice';
const CartProductCard = ({ item }) => {
    const dispatch = useDispatch();

    const handleQtyChange = (id, value) => {
        dispatch(updateQty(id, value));
    };

    const deleteCart = (id) => {
        dispatch(deleteCartItem(id));
    };

    return (
        <div className="product-card-cart">
            <Row>
                <Col md={2} xs={12}>
                    <img src={item.productId.image} width={112} alt="product" />
                </Col>
                <Col md={10} xs={12}>
                    <div className="display-flex space-between">
                        <h3>{item.productId.name}</h3>
                        <button className="trash-button">
                            <FontAwesomeIcon icon={faTrash} width={24} onClick={() => deleteCart(item._id)} />
                        </button>
                    </div>

                    <div>
                        <strong>₩ {currencyFormat(item.productId.price)}</strong>
                    </div>
                    <div>Size: {item.size}</div>
                    <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
                    <div>
                        Quantity:
                        <Form.Select
                            onChange={(event) => {
                                handleQtyChange(item._id, event.target.value);
                            }}
                            required
                            defaultValue={item.qty}
                            className="qty-dropdown">
                            {[...Array(10)].map((_, index) => (
                                <option key={index} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartProductCard;
