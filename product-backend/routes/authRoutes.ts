import { Router } from "express";
import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

type ExistingUser = RowDataPacket & {
  id: number;
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All field required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  const trimedEmail = email.trim().toLowerCase();

  const [existUser] = await pool.execute<ExistingUser[]>(
    "select id from users where email=?",
    [trimedEmail],
  );

  if ((existUser as User[]).length > 0) {
    return res.status(409).json({
      message: "Email Already exist",
    });
  }

  const [newUser] = await pool.execute<ResultSetHeader>(
    "insert into users (username,email,password) values (?,?,?)",
    [username.trim(), trimedEmail, password],
  );

  return res.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.insertId,
      username: username,
      email: email,
    },
  });
});

/*
400 - bad request
409 - conflict - server understand data is correct but cannot process because its conflict
      with current resource

201 - request succeed and new resourse created
*/

type UserRow = RowDataPacket &{
  id: number;
  username: string;
  email: string;
  password: string;
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  const trimedEmail = email.trim().toLowerCase();

  const [rows] = await pool.execute<UserRow[]>(
    "select id,username,email,password from users where email=?",
    [trimedEmail],
  );

  const user = rows[0]

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: "Invalid email and password",
    });
  }

  return res.status(200).json({
    message: "login successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

export default router;
