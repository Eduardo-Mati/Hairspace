const DEFAULT_PRIMARY = '#C9A84C';
const DEFAULT_ACCENT = '#d4b05c';
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function getBarbershopTheme(barbershop) {
  const primary = HEX_COLOR.test(barbershop?.primary_color || '')
    ? barbershop.primary_color
    : DEFAULT_PRIMARY;
  const accent = HEX_COLOR.test(barbershop?.accent_color || '')
    ? barbershop.accent_color
    : DEFAULT_ACCENT;

  return {
    '--color-gold': primary,
    '--color-gold-h': accent,
  };
}
