import React, { useEffect, useState } from 'react';
import Annotator from './components/Annotator';
import { Entity } from './interfaces/entity';


const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
const scannedUrl = 'https://jeroen.github.io/images/ocrscan.pdf';

const entity: Entity = {
  id: 1,
  name: 'Test',
  color: '#81C784',
};

const App = () => {
  const [scale, setScale] = useState(1.5);

  const handleKeyEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case '+':
        setScale(scale + 0.1);
        break;
      case '-':
        setScale(scale - 0.1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyEvent, false);
    return () => {
      document.removeEventListener('keydown', handleKeyEvent, false);
    };
  });

  return (
    <Annotator url={scannedUrl} scale={scale} entity={entity} />
  );
};

export default App;
