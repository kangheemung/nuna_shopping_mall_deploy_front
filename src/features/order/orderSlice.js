import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try{
        const res = await api.post("/order",payload)
        if(res.status!==200) throw new Error(res.error)
        dispatch(getCartQty());
        return res.data.orderNum;
    }catch(e){
      dispatch(showToastMessage({message:e.error,status: "error"}))
      return rejectWithValue(e.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
    async (_, { rejectWithValue, dispatch }) => {
      try{
        const res = await api.get("/order/me");
        console.log(res.data,"여기가 겟")
        if (res.status !== 200) {
          throw new Error(res.data.error);
        }
        return res.data;
    }catch(e){
      dispatch(showToastMessage({message:e.error,status: "error"}))
      return rejectWithValue(e.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async ( query , { rejectWithValue, dispatch }) => {
    try{
    const response = await api.get("/order", { params: {... query} });
    console.log("Response여기를 봐 data:", response.data); 
    if (response.status !== 200) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (e) {
    dispatch(showToastMessage({message: e.error, status: "error"}))
    return rejectWithValue(e.message);
  }
 }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try{
    const response = await api.put(`/order/${id}`, { status });
    if (response.status !== 200) throw new Error(response.data.message);
    return response.data;
  }catch(e) {
    dispatch(showToastMessage({message:e.error,status: "error"}))
    return rejectWithValue(e.message);
  }
}
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createOrder.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(createOrder.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.orderNum=action.payload;
    })
    .addCase(createOrder.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(getOrder.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(getOrder.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.orderList = action.payload.data;
      state.totalPageNum=action.payload.totalPageNum
    })
    .addCase(getOrder.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(getOrderList.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(getOrderList.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.orderList = action.payload.data;
      state.totalPageNum=action.payload.totalPageNum
    })
    .addCase(getOrderList.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(updateOrder.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(updateOrder.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.orderList = action.payload.data;
    })
    .addCase(updateOrder.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    });
  }
});
export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
