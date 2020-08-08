import React, { useState } from 'react';
import Annotator from './components/Annotator';

function App() {
  const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
  const [scale, setScale] = useState(1.5);

  return (
    <Annotator url={url} scale={scale} />
  );
}

export default App;
