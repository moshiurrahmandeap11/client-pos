"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { useSettings } from "@/hooks/useSettings";
import { SystemSettingsData } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Loader2,
} from "lucide-react";

export function SystemSettingsForm() {
  const t = useTranslations("systemSettings");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const {
    settings,
    updateSettings,
    changeThemeWithAnimation,
    isLoading: isContextLoading,
  } = useSettings();

  const [isSaving, setIsSaving] = useState(false);

  // Form State initialized from global context settings
  const [formData, setFormData] = useState<SystemSettingsData>(settings);

  // Synchronize local form whenever global settings change
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Handle standard text / number input changes
  const handleChange = (
    field: keyof SystemSettingsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Immediate auto-save handler for all dropdown selections
  const handleDropdownChange = async (
    field: keyof SystemSettingsData,
    value: string
  ) => {
    // 1. Immediately update local form data state
    const updatedForm: SystemSettingsData = {
      ...formData,
      [field]: field === "rowsPerPage" ? Number(value) : value,
    };
    setFormData(updatedForm);

    // 2. If changing theme, trigger smooth circular expanding ripple transition
    if (field === "theme") {
      changeThemeWithAnimation(value);
    }

    // 3. Auto-save to remote database without requiring button click
    try {
      const payload: Partial<SystemSettingsData> = {
        ...updatedForm,
        numberDaysDisableEditing: Number(updatedForm.numberDaysDisableEditing) || 0,
        rowsPerPage: Number(updatedForm.rowsPerPage) || 10,
        imageWidth: Number(updatedForm.imageWidth) || 800,
        imageHeight: Number(updatedForm.imageHeight) || 800,
        thumbnailWidth: Number(updatedForm.thumbnailWidth) || 150,
        thumbnailHeight: Number(updatedForm.thumbnailHeight) || 150,
      };

      await updateSettings(payload);
      toast.success(t("successMessage"));

      // If language changed, transition locale route immediately
      if (field === "language") {
        const targetLocale =
          value.toLowerCase().includes("bengali") ||
          value.toLowerCase().includes("bangla")
            ? "bn"
            : "en";

        if (targetLocale !== currentLocale) {
          if (typeof document !== "undefined") {
            document.documentElement.lang = targetLocale;
            document.documentElement.setAttribute("data-locale", targetLocale);
          }
          router.replace(pathname, { locale: targetLocale });
        }
      }
    } catch (err: any) {
      toast.error(err.message || t("errorMessage"));
    }
  };

  // Full form submission (for text and numeric fields like Site Name, Email, Biller, Days, Image Sizes)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Partial<SystemSettingsData> = {
        ...formData,
        numberDaysDisableEditing: Number(formData.numberDaysDisableEditing) || 0,
        rowsPerPage: Number(formData.rowsPerPage) || 10,
        imageWidth: Number(formData.imageWidth) || 800,
        imageHeight: Number(formData.imageHeight) || 800,
        thumbnailWidth: Number(formData.thumbnailWidth) || 150,
        thumbnailHeight: Number(formData.thumbnailHeight) || 150,
      };

      const updated = await updateSettings(payload);
      setFormData(updated);

      toast.success(t("successMessage"));

      // Dynamically apply selected Language locale across the site
      const targetLocale =
        formData.language?.toLowerCase().includes("bengali") ||
        formData.language?.toLowerCase().includes("bangla")
          ? "bn"
          : "en";

      if (targetLocale !== currentLocale) {
        if (typeof document !== "undefined") {
          document.documentElement.lang = targetLocale;
          document.documentElement.setAttribute("data-locale", targetLocale);
        }
        router.replace(pathname, { locale: targetLocale });
      }
    } catch (err: any) {
      toast.error(err.message || t("errorMessage"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isContextLoading && !formData.siteName) {
    return (
      <Card className="w-full border-border bg-card p-10 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-xs sm:text-[13px] text-muted-foreground font-normal">
          {t("loading")}
        </p>
      </Card>
    );
  }

  const isBn = currentLocale === "bn";

  return (
    <div className="w-full space-y-6">
      {/* Section Header - Clean with no icon next to title */}
      <div className="pb-3 border-b border-border/50">
        <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs sm:text-[13.5px] text-muted-foreground mt-0.5">
          {t("subtitle")}
        </p>
      </div>

      {/* Settings Form Grid - Full Width & Fully Responsive */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <Card className="border-border bg-card p-5 sm:p-6 space-y-8 shadow-xs w-full">
          {/* Section 1: Main Site Configuration (20 fields) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {/* 1. Site Name */}
            <div className="space-y-1.5">
              <Label htmlFor="siteName" className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("siteName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="siteName"
                value={formData.siteName || ""}
                onChange={(e) => handleChange("siteName", e.target.value)}
                placeholder={t("siteNamePlaceholder")}
                required
                className="text-xs sm:text-[13px] h-9.5 font-normal"
              />
            </div>

            {/* 2. Language (English & Bengali only) */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("language")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.language || "English"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("language", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Bengali">
                    {isBn ? "বাংলা (Bengali)" : "Bengali (বাংলা)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Default Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultCurrency")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultCurrency || "BDT"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultCurrency", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">{isBn ? "বিডিটি (৳ - বাংলাদেশি টাকা)" : "BDT (৳ - Bangladeshi Taka)"}</SelectItem>
                  <SelectItem value="USD">{isBn ? "ইউএসডি ($ - মার্কিন ডলার)" : "USD ($ - US Dollar)"}</SelectItem>
                  <SelectItem value="EUR">{isBn ? "ইউরো (€ - ইউরোপীয় ইউরো)" : "EUR (€ - Euro)"}</SelectItem>
                  <SelectItem value="GBP">{isBn ? "জিবিপি (£ - ব্রিটিশ পাউন্ড)" : "GBP (£ - British Pound)"}</SelectItem>
                  <SelectItem value="INR">{isBn ? "আইএনআর (₹ - ভারতীয় রুপি)" : "INR (₹ - Indian Rupee)"}</SelectItem>
                  <SelectItem value="SAR">{isBn ? "এসএআর (﷼ - সৌদি রিয়াল)" : "SAR (﷼ - Saudi Riyal)"}</SelectItem>
                  <SelectItem value="AED">{isBn ? "এইডি (د.إ - আমিরাত দিরহাম)" : "AED (د.إ - UAE Dirham)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Accounting Method */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("accountingMethod")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.accountingMethod || "AVCO (Average Cost Method)"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("accountingMethod", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVCO (Average Cost Method)">
                    {isBn ? "এভকো (AVCO - গড় খরচ পদ্ধতি)" : "AVCO (Average Cost Method)"}
                  </SelectItem>
                  <SelectItem value="FIFO (First In First Out)">
                    {isBn ? "ফিফো (FIFO - আগে আসলে আগে ব্যয়)" : "FIFO (First In First Out)"}
                  </SelectItem>
                  <SelectItem value="LIFO (Last In First Out)">
                    {isBn ? "লিফো (LIFO - পরে আসলে আগে ব্যয়)" : "LIFO (Last In First Out)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Default Email */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultEmail" className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultEmail")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="defaultEmail"
                type="email"
                value={formData.defaultEmail || ""}
                onChange={(e) => handleChange("defaultEmail", e.target.value)}
                placeholder={t("defaultEmailPlaceholder")}
                required
                className="text-xs sm:text-[13px] h-9.5 font-normal"
              />
            </div>

            {/* 6. Default Customer Group */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultCustomerGroup")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultCustomerGroup || "General"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultCustomerGroup", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">{isBn ? "সাধারণ গ্রাহক (General)" : "General"}</SelectItem>
                  <SelectItem value="VIP">{isBn ? "ভিআইপি (VIP)" : "VIP"}</SelectItem>
                  <SelectItem value="Wholesale">{isBn ? "পাইকারি (Wholesale)" : "Wholesale"}</SelectItem>
                  <SelectItem value="Distributor">{isBn ? "পরিবেশক (Distributor)" : "Distributor"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. Default Price Group */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultPriceGroup")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultPriceGroup || "Default"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultPriceGroup", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">{isBn ? "ডিফল্ট (Default)" : "Default"}</SelectItem>
                  <SelectItem value="Retail Price">{isBn ? "খুচরা মূল্য (Retail Price)" : "Retail Price"}</SelectItem>
                  <SelectItem value="Wholesale Price">{isBn ? "পাইকারি মূল্য (Wholesale Price)" : "Wholesale Price"}</SelectItem>
                  <SelectItem value="Corporate Discount">{isBn ? "কর্পোরেট মূল্য (Corporate Discount)" : "Corporate Discount"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 8. Maintenance Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("maintenanceMode")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.maintenanceMode || "No"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("maintenanceMode", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">{t("no")}</SelectItem>
                  <SelectItem value="Yes">{t("yes")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 9. Theme */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("theme")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.theme || "Default"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("theme", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">{t("themeDefault")}</SelectItem>
                  <SelectItem value="Light">{t("themeLight")}</SelectItem>
                  <SelectItem value="Dark">{t("themeDark")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 10. RTL Support */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("rtlSupport")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.rtlSupport || "Disable"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("rtlSupport", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disable">{t("disable")}</SelectItem>
                  <SelectItem value="Enable">{t("enable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 11. Login Captcha */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("loginCaptcha")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.loginCaptcha || "Disable"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("loginCaptcha", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disable">{t("disable")}</SelectItem>
                  <SelectItem value="Enable">{t("enable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 12. Number of days to disable editing */}
            <div className="space-y-1.5">
              <Label htmlFor="numberDaysDisableEditing" className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("numberDaysDisableEditing")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numberDaysDisableEditing"
                type="number"
                min={0}
                value={formData.numberDaysDisableEditing ?? 0}
                onChange={(e) =>
                  handleChange("numberDaysDisableEditing", Number(e.target.value))
                }
                required
                className="text-xs sm:text-[13px] h-9.5 font-normal"
              />
            </div>

            {/* 13. Rows per page */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("rowsPerPage")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(formData.rowsPerPage || 10)}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("rowsPerPage", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 14. Date Format */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("dateFormat")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.dateFormat || "dd-mm-yyyy"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("dateFormat", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">dd-mm-yyyy (e.g. 08-11-2026)</SelectItem>
                  <SelectItem value="yyyy-mm-dd">yyyy-mm-dd (e.g. 2026-11-08)</SelectItem>
                  <SelectItem value="mm/dd/yyyy">mm/dd/yyyy (e.g. 11/08/2026)</SelectItem>
                  <SelectItem value="dd/mm/yyyy">dd/mm/yyyy (e.g. 08/11/2026)</SelectItem>
                  <SelectItem value="dd.mm.yyyy">dd.mm.yyyy (e.g. 08.11.2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 15. Timezone */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("timezone")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.timezone || "Asia/Dhaka"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("timezone", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                  <SelectItem value="Africa/Algiers">Africa/Algiers (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 16. Calender */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("calender")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.calender || "Shared"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("calender", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shared">{t("shared")}</SelectItem>
                  <SelectItem value="Private">{t("private")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 17. Default Warehouse */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultWarehouse")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultWarehouse || "Uth (1)"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultWarehouse", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uth (1)">Uth (1)</SelectItem>
                  <SelectItem value="Central Warehouse">{isBn ? "সেন্ট্রাল ওয়্যারহাউস" : "Central Warehouse"}</SelectItem>
                  <SelectItem value="Outlet 1 Stock">{isBn ? "আউটলেট ১ স্টক" : "Outlet 1 Stock"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 18. Default Biller */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultBiller" className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultBiller")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="defaultBiller"
                value={formData.defaultBiller || ""}
                onChange={(e) => handleChange("defaultBiller", e.target.value)}
                placeholder={t("defaultBillerPlaceholder")}
                required
                className="text-xs sm:text-[13px] h-9.5 font-normal"
              />
            </div>

            {/* 19. PDF Library */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("pdfLibrary")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.pdfLibrary || "mPDF"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("pdfLibrary", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mPDF">mPDF</SelectItem>
                  <SelectItem value="DOMPDF">DOMPDF</SelectItem>
                  <SelectItem value="TCPDF">TCPDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 20. Use code for slug */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("useCodeForSlug")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.useCodeForSlug || "Enable"}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("useCodeForSlug", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enable">{t("enable")}</SelectItem>
                  <SelectItem value="Disable">{t("disable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2: Products Configuration Sub-section */}
          <div className="w-full pt-2">
            {/* Subsection Tab Header */}
            <div className="flex items-center">
              <div className="px-4 py-1.5 text-xs sm:text-[13px] font-medium text-primary border border-border border-b-background bg-card rounded-t-md shadow-2xs z-10">
                {t("productsSection")}
              </div>
            </div>

            {/* Products Fields Box */}
            <div className="border border-border rounded-b-md rounded-tr-md p-5 sm:p-6 bg-muted/15 dark:bg-muted/10 -mt-[1px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {/* 1. Product Tax */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("productTax")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.productTax || "Enable"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("productTax", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enable">{t("enable")}</SelectItem>
                      <SelectItem value="Disable">{t("disable")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Racks */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("racks")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.racks || "Disable"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("racks", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disable">{t("disable")}</SelectItem>
                      <SelectItem value="Enable">{t("enable")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Product Variants */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("productVariants")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.productVariants || "Enable"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("productVariants", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enable">{t("enable")}</SelectItem>
                      <SelectItem value="Disable">{t("disable")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Product Expiry */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("productExpiry")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.productExpiry || "Disable"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("productExpiry", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disable">{t("disable")}</SelectItem>
                      <SelectItem value="Enable">{t("enable")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Remove expired products from stock */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("removeExpired")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.removeExpired || "No, I will remove manually"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("removeExpired", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No, I will remove manually">
                        {t("removeExpiredManual")}
                      </SelectItem>
                      <SelectItem value="Yes, remove automatically">
                        {t("removeExpiredAuto")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. Image Size (Width : Height) */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("imageSize")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Input
                      type="number"
                      min={1}
                      value={formData.imageWidth ?? 800}
                      onChange={(e) => handleChange("imageWidth", Number(e.target.value))}
                      placeholder="800"
                      required
                      className="text-xs sm:text-[13px] h-9.5 font-normal"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={formData.imageHeight ?? 800}
                      onChange={(e) => handleChange("imageHeight", Number(e.target.value))}
                      placeholder="800"
                      required
                      className="text-xs sm:text-[13px] h-9.5 font-normal"
                    />
                  </div>
                </div>

                {/* 7. Thumbnail Size (Width : Height) */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("thumbnailSize")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Input
                      type="number"
                      min={1}
                      value={formData.thumbnailWidth ?? 150}
                      onChange={(e) => handleChange("thumbnailWidth", Number(e.target.value))}
                      placeholder="150"
                      required
                      className="text-xs sm:text-[13px] h-9.5 font-normal"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={formData.thumbnailHeight ?? 150}
                      onChange={(e) => handleChange("thumbnailHeight", Number(e.target.value))}
                      placeholder="150"
                      required
                      className="text-xs sm:text-[13px] h-9.5 font-normal"
                    />
                  </div>
                </div>

                {/* 8. Watermark */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("watermark")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.watermark || "Yes"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("watermark", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">{t("yes")}</SelectItem>
                      <SelectItem value="No">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 9. Display warehouse products */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("displayWarehouseProducts")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.displayWarehouseProducts || "Hide with 0 quantity"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("displayWarehouseProducts", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hide with 0 quantity">
                        {t("hideWithZero")}
                      </SelectItem>
                      <SelectItem value="Show with 0 quantity">
                        {t("showWithZero")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 10. Barcode separator */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("barcodeSeparator")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.barcodeSeparator || "Dot (.)"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("barcodeSeparator", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dot (.)">{t("barcodeSeparatorDot")}</SelectItem>
                      <SelectItem value="Hyphen (-)">{t("barcodeSeparatorHyphen")}</SelectItem>
                      <SelectItem value="Underscore (_)">{t("barcodeSeparatorUnderscore")}</SelectItem>
                      <SelectItem value="Slash (/)">{t("barcodeSeparatorSlash")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 11. Barcode Renderer */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("barcodeRenderer")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.barcodeRenderer || "Image"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("barcodeRenderer", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Image">{t("barcodeRendererImage")}</SelectItem>
                      <SelectItem value="SVG">{t("barcodeRendererSvg")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 12. Update cost with purchase */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                    {t("updateCostWithPurchase")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.updateCostWithPurchase || "No"}
                    onValueChange={(val) => {
                      if (val) handleDropdownChange("updateCostWithPurchase", val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">{t("no")}</SelectItem>
                      <SelectItem value="Yes">{t("yes")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Next Module Tab Indicator (as shown in reference ERP mock) */}
            <div className="flex items-center pt-3">
              <div className="px-4 py-1 text-xs text-muted-foreground/60 border border-border/40 rounded-t-md bg-muted/20 select-none">
                Sales
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-[13px] text-muted-foreground font-normal">
              {t("notice")}
            </p>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto gap-2 text-xs sm:text-[13px] font-normal h-10 px-5 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("updatingButton")}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{t("updateButton")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
