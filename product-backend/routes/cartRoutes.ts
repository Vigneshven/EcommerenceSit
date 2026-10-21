import { Router } from "express";
import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const GUEST_ID = 0;

function getOwner(userId: number | undefined, isGuestUser: boolean) {
  if (userId !== undefined) {
    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return {
      column: "user_id",
      value: userId,
    };
  }

  if (isGuestUser) {
    return {
      column: "guest_id",
      value: GUEST_ID,
    };
  }

  return null;
}

const router = Router();

// to show cart for guestuser and login user
router.get("/", async (req, res) => {
  try {
    const user_id = req.query.userId;

    const userId =
      typeof user_id === "string" && user_id !== ""
        ? Number(user_id)
        : undefined;

    const isGuest = req.query.guest === "true";

    const owner = getOwner(userId, isGuest);

    if (!owner) {
      return res.status(400).json({
        message: "Invalid User Id",
      });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `
            select ci.cart_item_id as cartItemId,ci.product_id as id,ci.quantity as amount,ci.color,
            p.image,p.name,p.company,p.category,p.description,p.price,p.free_shipping
            from cart_items ci
            join products p on p.id = ci.product_id
            where ci.${owner.column}=?
            order by ci.created_at desc
            `,
      [owner.value],
    );

    return res.json(rows);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "failed to fetch cart",
    });
  }
});

// to post cart items
router.post("/", async (req, res) => {
  try {
    const { userId: id, productId, quantity = 1, color = "pink" } = req.body;

    const userId = id === undefined || id === null ? undefined : Number(id);

    const isGuest = req.query.guest === "true";

    const owner = getOwner(userId, isGuest);
    const product_Id = Number(productId);
    const quantity_count = Number(quantity);

    if (
      owner === null ||
      !Number.isInteger(product_Id) ||
      product_Id <= 0 ||
      !Number.isInteger(quantity_count) ||
      quantity_count < 1 ||
      quantity_count > 100
    ) {
      return res.status(400).json({
        message: "Invalid cart item details",
      });
    }

    const [row] = await pool.query<RowDataPacket[]>(
      `insert into cart_items(user_id,
            guest_id,product_id,quantity,color) values(?,?,?,?,?) on duplicate key update
            quantity = least(100,quantity+values(quantity))
            `,
      [
        owner.column === "user_id" ? owner.value : null,
        owner.column === "guest_id" ? String(owner.value) : null,
        productId,
        quantity_count,
        color.trim(),
      ],
    );
    return res.status(200).json({
      message: "cart item added",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "failed to add",
    });
  }
});

router.put("/:cartItemId", async (req, res) => {
  try {
    const user_Id = req.body.userId;

    const userId =
      user_Id === undefined || user_Id === null || user_Id === ""
        ? undefined
        : Number(user_Id);

    const isGuest = req.query.guest === "true";

    const owner = getOwner(userId, isGuest);
    const cartItemId = Number(req.params.cartItemId);
    const quantity = Number(req.body.quantity);

    if (
      !owner ||
      !Number.isInteger(cartItemId) ||
      !Number.isInteger(quantity) ||
      Number(quantity) < 1 ||
      Number(quantity) > 100 ||
      cartItemId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid cart item details",
      });
    }

    const [row] = await pool.query<ResultSetHeader>(
      `update cart_items set quantity=? where cart_item_id=? and ${owner.column}=?`,
      [quantity, cartItemId, owner.value],
    );

    return res.json({
      message: "cart quantity updated",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "failed to update cart",
    });
  }
});

// to delete cart item

router.delete("/:cartItemId", async (req, res) => {
  try {
    const user_id = req.query.userId;

    const userId =
      typeof user_id === "string" && user_id !== ""
        ? Number(user_id)
        : undefined;

    const isGuest = req.query.guest === "true";

    const owner = getOwner(userId, isGuest);

    const cartItemId = Number.parseInt(req.params.cartItemId, 10);

    if (!owner || !Number.isInteger(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({
        message: "invalid cart item details",
      });
    }

    const [row] = await pool.query<ResultSetHeader>(
      `delete from cart_items
      where cart_item_id =? and ${owner.column}=?`,
      [cartItemId, owner.value],
    );

    return res.json({
      message: "item removed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "failed to remove cart item",
    });
  }
});

export default router;
