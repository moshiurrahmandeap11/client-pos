"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { posSettingsService, PosSettingsData } from "@/services/posSettings.service";
import { useSettings } from "@/hooks/useSettings";
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
  MonitorCheck,
  CheckCircle2,
} from "lucide-react";

export const DEFAULT_POS_SETTINGS: PosSettingsData = {
  displayProducts: 100,
  posPinCode: "",
  defaultCategory: "Grocery",
  defaultBiller: "Sunshine IT",
  defaultCustomer: "Walking Customer",
  displayTime: "No",
  onScreenKeyboard: "Yes",
  productButtonColor: "Default",
  tooltips: "No",
  rounding: "To nearest number (integer)",
  itemOrder: "Default",
  afterSalePage: "Receipt",
  displayCustomerDetailsOnReceipt: "Yes",
};

export function PosSettingsForm() {
  const t = useTranslations("posConfiguration");
  const { settings: systemSettings } = useSettings();

  // Dynamic system biller configured in System Settings
  const systemBiller =
    systemSettings?.defaultBiller?.trim() || "Sunshine IT";

  const [formData, setFormData] = useState<PosSettingsData>({
    ...DEFAULT_POS_SETTINGS,
    defaultBiller: systemBiller,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial POS settings from API
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await posSettingsService.getPosSettings();
        if (data && isMounted) {
          setFormData({
            ...data,
            // If defaultBiller is empty, inherit from system settings
            defaultBiller: data.defaultBiller?.trim() || systemBiller,
          });
        }
      } catch (err: any) {
        console.warn("Could not load remote POS settings, using defaults:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [systemBiller]);

  // Dynamically compute biller options: includes the system's default biller, current biller, and company name
  const billerOptions = useMemo(() => {
    const rawList = [
      systemBiller,
      formData.defaultBiller,
      systemSettings?.siteName,
      "Sunshine IT",
      "Apex Retail",
      "Apex POS",
    ].filter((b): b is string => Boolean(b && b.trim()));

    return Array.from(new Set(rawList));
  }, [systemBiller, formData.defaultBiller, systemSettings?.siteName]);

  // Standard input change
  const handleChange = (
    field: keyof PosSettingsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Immediate auto-save handler for dropdown selections
  const handleDropdownChange = async (
    field: keyof PosSettingsData,
    value: string | null
  ) => {
    if (!value) return;

    const updatedForm: PosSettingsData = {
      ...formData,
      [field]: field === "displayProducts" ? Number(value) || 100 : value,
    };
    setFormData(updatedForm);

    try {
      const payload: Partial<PosSettingsData> = {
        ...updatedForm,
        displayProducts: Number(updatedForm.displayProducts) || 100,
      };

      const result = await posSettingsService.updatePosSettings(payload);
      setFormData((prev) => ({
        ...prev,
        ...result,
        defaultBiller: result.defaultBiller || updatedForm.defaultBiller,
      }));
      toast.success(t("successMessage"));
    } catch (err: any) {
      toast.error(err.message || t("errorMessage"));
    }
  };

  // Manual Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Partial<PosSettingsData> = {
        ...formData,
        displayProducts: Number(formData.displayProducts) || 100,
      };

      const updated = await posSettingsService.updatePosSettings(payload);
      setFormData((prev) => ({
        ...prev,
        ...updated,
        defaultBiller: updated.defaultBiller || formData.defaultBiller,
      }));
      toast.success(t("successMessage"));
    } catch (err: any) {
      toast.error(err.message || t("errorMessage"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight flex items-center gap-2">
            <MonitorCheck className="h-5 w-5 text-primary" />
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400 font-normal">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Active Configuration</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card with ScreenShot Header Tab [ POS Configuration ] */}
        <div className="relative rounded-xl border border-border bg-card p-5 sm:p-7 shadow-xs">
          {/* Top Left Badge/Tab */}
          <div className="absolute -top-3.5 left-5 inline-flex items-center rounded-md border border-primary/20 bg-card px-3 py-0.5 text-xs font-medium text-primary shadow-2xs">
            {t("tabBadge")}
          </div>

          {/* 3-Column Grid for all 13 fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            
            {/* 1. Display Products * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("displayProducts")} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                max={1000}
                required
                value={formData.displayProducts}
                onChange={(e) => handleChange("displayProducts", Number(e.target.value) || 0)}
                placeholder={t("displayProductsPlaceholder")}
                className="h-9.5 text-xs sm:text-[13px] bg-background"
              />
            </div>

            {/* 2. POS Pin Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("posPinCode")}
              </Label>
              <Input
                type="text"
                value={formData.posPinCode || ""}
                onChange={(e) => handleChange("posPinCode", e.target.value)}
                placeholder={t("posPinCodePlaceholder")}
                className="h-9.5 text-xs sm:text-[13px] bg-background"
              />
            </div>

            {/* 3. Default Category * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("defaultCategory")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultCategory || "Grocery"}
                onValueChange={(val) => handleDropdownChange("defaultCategory", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("defaultCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grocery">Grocery</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Default Biller * (Inherited dynamically from System Settings) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground">
                  {t("defaultBiller")} <span className="text-destructive">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  System: {systemBiller}
                </span>
              </div>
              <Select
                value={formData.defaultBiller || systemBiller}
                onValueChange={(val) => handleDropdownChange("defaultBiller", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("defaultBiller")} />
                </SelectTrigger>
                <SelectContent>
                  {billerOptions.map((biller) => (
                    <SelectItem key={biller} value={biller}>
                      {biller} {biller === systemBiller ? `(${t("systemDefault")})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 5. Default Customer * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("defaultCustomer")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.defaultCustomer || "Walking Customer"}
                onValueChange={(val) => handleDropdownChange("defaultCustomer", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("defaultCustomer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Walking Customer">Walking Customer</SelectItem>
                  <SelectItem value="Regular Customer">Regular Customer</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="VIP Customer">VIP Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Display Time * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("displayTime")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.displayTime || "No"}
                onValueChange={(val) => handleDropdownChange("displayTime", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("displayTime")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">{t("no")}</SelectItem>
                  <SelectItem value="Yes">{t("yes")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. On-Screen Keyboard * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("onScreenKeyboard")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.onScreenKeyboard || "Yes"}
                onValueChange={(val) => handleDropdownChange("onScreenKeyboard", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("onScreenKeyboard")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">{t("yes")}</SelectItem>
                  <SelectItem value="No">{t("no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 8. Product Button Color * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("productButtonColor")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.productButtonColor || "Default"}
                onValueChange={(val) => handleDropdownChange("productButtonColor", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("productButtonColor")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">{t("default")}</SelectItem>
                  <SelectItem value="Primary">{t("primary")}</SelectItem>
                  <SelectItem value="Success">{t("success")}</SelectItem>
                  <SelectItem value="Info">{t("info")}</SelectItem>
                  <SelectItem value="Warning">{t("warning")}</SelectItem>
                  <SelectItem value="Danger">{t("danger")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 9. Tool tips * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("tooltips")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.tooltips || "No"}
                onValueChange={(val) => handleDropdownChange("tooltips", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("tooltips")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">{t("no")}</SelectItem>
                  <SelectItem value="Yes">{t("yes")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 10. Rounding * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("rounding")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.rounding || "To nearest number (integer)"}
                onValueChange={(val) => handleDropdownChange("rounding", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("rounding")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To nearest number (integer)">
                    {t("roundingNearestInteger")}
                  </SelectItem>
                  <SelectItem value="To nearest 0.05">
                    {t("roundingNearest005")}
                  </SelectItem>
                  <SelectItem value="To nearest 0.10">
                    {t("roundingNearest010")}
                  </SelectItem>
                  <SelectItem value="To nearest 0.50">
                    {t("roundingNearest050")}
                  </SelectItem>
                  <SelectItem value="Disable">
                    {t("roundingDisable")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 11. Item Order * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("itemOrder")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.itemOrder || "Default"}
                onValueChange={(val) => handleDropdownChange("itemOrder", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("itemOrder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">{t("itemOrderDefault")}</SelectItem>
                  <SelectItem value="Alphabetical">{t("itemOrderAlphabetical")}</SelectItem>
                  <SelectItem value="Popularity">{t("itemOrderPopularity")}</SelectItem>
                  <SelectItem value="Category">{t("itemOrderCategory")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 12. After Sale Page * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("afterSalePage")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.afterSalePage || "Receipt"}
                onValueChange={(val) => handleDropdownChange("afterSalePage", val)}
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("afterSalePage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receipt">{t("afterSaleReceipt")}</SelectItem>
                  <SelectItem value="POS">{t("afterSalePos")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 13. Display Customer Details on Receipt * */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {t("displayCustomerDetailsOnReceipt")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.displayCustomerDetailsOnReceipt || "Yes"}
                onValueChange={(val) =>
                  handleDropdownChange("displayCustomerDetailsOnReceipt", val)
                }
              >
                <SelectTrigger className="h-9.5 text-xs sm:text-[13px] bg-background">
                  <SelectValue placeholder={t("displayCustomerDetailsOnReceipt")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">{t("yes")}</SelectItem>
                  <SelectItem value="No">{t("no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="gap-2 px-6 h-10 text-xs sm:text-[13px] font-normal cursor-pointer"
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
      </form>
    </div>
  );
}
