import { Router } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const GUEST_ID = 0;

function getOwner(userId: number | undefined) {
  if (userId !== undefined) {
    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return {
      column: "user_id",
      value: userId,
    };
  }

  return {
    column: "guest_id",
    value: GUEST_ID,
  };
}

const router = Router();

// to show cart for guestuser and login user
router.get("/", async (req, res) => {
  try {
    const userId =
      typeof req.body.userId === "string" ? Number(req.body.userId) : undefined;

    const owner = getOwner(userId);

    if (!owner) {
      return res.status(400).json({
        message: "Invalid User Id",
      });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `
            select ci.cart_item_id,ci.product_id as id,ci.quantity,ci.color,
            p.image,p.name,p.company,p.category,p.description,p.free_shipping
            from cart_items ci
            join products p on p.id = ci.product_id
            where ci.${owner.column}=?d
            order by ci.created_at by desc
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

router.post("/", async (req, res) => {
  try {
    const { userId: id, productId, quantity = 1, color = "pink" } = req.body;

    const userId = id === undefined || id === null ? undefined : Number(id);

    const owner = getOwner(id);
    const product_Id = Number(productId);
    const quantity_count = Number(quantity);

    if (!owner || !product_Id || !quantity_count) {
      return res.status(400).json({
        message: "invalid cart items details",
      });
    }

    const [row] = await pool.query<RowDataPacket[]>(
      `insert into cart_items(user_id,
            guest_id,product_id,quantity,color) values(?,?,?,?,?) on duplicate key update
            quantity = least(5,quantity+values(quantity))
            `,
      [
        owner.column === "user_id" ? owner.value : "",
        owner.column === "guest_id" ? owner.value : "",
      ],
    );
  } catch (error) {
    console.log(error);
  }
});
