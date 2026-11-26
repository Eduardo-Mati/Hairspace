import model from "../models/bookings.model.js";
import barbershopsModel from "../models/barbershops.model.js";
import crypto from "node:crypto";

const TIME_SLOTS = ["09h", "10h", "11h", "14h", "15h", "16h", "17h"];
const VALID_LOCATIONS = ["barbershop", "home"];
const VALID_STATUSES = ["pending", "confirmed", "rejected"];

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseDate(date) {
  const match = typeof date === "string"
    ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    : null;
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year
    || utcDate.getUTCMonth() !== month - 1
    || utcDate.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day, utcDate };
}

export async function postBooking(req, res, next) {
  try {
    const {
      name,
      phone,
      date,
      time,
      location,
      barbershop_id: barbershopIdInput,
      service_id: serviceIdInput,
    } = req.body ?? {};
    const barbershopId = parseId(barbershopIdInput);
    const serviceId = parseId(serviceIdInput);

    if (
      typeof name !== "string" || !name.trim()
      || typeof phone !== "string" || !phone.trim()
      || !date || !time || !location
      || !barbershopId || !serviceId
    ) {
      return res.status(400).json({
        message: "Preencha nome, telefone, data, horário, local, barbearia e serviço.",
      });
    }

    const parsedDate = parseDate(date);
    if (!parsedDate) {
      return res.status(400).json({ message: "Data inválida. Use o formato AAAA-MM-DD." });
    }

    const requestedDate = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({ message: "Não é possível agendar para uma data passada." });
    }
    if (parsedDate.utcDate.getUTCDay() === 0) {
      return res.status(400).json({ message: "Não é possível agendar aos domingos." });
    }
    if (!VALID_LOCATIONS.includes(location)) {
      return res.status(400).json({ message: "Local de atendimento inválido." });
    }
    if (!TIME_SLOTS.includes(time)) {
      return res.status(400).json({ message: "Horário inválido." });
    }

    const service = await model.findActiveServiceForBarbershop(serviceId, barbershopId);
    if (!service) {
      return res.status(400).json({
        message: "O serviço não existe, está inativo ou não pertence à barbearia informada.",
      });
    }

    const taken = await model.findTakenSlotsByDate(date, barbershopId);
    if (taken.includes(time)) {
      return res.status(409).json({ message: "Esse horário acabou de ser reservado por outra pessoa." });
    }

    const confirmationCode = crypto.randomBytes(4).toString("hex");
    const booking = await model.createBooking({
      barbershopId,
      serviceId,
      name: name.trim(),
      phone: phone.trim(),
      confirmationCode,
      date,
      time,
      location,
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Esse horário acabou de ser reservado por outra pessoa." });
    }
    next(err);
  }
}

export async function getAvailableSlots(req, res, next) {
  try {
    const barbershopId = parseId(req.query.barbershop_id);
    const { date } = req.query;
    if (!barbershopId || !parseDate(date)) {
      return res.status(400).json({
        message: "Informe barbershop_id e uma data válida no formato AAAA-MM-DD.",
      });
    }

    const barbershop = await barbershopsModel.findActiveById(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ message: "Barbearia não encontrada." });
    }

    const taken = await model.findTakenSlotsByDate(date, barbershopId);
    const available = TIME_SLOTS.filter((slot) => !taken.includes(slot));
    res.json({ date, slots: TIME_SLOTS, available, taken });
  } catch (err) {
    next(err);
  }
}
export async function getBooking(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { code } = req.query;
    if (!id || typeof code !== "string" || !code) {
      return res.status(400).json({ message: "Informe um identificador e código de confirmação válidos." });
    }

    const booking = await model.findBookingById(id, code);
    if (!booking) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}
