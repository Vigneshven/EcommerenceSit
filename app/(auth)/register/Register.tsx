"use client";

import { registerUser } from "@/api/api";
import Button from "@/components/Button";
import useAuthStore from "@/zustandStore/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 character"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "password must be at least 8 character"),
});

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
  const router = useRouter();

  const saveRegisterUser = useAuthStore((state) => state.registerUser);

  const [isLoading, setIsLoading] = useState(false);

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
  });

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);

      saveRegisterUser(res.user);

      toast.success("Account created successfully!");

      reset();

      router.replace("/login");
    } catch (error) {
      toast.error("Registration Failedii");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <form
        className="flex flex-col border border-border bg-card-background p-3 shadow max-w-md w-96 gap-4 rounded-xl"
        onSubmit={handleSubmit(handleRegister)}
      >
        <h4 className="mb-2 text-center text-2xl font-bold text-heading">
          Register
        </h4>
        <label className="text-sm font-medium text-heading">UserName</label>
        <input
          type="text"
          {...register("username")}
          className="rounded-lg border border-border bg-input-background p-2 text-heading"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
        <label className="text-sm font-medium text-heading">Email</label>
        <input
          type="email"
          {...register("email")}
          className="rounded-lg border border-border bg-input-background p-2 text-heading"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <label className="text-sm font-medium text-heading">Password</label>
        <input
          type="password"
          {...register("password")}
          className="rounded-lg border border-border bg-input-background p-2 text-heading"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
        <p className="text-center font-bold">
          Already a member?{""}
          <Link className="hover:underline text-primary" href={"/login"}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
