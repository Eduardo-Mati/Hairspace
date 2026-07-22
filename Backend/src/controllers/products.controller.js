import { findAllActiveProducts } from "../models/products.model.js";

export async function listProducts(req, res, next) {
  try {
    const products = await findAllActiveProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
}
