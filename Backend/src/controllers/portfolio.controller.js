import model from "../models/portfolio.model.js";

export async function listPortfolio(req, res, next) {
  try {
    const photos = await model.findAllPhotos();
    res.json(photos);
  } catch (err) {
    next(err);
  }
}
