// Middleware de erro do Express: precisa ter 4 argumentos (err, req, res, next)
// para o Express reconhecer que é um error handler.
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor.",
  });
}
