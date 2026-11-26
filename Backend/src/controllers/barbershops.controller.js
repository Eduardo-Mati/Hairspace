import model from "../models/barbershops.model.js";

export async function listBarbershops(req, res, next) {
  try {
    const barbershops = await model.findAllActive();
    res.json(barbershops);
  } catch (err) {
    next(err);
  }
}

export async function getBarbershop(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ message: "Identificador de barbearia inválido." });
    }

    const barbershop = await model.findActiveByIdWithServices(id);
    if (!barbershop) {
      return res.status(404).json({ message: "Barbearia não encontrada." });
    }
    res.json(barbershop);
  } catch (err) {
    next(err);
  }
}
