import type { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/authModel";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(trimmedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const userId = await createUser(trimmedUsername, trimmedEmail, password);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: userId,
        username: trimmedUsername,
        email: trimmedEmail,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(trimmedEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email and password",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "authentication config error",
      });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1hr" });

    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}
