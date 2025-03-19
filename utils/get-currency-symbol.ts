export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return "";

  try {
    // Use Intl.NumberFormat to get the symbol
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    });

    const parts: Intl.NumberFormatPart[] = formatter.formatToParts(0);
    const currencyPart = parts.find((part) => part.type === "currency");
    return currencyPart ? currencyPart.value : "";
  } catch (error) {
    // Type the error properly
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Error getting currency symbol for ${currencyCode}: ${errorMessage}`
    );
    return "";
  }
}
