import React, { useState, useMemo, useRef, useEffect } from 'react';
import useMouse from '@react-hook/mouse-position';
import { findIntersectingChildren } from '../../helpers/selectionHelpers';
import { AnnotationParams } from '../../interfaces/annotation';
import { Entity } from '../../interfaces/entity';
import './Selection.scss';

interface Props {
  pageNumber: number;
  children: React.ReactNode;
  addAnnotation: (annotation: AnnotationParams) => void;
  className?: string;
  style?: {[key: string]: string};
  entity?: Entity;
}

// left, top, width, height
const initialCoords = [0, 0, 0, 0];

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
  const [mouseCoords, setMouseCoords] = useState([0, 0]);
  const [coords, setCoords] = useState(initialCoords);

  const handleKeyEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape': {
        if (isDragging) {
          setIsDragging(false);
          setMouseCoords([0, 0]);
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
      setMouseCoords([x!, y!]);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (selectionRef && entity) {
      const { children: selectionChildren } = selectionRef.current!;
      const intersects = findIntersectingChildren(selectionChildren, coords);
      const markToAdd: AnnotationParams = {
        page: pageNumber,
        tokens: [],
        textIds: [],
        entity: entity!,
      };

      intersects.forEach((intersect) => {
        const offsetX = intersect.offsetLeft;
        const offsetY = intersect.offsetTop;
        findIntersectingChildren(intersect.children, coords, offsetX, offsetY).forEach((child) => {
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
    setMouseCoords([0, 0]);
    setCoords(initialCoords);
  };

  const handleMouseMove = () => {
    if (isDragging && entity) {
      const { x, y } = mouse;
      calculateSelectionRectangle(x!, y!);
    }
  };

  const calculateSelectionRectangle = (x2: number, y2: number) => {
    const x3 = Math.min(mouseCoords[0], x2);
    const x4 = Math.max(mouseCoords[0], x2);
    const y3 = Math.min(mouseCoords[1], y2);
    const y4 = Math.max(mouseCoords[1], y2);

    setCoords([x3, y3, (x4 - x3), (y4 - y3)]);
  };

  const renderSelectionRectangle = useMemo(() => {
    const visibility = isDragging ? 'visible' : 'hidden';
    return (
      <span
        data-ignore={true}
        className="selection__rectangle"
        style={{
          visibility,
          left: `${coords[0]}px`,
          top: `${coords[1]}px`,
          width: `${coords[2]}px`,
          height: `${coords[3]}px`,
        }}
      />
    );
  }, [coords, isDragging]);

  return (
    <div
      role="document"
      ref={selectionRef}
      className={`selection-container ${className} ${entity ? 'annotating-mode' : 'text-selection-mode'}`}
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
