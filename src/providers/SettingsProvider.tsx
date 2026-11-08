"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useTheme } from "next-themes";
import {
  settingsService,
  SystemSettingsData,
} from "@/services/settings.service";
import { transitionThemeWithRipple } from "@/lib/themeTransition";

// Known currency code to symbol map
const CURRENCY_SYMBOLS: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  CAD: "CA$",
  AUD: "AU$",
  SAR: "﷼",
  AED: "د.إ",
  JPY: "¥",
  CNY: "¥",
  SGD: "S$",
  MYR: "RM",
  TRY: "₺",
};

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsData = {
  siteName: "Apex POS",
  language: "English",
  defaultCurrency: "BDT",
  accountingMethod: "AVCO (Average Cost Method)",
  defaultEmail: "admin@apexpos.com",
  defaultCustomerGroup: "General",
  defaultPriceGroup: "Default",
  maintenanceMode: "No",
  theme: "Default",
  rtlSupport: "Disable",
  loginCaptcha: "Disable",
  numberDaysDisableEditing: 0,
  rowsPerPage: 10,
  dateFormat: "dd-mm-yyyy",
  timezone: "Asia/Dhaka",
  calender: "Shared",
  defaultWarehouse: "Main Warehouse",
  defaultBiller: "Apex POS",
  pdfLibrary: "mPDF",
  useCodeForSlug: "Enable",

  // Products Configuration Sub-section
  productTax: "Enable",
  racks: "Disable",
  productVariants: "Enable",
  productExpiry: "Disable",
  removeExpired: "No, I will remove manually",
  imageWidth: 800,
  imageHeight: 800,
  thumbnailWidth: 150,
  thumbnailHeight: 150,
  watermark: "Yes",
  displayWarehouseProducts: "Hide with 0 quantity",
  barcodeSeparator: "Dot (.)",
  barcodeRenderer: "Image",
  updateCostWithPurchase: "No",

  // Sales Configuration Sub-section
  overSelling: "Yes",
  referenceFormat: "Sequence Number",
  orderTax: "Vat",
  productLevelDiscount: "Enable",
  productSerial: "Enable",
  autoDetectBarcode: "Enable",
  productsCountFixBarcode: 4,
  cartItemAdditionMethod: "Add New Item to cart",
  defaultOrderPageFocus: "Add item input",
  ksaInvoiceQrCode: "Disable",
  invoiceView: "Standard",

  // Prefix Configuration Sub-section
  salesPrefix: "SALE",
  returnSalePrefix: "SR",
  paymentPrefix: "IPAY",
  purchasePaymentPrefix: "POP",
  deliveryPrefix: "DO",
  quotationPrefix: "QUOTE",
  purchasePrefix: "PO",
  returnPurchasePrefix: "PR",
  transferPrefix: "TR",
  expensePrefix: "",
  qaPrefix: "",

  // Money and Number Format Sub-section
  decimals: 2,
  quantityDecimals: 2,
  southAsianCurrencyFormat: "Disable",
  decimalsSeparator: "Dot (.)",
  thousandsSeparator: "Comma",
  displayCurrencySymbol: "Before",
  currencySymbol: "৳",

  // Weighing Scale Barcode Sub-section
  wsBarcodeContains: "Weight/Quantity",
  wsBarcodeTotalChars: 0,
  wsFlagChars: 0,
  wsItemCodeStartPos: 0,
  wsItemCodeChars: 0,
  wsWeightStartPos: 0,
  wsWeightChars: 0,
  wsWeightDivideBy: 0,

  // Email Sub-section
  emailProtocol: "PHP Mail Function",

  // Award Points Configuration Sub-section
  customerAwardPointsSpent: 0,
  customerAwardPoints: 0,
  staffAwardPointsSale: 0,
  staffAwardPoints: 0,
};

