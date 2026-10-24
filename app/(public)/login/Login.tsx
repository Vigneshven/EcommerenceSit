"use client";

import { guestLogin, loginUsers } from "@/api/api";
import Button from "@/components/Button";
import useAuthStore from "@/zustandStore/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  const loginUser = useAuthStore((state) => state.loginUser);
  const enterGuestMode = useAuthStore((state) => state.enterGuestMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<LoginForm | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const result = await loginUsers(data);

      if (result.sessionExists) {
        setPendingLogin(data);
        setShowSessionDialog(true);
        return;
      }

      loginUser({
        user: result.user,
        token: result.token ?? null,
      });

      reset({
        email: "",
        password: "",
      });

      toast.success("Login successful!");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueHere = async () => {
    if (!pendingLogin) return;
    setIsLoading(true);
    try {
      const res = await loginUsers({
        ...pendingLogin,
        forceNewSession: true,
      });

      if (res.sessionExists) {
        toast.error("Another Session is still active");
        return;
      }

      loginUser({
        user: res.user,
        token: res.token,
      });

      setShowSessionDialog(false);
      setPendingLogin(null);

      reset({
        email: "",
        password: "",
      });
      toast.success("Successfully login previous session replaced");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("unable to continue here");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = () => {
    setShowSessionDialog(false);
    setPendingLogin(null);
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      enterGuestMode();
      toast.success("Logged in as guest!");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card-background p-8 shadow"
      >
        <h4 className="mb-2 text-center text-2xl font-bold text-heading">
          Login
        </h4>

        <label htmlFor="email" className="text-sm font-medium text-heading">
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register("email")}
          className="rounded border border-border bg-transparent p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <label htmlFor="password" className="text-sm font-medium text-heading">
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password")}
          className="rounded border border-border bg-transparent p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>

        <Button
          type="button"
          onClick={handleGuestLogin}
          className="bg-secondary-btn"
        >
          Guest User
        </Button>

        <p className="mt-2  font-bold text-center text-mb">
          Not a member yet?{" "}
          <Link className="hover:underline text-primary" href={"/register"}>
            Register
          </Link>
        </p>
      </form>
      {/* session */}
      {showSessionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-dialog-title"
            className="w-full max-w-md rounded-xl border border-border bg-card-background p-6 shadow-xl"
          >
            <h2
              id="session-dialog-title"
              className="text-xl font-bold text-heading"
            >
              Another session is active
            </h2>

            <p className="my-4 text-sm text-heading">
              This account is already logged in in another browser. Do you want
              to replace that session and continue here?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelSession}
                disabled={isLoading}
                className="rounded-lg border border-border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleContinueHere}
                disabled={isLoading}
                className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
              >
                {isLoading ? "Continuing..." : "Continue here"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
