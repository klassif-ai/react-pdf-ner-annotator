import React, { useState } from 'react';
// @ts-ignore
import JSONTree from 'react-json-tree';
import Annotator from './components/Annotator';
import { Entity } from './interfaces/entity';
import './App.scss';
import { Annotation } from './interfaces/annotation';
import { TextMap } from './interfaces/textMap';


const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
const scannedUrl = 'https://jeroen.github.io/images/ocrscan.pdf';

const entities: Array<Entity> = [
  {
    id: 1,
    name: 'Location',
    color: '#4DD0E1',
  },
  {
    id: 2,
    name: 'Person',
    color: '#4DB6AC',
  },
  {
    id: 3,
    name: 'Organisation',
    color: '#81C784',
  },
  {
    id: 4,
    name: 'Date',
    color: '#AED581',
  },
  {
    id: 5,
    name: 'Other',
    color: '#DCE775',
  },
];

const App = () => {
  const [selectedEntity, setSelectedEntity] = useState(0);
  const [annotations, setAnnotations] = useState<Array<Annotation>>([]);
  const [textMap, setTextMap] = useState<Array<TextMap>>([]);

  return (
    <div className="app-container">
      <div className="app__header">
        <h1>Header</h1>
      </div>
      <div className="app__content">
        <div className="app__content-wrapper">
          <div className="app__content-output">
            <JSONTree data={{
              annotations,
              textMap,
            }}
            />
          </div>
          <div className="app__content-main">
            <Annotator
              url={scannedUrl}
              entity={entities[selectedEntity]}
              getAnnotations={setAnnotations}
              getTextMaps={setTextMap}
            />
          </div>
          <div className="app__content-entities">
            <h1>Entities</h1>
            {
              entities.map((entity, index) => (
                <span
                  role="button"
                  key={entity.id}
                  className="entity"
                  style={selectedEntity === index ? { backgroundColor: entity.color } : { backgroundColor: '#bebebe' }}
                  onClick={() => setSelectedEntity(index)}
                >
                  {entity.name}
                </span>
              ))
            }

          </div>
        </div>
      </div>
      <div className="app__footer">
        <h1>Footer</h1>
      </div>
    </div>
  );
};

export default App;
