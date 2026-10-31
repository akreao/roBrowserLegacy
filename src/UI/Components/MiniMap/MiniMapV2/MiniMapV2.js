/**
 * UI/Components/MiniMap/MiniMapV2.js
 *
 * MiniMap UI
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import BigMap from 'UI/Components/BigMap/BigMap.js';
import htmlText from './MiniMapV2.html?raw';
import cssText from './MiniMapV2.css?raw';
import { createMiniMap } from '../MiniMapCommon.js';

export default createMiniMap({
	name: 'MiniMapV2',
	htmlText,
	cssText,
	// The 2025 client's view button opens the memo map (UIMinimapZoomWnd message 0xbd);
	// the world map keeps its own shortcut.
	worldMap: BigMap,
	townInfoToggle: true,
	coordinates: true,
	arrowShadow: true
});
