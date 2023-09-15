import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const register = createAsyncThunk(
  'users/register',
  async ({ username, email, password }, thunkAPI) => {
    const body = JSON.stringify({
      username,
      email,
      password,
    });
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();

      if (response.status === 201) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  'users/me',
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${BASE_URL}/users/me/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response,"iam the get user");
      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'users/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        email,
        password,
      });
      console.log(response,"helo it is me");

      const data = response.data;
      if (response.status === 200) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const { dispatch } = thunkAPI;
        dispatch(getUser());
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, thunkAPI) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return undefined;
  }
);

export const checkAuth = createAsyncThunk(
  'users/verify',
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem('access_token');
    const body = JSON.stringify({ token: accessToken });
    try {
      const res = await fetch(`${BASE_URL}/api/token/verify/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();

      if (res.status === 200) {
        const { dispatch } = thunkAPI;
        dispatch(getUser());
        return data;
      } else if (res.status === 401) {
        const { dispatch } = thunkAPI;
        await dispatch(updateToken());
        const updateTokenResult = thunkAPI.getState().userSlice;
        if (updateTokenResult.isAuthenticated) {
          const { dispatch } = thunkAPI;
          dispatch(getUser());
          return data;
        } else {
          return thunkAPI.rejectWithValue(updateTokenResult.error);
        }
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateToken = createAsyncThunk(
  'users/refresh',
  async (_, thunkAPI) => {
    const refreshToken = localStorage.getItem('access_token');
    const body = JSON.stringify({ token: refreshToken });
    try {
      const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const { dispatch } = thunkAPI;
        dispatch(getUser());
        return data;
      } else {
        const { dispatch } = thunkAPI;
        dispatch(logout());
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
  loading: false,
  registered: false,
  isSuperuser: false,
};

const userSlice = createSlice({
    name:"user",
    initialState: INITIAL_STATE,
    reducers:{
        resetRegistered: state => {
			state.registered = false;
        },
    },
    extraReducers : builder=>{
        builder
        .addCase(register.pending, state => {
            state.loading = true;
        })
        .addCase(register.fulfilled, state => {
            state.loading = false;
            state.registered = true;
        })
        .addCase(register.rejected, state => {
            state.loading = false;
        })
        .addCase(login.pending, state => {
            state.loading = true;
          })
          .addCase(login.fulfilled, (state, action) => {
            // state.loading = false;
            state.isAuthenticated = true;
            state.isSuperuser = jwt_decode(action.payload.access).is_superuser;
            // state.accessToken = action.payload.access;
            // state.refreshToken = action.payload.refresh;
          })
          .addCase(login.rejected, state => {
            state.loading = false;
          })
          .addCase(getUser.pending, state => {
            state.loading = true;
          })
          .addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isSuperuser = state.user.is_superuser
          })
          .addCase(getUser.rejected, state => {
            state.loading = false;
          })
          .addCase(logout.pending, state => {
            state.loading = true;
          })
          .addCase(logout.fulfilled, state => {
            state.loading = false;
            state.isAuthenticated = false
            state.user = null
            // state.accessToken = null
            // state.refreshToken = null
            state.isSuperuser = false
          })
          .addCase(logout.rejected, state => {
            state.loading = false;
          })
          .addCase(checkAuth.pending, state => {
            state.loading = true;
          })
          .addCase(checkAuth.fulfilled, state => {
            state.loading = false;
            state.isAuthenticated = true;
            // state.accessToken = action.payload.access;
            // state.refreshToken = action.payload.refresh;
          })
          .addCase(checkAuth.rejected, state => {
            state.loading = false;
          })
          .addCase(updateToken.pending, state => {
            state.loading = true;
          })
          .addCase(updateToken.fulfilled, state => {
            state.loading = false;
            state.isAuthenticated = true;
          })
          .addCase(updateToken.rejected, state => {
            state.loading = false;
          });
    },
});

export const {resetRegistered} = userSlice.actions;

export default userSlice.reducer;
