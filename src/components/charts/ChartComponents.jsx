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
import { useTheme } from '../../shared/contexts/ThemeContext'

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
  const isDarkMode = theme === 'dark';

  return {
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDarkMode ? '#f1f5f9' : '#0f172a',
      bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
      borderColor: isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(226, 232, 240, 1)'
    },
    doughnutBorderColor: isDarkMode ? '#0f172a' : '#ffffff'
  };
};

export const LineChart = ({ data, options = {} }) => {
  const theme = useChartTheme();

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        ...theme.tooltip,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            }).format(value)
          }
        }
      }
    },
    ...options
  }

  return <Line data={data} options={defaultOptions} />
}

export const BarChart = ({ data, options = {} }) => {
  const theme = useChartTheme();

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        ...theme.tooltip,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            }).format(value)
          }
        }
      }
    },
    ...options
  }

  return <Bar data={data} options={defaultOptions} />
}

export const DoughnutChart = ({ data, options = {} }) => {
  const theme = useChartTheme();

  const themedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderColor: theme.doughnutBorderColor,
      borderWidth: 2,
      hoverBorderColor: theme.doughnutBorderColor,
      hoverBorderWidth: 2,
    }))
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                if (total === 0) {
                  return {
                    text: `${label} (0.0%)`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.backgroundColor[i],
                    lineWidth: 0,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  };
                }
                const percentage = ((value / total) * 100).toFixed(1);

                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  lineWidth: 0,
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
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            if (total === 0) {
              return `${label}: 0.0%`;
            }
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%',
    ...options
  }

  return <Doughnut data={themedData} options={defaultOptions} />
}

export const AreaChart = ({ data, options = {} }) => {
  const theme = useChartTheme();

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        ...theme.tooltip,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            }).format(value)
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    ...options
  }

  return <Line data={data} options={defaultOptions} />
}