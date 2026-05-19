"use client";

import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useExpenses } from "@/context/ExpenseContext";
import { CATEGORY_COLORS, Category } from "@/lib/types";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const chartDefaults = {
  color: "#8A9BB0",
  borderColor: "rgba(0, 245, 255, 0.1)",
};

export function PieChart() {
  const { categoryTotals } = useExpenses();

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  const colors = labels.map((l) => CATEGORY_COLORS[l as Category] || "#8A9BB0");

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.map((c) => c + "CC"),
        borderColor: colors,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
        CATEGORY BREAKDOWN
      </h3>
      <div className="h-[280px] flex items-center justify-center">
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: "easeOutQuart" },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: chartDefaults.color,
                  font: { family: "var(--font-barlow)", size: 11 },
                  padding: 12,
                  usePointStyle: true,
                  pointStyleWidth: 8,
                },
              },
              tooltip: {
                backgroundColor: "rgba(5, 10, 14, 0.9)",
                borderColor: "rgba(0, 245, 255, 0.3)",
                borderWidth: 1,
                titleFont: { family: "var(--font-barlow)" },
                bodyFont: { family: "var(--font-jetbrains)" },
                bodyColor: "#00F5FF",
                callbacks: {
                  label: (ctx) => `₹${ctx.parsed.toLocaleString("en-IN")}`,
                },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}

export function BarChart() {
  const { monthlyTotals } = useExpenses();
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlyTotals,
        backgroundColor: "rgba(0, 245, 255, 0.3)",
        borderColor: "#00F5FF",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(0, 245, 255, 0.5)",
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
        MONTHLY SPENDING
      </h3>
      <div className="h-[280px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: "easeOutQuart" },
            scales: {
              x: {
                grid: { color: "rgba(0, 245, 255, 0.05)" },
                ticks: { color: chartDefaults.color, font: { family: "var(--font-barlow)", size: 11 } },
              },
              y: {
                grid: { color: "rgba(0, 245, 255, 0.05)" },
                ticks: {
                  color: chartDefaults.color,
                  font: { family: "var(--font-jetbrains)", size: 10 },
                  callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(5, 10, 14, 0.9)",
                borderColor: "rgba(0, 245, 255, 0.3)",
                borderWidth: 1,
                bodyFont: { family: "var(--font-jetbrains)" },
                bodyColor: "#00F5FF",
                callbacks: {
                  label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
                },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}

export function LineChart() {
  const { trendData } = useExpenses();
  const labels = trendData.map((_, i) => `Day ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending Trend",
        data: trendData,
        borderColor: "#B8FF00",
        backgroundColor: "rgba(184, 255, 0, 0.08)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#B8FF00",
        pointBorderColor: "#050A0E",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
        SPENDING TREND
      </h3>
      <div className="h-[280px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: "easeOutQuart" },
            scales: {
              x: {
                grid: { color: "rgba(0, 245, 255, 0.05)" },
                ticks: { color: chartDefaults.color, font: { family: "var(--font-barlow)", size: 10 } },
              },
              y: {
                grid: { color: "rgba(0, 245, 255, 0.05)" },
                ticks: {
                  color: chartDefaults.color,
                  font: { family: "var(--font-jetbrains)", size: 10 },
                  callback: (v) => `₹${v}`,
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(5, 10, 14, 0.9)",
                borderColor: "rgba(184, 255, 0, 0.3)",
                borderWidth: 1,
                bodyFont: { family: "var(--font-jetbrains)" },
                bodyColor: "#B8FF00",
                callbacks: {
                  label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
                },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}
