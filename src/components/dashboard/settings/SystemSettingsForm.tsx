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

  const handleChange = (
    field: keyof SystemSettingsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        <p className="text-xs text-muted-foreground font-normal">
          {t("loading")}
        </p>
      </Card>
    );
  }

  // Consistent select dropdown styling with clean non-bold font
  const selectClassName =
    "h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground font-normal outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring cursor-pointer";

  const isBn = currentLocale === "bn";

  return (
    <div className="w-full space-y-6">
      {/* Section Header - Clean with no icon next to title */}
      <div className="pb-3 border-b border-border/50">
        <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("subtitle")}
        </p>
      </div>

      {/* Settings Form Grid - Full Width & Fully Responsive */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <Card className="border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {/* 1. Site Name */}
            <div className="space-y-1.5">
              <Label htmlFor="siteName" className="text-xs font-normal text-foreground">
                {t("siteName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                placeholder={t("siteNamePlaceholder")}
                required
                className="text-xs h-9 font-normal"
              />
            </div>

            {/* 2. Language (English & Bengali only) */}
            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs font-normal text-foreground">
                {t("language")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className={selectClassName}
              >
                <option value="English">English</option>
                <option value="Bengali">{isBn ? "বাংলা (Bengali)" : "Bengali (বাংলা)"}</option>
              </select>
            </div>

            {/* 3. Default Currency */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultCurrency" className="text-xs font-normal text-foreground">
                {t("defaultCurrency")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultCurrency"
                value={formData.defaultCurrency}
                onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                className={selectClassName}
              >
                <option value="BDT">{isBn ? "বিডিটি (৳ - বাংলাদেশি টাকা)" : "BDT (৳ - Bangladeshi Taka)"}</option>
                <option value="USD">{isBn ? "ইউএসডি ($ - মার্কিন ডলার)" : "USD ($ - US Dollar)"}</option>
                <option value="EUR">{isBn ? "ইউরো (€ - ইউরোপীয় ইউরো)" : "EUR (€ - Euro)"}</option>
                <option value="GBP">{isBn ? "জিবিপি (£ - ব্রিটিশ পাউন্ড)" : "GBP (£ - British Pound)"}</option>
                <option value="INR">{isBn ? "আইএনআর (₹ - ভারতীয় রুপি)" : "INR (₹ - Indian Rupee)"}</option>
                <option value="SAR">{isBn ? "এসএআর (﷼ - সৌদি রিয়াল)" : "SAR (﷼ - Saudi Riyal)"}</option>
                <option value="AED">{isBn ? "এইডি (د.إ - আমিরাত দিরহাম)" : "AED (د.إ - UAE Dirham)"}</option>
              </select>
            </div>

            {/* 4. Accounting Method */}
            <div className="space-y-1.5">
              <Label htmlFor="accountingMethod" className="text-xs font-normal text-foreground">
                {t("accountingMethod")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="accountingMethod"
                value={formData.accountingMethod}
                onChange={(e) => handleChange("accountingMethod", e.target.value)}
                className={selectClassName}
              >
                <option value="AVCO (Average Cost Method)">
                  {isBn ? "এভকো (AVCO - গড় খরচ পদ্ধতি)" : "AVCO (Average Cost Method)"}
                </option>
                <option value="FIFO (First In First Out)">
                  {isBn ? "ফিফো (FIFO - আগে আসা পণ্য আগে বিক্রি)" : "FIFO (First In First Out)"}
                </option>
                <option value="LIFO (Last In First Out)">
                  {isBn ? "লিফো (LIFO - পরে আসা পণ্য আগে বিক্রি)" : "LIFO (Last In First Out)"}
                </option>
              </select>
            </div>

            {/* 5. Default Email */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultEmail" className="text-xs font-normal text-foreground">
                {t("defaultEmail")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="defaultEmail"
                type="email"
                value={formData.defaultEmail}
                onChange={(e) => handleChange("defaultEmail", e.target.value)}
                placeholder={t("defaultEmailPlaceholder")}
                required
                className="text-xs h-9 font-normal"
              />
            </div>

            {/* 6. Default Customer Group */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultCustomerGroup" className="text-xs font-normal text-foreground">
                {t("defaultCustomerGroup")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultCustomerGroup"
                value={formData.defaultCustomerGroup}
                onChange={(e) => handleChange("defaultCustomerGroup", e.target.value)}
                className={selectClassName}
              >
                <option value="General">{isBn ? "সাধারণ (General)" : "General"}</option>
                <option value="Retail">{isBn ? "খুচরা (Retail)" : "Retail"}</option>
                <option value="Wholesale">{isBn ? "পাইকারি (Wholesale)" : "Wholesale"}</option>
                <option value="VIP">{isBn ? "ভিআইপি (VIP)" : "VIP"}</option>
              </select>
            </div>

            {/* 7. Default Price Group */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultPriceGroup" className="text-xs font-normal text-foreground">
                {t("defaultPriceGroup")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultPriceGroup"
                value={formData.defaultPriceGroup}
                onChange={(e) => handleChange("defaultPriceGroup", e.target.value)}
                className={selectClassName}
              >
                <option value="Default">{isBn ? "ডিফল্ট (Default)" : "Default"}</option>
                <option value="Retail Tier 1">{isBn ? "খুচরা টায়ার ১ (Retail Tier 1)" : "Retail Tier 1"}</option>
                <option value="Wholesale Tier 2">{isBn ? "পাইকারি টায়ার ২ (Wholesale Tier 2)" : "Wholesale Tier 2"}</option>
              </select>
            </div>

            {/* 8. Maintenance Mode */}
            <div className="space-y-1.5">
              <Label htmlFor="maintenanceMode" className="text-xs font-normal text-foreground">
                {t("maintenanceMode")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="maintenanceMode"
                value={formData.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.value)}
                className={selectClassName}
              >
                <option value="No">{t("no")}</option>
                <option value="Yes">{t("yes")}</option>
              </select>
            </div>

            {/* 9. Theme with Liquid Ripple Animation */}
            <div className="space-y-1.5">
              <Label htmlFor="theme" className="text-xs font-normal text-foreground">
                {t("theme")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e) => {
                  const newTheme = e.target.value;
                  handleChange("theme", newTheme);
                  const rect = e.currentTarget.getBoundingClientRect();
                  changeThemeWithAnimation(newTheme, {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                }}
                className={selectClassName}
              >
                <option value="Default">{t("themeDefault")}</option>
                <option value="Light">{t("themeLight")}</option>
                <option value="Dark">{t("themeDark")}</option>
              </select>
            </div>

            {/* 10. RTL Support */}
            <div className="space-y-1.5">
              <Label htmlFor="rtlSupport" className="text-xs font-normal text-foreground">
                {t("rtlSupport")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="rtlSupport"
                value={formData.rtlSupport}
                onChange={(e) => handleChange("rtlSupport", e.target.value)}
                className={selectClassName}
              >
                <option value="Disable">{t("disable")}</option>
                <option value="Enable">{t("enable")}</option>
              </select>
            </div>

            {/* 11. Login Captcha */}
            <div className="space-y-1.5">
              <Label htmlFor="loginCaptcha" className="text-xs font-normal text-foreground">
                {t("loginCaptcha")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="loginCaptcha"
                value={formData.loginCaptcha}
                onChange={(e) => handleChange("loginCaptcha", e.target.value)}
                className={selectClassName}
              >
                <option value="Disable">{t("disable")}</option>
                <option value="Enable">{t("enable")}</option>
              </select>
            </div>

            {/* 12. Number of days to disable editing */}
            <div className="space-y-1.5">
              <Label htmlFor="numberDaysDisableEditing" className="text-xs font-normal text-foreground">
                {t("numberDaysDisableEditing")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numberDaysDisableEditing"
                type="number"
                min="0"
                value={formData.numberDaysDisableEditing}
                onChange={(e) => handleChange("numberDaysDisableEditing", e.target.value)}
                required
                className="text-xs h-9 font-normal"
              />
            </div>

            {/* 13. Rows per page */}
            <div className="space-y-1.5">
              <Label htmlFor="rowsPerPage" className="text-xs font-normal text-foreground">
                {t("rowsPerPage")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="rowsPerPage"
                value={formData.rowsPerPage}
                onChange={(e) => handleChange("rowsPerPage", e.target.value)}
                className={selectClassName}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            {/* 14. Date Format */}
            <div className="space-y-1.5">
              <Label htmlFor="dateFormat" className="text-xs font-normal text-foreground">
                {t("dateFormat")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="dateFormat"
                value={formData.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className={selectClassName}
              >
                <option value="dd-mm-yyyy">dd-mm-yyyy (08-11-2026)</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd (2026-11-08)</option>
                <option value="mm-dd-yyyy">mm-dd-yyyy (11-08-2026)</option>
                <option value="dd/mm/yyyy">dd/mm/yyyy (08/11/2026)</option>
              </select>
            </div>

            {/* 15. Timezone */}
            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs font-normal text-foreground">
                {t("timezone")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className={selectClassName}
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="Africa/Algiers">Africa/Algiers (GMT+1)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            {/* 16. Calender */}
            <div className="space-y-1.5">
              <Label htmlFor="calender" className="text-xs font-normal text-foreground">
                {t("calender")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="calender"
                value={formData.calender}
                onChange={(e) => handleChange("calender", e.target.value)}
                className={selectClassName}
              >
                <option value="Shared">{t("shared")}</option>
                <option value="Private">{t("private")}</option>
              </select>
            </div>

            {/* 17. Default Warehouse */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultWarehouse" className="text-xs font-normal text-foreground">
                {t("defaultWarehouse")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultWarehouse"
                value={formData.defaultWarehouse}
                onChange={(e) => handleChange("defaultWarehouse", e.target.value)}
                className={selectClassName}
              >
                <option value="Uth (1)">Uth (1)</option>
                <option value="Central Warehouse">{isBn ? "সেন্ট্রাল ওয়্যারহাউস" : "Central Warehouse"}</option>
                <option value="Outlet 1 Stock">{isBn ? "আউটলেট ১ স্টক" : "Outlet 1 Stock"}</option>
              </select>
            </div>

            {/* 18. Default Biller */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultBiller" className="text-xs font-normal text-foreground">
                {t("defaultBiller")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="defaultBiller"
                value={formData.defaultBiller}
                onChange={(e) => handleChange("defaultBiller", e.target.value)}
                placeholder={t("defaultBillerPlaceholder")}
                required
                className="text-xs h-9 font-normal"
              />
            </div>

            {/* 19. PDF Library */}
            <div className="space-y-1.5">
              <Label htmlFor="pdfLibrary" className="text-xs font-normal text-foreground">
                {t("pdfLibrary")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="pdfLibrary"
                value={formData.pdfLibrary}
                onChange={(e) => handleChange("pdfLibrary", e.target.value)}
                className={selectClassName}
              >
                <option value="mPDF">mPDF</option>
                <option value="DOMPDF">DOMPDF</option>
                <option value="TCPDF">TCPDF</option>
              </select>
            </div>

            {/* 20. Use code for slug */}
            <div className="space-y-1.5">
              <Label htmlFor="useCodeForSlug" className="text-xs font-normal text-foreground">
                {t("useCodeForSlug")} <span className="text-destructive">*</span>
              </Label>
              <select
                id="useCodeForSlug"
                value={formData.useCodeForSlug}
                onChange={(e) => handleChange("useCodeForSlug", e.target.value)}
                className={selectClassName}
              >
                <option value="Enable">{t("enable")}</option>
                <option value="Disable">{t("disable")}</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground font-normal">
              {t("notice")}
            </p>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto gap-2 text-xs font-normal h-9.5 px-5 cursor-pointer"
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
