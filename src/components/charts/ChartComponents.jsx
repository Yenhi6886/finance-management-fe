import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useTheme } from '../../shared/contexts/ThemeContext.jsx'
import { useLanguage } from '../../shared/contexts/LanguageContext.jsx'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const useChartTheme = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    isDarkMode,
    textColor: isDarkMode ? '#e2e8f0' : '#475569',
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDarkMode ? '#f1f5f9' : '#0f172a',
      bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
      borderColor: isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(226, 232, 240, 1)'
    },
    gridColor: isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(226, 232, 240, 1)',
    doughnutBorderColor: isDarkMode ? '#0f172a' : '#ffffff'
  };
};

export const LineChart = ({ data, options = {} }) => {
  const theme = useChartTheme();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20, color: theme.textColor } },
      tooltip: { ...theme.tooltip, borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: theme.gridColor }, ticks: { color: theme.textColor } },
      y: {
        grid: { color: theme.gridColor },
        ticks: {
          color: theme.textColor,
          callback: value => new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND', notation: 'compact' }).format(value)
        }
      }
    },
    ...options
  };
  return <Line data={data} options={defaultOptions} />
}

export const BarChart = ({ data, options = {} }) => {
  const theme = useChartTheme();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20, color: theme.textColor } },
      tooltip: { ...theme.tooltip, borderWidth: 1 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: theme.textColor } },
      y: {
        ticks: {
          color: theme.textColor,
          callback: value => new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND', notation: 'compact' }).format(value)
        }
      }
    },
    ...options
  }
  return <Bar data={data} options={defaultOptions} />
}

export const DoughnutChart = ({ data, options = {} }) => {
  const theme = useChartTheme();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.textColor,
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i], // Use background color for stroke to match
                  lineWidth: 1,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        ...theme.tooltip,
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            const formattedValue = new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(value);
            return `${label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    ...options
  };

  const themedData = JSON.parse(JSON.stringify(data));
  themedData.datasets.forEach(dataset => {
    dataset.borderColor = theme.doughnutBorderColor;
    dataset.borderWidth = 2;
  });

  return <Doughnut data={themedData} options={defaultOptions} />;
}

export const AreaChart = ({ data, options = {} }) => {
  const theme = useChartTheme();
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...theme.tooltip, borderWidth: 1 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: { grid: { display: false }, ticks: { display: false } }
    },
    ...options
  };
  return <Line data={data} options={defaultOptions} />
}