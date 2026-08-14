export const money = (n: number) => `$${n.toFixed(2)}`;

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const TAX_RATE = 0.075;
