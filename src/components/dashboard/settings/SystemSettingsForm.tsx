"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  settingsService,
  SystemSettingsData,
} from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sliders,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export function SystemSettingsForm() {
  const t = useTranslations("settingsMenu");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<SystemSettingsData>({
    siteName: "Sunshine IT",
    language: "English",
    defaultCurrency: "BDT",
    accountingMethod: "AVCO (Average Cost Method)",
    defaultEmail: "sunshine.com.bd@gmail.com",
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
    defaultWarehouse: "Uth (1)",
    defaultBiller: "Sunshine IT",
    pdfLibrary: "mPDF",
    useCodeForSlug: "Enable",
  });

  // Fetch initial settings from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const data = await settingsService.getSystemSettings();
        if (isMounted && data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err: any) {
        console.error("Failed to load system settings:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    field: keyof SystemSettingsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await settingsService.updateSystemSettings({
        ...formData,
        numberDaysDisableEditing: Number(formData.numberDaysDisableEditing) || 0,
        rowsPerPage: Number(formData.rowsPerPage) || 10,
      });
      setFormData(updated);
      setSuccessMessage("System settings updated successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full border-border bg-card p-10 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground font-normal">
          Loading system settings...
        </p>
      </Card>
    );
  }

  // Consistent select dropdown styling with clean non-bold font
  const selectClassName =
    "h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground font-normal outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring cursor-pointer";

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
              {t("systemSettings")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure global system parameters, accounting policies, localization, and station defaults.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground font-normal">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Active Configuration</span>
        </div>
      </div>

      {/* Form Container - Full Width */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Alerts */}
        {successMessage && (
          <div className="w-full flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-normal animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="w-full flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-normal animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Card className="w-full border-border bg-card p-5 sm:p-7 shadow-xs space-y-6">
          {/* 3-Column Responsive Grid (Full width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {/* 1. Site Name * */}
            <div className="space-y-1.5">
              <Label htmlFor="siteName" className="text-xs font-normal text-foreground">
                Site Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                required
                className="h-9 text-xs font-normal"
                placeholder="Sunshine IT"
              />
            </div>

            {/* 2. Language * */}
            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs font-normal text-foreground">
                Language <span className="text-destructive">*</span>
              </Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className={selectClassName}
              >
                <option value="English">English</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            {/* 3. Default Currency * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultCurrency" className="text-xs font-normal text-foreground">
                Default Currency <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultCurrency"
                value={formData.defaultCurrency}
                onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                className={selectClassName}
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SAR">SAR</option>
                <option value="AED">AED</option>
              </select>
            </div>

            {/* 4. Accounting Method * */}
            <div className="space-y-1.5">
              <Label htmlFor="accountingMethod" className="text-xs font-normal text-foreground">
                Accounting Method <span className="text-destructive">*</span>
              </Label>
              <select
                id="accountingMethod"
                value={formData.accountingMethod}
                onChange={(e) => handleChange("accountingMethod", e.target.value)}
                className={selectClassName}
              >
                <option value="AVCO (Average Cost Method)">AVCO (Average Cost Method)</option>
                <option value="FIFO (First In First Out)">FIFO (First In First Out)</option>
                <option value="LIFO (Last In First Out)">LIFO (Last In First Out)</option>
              </select>
            </div>

            {/* 5. Default Email * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultEmail" className="text-xs font-normal text-foreground">
                Default Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="defaultEmail"
                type="email"
                value={formData.defaultEmail}
                onChange={(e) => handleChange("defaultEmail", e.target.value)}
                required
                className="h-9 text-xs font-normal"
                placeholder="sunshine.com.bd@gmail.com"
              />
            </div>

            {/* 6. Default Customer Group * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultCustomerGroup" className="text-xs font-normal text-foreground">
                Default Customer Group <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultCustomerGroup"
                value={formData.defaultCustomerGroup}
                onChange={(e) => handleChange("defaultCustomerGroup", e.target.value)}
                className={selectClassName}
              >
                <option value="General">General</option>
                <option value="VIP">VIP</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* 7. Default Price Group * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultPriceGroup" className="text-xs font-normal text-foreground">
                Default Price Group <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultPriceGroup"
                value={formData.defaultPriceGroup}
                onChange={(e) => handleChange("defaultPriceGroup", e.target.value)}
                className={selectClassName}
              >
                <option value="Default">Default</option>
                <option value="Retail Counter">Retail Counter</option>
                <option value="Wholesale Bulk">Wholesale Bulk</option>
                <option value="Distributor Special">Distributor Special</option>
              </select>
            </div>

            {/* 8. Maintenance Mode * */}
            <div className="space-y-1.5">
              <Label htmlFor="maintenanceMode" className="text-xs font-normal text-foreground">
                Maintenance Mode <span className="text-destructive">*</span>
              </Label>
              <select
                id="maintenanceMode"
                value={formData.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.value)}
                className={selectClassName}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* 9. Theme * */}
            <div className="space-y-1.5">
              <Label htmlFor="theme" className="text-xs font-normal text-foreground">
                Theme <span className="text-destructive">*</span>
              </Label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className={selectClassName}
              >
                <option value="Default">Default</option>
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            {/* 10. RTL Support * */}
            <div className="space-y-1.5">
              <Label htmlFor="rtlSupport" className="text-xs font-normal text-foreground">
                RTL Support <span className="text-destructive">*</span>
              </Label>
              <select
                id="rtlSupport"
                value={formData.rtlSupport}
                onChange={(e) => handleChange("rtlSupport", e.target.value)}
                className={selectClassName}
              >
                <option value="Disable">Disable</option>
                <option value="Enable">Enable</option>
              </select>
            </div>

            {/* 11. Login Captcha * */}
            <div className="space-y-1.5">
              <Label htmlFor="loginCaptcha" className="text-xs font-normal text-foreground">
                Login Captcha <span className="text-destructive">*</span>
              </Label>
              <select
                id="loginCaptcha"
                value={formData.loginCaptcha}
                onChange={(e) => handleChange("loginCaptcha", e.target.value)}
                className={selectClassName}
              >
                <option value="Disable">Disable</option>
                <option value="Enable">Enable</option>
              </select>
            </div>

            {/* 12. Number of days to disable editing * */}
            <div className="space-y-1.5">
              <Label htmlFor="numberDaysDisableEditing" className="text-xs font-normal text-foreground">
                Number of days to disable editing <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numberDaysDisableEditing"
                type="number"
                min="0"
                value={formData.numberDaysDisableEditing}
                onChange={(e) => handleChange("numberDaysDisableEditing", parseInt(e.target.value, 10) || 0)}
                required
                className="h-9 text-xs font-normal"
                placeholder="0"
              />
            </div>

            {/* 13. Rows per page * */}
            <div className="space-y-1.5">
              <Label htmlFor="rowsPerPage" className="text-xs font-normal text-foreground">
                Rows per page <span className="text-destructive">*</span>
              </Label>
              <select
                id="rowsPerPage"
                value={formData.rowsPerPage}
                onChange={(e) => handleChange("rowsPerPage", parseInt(e.target.value, 10) || 10)}
                className={selectClassName}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* 14. Date Format * */}
            <div className="space-y-1.5">
              <Label htmlFor="dateFormat" className="text-xs font-normal text-foreground">
                Date Format <span className="text-destructive">*</span>
              </Label>
              <select
                id="dateFormat"
                value={formData.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className={selectClassName}
              >
                <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                <option value="mm-dd-yyyy">mm-dd-yyyy</option>
                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
              </select>
            </div>

            {/* 15. Timezone * */}
            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs font-normal text-foreground">
                Timezone <span className="text-destructive">*</span>
              </Label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className={selectClassName}
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="Africa/Algiers">Africa/Algiers</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
            </div>

            {/* 16. Calender * */}
            <div className="space-y-1.5">
              <Label htmlFor="calender" className="text-xs font-normal text-foreground">
                Calender <span className="text-destructive">*</span>
              </Label>
              <select
                id="calender"
                value={formData.calender}
                onChange={(e) => handleChange("calender", e.target.value)}
                className={selectClassName}
              >
                <option value="Shared">Shared</option>
                <option value="Private">Private</option>
              </select>
            </div>

            {/* 17. Default Warehouse * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultWarehouse" className="text-xs font-normal text-foreground">
                Default Warehouse <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultWarehouse"
                value={formData.defaultWarehouse}
                onChange={(e) => handleChange("defaultWarehouse", e.target.value)}
                className={selectClassName}
              >
                <option value="Uth (1)">Uth (1)</option>
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="Central Storage">Central Storage</option>
                <option value="Branch Outlet 01">Branch Outlet 01</option>
              </select>
            </div>

            {/* 18. Default Biller * */}
            <div className="space-y-1.5">
              <Label htmlFor="defaultBiller" className="text-xs font-normal text-foreground">
                Default Biller <span className="text-destructive">*</span>
              </Label>
              <select
                id="defaultBiller"
                value={formData.defaultBiller}
                onChange={(e) => handleChange("defaultBiller", e.target.value)}
                className={selectClassName}
              >
                <option value="Sunshine IT">Sunshine IT</option>
                <option value="Apex POS">Apex POS</option>
                <option value="Head Office Retail">Head Office Retail</option>
              </select>
            </div>

            {/* 19. PDF Library * */}
            <div className="space-y-1.5">
              <Label htmlFor="pdfLibrary" className="text-xs font-normal text-foreground">
                PDF Library <span className="text-destructive">*</span>
              </Label>
              <select
                id="pdfLibrary"
                value={formData.pdfLibrary}
                onChange={(e) => handleChange("pdfLibrary", e.target.value)}
                className={selectClassName}
              >
                <option value="mPDF">mPDF</option>
                <option value="DOMPDF">DOMPDF</option>
              </select>
            </div>

            {/* 20. Use code for slug * */}
            <div className="space-y-1.5">
              <Label htmlFor="useCodeForSlug" className="text-xs font-normal text-foreground">
                Use code for slug <span className="text-destructive">*</span>
              </Label>
              <select
                id="useCodeForSlug"
                value={formData.useCodeForSlug}
                onChange={(e) => handleChange("useCodeForSlug", e.target.value)}
                className={selectClassName}
              >
                <option value="Enable">Enable</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground font-normal">
              * Required system parameters will immediately affect store calculations and invoice generation.
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
                    <span>Updating Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Settings</span>
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
