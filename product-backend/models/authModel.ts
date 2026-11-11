import { prisma } from "../lib/prisma";

export async function findUserByEmail(email: string) {
  // const [rows] = await pool.execute<UserRow[]>(
  //   "select id,username,email,password from users where email=?",
  //   [email],
  // );

  // return rows[0] ?? null;

  return await prisma.users.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });
}

export async function updatePasswordByHash(
  userId: number,
  passwordHash: string,
): Promise<void> {
  // await pool.execute(`update users set password=? where id=?`, [
  //   userId,
  //   passwordHash,
  // ]);
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: passwordHash,
    },
  });
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
) {
  // const [rows] = await pool.execute<ResultSetHeader>(
  //   "insert into users (username,email,password) values (?,?,?)",
  //   [username, email, passwordHash],
  // );

  // return rows.insertId;

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password: passwordHash,
    },
    select: {
      id: true,
    },
  });
  return user.id;
}
