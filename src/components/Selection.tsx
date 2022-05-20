import React, { useState, useMemo, useRef, useEffect, useCallback, useContext } from 'react';
import useMouse from '@react-hook/mouse-position';
import { Rectangle } from 'tesseract.js';
import { calculateSelectionRectangle, isCoordsEmpty } from '../helpers/selectionHelpers';
import { AnnotationParams } from '../interfaces/annotation';
import { Point } from '../interfaces/point';
import SelectionRectangle from './SelectionRectangle';
import { buildAreaAnnotation, buildNerAnnotation } from '../helpers/annotationHelpers';
import { PDFMetaData } from '../interfaces/pdf';
import useKeyPressedListener from '../hooks/useKeyPressedListener';
import CursorText from './CursorText';
import EntityContext from '../context/entityContext';

interface Props {
  pageNumber: number;
  children: React.ReactNode;
  addAnnotation: (annotation: AnnotationParams) => void;
  updateLastAnnotationForEntity: (annotation: AnnotationParams) => void;
  className?: string;
  style?: {[key: string]: string};
  pdfInformation: PDFMetaData;
  pdfContext: CanvasRenderingContext2D;
}

const initialCoords: Rectangle = { left: 0, top: 0, width: 0, height: 0 };

const Selection = ({
  pageNumber,
  children,
  addAnnotation,
  updateLastAnnotationForEntity,
  className,
  style,
  pdfInformation,
  pdfContext,
}: Props) => {
  const selectionRef = useRef(null);
  const mouse = useMouse(selectionRef);
  const keyPressed = useKeyPressedListener();

  const [isDragging, setIsDragging] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<Point>({ x: 0, y: 0 });
  const [coords, setCoords] = useState(initialCoords);

  const { entity } = useContext(EntityContext);

  const mode = useMemo(() => {
    if (entity && isDragging) {
      return 'annotating-mode';
    }
    if (entity) {
      return 'normal-mode';
    }

    return 'text-selection-mode';
  }, [entity, isDragging]);

  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'escape' && isDragging) {
      setIsDragging(false);
      setMouseCoords({ x: 0, y: 0 });
      setCoords(initialCoords);
    }
  }, [isDragging]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyEvent, false);
    return () => {
      document.removeEventListener('keydown', handleKeyEvent, false);
    };
  }, [handleKeyEvent]);

  const handleMouseDown = useCallback(() => {
    if (entity) {
      const { x, y } = mouse;
      setMouseCoords({ x: x!, y: y! });
      setIsDragging(true);
    }
  }, [entity, mouse]);

  const handleMouseUp = useCallback(() => {
    if (selectionRef && entity) {
      let coordsToUse = coords;
      if (isCoordsEmpty(coords) && entity.entityType === 'NER') {
        const { x, y } = mouse;
        coordsToUse = { left: x!, top: y!, width: 1, height: 1 };
      }

      switch (entity.entityType) {
        case 'NER': {
          const { children: selectionChildren } = selectionRef.current!;
          const markToAdd = buildNerAnnotation(pageNumber, entity, selectionChildren, coordsToUse);
          if (markToAdd.nerAnnotation.textIds.length) {
            if (keyPressed) {
              updateLastAnnotationForEntity(markToAdd);
            } else {
              addAnnotation(markToAdd);
            }
          }
          break;
        }
        case 'AREA': {
          const areaToAdd = buildAreaAnnotation(pageNumber, entity, coordsToUse, pdfInformation, pdfContext);
          if (areaToAdd) {
            addAnnotation(areaToAdd);
          }
          break;
        }
        default:
          break;
      }
    }

    setIsDragging(false);
    setMouseCoords({ x: 0, y: 0 });
    setCoords(initialCoords);
  }, [entity, coords, mouse, pageNumber, keyPressed, updateLastAnnotationForEntity, addAnnotation, pdfInformation, pdfContext]);

  const handleMouseMove = useCallback(() => {
    if (isDragging && entity) {
      const { x, y } = mouse;
      setCoords(calculateSelectionRectangle(mouseCoords, { x: x!, y: y! }));
    }
  }, [isDragging, entity, mouse, mouseCoords]);

  return (
    <div
      role="document"
      ref={selectionRef}
      className={`selection-container ${className} ${mode}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <CursorText
        entity={entity}
        mouseCoords={{ x: mouse?.x, y: mouse?.y }}
      />
      <SelectionRectangle isDragging={isDragging} coordinates={coords} />
      { children }
    </div>
  );
};

export default Selection;
