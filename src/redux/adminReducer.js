import { createSlice } from '@reduxjs/toolkit';
import { getAllUser, getAllCookie, getAllCustomer, getAllCustomerOrderDetail, createNewCookie, updateCookie, updateUser } from '../services/admin/index'

const initialState = {
  allUser: null,
  allCookie: null,
  allCustomer: null,
  allCustomerOrder: null,
  userUpdated: null,
  updatedUserResult: false,
  cookieUpdated: null,
  updatedCookieResult: false,
  getResult: false,
  getCustomerOrderResult: false,
  createCookieResult: false,
}

const slice = createSlice({
  name: 'adminReducer',
  initialState: initialState,
  reducers: {
    // fetching(state) {
    //   state.loading = true
    // },
    // reset(state) {
    //   state.loading = false
    //   state.updatingSuccess = true
    // },
    // logoutAction: (state) => {
    //   state.currentUser = null
    //   localStorage.removeItem('userData')
    // },
  },
  extraReducers: (builder) => {
    //Sign in
    // builder.addCase(sendUserLogin.pending, (state) => {
    //   state.loading = true;
    //   state.updatingSuccess = false;
    // })
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.allUser = action.payload.data;
      state.getResult = true
      console.log(state, action)
    });

    builder.addCase(getAllUser.rejected, (state, action) => {
      state.getResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(getAllCookie.fulfilled, (state, action) => {
      state.allCookie = action.payload.data;
      state.getResult = true
      console.log(state, action)
    });

    builder.addCase(getAllCookie.rejected, (state, action) => {
      state.getResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(getAllCustomer.fulfilled, (state, action) => {
      state.allCustomer = action.payload.data;
      state.getResult = true
      console.log(state, action)
    });

    builder.addCase(getAllCustomer.rejected, (state, action) => {
      state.getResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(getAllCustomerOrderDetail.fulfilled, (state, action) => {
      state.allCustomerOrder = action.payload.data;
      state.getCustomerOrderResult = true
      console.log(state, action)
    });

    builder.addCase(getAllCustomerOrderDetail.rejected, (state, action) => {
      state.getCustomerOrderResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(createNewCookie.fulfilled, (state, action) => {
      state.cookieResult = action.payload;
      state.createCookieResult = true
      console.log(state, action)
    });

    builder.addCase(createNewCookie.rejected, (state, action) => {
      state.createCookieResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(updateCookie.fulfilled, (state, action) => {
      state.cookieUpdated = action.payload;
      state.updatedCookieResult = true
      console.log(state, action)
    });

    builder.addCase(updateCookie.rejected, (state, action) => {
      state.updatedCookieResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.userUpdated = action.payload;
      state.updatedUserResult = true
      console.log(state, action)
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      state.updatedUserResult = false;
      console.log('err:', action.error);
    });
  }
});

// export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;