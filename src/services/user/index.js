import newAxios, { BASE_URL } from '../newAxios'
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUserProfile = createAsyncThunk(`${BASE_URL}/account/profile`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.post('/account/profile');
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateUserProfile = createAsyncThunk(`${BASE_URL}/account/updateProfile`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.put('/account/profile', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const changeUserPassword = createAsyncThunk(`${BASE_URL}/account/changePassword`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.put('/account/changePassword', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});