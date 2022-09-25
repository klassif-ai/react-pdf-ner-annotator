import React, { useRef, useState } from 'react';
import { JSONTree } from 'react-json-tree';
import Annotator from 'react-pdf-ner-annotator';
import { Entity } from 'react-pdf-ner-annotator/src/interfaces/entity';
import { Annotation } from 'react-pdf-ner-annotator/src/interfaces/annotation';
import { AnnotatorHandle } from 'react-pdf-ner-annotator/src/types';
import PDFFile from './pdfs/order.pdf';
import KlassifaiLogo from './klassifai.svg';
import './App.scss';
import 'react-pdf-ner-annotator/src/scss/style.scss';

const defaultAnnotations: Array<Annotation> = [{
  'id': 4,
  'page': 1,
  'areaAnnotation': {
    'boundingBox': { 'left': 60, 'top': 35, 'width': 230, 'height': 38 },
    'pdfInformation': { 'width': 892.92, 'height': 1262.835, 'scale': 1.5 },
    'base64Image': 'data:image/jpeg;base64,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',
    'text': 'SlicedInvoices',
  },
  'entity': { 'id': 7, 'name': 'Logo', 'color': '#b39ddb', 'entityType': 'AREA' },
}, {
  'id': 5,
  'page': 1,
  'nerAnnotation': { 'tokens': ['INV-3337'], 'textIds': [4] },
  'entity': { 'id': 5, 'name': 'Reference', 'color': '#DCE775', 'entityType': 'NER' },
}, {
  'id': 6,
  'page': 1,
  'nerAnnotation': { 'tokens': ['January', '25', ',', '2016'], 'textIds': [18, 19, 20, 21] },
  'entity': { 'id': 4, 'name': 'Date', 'color': '#AED581', 'entityType': 'NER' },
}, {
  'id': 7,
  'page': 1,
  'nerAnnotation': { 'tokens': ['January', '31', ',', '2016'], 'textIds': [27, 28, 29, 30] },
  'entity': { 'id': 4, 'name': 'Date', 'color': '#AED581', 'entityType': 'NER' },
}, {
  'id': 8,
  'page': 1,
  'nerAnnotation': {
    'tokens': ['123', 'Somewhere', 'St', 'Melbourne', ',', 'VIC', '3000'],
    'textIds': [46, 47, 48, 49, 50, 51, 52],
  },
  'entity': { 'id': 1, 'name': 'Location', 'color': '#4DD0E1', 'entityType': 'NER' },
}, {
  'id': 9,
  'page': 1,
  'nerAnnotation': { 'tokens': ['Test', 'Business'], 'textIds': [44, 45] },
  'entity': { 'id': 3, 'name': 'Organisation', 'color': '#81C784', 'entityType': 'NER' },
}, {
  'id': 10,
  'page': 1,
  'nerAnnotation': {
    'tokens': ['ANZ', 'Bank', 'ACC', '#', '1234', '1234', 'BSB', '#', '4321', '432'],
    'textIds': [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
  },
  'entity': { 'id': 6, 'name': 'Other', 'color': '#FF8A65', 'entityType': 'NER' },
}];

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
  {
    id: 7,
    name: 'Logo',
    color: '#b39ddb',
    entityType: 'AREA',
  },
];

const App = () => {
  const [selectedEntity, setSelectedEntity] = useState(-1);
  const [annotations, setAnnotations] = useState<Array<Annotation>>(defaultAnnotations);
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
              config={{
                shouldUpdateDefaultAnnotations: true,
              }}
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
