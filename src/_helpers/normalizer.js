import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const FIGMA_MOBILE_WIDTH = 450;
const FIGMA_MOBILE_HEIGHT = 500;

const wscale = SCREEN_WIDTH / FIGMA_MOBILE_WIDTH;
const hscale = SCREEN_HEIGHT / FIGMA_MOBILE_HEIGHT;

const normalize = (size, landscape = false) => {
  const newSize = landscape ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }  
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export default normalize;
export {SCREEN_WIDTH, SCREEN_HEIGHT};
