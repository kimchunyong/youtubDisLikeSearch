import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  BubbleController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Bubble } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  BubbleController,
  Title,
  Tooltip,
  Legend
);

function Charts({ data }) {
  // 데이터 정렬 (좋아요 수 기준)
  const sortedData = [...data].sort((a, b) => b.likes - a.likes);
  const labels = sortedData.map(d => 
    d.title.length > 30 ? d.title.substring(0, 30) + '...' : d.title
  );

  // 1. 좋아요/싫어요 막대 그래프
  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: '좋아요',
        data: sortedData.map(d => d.likes),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: '싫어요',
        data: sortedData.map(d => d.dislikes),
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // 2. 좋아요 비율 막대 그래프
  const ratioData = [...data].sort((a, b) => a.ratio - b.ratio);
  const ratioLabels = ratioData.map(d => 
    d.title.length > 30 ? d.title.substring(0, 30) + '...' : d.title
  );
  const ratioColors = ratioData.map(d => {
    if (d.ratio < 0.5) return 'rgba(255, 107, 107, 0.8)';
    if (d.ratio < 0.7) return 'rgba(78, 205, 196, 0.8)';
    return 'rgba(69, 183, 209, 0.8)';
  });

  const ratioChartData = {
    labels: ratioLabels,
    datasets: [{
      label: '좋아요 비율 (%)',
      data: ratioData.map(d => d.ratio * 100),
      backgroundColor: ratioColors,
    }]
  };

  const ratioChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // 3. 산점도
  const scatterData = {
    datasets: [{
      label: '영상',
      data: data.map(d => ({
        x: d.dislikes,
        y: d.likes,
        r: Math.sqrt(d.likes + d.dislikes) / 10
      })),
      backgroundColor: data.map(d => {
        const ratio = d.ratio;
        if (ratio < 0.5) return 'rgba(255, 107, 107, 0.6)';
        if (ratio < 0.7) return 'rgba(255, 206, 84, 0.6)';
        return 'rgba(78, 205, 196, 0.6)';
      }),
      borderColor: data.map(d => {
        const ratio = d.ratio;
        if (ratio < 0.5) return 'rgba(255, 107, 107, 1)';
        if (ratio < 0.7) return 'rgba(255, 206, 84, 1)';
        return 'rgba(78, 205, 196, 1)';
      }),
      borderWidth: 1
    }]
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: '싫어요 수'
        },
        beginAtZero: true
      },
      y: {
        title: {
          display: true,
          text: '좋아요 수'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const item = data[index];
            return [
              `제목: ${item.title}`,
              `좋아요: ${item.likes.toLocaleString()}`,
              `싫어요: ${item.dislikes.toLocaleString()}`,
              `비율: ${(item.ratio * 100).toFixed(2)}%`
            ];
          }
        }
      }
    }
  };

  // 4. 히스토그램
  const ratios = data.map(d => d.ratio * 100);
  const bins = 20;
  const binSize = 100 / bins;
  const histogram = new Array(bins).fill(0);
  
  ratios.forEach(ratio => {
    const binIndex = Math.min(Math.floor(ratio / binSize), bins - 1);
    histogram[binIndex]++;
  });

  const binLabels = Array.from({ length: bins }, (_, i) => 
    `${(i * binSize).toFixed(0)}-${((i + 1) * binSize).toFixed(0)}%`
  );

  const histogramData = {
    labels: binLabels,
    datasets: [{
      label: '영상 수',
      data: histogram,
      backgroundColor: 'rgba(149, 225, 211, 0.7)',
      borderColor: 'rgba(149, 225, 211, 1)',
      borderWidth: 1
    }]
  };

  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="charts">
      <div className="chart-container">
        <h2>좋아요/싫어요 수 비교</h2>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      <div className="chart-container">
        <h2>좋아요 비율</h2>
        <Bar data={ratioChartData} options={ratioChartOptions} />
      </div>

      <div className="chart-container">
        <h2>좋아요 vs 싫어요 산점도</h2>
        <Bubble data={scatterData} options={scatterOptions} />
      </div>

      <div className="chart-container">
        <h2>좋아요 비율 분포</h2>
        <Bar data={histogramData} options={histogramOptions} />
      </div>
    </div>
  );
}

export default Charts;
