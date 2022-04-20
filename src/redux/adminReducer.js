import { createSlice } from '@reduxjs/toolkit';
import {
  getAllUser,
  getAllCookie,
  getAllCustomer,
  getAllCustomerOrderDetail,
  createNewCookie,
  updateCookie,
  updateUser,
  updateUserPassword,
  changeStatusUser,
  deleteCookie
} from '../services/admin/index'

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
  passwordUpdated: null,
  updatedPasswordResult: false,
  deactiveUser: null,
  deactiveUserResult: false,
  deletedCookie: null,
  deleteCookieResult: false
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
      state.allCustomerOrder = action.payload;
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

    builder.addCase(updateUserPassword.fulfilled, (state, action) => {
      state.passwordUpdated = action.payload;
      state.updatedPasswordResult = true
      console.log(state, action)
    });

    builder.addCase(updateUserPassword.rejected, (state, action) => {
      state.updatedPasswordResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(changeStatusUser.fulfilled, (state, action) => {
      state.deactiveUser = action.payload;
      state.deactiveUserResult = true
      console.log(state, action)
    });

    builder.addCase(changeStatusUser.rejected, (state, action) => {
      state.deactiveUserResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(deleteCookie.fulfilled, (state, action) => {
      state.deletedCookie= action.payload;
      state.deleteCookieResult = true
      console.log(state, action)
    });

    builder.addCase(deleteCookie.rejected, (state, action) => {
      state.deleteCookieResult = false;
      console.log('err:', action.error);
    });

  }
});

// export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;