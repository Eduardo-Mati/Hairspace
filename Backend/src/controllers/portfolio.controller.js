import { findAllPhotos } from "../models/portfolio.model.js";

export async function listPortfolio(req, res, next) {
  try {
    const photos = await findAllPhotos();
    res.json(photos);
  } catch (err) {
    next(err);
  }
}
