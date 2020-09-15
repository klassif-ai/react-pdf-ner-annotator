export const generateRandomId = (length: number): string => Array(length).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');

export const getTextMetrics = (text: string, fontSize: number) => {
	// re-use canvas object for better performance
	let canvas = document.createElement("canvas");
	let context = canvas.getContext("2d");
	context.font = `${fontSize}px sans-serif`;
	let metrics = context.measureText(text);
	let lineHeight = 1.5*context.measureText('M').width;

	return {
		'width': metrics.width,
		'height': lineHeight
	}
}

export const getScale = (transform: string) => {
	var scale = {
    'x': 1,
    'y': 1
  }
  if (transform){
    transform = transform.replace("scale(", "")
    var scales = transform.split(",");
    scale.x = parseFloat(scales[0])
    scale.y = parseFloat(scales[1])
  }
	return scale;
}
