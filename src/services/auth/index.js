import newAxios, {BASE_URL} from '../newAxios'
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendUserLogin = createAsyncThunk(`${BASE_URL}/account/login`, async (body, thunkAPI) => {
  try {
    const result = await newAxios.post('/account/login', body);
    // console.log(result);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const sendUserSignup = createAsyncThunk(`${BASE_URL}/account/register`, async (body, thunkAPI) => {
  try {
    const result = await newAxios.post('/account/register', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});