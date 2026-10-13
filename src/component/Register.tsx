import { Link, useNavigate } from "react-router-dom"
import Button from "./Button"
import { useDispatch } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../redux/authSlice"
import { getUsers, registerUser as saveUser } from "../api/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must contain at least 3 characters"),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must contain at least 6 characters"),
})

type RegisterForm = z.infer<typeof registerSchema>

function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const registerMutate = useMutation({
        mutationFn: async (user: RegisterForm) => {
            const existingUsers = await getUsers()

            const exists = existingUsers.some(
                (item) =>
                    item.email.toLowerCase() === user.email.toLowerCase()
            )

            if (exists) {
                throw new Error("Email already exists")
            }

            return await saveUser(user)
        },

        onSuccess: (savedUser) => {
            dispatch(registerUser(savedUser))

            toast.success("Account created successfully...")
            reset()
            navigate("/login")
        },

        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const handleRegister = (data: RegisterForm) => {
        registerMutate.mutate(data)
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex w-96 max-w-md flex-col gap-3 rounded-2xl border border-border bg-card-background p-8 shadow"
            >
                <h4 className="mb-2 text-center text-2xl font-bold text-heading">
                    Register
                </h4>

                <label
                    className="text-sm font-medium text-heading"
                    htmlFor="username"
                >
                    Username
                </label>

                <input
                    {...register("username")}
                    id="username"
                    type="text"
                    className="rounded-lg border border-border bg-input-background p-2 text-heading"
                />

                {errors.username && (
                    <p className="text-sm text-red-500">
                        {errors.username.message}
                    </p>
                )}

                <label
                    className="text-sm font-medium text-heading"
                    htmlFor="email"
                >
                    Email
                </label>

                <input
                    {...register("email")}
                    id="email"
                    type="email"
                    className="rounded-lg border border-border bg-input-background p-2 text-heading"
                />

                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <label
                    className="text-sm font-medium text-heading"
                    htmlFor="password"
                >
                    Password
                </label>

                <input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="rounded-lg border border-border bg-input-background p-2 text-heading"
                />

                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disable={registerMutate.isPending}
                >
                    {registerMutate.isPending
                        ? "Registering..."
                        : "Register"}
                </Button>

                <p className="text-center text-muted-text">
                    Already a member?{" "}
                    <Link
                        className="text-primary hover:underline"
                        to="/login"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Register