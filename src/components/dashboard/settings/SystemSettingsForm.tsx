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

  // Handle standard text input changes
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

  // Full form submission (for text fields like Site Name, Email, Biller, Days)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Partial<SystemSettingsData> = {
        ...formData,
        numberDaysDisableEditing: Number(formData.numberDaysDisableEditing) || 0,
        rowsPerPage: Number(formData.rowsPerPage) || 10,
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
        <Card className="border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {/* 1. Site Name */}
            <div className="space-y-1.5">
              <Label htmlFor="siteName" className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("siteName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="siteName"
                value={formData.siteName}
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
                value={formData.language}
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
                value={formData.defaultCurrency}
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
                value={formData.accountingMethod}
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
                    {isBn ? "ফিফো (FIFO - আগে আসা পণ্য আগে বিক্রি)" : "FIFO (First In First Out)"}
                  </SelectItem>
                  <SelectItem value="LIFO (Last In First Out)">
                    {isBn ? "লিফো (LIFO - পরে আসা পণ্য আগে বিক্রি)" : "LIFO (Last In First Out)"}
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
                value={formData.defaultEmail}
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
                value={formData.defaultCustomerGroup}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultCustomerGroup", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">{isBn ? "সাধারণ (General)" : "General"}</SelectItem>
                  <SelectItem value="Retail">{isBn ? "খুচরা (Retail)" : "Retail"}</SelectItem>
                  <SelectItem value="Wholesale">{isBn ? "পাইকারি (Wholesale)" : "Wholesale"}</SelectItem>
                  <SelectItem value="VIP">{isBn ? "ভিআইপি (VIP)" : "VIP"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. Default Price Group */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("defaultPriceGroup")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultPriceGroup}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("defaultPriceGroup", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">{isBn ? "ডিফল্ট (Default)" : "Default"}</SelectItem>
                  <SelectItem value="Retail Tier 1">{isBn ? "খুচরা টায়ার ১ (Retail Tier 1)" : "Retail Tier 1"}</SelectItem>
                  <SelectItem value="Wholesale Tier 2">{isBn ? "পাইকারি টায়ার ২ (Wholesale Tier 2)" : "Wholesale Tier 2"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 8. Maintenance Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("maintenanceMode")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.maintenanceMode}
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

            {/* 9. Theme with Liquid Ripple Animation */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("theme")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.theme}
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
                value={formData.rtlSupport}
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
                value={formData.loginCaptcha}
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
                min="0"
                value={formData.numberDaysDisableEditing}
                onChange={(e) => handleChange("numberDaysDisableEditing", e.target.value)}
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
                value={String(formData.rowsPerPage)}
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
                value={formData.dateFormat}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("dateFormat", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">dd-mm-yyyy (08-11-2026)</SelectItem>
                  <SelectItem value="yyyy-mm-dd">yyyy-mm-dd (2026-11-08)</SelectItem>
                  <SelectItem value="mm-dd-yyyy">mm-dd-yyyy (11-08-2026)</SelectItem>
                  <SelectItem value="dd/mm/yyyy">dd/mm/yyyy (08/11/2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 15. Timezone */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("timezone")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(val) => {
                  if (val) handleDropdownChange("timezone", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                  <SelectItem value="Africa/Algiers">Africa/Algiers (GMT+1)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 16. Calender */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-[13px] font-normal text-foreground">
                {t("calender")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.calender}
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
                value={formData.defaultWarehouse}
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
                value={formData.defaultBiller}
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
                value={formData.pdfLibrary}
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
                value={formData.useCodeForSlug}
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
