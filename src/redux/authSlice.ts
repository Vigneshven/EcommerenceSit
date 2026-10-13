import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
    username: string;
    email: string;
    password: string;
}

type AuthState = {
    users: User[],
    currentUser: currentUser | null
    token: string | null
}

type currentUser = {
    username: string,
    email: string
}

const initialState: AuthState = {
    users: [],
    currentUser: null,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload)
        },
        loginUser: (state, action: PayloadAction<{
            user: currentUser
            token: string | null
        }>) => {
            state.currentUser = action.payload.user
            state.token = action.payload.token

        },
        logout: (state) => {
            state.currentUser = null
            state.token = null
        },
    }
})

export const { registerUser, loginUser, logout } = authSlice.actions
export default authSlice.reducer