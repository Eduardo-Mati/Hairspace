import bookingsModel from "../models/bookings.model.js";
import barbershopsModel from "../models/barbershops.model.js";

const VALID_STATUSES = ["pending", "confirmed", "rejected"];
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

function getUserId(req) {
  const id = Number(req.user?.id ?? req.user?.sub);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validDate(date) {
  const match = typeof date === "string"
    ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    : null;
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export async function getAdminBarbershop(req, res, next) {
  try {
    const ownerId = getUserId(req);
    if (!ownerId) {
      return res.status(401).json({ message: "Token sem identificador de usuário válido." });
    }

    const barbershop = await barbershopsModel.findByOwnerId(ownerId);
    if (!barbershop) {
      return res.status(404).json({ message: "Barbearia não encontrada." });
    }
    res.json(barbershop);
  } catch (err) {
    next(err);
  }
}

export async function patchAdminBarbershop(req, res, next) {
  try {
    const ownerId = getUserId(req);
    if (!ownerId) {
      return res.status(401).json({ message: "Token sem identificador de usuário válido." });
    }

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body
      : {};
    const fields = {};

    if (Object.hasOwn(body, "name")) {
      if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
        return res.status(400).json({ message: "Nome inválido." });
      }
      fields.name = body.name.trim();
    }

    for (const field of ["primary_color", "accent_color"]) {
      if (Object.hasOwn(body, field)) {
        if (typeof body[field] !== "string" || !COLOR_PATTERN.test(body[field])) {
          return res.status(400).json({ message: `Cor inválida em ${field}; use #RRGGBB.` });
        }
        fields[field] = body[field];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: "Informe name, primary_color ou accent_color." });
    }

    const barbershop = await barbershopsModel.updateByOwnerId(ownerId, fields);
    if (!barbershop) {
      return res.status(404).json({ message: "Barbearia não encontrada." });
    }
    res.json(barbershop);
  } catch (err) {
    next(err);
  }
}

export async function listAdminBookings(req, res, next) {
  try {
    const ownerId = getUserId(req);
    if (!ownerId) {
      return res.status(401).json({ message: "Token sem identificador de usuário válido." });
    }
    if (!validDate(req.query.date)) {
      return res.status(400).json({ message: "Informe uma data válida no formato AAAA-MM-DD." });
    }

    const bookings = await bookingsModel.findBookingsByOwnerIdAndDate(ownerId, req.query.date);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function patchAdminBookingStatus(req, res, next) {
  try {
    const ownerId = getUserId(req);
    if (!ownerId) {
      return res.status(401).json({ message: "Token sem identificador de usuário válido." });
    }

    const bookingId = Number(req.params.id);
    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
      return res.status(400).json({ message: "Identificador de reserva inválido." });
    }

    const { status } = req.body ?? {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const booking = await bookingsModel.updateStatusByOwnerId(
      bookingId,
      ownerId,
      status
    );
    if (!booking) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
}
