import newAxios, { BASE_URL } from '../newAxios'
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllUser = createAsyncThunk(`${BASE_URL}/account/user`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.get('/account/user');
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});