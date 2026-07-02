import React from "react";
import { BookOpen, Wifi, WifiOff, Award, User, RefreshCw, Zap, Menu } from "lucide-react";

interface HeaderProps {
  teacherName: string;
  setTeacherName: (name: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (val: boolean) => void;
  isSynced: boolean;
  onMenuOpen: () => void;
}

const NIGERIAN_STATES = [
  "Lagos", "FCT Abuja", "Oyo", "Kano", "Enugu", "Rivers", "Kaduna", "Ogun", "Delta", "Anambra", "Plateau", "Borno"
];

export default function Header({
  teacherName,
  setTeacherName,
  selectedState,
  setSelectedState,
  isOfflineMode,
  setIsOfflineMode,
  isSynced,
  onMenuOpen,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Brand & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuOpen}
              className="lg:hidden p-2 text-gray-500 hover:text-emerald-700 hover:bg-gray-105 rounded-xl transition-all"
              id="mobile-menu-trigger"
              title="Open Menu"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md shadow-emerald-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-bold text-xl text-gray-900 tracking-tight">TeacherOS</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                  v1.2 Beta
                </span>
              </div>
              <p className="text-xs text-gray-500 font-sans">AI Co-pilot for Nigerian Classrooms</p>
            </div>
          </div>

          {/* Center Configuration controls */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100 self-start md:self-center">
            
            {/* Teacher Details */}
            <div className="flex items-center space-x-2 px-2.5 py-1">
              <User className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none w-28 placeholder:text-gray-400"
                id="header-teacher-input"
              />
            </div>

            {/* State/Region Selector */}
            <div className="flex items-center space-x-1.5 border-l border-gray-200 pl-3 py-1">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-semibold text-gray-600 bg-transparent focus:outline-none cursor-pointer hover:text-emerald-600 pr-1"
                id="header-state-select"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Offline simulation toggler */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                isOfflineMode
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
              title="Simulate Offline classroom connectivity"
              id="header-offline-toggle"
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Simulating Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Online Connected</span>
                </>
              )}
            </button>
          </div>

          {/* Sync status & country label */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-gray-100 pt-2.5 md:pt-0">
            <div className="flex items-center space-x-1.5 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100">
              <div className="flex space-x-0.5">
                <span className="w-2.5 h-2 bg-emerald-600 rounded-sm"></span>
                <span className="w-2.5 h-2 bg-white rounded-sm border border-gray-200"></span>
                <span className="w-2.5 h-2 bg-emerald-600 rounded-sm"></span>
              </div>
              <span>NERDC COMPLIANT</span>
            </div>

            {/* Database sync status */}
            <div className="flex items-center space-x-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSynced && !isOfflineMode ? "bg-emerald-500" : "bg-amber-400"
                }`}
              ></span>
              <span className="text-[11px] font-medium text-gray-500">
                {isOfflineMode ? "Local Active" : isSynced ? "Server Synced" : "Pending Sync"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
