// import { Timeline } from 'primereact/timeline';
import { DataScroller } from 'primereact/datascroller';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
export const ListadoRespuestas = ({ respuesta }) => {
  const timelineRespuestas = (data) => {
    return (
      <div>
        {data.respuestas.map((data) => (
          <Card key={data._id} className="mb-2">
            <CardContent className="d-flex justify-content-between align-items-center">
              <Typography variant="h-5">{data.numero_radicado_respuesta}</Typography>
              <Typography variant="h-6" className="text-gray-blue">
                {new Date(data.fechaRespuesta).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
              </Typography>

              <div>
                <Typography variant="overline" className="text-gray-blue">
                  Consultar archivo
                </Typography>
                <TrendingFlatIcon />
                <a href={`http://192.168.28.74:4000/api/v2/answer/pdf-viewer-answer/${data._id}`} target="_blank" rel="noreferrer">
                  <Tooltip title="Ir al archivo" placement="top">
                    <IconButton>
                      <DescriptionIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <DataScroller value={respuesta} itemTemplate={timelineRespuestas} rows={5} inline scrollHeight="500px" header="Respuestas cargadas" />
    </div>
  );
};
