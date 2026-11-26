import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const tokenMatch = typeof authHeader === "string"
    ? /^Bearer\s+(\S+)$/i.exec(authHeader)
    : null;

  if (!tokenMatch) {
    return res.status(401).json({ message: "Autenticação necessária." });
  }

  try {
    const verified = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido." });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Acesso não autorizado." });
    }
    next();
  };
}
