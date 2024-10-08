import { useEffect, useState, useMemo } from 'react';
import axios from 'api/axios';
import Chart from 'react-apexcharts';

const ChartRadicadosAnswer = () => {
  const [radicados, setRadicados] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    radicadosByMonthApi();
    answersByMonthApi();
  }, []);

  const radicadosByMonthApi = async () => {
    try {
      const response = await axios.get('/radicados/total/radicados-mes');
      setRadicados(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const answersByMonthApi = async () => {
    try {
      const response = await axios.get('/answer/answer-month');
      setAnswers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMonths = () => {
    const radicadoMonths = radicados.map((item) => item._id);
    const answerMonths = answers.map((item) => item._id.month);
    return Array.from(new Set([...radicadoMonths, ...answerMonths]));
  };

  const calculatePercentage = useMemo(() => {
    return (radicadosCount, answersCount) => {
      if (radicadosCount === 0) return 0;
      const porcentaje = ((radicadosCount - answersCount) / radicadosCount) * 100;
      if (porcentaje === 0) return answersCount;
      return `${porcentaje.toFixed(1)}%`;
    };
  }, [radicados, answers]);

  const chartData = {
    type: 'bar',
    series: [
      {
        name: 'Respuestas',
        data: getMonths().map((month) => {
          const answer = answers.find((a) => a._id.month === month);
          return {
            x: `Mes ${month}`,
            y: answer ? answer.count : 0,
            goals: [
              {
                name: 'Radicados',
                value: (radicados.find((r) => r._id === month) || {}).count || 0,
                strokeHeight: 2,
                strokeColor: '#FF1E1E'
              }
            ]
          };
        })
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: ['#4379F2'],
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#000']
        },

        formatter: (val, opt) => {
          const radicadosCount = opt.w.config.series[0].data[opt.dataPointIndex].goals[0].value;
          const answersCount = val;
          return calculatePercentage(radicadosCount, answersCount);
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Respuestas', 'Radicados'],
        markers: {
          fillColors: ['#4379F2', '#FF1E1E']
        }
      }
    }
  };

  return <Chart {...chartData} />;
};

export default ChartRadicadosAnswer;
