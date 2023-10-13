
import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,

  BarElement,

} from 'chart.js';

import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import {CategoryScale} from 'chart.js'; 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

ChartJS.register(
  BarElement,CategoryScale
);


const BarChart = () => {
  const accessToken = localStorage.getItem('access_token');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(`${BASE_URL}/joining-month-count/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setChartData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
      }
      setLoading(false);
    };

    fetchChartData();
  }, [accessToken]);




  var data = {
    labels: chartData.map((item) => item.joining_month),
    datasets: [{
      label: 'User Count',
      data: chartData.map((item) => item.user_count),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)', // Purple color for the line
      borderWidth: 2,
    }]
  };

  var options = {
    maintainAspectRatio: false,
    scales: {
    },
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-white to-violet-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">User Joining Month Statistics</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <Line data={data} height={400} options={options} />
          </div>
        )}
      </div>
    </div>
  )
}

export default BarChart