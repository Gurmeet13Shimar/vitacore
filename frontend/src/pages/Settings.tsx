import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser } from "@/data/mockData";
import { Settings as SettingsIcon, User, Bell, Lock, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-3">
            <SettingsIcon className="text-gray-400" /> System Preferences
          </h1>
          <p className="text-muted-foreground">Manage your VitaCore instance parameters.</p>
        </div>

        <div className="grid gap-6">
          {/* Profile */}
          <div className="glass-card border-primary/20 p-6 flex items-start gap-6">
            <img src={mockUser.avatar} alt={mockUser.name} className="w-24 h-24 rounded-2xl border-2 border-primary/20" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{mockUser.name}</h3>
                <p className="text-sm text-primary">{mockUser.role}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/40 border-primary/20 text-foreground hover:bg-white/10">Change Avatar</Button>
                <Button variant="outline" className="bg-white/40 border-primary/20 text-foreground hover:bg-white/10">Edit Profile</Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-card border-primary/20 p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-primary/20 pb-4">
              <Bell size={18} /> Telemetry & Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a morning summary of your vectors.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">AI Intervention Alerts</Label>
                  <p className="text-sm text-muted-foreground">Real-time alerts when trajectory falls below baseline.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">Achievement Pings</Label>
                  <p className="text-sm text-muted-foreground">Celebrate unlocks instantly.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="glass-card border-primary/20 p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-primary/20 pb-4">
              <Lock size={18} /> Data & Privacy
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/5">
              <div>
                <h4 className="font-bold text-foreground mb-1">Export Telemetry Data</h4>
                <p className="text-sm text-muted-foreground">Download all your metrics in CSV/JSON format.</p>
              </div>
              <Button variant="outline" className="bg-white/40 border-primary/20 text-foreground hover:bg-white/10 gap-2">
                <Download size={16} /> Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 mt-4">
              <div>
                <h4 className="font-bold text-red-400 mb-1">Terminate Instance</h4>
                <p className="text-sm text-red-400/70">Permanently delete your account and all data. Irreversible.</p>
              </div>
              <Button variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/40 gap-2 border border-red-500/50">
                <Trash2 size={16} /> Delete Account
              </Button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}