import newAxios, { BASE_URL } from '../newAxios'
import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
export const sendUserLogin = createAsyncThunk(`${BASE_URL}/account/login`, async (body, thunkAPI) => {
  try {
    const result = await newAxios.post('/account/login', body);
    if (result?.data?.data?.token) {
      const cookies = new Cookies();
    }
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