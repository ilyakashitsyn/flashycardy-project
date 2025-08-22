"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BillingSwitchProps {
  onToggle?: (isAnnual: boolean) => void;
  defaultChecked?: boolean;
  className?: string;
  integrationMode?: "clerk" | "standalone";
}

export const BillingSwitch: React.FC<BillingSwitchProps> = ({
  onToggle,
  defaultChecked = false,
  className = "",
  integrationMode = "standalone",
}) => {
  const [isAnnual, setIsAnnual] = useState(defaultChecked);

  const handleToggle = (checked: boolean) => {
    setIsAnnual(checked);
    onToggle?.(checked);
  };

  return (
    <div
      className={`billing-switch-container flex items-center gap-3 ${className}`}
    >
      <Label
        htmlFor="billing-switch"
        className={`text-sm font-medium transition-colors cursor-pointer select-none ${
          !isAnnual ? "text-foreground" : "text-muted-foreground"
        }`}
        onClick={() => handleToggle(false)}
      >
        Monthly
      </Label>
      <Switch
        id="billing-switch"
        checked={isAnnual}
        onCheckedChange={handleToggle}
        className="billing-switch"
        aria-label="Toggle between monthly and annual billing"
      />
      <Label
        htmlFor="billing-switch"
        className={`text-sm font-medium transition-colors cursor-pointer select-none ${
          isAnnual ? "text-foreground" : "text-muted-foreground"
        }`}
        onClick={() => handleToggle(true)}
      >
        Billed annually
        {isAnnual && (
          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Save 20%
          </span>
        )}
      </Label>
    </div>
  );
};

export default BillingSwitch;
