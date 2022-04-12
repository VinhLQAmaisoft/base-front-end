import { createSlice } from '@reduxjs/toolkit';
import { sendUserLogin, sendUserSignup } from '../services/auth/index'

const initialState = {
  currentUser: null,
  isAuth: false,
  isSignup: false,
  signUpResult: null,
}

const slice = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    // fetching(state) {
    //   state.loading = true
    // },
    // reset(state) {
    //   state.loading = false
    //   state.updatingSuccess = true
    // },
    logoutAction: (state) => {
      state.currentUser = null
      localStorage.removeItem('userData')
    },
  },
  extraReducers: (builder) => {
    //Sign in
    // builder.addCase(sendUserLogin.pending, (state) => {
    //   state.loading = true;
    //   state.updatingSuccess = false;
    // })
    builder.addCase(sendUserLogin.fulfilled, (state, action) => {
      state.isAuth = true;
      // state.loading = true;
      // state.updatingSuccess = false;
      state.currentUser = action.payload
      console.log(state, action)
    });
    builder.addCase(sendUserLogin.rejected, (state, action) => {
      // state.updatingSuccess = false;
      state.isAuth = false;
      // state.loading = false;
      console.log('err:', action.error);
    });
    //Sign up
    builder.addCase(sendUserSignup.fulfilled, (state, action) => {
      state.isSignup = true;
      // state.loading = true;
      // state.updatingSuccess = false;
      state.signUpResult = action.payload
      console.log(state, action)
    });
    builder.addCase(sendUserSignup.rejected, (state, action) => {
      state.isSignup = false;
      // state.loading = true;
      // state.updatingSuccess = false;
      console.log(state, action)
    });
  }
});

export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;