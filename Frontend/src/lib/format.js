// O backend guarda preço em centavos (price_cents) pra nunca ter erro de
// arredondamento com número decimal — aqui a gente só formata pra exibir.
export function formatPrice(cents) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}
