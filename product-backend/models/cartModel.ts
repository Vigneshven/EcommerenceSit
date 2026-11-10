import { prisma } from "../lib/prisma";

export type CartOwner =
  | { column: "user_id"; value: number }
  | { column: "guest_id"; value: string };

function validateOwner(owner: CartOwner): void {
  if (
    owner.column === "user_id" &&
    (!Number.isInteger(owner.value) || owner.value <= 0)
  ) {
    throw new Error("Invalid user cart owner");
  }

  if (
    owner.column === "guest_id" &&
    (typeof owner.value !== "string" || !owner.value.trim())
  ) {
    throw new Error("Invalid guest cart owner");
  }
}

function ownerWhere(owner: CartOwner) {
  validateOwner(owner);

  if (owner.column === "user_id") {
    return {
      user_id: owner.value,
    };
  }

  return {
    user_id: null,
    guest_id: owner.value,
  };
}

export async function getCartItems(owner: CartOwner) {
  // const condition = ownerCondition(owner);
  // const [rows] = await pool.query<RowDataPacket[]>(
  //   `
  //           select ci.cart_item_id as cartItemId,ci.product_id as product_id,ci.quantity as amount,ci.color,
  //           p.image,p.name,p.company,p.category,p.description,p.price,p.free_shipping
  //           from cart_items ci
  //           join products p on p.id = ci.product_id
  //           where ${condition}
  //           order by ci.created_at desc
  //           `,
  //   [owner.value],
  // );
  // return rows;
  const rows = await prisma.cart_items.findMany({
    where: ownerWhere(owner),
    select: {
      cart_item_id: true,
      product_id: true,
      quantity: true,
      color: true,

      products: {
        select: {
          image: true,
          name: true,
          company: true,
          category: true,
          description: true,
          price: true,
          free_shipping: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return rows.map(({ products, quantity, cart_item_id, ...item }) => ({
    cartItemId: cart_item_id,
    ...item,
    amount: quantity,
    ...products,
  }));
}

export async function addCartItems(data: {
  owner: CartOwner;
  productId: number;
  quantity: number;
  color: string;
}) {
  const { owner, productId, quantity, color } = data;
  validateOwner(owner);

  // const [row] = await pool.query<RowDataPacket[]>(
  //   `insert into cart_items(user_id,
  //           guest_id,product_id,quantity,color) values(?,?,?,?,?) on duplicate key update
  //           quantity = least(100,quantity+values(quantity))
  //           `,
  //   [
  //     owner.column === "user_id" ? owner.value : null,
  //     owner.column === "guest_id" ? owner.value : null,
  //     productId,
  //     quantity,
  //     color.trim(),
  //   ],
  // );
  // return row;
  const isUser = owner.column === "user_id";

  const where = isUser
    ? {
        user_id_product_id_color: {
          user_id: owner.value as number,
          product_id: productId,
          color: color,
        },
      }
    : {
        guest_id_product_id_color: {
          guest_id: owner.value as string,
          product_id: productId,
          color: color,
        },
      };

  const ownerData = isUser
    ? { user_id: owner.value as number, guest_id: null }
    : { user_id: null, guest_id: owner.value as string };

  return prisma.cart_items.upsert({
    where,
    create: {
      ...ownerData,
      product_id: productId,
      quantity,
      color: color,
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
  });
}

export async function updateCartItem(
  owner: CartOwner,
  cartItemId: number,
  quantity: number,
) {
  validateOwner(owner);
  // const condition =
  //   owner.column === "user_id" ? "user_id=?" : "user_id is null and guest_id=?";
  // const [result] = await pool.query<ResultSetHeader>(
  //   `UPDATE cart_items
  //    SET quantity = ?
  //    WHERE cart_item_id = ? AND ${condition}`,
  //   [quantity, cartItemId, owner.value],
  // );

  // return result;

  const res = await prisma.cart_items.updateMany({
    where: {
      cart_item_id: cartItemId,
      ...ownerWhere(owner),
    },
    data: {
      quantity,
      updated_at: new Date(),
    },
  });
  return {
    affectedRows: res.count,
  };
}

export async function deleteCartItem(owner: CartOwner, cartItemId: number) {
  validateOwner(owner);
  // const condition =
  //   owner.column === "user_id" ? "user_id=?" : "user_id is null and guest_id=?";
  // const [result] = await pool.query<ResultSetHeader>(
  //   `DELETE FROM cart_items
  //    WHERE cart_item_id = ? AND ${condition}`,
  //   [cartItemId, owner.value],
  // );

  // return result;

  const res = await prisma.cart_items.deleteMany({
    where: {
      cart_item_id: cartItemId,
      ...ownerWhere(owner),
    },
  });

  return {
    affectedRow: res.count,
  };
}
