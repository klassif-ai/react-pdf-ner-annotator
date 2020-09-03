import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type AnnotatorHandle<T> = T extends ForwardRefExoticComponent<RefAttributes<infer T2>> ? T2 : never;
