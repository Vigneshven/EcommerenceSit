"use client";

import { useRouter } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type loginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8">
      <form className="flex w-96 max-w-md flex-col gap-3 rounded border border-border bg-card-background p-8 shadow">
        <h4 className="mb-2 text-center text-2xl font-bold text-heading">
          Login
        </h4>
        <label className="text-sm font-medium text-heading">Email</label>
        <input type="text" />
        <label className="text-sm font-medium text-heading">Password</label>
        <input type="password" />
        <button>Login In</button>
        <button>GUEST USER</button>
        <p>
          Not a member yet? <span>Register</span>
        </p>
      </form>
    </div>
  );
}
