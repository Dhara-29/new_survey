import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const location = useLocation();
  const [chartData, setChartData] = useState({});
  const survey_id = location.state?.survey_id;
  const user_id = location.state?.user_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("User id:", user_id, "Survey id:", survey_id);
        
        const response = await axios.get(`http://localhost:3000/surveyResponse/viewResponse/${survey_id}/${user_id}`);
        
        const data = response.data;
        console.log("API Response:", data);  // Log the entire response to understand its structure

        if (!Array.isArray(data)) {
          console.error('Expected an array but got something else:', data);
          throw new Error('Expected an array but got something else');
        }

        const processedData = processSurveyData(data);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [survey_id, user_id]);

  const processSurveyData = (data) => {
    const labels = [];
    const answerCounts = { text: [], selectedOption: [], numeric: [] };

    data.forEach((item) => {
      labels.push(`Question ${item.question_id}`);
      answerCounts.text.push(item.answer_text ? 1 : 0);
      answerCounts.selectedOption.push(item.selected_option ? 1 : 0);
      answerCounts.numeric.push(item.answer_numeric ? 1 : 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Text Answers',
          data: answerCounts.text,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Selected Options',
          data: answerCounts.selectedOption,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Numeric Answers',
          data: answerCounts.numeric,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Survey ID: ${survey_id} - Question Answers Overview`,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
