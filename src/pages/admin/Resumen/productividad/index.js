import { TabView, TabPanel } from 'primereact/tabview';
import { AsignacionMensual } from './tables/AsignacionMensual';
import { RespuestasMensuales } from './tables/RespuestasMensuales';

export const Productivity = () => {
  return (
    <div className="card">
      <TabView>
        <TabPanel header="Asignacion">
          <AsignacionMensual />
        </TabPanel>
        <TabPanel header="Respuestas">
          <RespuestasMensuales />
        </TabPanel>
      </TabView>
    </div>
  );
};
