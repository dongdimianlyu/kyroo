import React, { useRef } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ConfidenceTrend } from '../../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ConfidenceTrendChartProps {
  data: ConfidenceTrend[];
}

const ConfidenceTrendChart: React.FC<ConfidenceTrendChartProps> = ({ data }) => {

  // Prepare chart data
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Confidence Score',
        data: data.map(item => item.score),
        borderColor: 'rgba(139, 92, 246, 1)', // purple-500
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return 'rgba(139, 92, 246, 0.1)';
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 4,
        fill: true,
        tension: 0.4,
        segment: {
          borderColor: (ctx: any) => {
            const currentScore = ctx.p1.parsed.y;
            const previousScore = ctx.p0.parsed.y;
            
            // Color based on trend
            if (currentScore > previousScore) {
              return 'rgba(34, 197, 94, 1)'; // green for improvement
            } else if (currentScore < previousScore) {
              return 'rgba(239, 68, 68, 1)'; // red for decline
            }
            return 'rgba(139, 92, 246, 1)'; // purple for stable
          }
        }
      },
      {
        label: 'Sessions',
        data: data.map(item => item.sessions_count * 20), // Scale for visibility
        borderColor: 'rgba(59, 130, 246, 0.6)', // blue-500 with opacity
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.3,
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(75, 85, 99)', // neutral-600
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          filter: (legendItem: any) => {
            // Hide the sessions dataset from legend for cleaner look
            return legendItem.text === 'Confidence Score';
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'rgb(31, 41, 55)', // neutral-800
        bodyColor: 'rgb(75, 85, 99)', // neutral-600
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const date = new Date(data[dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric' 
            });
          },
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const score = data[dataIndex].score;
            const sessions = data[dataIndex].sessions_count;
            
            if (context.datasetIndex === 0) {
              return `Confidence: ${score}%`;
            } else {
              return `Sessions: ${sessions}`;
            }
          },
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const sessions = data[dataIndex].sessions_count;
            
            if (sessions === 0) {
              return 'No practice sessions this day';
            } else if (sessions === 1) {
              return '1 practice session';
            } else {
              return `${sessions} practice sessions`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // neutral-400
          font: {
            size: 11,
          },
          maxRotation: 0,
        },
        border: {
          display: false,
        }
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)', // neutral-400 with opacity
          drawTicks: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // neutral-400
          font: {
            size: 11,
          },
          stepSize: 20,
          callback: (value: any) => `${value}%`,
          padding: 10,
        },
        border: {
          display: false,
        }
      },
      y1: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        min: 0,
        max: 100,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    }
  };

  // Calculate trend stats
  const currentScore = data[data.length - 1]?.score || 0;
  const previousScore = data[data.length - 2]?.score || 0;
  const weekChange = previousScore > 0 ? ((currentScore - previousScore) / previousScore) * 100 : 0;
  const averageScore = Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length);
  const totalSessions = data.reduce((sum, item) => sum + item.sessions_count, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 mb-2">Confidence Trend</h3>
          <p className="text-sm text-neutral-600">
            Your confidence journey over the past 30 days
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-lg font-bold text-purple-600">{currentScore}%</div>
            <div className="text-xs text-neutral-600">Current</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-lg font-bold text-blue-600">{averageScore}%</div>
            <div className="text-xs text-neutral-600">Average</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className={`text-lg font-bold ${weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weekChange >= 0 ? '+' : ''}{weekChange.toFixed(1)}%
            </div>
            <div className="text-xs text-neutral-600">Change</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Chart Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-neutral-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Confidence Score</span>
            </div>
            <div className="text-neutral-500">•</div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{totalSessions} total sessions</span>
            </div>
          </div>
          
          <div className="text-neutral-500 text-xs">
            Last 30 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceTrendChart; 