export function cn(...inputs: Array<string | number | null | undefined | false>) {
  return inputs
    .flatMap((value) => {
      if (typeof value === "number") {
        return value === 0 ? [] : [String(value)];
      }
      return value ? [value] : [];
    })
    .join(" ");
}
