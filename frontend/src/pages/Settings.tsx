import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser } from "@/data/mockData";
import { Settings as SettingsIcon, Bell, Lock, Download, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <AppLayout theme="default">
      {/* Light Mesh Layout Background Canvas */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE TITLE HEADER ZONE */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1E293B] mb-1 flex items-center gap-3">
              <SettingsIcon className="text-purple-600 w-8 h-8" /> System Preferences
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage your VitaCore instance variables and optimization data streams.
            </p>
          </div>

          <div className="grid gap-6">
            
            {/* USER PROFILE DEPLOYMENT SECTION */}
            <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.012)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img 
                src={mockUser.avatar} 
                alt={mockUser.name} 
                className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
              />
              <div className="flex-1 text-center sm:text-left space-y-4 w-full">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1E293B]">{mockUser.name}</h3>
                  <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg mt-1 border border-purple-100/40">
                    {mockUser.role}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
                    Change Avatar
                  </Button>
                  <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* TELEMETRY & NOTIFICATIONS CONTROLS */}
            <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.012)] space-y-6">
              <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2.5 border-b border-slate-50 pb-4">
                <Bell size={18} className="text-purple-600" /> Telemetry & Notifications
              </h3>
              
              <div className="space-y-5">
                {/* Daily Digest */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-extrabold text-[#1E293B]">Daily Digest</Label>
                    <p className="text-xs text-slate-400 font-medium leading-normal">Receive a clean morning summary metrics readout regarding your live vectors.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                </div>
                
                {/* AI Intervention Alerts */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-extrabold text-[#1E293B]">AI Intervention Alerts</Label>
                    <p className="text-xs text-slate-400 font-medium leading-normal">Real-time emergency telemetry pings whenever a state trajectory calculation trends below target baseline.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                </div>
                
                {/* Achievement Pings */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-extrabold text-[#1E293B]">Achievement Pings</Label>
                    <p className="text-xs text-slate-400 font-medium leading-normal">Celebrate node level unlocks and milestone updates instantly with immediate workspace display updates.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                </div>
              </div>
            </div>

            {/* DATA MANAGEMENT & INSTANCE SECURITY */}
            <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.012)] space-y-6">
              <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2.5 border-b border-slate-50 pb-4">
                <Lock size={18} className="text-purple-600" /> Data & Privacy Settings
              </h3>
              
              {/* Export Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div>
                  <h4 className="font-extrabold text-sm text-[#1E293B] mb-0.5">Export Telemetry Data</h4>
                  <p className="text-xs text-slate-400 font-medium leading-normal">Download complete time-series execution metrics array formatted in standard structured JSON or CSV parameters.</p>
                </div>
                <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 shrink-0 transition-all shadow-xs">
                  <Download size={14} /> Export Dataset
                </Button>
              </div>

              {/* Destruction / Danger Zone Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-100/60 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 hidden sm:flex border border-rose-100/30">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-700 mb-0.5">Terminate Instance Cluster</h4>
                    <p className="text-xs text-rose-600/80 font-medium leading-normal">Permanently purge instance vectors, histories, credentials, and structural records. This execution configuration is completely irreversible.</p>
                  </div>
                </div>
                <Button variant="destructive" className="h-9 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white gap-2 shrink-0 transition-all shadow-xs">
                  <Trash2 size={14} /> Delete Account
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
