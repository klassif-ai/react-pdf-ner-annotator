# react-pdf-ner-annotator

[![npm package][npm-badge]][npm]

A React component to annotate named entities directly onto a PDF.

## Features


## Installation
The package can be installed through NPM.

``npm install react-pdf-ner-annotator``

## Usage
For simple example usage you can refer to [example/src/App.tsx](https://github.com/MaartenBloemen/react-pdf-ner-annotator/blob/master/example/src/App.tsx).

```javascript
import Annotator from 'react-pdf-ner-annotator';
// import the css
import 'react-pdf-ner-annotator/lib/css/style.css';
// OR import the sass
import 'react-pdf-ner-annotator/lib/scss/style.scss';
<Annotator url={'http://example.pdf'} />
```

## Properties
| Name               | Type                                     | Required                       | Default value                                             | Description                                                                                                                                                                                                                                  |
|--------------------|------------------------------------------|--------------------------------|-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| url                | `string`                                 | Either url or data is required | `undefined`                                               | The URL of the PDF\.                                                                                                                                                                                                                         |
| data               | `Uint8Array` | `BufferSource` | `string` | Either data or url is required | `undefined`                                               | The PDF as binary or base64 encoded string\.                                                                                                                                                                                                 |
| httpHeaders        | `{ [key: string]: string }`              | no                             | `undefined`                                               | Extra fields for in the HTTP header when for example authentication is needed\.                                                                                                                                                              |
| initialScale       | `number`                                 | no                             | 1\.5                                                      | The initial scale to display the PDF as\. Must be between 1 and 2\.                                                                                                                                                                          |
| tokenizer          | `RegExp`                                 | no                             | `new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g)`                  | A Regular expression for the tokenization of the paragraphs\.                                                                                                                                                                                |
| disableOCR         | `boolean`                                | no                             | `false`                                                   | You can set this value to true if your PDF doesn't have a text layer and you don't want the frontend to run OCR\.                                                                                                                            |
| entity             | `Entity`                                 | no                             | `undefined`                                               | The active [Entity](https://github.com/MaartenBloemen/react\-pdf\-ner\-annotator/blob/master/src/interfaces/entity\.ts\#L3\) to annotate on the PDF\.                                                                                        |
| initialTextmap     | `Array<TextLayer>`                       | no                             | `undefined`                                               | A array of [TextLayer](https://github.com/MaartenBloemen/react\-pdf\-ner\-annotator/blob/master/src/interfaces/textLayer\.ts\#L17\) if you want to provide your own TextLayer for the PDF instead of letting the frontend generate one\.     |
| defaultAnnotations | `Array<Annotation>`                      | no                             | `[]`                                                      | An array of [Annotation](https://github.com/MaartenBloemen/react\-pdf\-ner\-annotator/blob/master/src/interfaces/annotation\.ts\#L3\) to show on the PDF\.                                                                                   |
| ref                | `ref`                                    | no                             | `undefined`                                               | A ref to pass to the Annotator, this ref can be used to call removeAnnotation.                                                                                                                                                               |

## Callback methods
| Name           | Parameters                     | Return type | Required | Description                                                                                                                                                                                    |
|----------------|--------------------------------|-------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getAnnotations | annotations: Array<Annotation> | void        | yes      | Provide a method that takes an array of Annotation as input. This method can be the set of a useState hook for example. This is to subscribe to changes of the annotations made on the PDF. |
| getTextMaps    | maps: Array<TextLayer>         | void        | no       | Same as the annotations but for the text layers. This will only return text layers of pages with annotations on them.                                                                        |

## Local development
