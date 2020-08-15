import React, { useState, useMemo, useRef, useEffect } from 'react';
import useMouse from '@react-hook/mouse-position';
import { Rectangle } from 'tesseract.js';
import { calculateSelectionRectangle, findIntersectingChildren, isCoordsEmpty } from '../../helpers/selectionHelpers';
import { AnnotationParams } from '../../interfaces/annotation';
import { Entity } from '../../interfaces/entity';
import './Selection.scss';
import { Point } from '../../interfaces/point';

interface Props {
  pageNumber: number;
  children: React.ReactNode;
  addAnnotation: (annotation: AnnotationParams) => void;
  className?: string;
  style?: {[key: string]: string};
  entity?: Entity;
}

const initialCoords: Rectangle = { left: 0, top: 0, width: 0, height: 0 };

const Selection = ({
  pageNumber,
  children,
  addAnnotation,
  className,
  style,
  entity
}: Props) => {
  const selectionRef = useRef(null);
  const mouse = useMouse(selectionRef);

  const [isDragging, setIsDragging] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<Point>({ x: 0, y: 0 });
  const [coords, setCoords] = useState(initialCoords);

  const mode = () => {
    if (entity && isDragging) {
      return 'annotating-mode';
    }
    if (entity) {
      return 'normal-mode';
    }

    return 'text-selection-mode';
  };

  const handleKeyEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape': {
        if (isDragging) {
          setIsDragging(false);
          setMouseCoords({ x: 0, y: 0 });
          setCoords(initialCoords);
        }
        break;
      }
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

  const handleMouseDown = () => {
    if (entity) {
      const { x, y } = mouse;
      setMouseCoords({ x: x!, y: y! });
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (selectionRef && entity) {
      let coordsToUse = coords;
      if (isCoordsEmpty(coords)) {
        const { x, y } = mouse;
        coordsToUse = { left: x!, top: y!, width: 5, height: 5 };
      }
      const { children: selectionChildren } = selectionRef.current!;
      const intersects = findIntersectingChildren(selectionChildren, coordsToUse);
      const markToAdd: AnnotationParams = {
        page: pageNumber,
        tokens: [],
        textIds: [],
        entity: entity!
      };

      intersects.forEach((intersect) => {
        const offsetX = intersect.offsetLeft;
        const offsetY = intersect.offsetTop;
        findIntersectingChildren(intersect.children, coordsToUse, offsetX, offsetY).forEach((child, index) => {
          const dataI = child.getAttribute('data-i');
          if (dataI) {
            markToAdd.tokens.push(child.textContent);
            markToAdd.textIds.push(parseInt(dataI, 10));
          }
        });
      });

      if (markToAdd.textIds.length) {
        addAnnotation(markToAdd);
      }
    }

    setIsDragging(false);
    setMouseCoords({ x: 0, y: 0 });
    setCoords(initialCoords);
  };

  const handleMouseMove = () => {
    if (isDragging && entity) {
      const { x, y } = mouse;
      setCoords(calculateSelectionRectangle(mouseCoords, { x: x!, y: y! }));
    }
  };

  const renderSelectionRectangle = useMemo(() => {
    const visibility = isDragging ? 'visible' : 'hidden';
    return (
      <span
        data-ignore={true}
        className="selection__rectangle"
        style={{
          visibility,
          left: `${coords.left}px`,
          top: `${coords.top}px`,
          width: `${coords.width}px`,
          height: `${coords.height}px`,
        }}
      />
    );
  }, [coords, isDragging]);

  return (
    <div
      role="document"
      ref={selectionRef}
      className={`selection-container ${className} ${mode()}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      { renderSelectionRectangle }
      { children }
    </div>
  );
};

export default Selection;
