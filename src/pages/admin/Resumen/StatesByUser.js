import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import instance from 'api/axios';

// Servicios API
const api = {
  fetchDataStatesUser: async (id) => {
    const { data } = await instance.get(`/assigned/allState-user-typification/${id}`);
    return data;
  },
  fetchTypifications: async () => {
    const { data } = await instance.get('/typification');
    return data;
  }
};

export const BarChart = () => {
  const [data, setData] = useState([]);
  const [typifications, setTypifications] = useState([]);
  const [typificationOptions, setTypificationOptions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tipificaciones al montar
  useEffect(() => {
    const loadTypifications = async () => {
      setLoading(true);
      try {
        const res = await api.fetchTypifications();
        setTypifications(res);
      } catch (err) {
        setError(err.response?.data || 'Error al cargar tipificaciones');
      } finally {
        setLoading(false);
      }
    };
    loadTypifications();
  }, []);

  // Estados únicos (series)
  const estados = useMemo(() => {
    const set = new Set();
    (data || []).forEach((u) => (u.data || []).forEach((it) => set.add(it.estado_radicado)));
    return Array.from(set);
  }, [data]);

  // Categorías (usuarios)
  const categories = useMemo(() => (data || []).map((d) => d.nombre_usuario), [data]);

  // Series por estado
  const series = useMemo(
    () =>
      estados.map((estado) => ({
        name: estado,
        data: (data || []).map((u) => u.data.find((e) => e.estado_radicado === estado)?.total || 0)
      })),
    [data, estados]
  );

  const chartHeight = Math.max(200, categories.length * 56);

  const options = {
    chart: { type: 'bar', toolbar: { show: false }, foreColor: '#374151' },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '60%', borderRadius: 8 }
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { width: 8, height: 8 },
      itemMargin: { horizontal: 8, vertical: 4 }
    },
    xaxis: {
      categories,
      labels: { formatter: (v) => Number(v).toLocaleString('es-CO') }
    },
    yaxis: {
      labels: { style: { fontSize: '12px' }, trim: true, maxWidth: 180 }
    },
    tooltip: {
      y: {
        formatter: (val) => (typeof val === 'number' ? val.toLocaleString('es-CO') : String(val))
      }
    },
    stroke: { show: true, width: 1 },
    fill: { opacity: 0.95 },
    responsive: [
      { breakpoint: 1024, options: { plotOptions: { bar: { barHeight: '55%' } } } },
      {
        breakpoint: 640,
        options: { plotOptions: { bar: { barHeight: '50%' } }, legend: { fontSize: '11px' } }
      }
    ]
  };

  const handleStatesUser = async () => {
    if (!typificationOptions) return;
    setLoading(true);
    try {
      const res = await api.fetchDataStatesUser(typificationOptions);
      setData(res);
    } catch (err) {
      setError(err.response?.data || 'Error al cargar estados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div
      style={{
        width: '100%',
        background: 'white',
        borderRadius: '1rem',
        padding: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB'
      }}
    >
      <div className="d-flex justify-content-start gap-2">
        <select className="form-select w-25 mr-1" value={typificationOptions} onChange={(e) => setTypificationOptions(e.target.value)}>
          <option value="">Seleccione tipificación</option>
          {typifications.map((item) => (
            <option key={item._id} value={item._id}>
              {item.nombre_tipificacion}
            </option>
          ))}
        </select>
        <button className="btn btn-success" onClick={handleStatesUser}>
          Buscar
        </button>
      </div>

      {data.length > 0 && <ReactApexChart type="bar" options={options} series={series} height={chartHeight} />}
    </div>
  );
};
