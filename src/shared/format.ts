export const fmtUsd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`
export const fmtInr = (v: number) => `₹${Math.round(v).toLocaleString('en-IN')}`
export const fmtMass = (g: number) => (g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${Math.round(g)} g`)
export const fmtMm = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)} mm`
