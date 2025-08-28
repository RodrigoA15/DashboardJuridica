import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
import Chart from 'react-apexcharts';

export const ChartEstados = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    statesByArea();
  }, []);

  const statesByArea = async () => {
    try {
      const response = await axios.get('/chartAdmin/radicadosAreasEstados');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Estados únicos (series)
  const estados = useMemo(() => {
    const set = new Set();
    (data || []).forEach((u) => (u.radicados || []).forEach((it) => set.add(it.estado)));
    return Array.from(set);
  }, [data]);

  const categories = useMemo(() => (data || []).map((d) => d._id), [data]);

  // Series por estado
  const series = useMemo(
    () =>
      estados.map((estado) => ({
        name: estado,
        data: (data || []).map((u) => u.radicados.find((e) => e.estado === estado)?.count || 0)
      })),
    [data, estados]
  );

  const chartData = {
    type: 'bar',
    series: series,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20
      },
      xaxis: {
        categories: categories
      }
    }
  };

  return <Chart {...chartData} height={450} />;
};
