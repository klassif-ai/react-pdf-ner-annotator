import React, { useRef, useState } from 'react';
import JSONTree from 'react-json-tree';
import Annotator from 'react-pdf-ner-annotator';
import { Entity } from 'react-pdf-ner-annotator/src/interfaces/entity';
import { Annotation } from 'react-pdf-ner-annotator/src/interfaces/annotation';
import { AnnotatorHandle } from 'react-pdf-ner-annotator/src/types';
import './App.scss';
import 'react-pdf-ner-annotator/src/scss/style.scss';

const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
const scannedUrl = 'https://jeroen.github.io/images/ocrscan.pdf';

const entities: Array<Entity> = [
  {
    id: 1,
    name: 'Location',
    color: '#4DD0E1',
    entityType: 'NER',
  },
  {
    id: 2,
    name: 'Person',
    color: '#4DB6AC',
    entityType: 'NER',
  },
  {
    id: 3,
    name: 'Organisation',
    color: '#81C784',
    entityType: 'NER',
  },
  {
    id: 4,
    name: 'Date',
    color: '#AED581',
    entityType: 'NER',
  },
  {
    id: 5,
    name: 'Other',
    color: '#DCE775',
    entityType: 'NER',
  },
];

const App = () => {
  const [selectedEntity, setSelectedEntity] = useState(-1);
  const [annotations, setAnnotations] = useState<Array<Annotation>>([]);
  const [textMap, setTextMap] = useState<any>([]);
  const childRef = useRef<AnnotatorHandle<typeof Annotator>>();

  return (
    <div className="app-container">
      <div className="app__header">
        <h1>React PDF NER Annotator</h1>
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
              url={url}
              entity={entities[selectedEntity]}
              getAnnotations={setAnnotations}
              getTextMaps={setTextMap}
              ref={childRef}
            />
          </div>
          <div className="app__content-entities">
            <h1>Entities</h1>
            {
              entities.map((entity, index) => (
                <div className="entity-container" key={entity.id}>
                  <span className="entity__hotkey">
                    {index + 1}
                  </span>
                  <span
                    role="button"
                    className="entity__name"
                    style={(selectedEntity === index || selectedEntity === -1) ?
                      { backgroundColor: entity.color } : { backgroundColor: '#bebebe' }}
                    onClick={() => setSelectedEntity(selectedEntity !== index ? index : -1)}
                  >
                    {entity.name}
                  </span>
                </div>
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
