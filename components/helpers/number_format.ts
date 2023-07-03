export const numberFormat = (value: any) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  }).format(value)
