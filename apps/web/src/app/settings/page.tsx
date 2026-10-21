"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Settings, Moon, Sun, Monitor, Lock, Shield, User, Bell } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Settings</h1>
        <p className="text-xs text-muted-foreground">Manage your workspace preferences, appearance theme, and operational security controls</p>
      </div>

      {/* Appearance Section */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Appearance & Theme</h2>
        </div>
        <p className="text-xs text-muted-foreground">Select your preferred visual interface mode</p>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
              theme === "dark"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-ring"
            }`}
          >
            <Moon className="h-5 w-5" />
            <span>Dark Mode</span>
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
              theme === "light"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-ring"
            }`}
          >
            <Sun className="h-5 w-5" />
            <span>Light Mode</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
              theme === "system"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-ring"
            }`}
          >
            <Monitor className="h-5 w-5" />
            <span>System Sync</span>
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">User Profile & Role</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-muted-foreground font-medium">Display Name</label>
            <input
              type="text"
              defaultValue="Sarah Connor"
              className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground font-medium">Work Email</label>
            <input
              type="email"
              disabled
              defaultValue="admin@opsintel.com"
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {saved ? "Preferences Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
