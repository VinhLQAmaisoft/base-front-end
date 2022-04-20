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

export const getAllCookie = createAsyncThunk(`${BASE_URL}/cookie/getAll`, async (body, thunkAPI) => {
    try {
        const param=''
        const result = await newAxios.post('/cookie/getAll?keyword=' + param);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getAllCustomer = createAsyncThunk(`${BASE_URL}/customer/get-customer`, async (body, thunkAPI) => {
    try {
        const param=''
        const result = await newAxios.post('/customer/get-customer?keyword=' + param);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getAllCustomerOrderDetail = createAsyncThunk(`${BASE_URL}/customer/get-order`, async (body, thunkAPI) => {
    try {
        console.log(body)
        const result = await newAxios.post('/customer/get-order', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createNewCookie = createAsyncThunk(`${BASE_URL}/cookie/create`, async (body, thunkAPI) => {
    try {
        console.log(body)
        const result = await newAxios.post('/cookie/create', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateCookie = createAsyncThunk(`${BASE_URL}/cookie/update`, async (body, thunkAPI) => {
    try {
        console.log(body)
        const result = await newAxios.put('/cookie/update', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateUser = createAsyncThunk(`${BASE_URL}/account/admin-update-profile`, async (body, thunkAPI) => {
    try {
        console.log(body)
        const result = await newAxios.put('/account/admin-update-profile', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateUserPassword = createAsyncThunk(`${BASE_URL}/account/admin-change-password`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.put('/account/admin-change-password', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const changeStatusUser= createAsyncThunk(`${BASE_URL}/account/changeStatus`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.put('/account/changeStatus?id=' + body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const deleteCookie = createAsyncThunk(`${BASE_URL}/cookie/delete`, async (body, thunkAPI) => {
    try {
        const result = await newAxios.post('/cookie/delete', body);
        console.log(result.data);
        return result.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});