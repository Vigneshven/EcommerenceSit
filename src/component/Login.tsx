import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import { getUsers } from "../api/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuthStore from "../zustandStore/authStore";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();

  const loginUser = useAuthStore((state) => state.loginUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutate = useMutation({
    mutationFn: async (data: LoginForm) => {
      const existUser = await getUsers();

      const user = existUser.find(
        (item) =>
          item.email.toLowerCase() === data.email.trim().toLowerCase() &&
          item.password === data.password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      return user;
    },

    onSuccess: (user) => {
      loginUser({
        user: {
          username: user.username,
          email: user.email,
        },
        token: null,
      });

      toast.success("Login successfully...");
      navigate("/", { replace: true });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleLogin = (data: LoginForm) => {
    loginMutate.mutate(data);
  };

  const handleGuestLogin = () => {
    loginUser({
      user: {
        username: "Guest User",
        email: "guest@example.com",
      },
      token: null,
    });

    toast.success("Logged in as guest!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex w-96 max-w-md flex-col gap-3 rounded-2xl border border-border bg-card-background p-8 shadow"
      >
        <h4 className="mb-2 text-center text-2xl font-bold text-heading">
          Login
        </h4>

        <label className="text-sm font-medium text-heading" htmlFor="email">
          Email
        </label>

        <input
          {...register("email")}
          id="email"
          type="email"
          className="rounded-lg border border-border bg-input-background p-2 text-heading"
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <label className="text-sm font-medium text-heading" htmlFor="password">
          Password
        </label>

        <input
          {...register("password")}
          id="password"
          type="password"
          className="rounded-lg border border-border bg-input-background p-2 text-heading"
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

        <Button
          type="submit"
          disabled={loginMutate.isPending}
          className="bg-primary w-80 h-60"
        >
          {loginMutate.isPending ? "LOGGING IN..." : "LOGIN"}
        </Button>

        <Button type="button" className="w-80 h-60" onClick={handleGuestLogin}>
          GUEST USER
        </Button>

        <p className="text-center text-muted-text">
          Not a member yet?{" "}
          <Link className="text-primary hover:underline" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
