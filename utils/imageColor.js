import axios from "axios";
import ColorThief from "color-thief";
import Color from "color";

const rgbToHex = function (rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = function (r, g, b) {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);
  return red + green + blue;
};

const arrayToRGB = arr => '#' + fullColorHex(arr[0], arr[1], arr[2]);

/**
 * @return {string}
 */
const LightenColor = function(color, percent) {
  const num = parseInt(color.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;

  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

const getBuffer = async (url) => {
  const imageBuffer = await axios.get(url,
    {responseType: 'arraybuffer',})
    .then(response => response.data);

  let buffer = Buffer.from(imageBuffer);
  let arraybuffer = Uint8Array.from(buffer).buffer;

  return new Promise(resolve => resolve(imageBuffer));
};

const generateFromImage = async (url) => {
  const imageBuffer = await getBuffer(url);
  const colorThief = new ColorThief();

  const singleCollor = colorThief.getColor(imageBuffer);
  const palateCollors = colorThief.getPalette(imageBuffer, 6);

  const colorsHex = palateCollors.map(p => {
    const color = Color(p);
    return {
      isLight: color.isLight(),
      lighten: LightenColor(arrayToRGB(p), .2),
      hex: arrayToRGB(p)
    }
  });

  const returnObj = colorsHex;

  // console.log('pallate is: ', palateCollors);
  // console.log('image is: ', url);

  return returnObj;
};

export const generateColor = async (imageURL) => {
  let colorGet;

  colorGet = await generateFromImage(imageURL);

  return new Promise(resolve => resolve(colorGet));
};
