import model from "../models/services.model.js";

export async function listServices(req, res, next) {
  try {
    const services = await model.findAllActiveServices();
    res.json(services);
  } catch (err) {
    next(err);
  }
}