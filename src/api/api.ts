import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000",
    headers:{
        "Content-Type":"application/json"
    }
})

export type User = {
    username: string;
    email: string;
    password: string;

}

export const getUsers = async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users")
    return res.data
}

export const registerUser = async (user: User): Promise<User> => {
    const res = await api.post<User>("/users", user)
    return res.data
}

export default api
