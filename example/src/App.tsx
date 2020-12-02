import React, { useRef, useState } from 'react';
import JSONTree from 'react-json-tree';
import Annotator from 'react-pdf-ner-annotator';
import { Entity } from 'react-pdf-ner-annotator/src/interfaces/entity';
import { Annotation } from 'react-pdf-ner-annotator/src/interfaces/annotation';
import { AnnotatorHandle } from 'react-pdf-ner-annotator/src/types';
import PDFFile from './pdfs/order.pdf';
import KlassifaiLogo from './klassifai.svg';
import './App.scss';
import 'react-pdf-ner-annotator/src/scss/style.scss';

const defaultAnnotations: Array<Annotation> = [
  {
    'id': 'czj6p188jb',
    'page': 1,
    'tokens': ['#', 'PO002848'],
    'textIds': [16, 17],
    'entity': { 'id': 5, 'name': 'Reference', 'color': '#DCE775', 'entityType': 'NER' },
  },
  {
    'id': 'v7rymcccdg',
    'page': 1,
    'tokens': ['Brainjar', 'nv'],
    'textIds': [1, 2],
    'entity': { 'id': 3, 'name': 'Organisation', 'color': '#81C784', 'entityType': 'NER' },
  },
  {
    'id': '74s33l7zzu',
    'page': 1,
    'tokens': ['Gaston', 'Geenslaan', '11', 'B4', '3001', 'Leuven', 'Belgie'],
    'textIds': [3, 4, 5, 6, 7, 8, 9],
    'entity': { 'id': 1, 'name': 'Location', 'color': '#4DD0E1', 'entityType': 'NER' },
  },
  {
    'id': 'yq4giluopu',
    'page': 1,
    'tokens': ['10/08/2021'],
    'textIds': [32],
    'entity': { 'id': 4, 'name': 'Date', 'color': '#AED581', 'entityType': 'NER' },
  },
];

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
    name: 'Reference',
    color: '#DCE775',
    entityType: 'NER',
  },
  {
    id: 6,
    name: 'Other',
    color: '#FF8A65',
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
              data={PDFFile}
              defaultAnnotations={defaultAnnotations}
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
        <h1>Made by</h1>
        <a href="https://www.klassif.ai/">
          <img
            className="app__footer-logo"
            src={KlassifaiLogo}
            alt="Klassif.ai logo"/>
        </a>
      </div>
    </div>
  );
};

export default App;
