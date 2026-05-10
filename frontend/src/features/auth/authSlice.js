import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "./authService";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userFromStorage || null,
  loading: false,
  error: null,
  status: null,
  success: false,
};

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await registerUser(data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      const statusCode = err.response?.status || 500;
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: statusCode
      });
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await loginUser(data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      const statusCode = err.response?.status || 500;
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: statusCode
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.status = action.payload.status;
        state.success = action.payload.success;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
        state.success = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.status = action.payload.status;
        state.success = action.payload.success;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
        state.success = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;