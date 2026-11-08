import { SystemSettingsData } from "@/services/settings.service";

export interface ParsedWeighingScaleBarcode {
  isValid: boolean;
  itemCode?: string;
  weight?: number;
  price?: number;
  type: "weight" | "price" | "standard";
}

/**
 * Functional decoder for digital weighing scale barcodes (e.g. EAN-13 printed at deli/meat/vegetable counters).
 */
export function parseWeighingBarcode(
  barcode: string,
  settings: SystemSettingsData
): ParsedWeighingScaleBarcode {
  if (!barcode) return { isValid: false, type: "standard" };

  const totalChars = settings.wsBarcodeTotalChars || 0;
  if (totalChars > 0 && barcode.length !== totalChars) {
    return { isValid: false, type: "standard" };
  }

  const flagChars = settings.wsFlagChars || 0;
  if (flagChars > 0) {
    const flagPrefix = barcode.substring(0, flagChars);
    // If flag is configured, verify barcode starts with it or standard prefix
    if (!flagPrefix) {
      return { isValid: false, type: "standard" };
    }
  }

  const itemStart = settings.wsItemCodeStartPos || 0;
  const itemLength = settings.wsItemCodeChars || 0;
  const weightStart = settings.wsWeightStartPos || 0;
  const weightLength = settings.wsWeightChars || 0;
  const divideBy = settings.wsWeightDivideBy || 1000;

  if (itemLength <= 0 || weightLength <= 0) {
    return { isValid: false, type: "standard" };
  }

  const itemCode = barcode.substring(itemStart, itemStart + itemLength);
  const rawWeightStr = barcode.substring(weightStart, weightStart + weightLength);
  const rawNumber = parseFloat(rawWeightStr);

  if (isNaN(rawNumber)) {
    return { isValid: false, type: "standard" };
  }

  const calculatedValue = divideBy > 0 ? rawNumber / divideBy : rawNumber;
  const isPrice = settings.wsBarcodeContains?.toLowerCase().includes("price");

  if (isPrice) {
    return {
      isValid: true,
      itemCode,
      price: calculatedValue,
      type: "price",
    };
  }

  return {
    isValid: true,
    itemCode,
    weight: calculatedValue,
    type: "weight",
  };
}
