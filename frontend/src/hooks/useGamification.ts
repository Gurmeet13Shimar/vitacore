import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export interface GamificationData {
  level: number;
  xp: number;
  levelName: string;
  streak: number;
  loading: boolean;
}

export function useGamification(): GamificationData {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState<GamificationData>({
    level: 1,
    xp: 0,
    levelName: "Digital Novice",
    streak: 0,
    loading: true,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setData({
        level: 1,
        xp: 0,
        levelName: "Digital Novice",
        streak: 0,
        loading: false,
      });
      return;
    }

    const fetchAllLogs = async () => {
      try {
        const [healthRes, financeRes, careerRes] = await Promise.all([
          axios.get("http://localhost:5000/api/health"),
          axios.get("http://localhost:5000/api/finance"),
          axios.get("http://localhost:5000/api/career"),
        ]);

        const healthLogs = Array.isArray(healthRes.data) ? healthRes.data : [];
        const financeLogs = Array.isArray(financeRes.data) ? financeRes.data : [];
        const careerLogs = Array.isArray(careerRes.data) ? careerRes.data : [];

        const hCount = healthLogs.length;
        const fCount = financeLogs.length;
        const cCount = careerLogs.length;

        const totalXp = (hCount * 150) + (fCount * 100) + (cCount * 250);
        const level = Math.floor(totalXp / 5000) + 1;
        const xp = totalXp % 5000;
        
        let levelName = "Digital Novice";
        if (level >= 10) levelName = "Digital Optimizer";
        else if (level >= 6) levelName = "Systematic Tracker";
        else if (level >= 3) levelName = "Habit Builder";

        // Calculate streak
        const allDates = new Set<string>();
        [...healthLogs, ...financeLogs, ...careerLogs].forEach(log => {
          const dateVal = log.date || log.createdAt;
          if (dateVal) {
            allDates.add(new Date(dateVal).toDateString());
          }
        });

        const sortedDates = Array.from(allDates).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let checkDate = new Date(today);
        
        const hasToday = sortedDates.some(d => d.toDateString() === today.toDateString());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const hasYesterday = sortedDates.some(d => d.toDateString() === yesterday.toDateString());

        if (hasToday || hasYesterday) {
          if (!hasToday) {
            checkDate = yesterday;
          }
          
          while (true) {
            const dateStr = checkDate.toDateString();
            const found = sortedDates.some(d => d.toDateString() === dateStr);
            if (found) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        setData({
          level,
          xp,
          levelName,
          streak,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching gamification data:", error);
        setData({
          level: 1,
          xp: 0,
          levelName: "Digital Novice",
          streak: 0,
          loading: false,
        });
      }
    };

    fetchAllLogs();
  }, [isLoggedIn]);

  return data;
}
