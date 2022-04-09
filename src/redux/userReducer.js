import { createSlice } from '@reduxjs/toolkit';
import { getUserProfile } from '../services/user/index'

const initialState = {
  userProfile: null,
  getUserProfileResult: false
}

const slice = createSlice({
  name: 'userReducer',
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
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload.data;
      state.getUserProfileResult = true
      console.log(state, action)
    });

    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.getUserProfileResult = false;
      console.log('err:', action.error);
    });

    // builder.addCase(getAllCookie.fulfilled, (state, action) => {
    //   state.allCookie = action.payload.data;
    //   state.getResult = true
    //   console.log(state, action)
    // });

    // builder.addCase(getAllCookie.rejected, (state, action) => {
    //   state.getResult = false;
    //   console.log('err:', action.error);
    // });
  }
});

// export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;