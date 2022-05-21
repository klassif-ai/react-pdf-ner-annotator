export interface Config {
  httpHeaders?: {
    [key: string]: string;
  };
  disableOCR?: boolean;
  readonly?: boolean;
  hideAnnotatingTooltips?: boolean;
  hideAnnotatingEntityVisualizations?: boolean;
  hideAnnotateableBoxes?: boolean;
  shouldUpdateDefaultAnnotations?: boolean;
}
