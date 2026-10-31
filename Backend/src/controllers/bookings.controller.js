import model from "../models/bookings.model.js";
import crypto from "node:crypto";

// Mesmos horários que o front oferece — se um dia isso vier do banco
// (ex: tabela de "expediente"), só essa constante muda.
const TIME_SLOTS = ["09h", "10h", "11h", "14h", "15h", "16h", "17h"];
const VALID_LOCATIONS = ["barbershop", "home"];
const VALID_STATUSES = ["pending", "confirmed", "rejected"];

export async function postBooking(req, res, next) {
  try {
    const { name, phone, date, time, location } = req.body;

    if (!name?.trim() || !phone?.trim() || !date || !time || !location) {
      return res
        .status(400)
        .json({ message: "Preencha nome, telefone, data, horário e local." });
    }
    const dateParts = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date);
    const requestedDate = dateParts
      ? new Date(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3]))
      : null;
    const isValidDate = requestedDate
      && requestedDate.getFullYear() === Number(dateParts[1])
      && requestedDate.getMonth() === Number(dateParts[2]) - 1
      && requestedDate.getDate() === Number(dateParts[3]);
    if (!isValidDate) {
      return res.status(400).json({ message: "Data inválida. Use o formato AAAA-MM-DD." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({ message: "Não é possível agendar para uma data passada." });
    }
    if (requestedDate.getDay() === 0) {
      return res.status(400).json({ message: "Não é possível agendar aos domingos." });
    }
    if (!VALID_LOCATIONS.includes(location)) {
      return res.status(400).json({ message: "Local de atendimento inválido." });
    }
    if (!TIME_SLOTS.includes(time)) {
      return res.status(400).json({ message: "Horário inválido." });
    }

    const taken = await model.findTakenSlotsByDate(date);
    if (taken.includes(time)) {
      return res.status(409).json({ message: "Esse horário acabou de ser reservado por outra pessoa." });
    }

    const confirmationCode = crypto.randomBytes(4).toString("hex");
    const booking = await model.createBooking({
      name: name.trim(),
      phone: phone.trim(),
      confirmationCode,
      date,
      time,
      location,
    });
    res.status(201).json(booking);
  } catch (err) {
    // Se dois clientes confirmarem no mesmo milissegundo, a constraint
    // UNIQUE(booking_date, booking_time) do banco pega o que o check acima não pegou.
    if (err.code === "23505") {
      return res.status(409).json({ message: "Esse horário acabou de ser reservado por outra pessoa." });
    }
    next(err);
  }
}

export async function getAvailableSlots(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Informe a data no formato AAAA-MM-DD (?date=)." });
    }

    const taken = await model.findTakenSlotsByDate(date);
    const available = TIME_SLOTS.filter((slot) => !taken.includes(slot));
    res.json({ date, available, taken });
  } catch (err) {
    next(err);
  }
}

export async function getBooking(req, res, next) {
  try {
    const booking = await model.findBookingById(req.params.id, req.query.code);
    if (!booking) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

// Rota autenticada (painel do barbeiro)
export async function listBookings(req, res, next) {
  try {
    const bookings = await model.findAllBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

// Rota autenticada (painel do barbeiro) — confirmar ou recusar um horário
export async function patchBookingStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const booking = await model.updateBookingStatus(req.params.id, status);
    if (!booking) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}