export interface SettingsContextType {
  settings: SystemSettingsData;
  isLoading: boolean;
  currencySymbol: string;
  formatCurrency: (amount: number | string) => string;
  formatQuantity: (quantity: number | string) => string;
  formatDate: (date?: Date | string | null) => string;
  refreshSettings: () => Promise<void>;
  updateSettings: (payload: Partial<SystemSettingsData>) => Promise<SystemSettingsData>;
  changeThemeWithAnimation: (theme: string, origin?: { x: number; y: number }) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettingsData>(DEFAULT_SYSTEM_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setTheme, theme: currentActiveTheme } = useTheme();
  const isFirstRender = useRef(true);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSystemSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn("Could not load remote system settings, using defaults/cached:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Animated Theme Changer
  const changeThemeWithAnimation = useCallback(
    (newTheme: string, origin?: { x: number; y: number }) => {
      transitionThemeWithRipple(newTheme, setTheme, origin);
    },
    [setTheme]
  );

  // Update Settings mutation
  const updateSettings = useCallback(
    async (payload: Partial<SystemSettingsData>): Promise<SystemSettingsData> => {
      const updated = await settingsService.updateSystemSettings(payload);
      setSettings(updated);

      // If theme changed in payload, trigger ripple transition
      if (payload.theme) {
        transitionThemeWithRipple(payload.theme, setTheme);
      }

      return updated;
    },
    [setTheme]
  );

  // Global Side-Effects:
  // 1. Browser Tab Title (document.title)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const brand = settings.siteName?.trim() || "Apex POS";
      document.title = `${brand} | Retail POS`;
    }
  }, [settings.siteName]);

  // 2. RTL Support (document.documentElement.dir)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isRtl = settings.rtlSupport?.toLowerCase() === "enable";
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
    }
  }, [settings.rtlSupport]);

  // 3. Theme synchronization on load / update (with ripple after initial mount)
  useEffect(() => {
    if (!settings.theme) return;
    const targetTheme = settings.theme.toLowerCase();
    const mapped = targetTheme === "default" ? "system" : targetTheme;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setTheme(mapped);
    } else {
      if (currentActiveTheme !== mapped) {
        transitionThemeWithRipple(mapped, setTheme);
      }
    }
  }, [settings.theme, currentActiveTheme, setTheme]);

  // Computed default currency symbol from currency code
  const codeCurrencySymbol = useMemo(() => {
    const code = (settings.defaultCurrency || "BDT").toUpperCase().trim();
    return CURRENCY_SYMBOLS[code] || code;
  }, [settings.defaultCurrency]);

  // Active currency symbol (prefers custom currencySymbol if provided)
  const currencySymbol = useMemo(() => {
    if (settings.currencySymbol && settings.currencySymbol.trim() !== "") {
      return settings.currencySymbol.trim();
    }
    return codeCurrencySymbol;
  }, [settings.currencySymbol, codeCurrencySymbol]);

  // Currency formatter helper - fully functional with decimals, separators, South Asian formatting, and symbol placement
  const formatCurrency = useCallback(
    (amount: number | string): string => {
      const numeric = typeof amount === "string" ? parseFloat(amount) || 0 : amount || 0;
      const decimals = typeof settings.decimals === "number" ? settings.decimals : 2;
      const isSouthAsian = settings.southAsianCurrencyFormat?.toLowerCase() === "enable";

      // Locale-based numeric base: South Asian (en-IN e.g. 12,34,567.89) or International (en-US e.g. 1,234,567.89)
      const locale = isSouthAsian ? "en-IN" : "en-US";
      let formattedNumber = numeric.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      // Custom separator handling
      const decSep = settings.decimalsSeparator?.includes("Comma") ? "," : ".";
      const thouSep =
        settings.thousandsSeparator === "Dot"
          ? "."
          : settings.thousandsSeparator === "Space"
          ? " "
          : ",";

      if (decSep === "," && thouSep === ".") {
        formattedNumber = formattedNumber.replace(/,/g, "TEMP").replace(/\./g, ",").replace(/TEMP/g, ".");
      } else if (decSep === "," && thouSep === " ") {
        formattedNumber = formattedNumber.replace(/,/g, " ").replace(/\./g, ",");
      } else if (decSep === "." && thouSep === " ") {
        formattedNumber = formattedNumber.replace(/,/g, " ");
      }

      // Display symbol placement: Before, After, or Disable
      const position = settings.displayCurrencySymbol || "Before";
      if (position === "Disable") {
        return formattedNumber;
      }
      if (position === "After") {
        return `${formattedNumber} ${currencySymbol}`;
      }
      return `${currencySymbol}${formattedNumber}`;
    },
    [
      settings.decimals,
      settings.southAsianCurrencyFormat,
      settings.decimalsSeparator,
      settings.thousandsSeparator,
      settings.displayCurrencySymbol,
      currencySymbol,
    ]
  );

  // Quantity formatter helper - fully functional with quantityDecimals
  const formatQuantity = useCallback(
    (quantity: number | string): string => {
      const numeric = typeof quantity === "string" ? parseFloat(quantity) || 0 : quantity || 0;
      const decimals = typeof settings.quantityDecimals === "number" ? settings.quantityDecimals : 2;
      return numeric.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },
    [settings.quantityDecimals]
  );

  // Date formatter helper based on settings.dateFormat (e.g. 'dd-mm-yyyy', 'yyyy-mm-dd')
  const formatDate = useCallback(
    (dateInput?: Date | string | null): string => {
      if (!dateInput) return "";
      const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      if (isNaN(d.getTime())) return String(dateInput);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear());

      const fmt = (settings.dateFormat || "dd-mm-yyyy").toLowerCase();
      if (fmt.includes("yyyy-mm-dd")) {
        return `${year}-${month}-${day}`;
      }
      if (fmt.includes("mm-dd-yyyy")) {
        return `${month}-${day}-${year}`;
      }
      if (fmt.includes("dd/mm/yyyy")) {
        return `${day}/${month}/${year}`;
      }
      // Default: dd-mm-yyyy
      return `${day}-${month}-${year}`;
    },
    [settings.dateFormat]
  );

  const value = useMemo<SettingsContextType>(
    () => ({
      settings,
      isLoading,
      currencySymbol,
      formatCurrency,
      formatQuantity,
      formatDate,
      refreshSettings: fetchSettings,
      updateSettings,
      changeThemeWithAnimation,
    }),
    [
      settings,
      isLoading,
      currencySymbol,
      formatCurrency,
      formatQuantity,
      formatDate,
      fetchSettings,
      updateSettings,
      changeThemeWithAnimation,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
