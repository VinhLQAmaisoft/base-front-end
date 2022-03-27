import { createSlice } from '@reduxjs/toolkit';
import { getAllUser } from '../services/admin/index'

const initialState = {
  allUser: null,
  getResult: false,
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
  }
});

// export const { fetching, reset, logoutAction } = slice.actions;
export default slice.reducer;