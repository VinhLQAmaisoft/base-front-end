import { createSlice } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile, changeUserPassword } from '../services/user/index'

const initialState = {
  userProfile: null,
  getUserProfileResult: false,
  userProfileUpdated: null,
  updateUserProfileResult: false,
  userPasswordUpdated: null,
  updateUserPasswordResult: false,
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

    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.userProfileUpdated = action.payload;
      state.updateUserProfileResult = true
      console.log(state, action)
    });

    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.updateUserProfileResult = false;
      console.log('err:', action.error);
    });

    builder.addCase(changeUserPassword.fulfilled, (state, action) => {
      state.userPasswordUpdated = action.payload;
      state.updateUserPasswordResult = true
      console.log(state, action)
    });

    builder.addCase(changeUserPassword.rejected, (state, action) => {
      state.updateUserPasswordResult = false;
      console.log('err:', action.error);
    });
  }
});

// export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;