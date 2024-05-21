import { TabView, TabPanel } from 'primereact/tabview';

import React from 'react';
import AdminRadicados from './TablaRadicados';
import ConsultaRadicados from './ConsultaRadicados';

function TabViewComponent() {
  return (
    <div className="card">
      <TabView>
        <TabPanel header="Radicados">
          <AdminRadicados />
        </TabPanel>
        <TabPanel header="Consultar radicados">
          <ConsultaRadicados />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default TabViewComponent;
