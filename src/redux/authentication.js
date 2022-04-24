import { createSlice } from '@reduxjs/toolkit';
import { sendMailResetPassword, sendUserLogin, sendUserSignup } from '../services/auth/index'

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

const initialState = {
  currentUser: null,
  isAuth: false,
  isSignup: false,
  signUpResult: null,
  sendMail: false,
  sendMailResult: null
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
      eraseCookie('token')
      window.location.href = "/login"
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendUserLogin.fulfilled, (state, action) => {
      state.isAuth = true;
      state.currentUser = action.payload
      console.log(state, action)
    });
    builder.addCase(sendUserLogin.rejected, (state, action) => {
      state.isAuth = false;
      console.log('err:', action.error);
    });
    //Sign up
    builder.addCase(sendUserSignup.fulfilled, (state, action) => {
      state.isSignup = true;
      state.signUpResult = action.payload
      console.log(state, action)
    });
    builder.addCase(sendUserSignup.rejected, (state, action) => {
      state.isSignup = false;
      console.log(state, action)
    });
    //Send mail reset password
    builder.addCase(sendMailResetPassword.fulfilled, (state, action) => {
      state.sendMail = true;
      state.sendMailResult = action.payload
      console.log(state, action)
    });
    builder.addCase(sendMailResetPassword.rejected, (state, action) => {
      state.sendMail = false;
      console.log(state, action)
    });
  }
});

export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;