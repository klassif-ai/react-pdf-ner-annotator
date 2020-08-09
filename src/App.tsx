import React, { useState } from 'react';
import Annotator from './components/Annotator';
import { Entity } from './interfaces/entity';


const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
const entity: Entity = {
  id: 1,
  name: 'Test',
  color: '#81C784',
};

const App = () => {
  const [scale, setScale] = useState(1.5);

  return (
    <Annotator url={url} scale={scale} entity={entity} />
  );
};

export default App;
