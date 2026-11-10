import { prisma } from "../lib/prisma";

export async function getAllProducts() {
  // const [rows] = await pool.query<RowDataPacket[]>(`
  //           select id,image,name,category,company,price,description,amount,free_shipping
  //           from products
  //           order by id
  //           `);

  // return rows;

  return await prisma.products.findMany({
    select: {
      id: true,
      image: true,
      name: true,
      category: true,
      company: true,
      price: true,
      description: true,
      amount: true,
      free_shipping: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getProductById(id: number) {
  // const [rows] = await pool.query<RowDataPacket[]>(
  //   "select * from products where id=?",
  //   [id],
  // );

  // return rows[0] ?? null;

  return prisma.products.findUnique({
    where: {
      id: id,
    },
  });
}
