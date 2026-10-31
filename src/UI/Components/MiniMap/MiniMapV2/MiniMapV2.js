/**
 * UI/Components/MiniMap/MiniMapV2.js
 *
 * MiniMap UI
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import WorldMap from 'UI/Components/WorldMap/WorldMap.js';
import BigMap from 'UI/Components/BigMap/BigMap.js';
import htmlText from './MiniMapV2.html?raw';
import cssText from './MiniMapV2.css?raw';
import { createMiniMap } from '../MiniMapCommon.js';

export default createMiniMap({
	name: 'MiniMapV2',
	htmlText,
	cssText,
	// The 2025 minimap: "mini" (Maximize, message 0xbd) opens the memo map,
	// "viewon" (World Map, message 0x1c6) the world map (UIMinimapZoomWnd).
	worldMap: WorldMap,
	bigMap: BigMap,
	townInfoToggle: true,
	coordinates: true,
	arrowShadow: true
});
