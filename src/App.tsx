import React, { useEffect, useState } from 'react';
import Annotator from './components/Annotator';
import { Entity } from './interfaces/entity';


const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
const entity: Entity = {
  id: 1,
  name: 'Test',
  color: '#81C784',
};

const defaultAnnotations = [{ 'id':'z41juzvba6', 'page':1, 'tokens':['Trace-based', 'Just-in-Time'], 'textIds':[1, 2], 'entity':{ 'id':1, 'name':'Test', 'color':'#81C784' } }];

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
    <Annotator url={url} scale={scale} entity={entity} defaultAnnotations={defaultAnnotations} />
  );
};

export default App;
