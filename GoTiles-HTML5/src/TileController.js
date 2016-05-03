// TileController.js
var TileController = cc.Node.extend({
    init:function(wTileCount, hTileCount, tileSize, delegate) {
        this._super();
        this._wTileCount = wTileCount;
        this._hTileCount = hTileCount;
        this._tileSize = tileSize;
        this._delegate = delegate;
        this._randomTypeCount = 3;
        this._affectedColumnArray = new Array();
        this._maskTileArray = new Array();
        this._guideLineArray = new Array();
        this._tileManager = new TileManager();
        this._tileLayer = TileLayer.create(this._wTileCount, this._hTileCount, this._tileSize);
        this._eye = this._tileLayer.getCamera().getEye();
        this._initTiles();
        this._updateAllTilesPosition();
        return true;
    },
    _initTiles:function() {
        for(var i = 0; i < this._wTileCount; i++) {
            for(var j = 0; j < this._hTileCount; j++) { 
                var tile = TileSprite.create(0, i, j, this._tileSize);
                this._tileLayer.addChild(tile);
                this._tileManager.addTile(tile);
            }
        }    
    },
    _randomTileType:function() {
    	return parseInt(1 + Math.random() * this._randomTypeCount);
    },
    _randomItemType:function(linkedTileCount) {
        var pr = parseInt(1 + Math.random() * 100) + linkedTileCount * 3;
        if (pr <= 40) {
            return 101; // A
        }
        else if (pr > 40 && pr <= 60) {
            return 102; // V
        }
        else if (pr > 60 && pr <= 80) {
            return 103; // H
        }
        else if (pr > 80 && pr <= 95) {
            return 105; // T
        }
        else {
            return 104; // C
        }
    },
    _randomTileRange:function(linkedTileCount) {
    	var pr = parseInt(1 + Math.random() * 100) + linkedTileCount * 3;
    	if (pr <= 30) {
    		return 1;
    	}
    	else if (pr > 30 && pr <= 50) {
    		return 2;
    	}
    	else if (pr > 50 && pr <= 70) {
    		return 3;
    	}
    	else if (pr > 70 && pr <= 85) {
    		return 4;
    	}
    	else if (pr > 85 && pr <= 95) {
    		return 5;
    	}
    	else {
    		return 99;
    	}
    },
    updateRandomTypeCount:function(typeCount) {
    	this._randomTypeCount = typeCount;
    },
    _calcPosition:function(xIndex, yIndex) {
        return cc.p(xIndex * this._tileSize + this._tileSize / 2, 
        		    (this._hTileCount - yIndex - 1) * this._tileSize + this._tileSize / 2)
    },
    _updateAllTilesPosition:function() {
    	var tilesArray = this._tileManager.getAllTiles();
        for(var i = 0; i < tilesArray.length; i++) {
            var tile = tilesArray[i];
            tile.setPosition(this._calcPosition(tile._xIndex - 1, tile._yIndex - 1));
        }
    },
    // tile layer
    addGuideLine:function(startPoint, endPoint, color) {
		var lineSprite = LineSprite.create(startPoint, endPoint, 2);
		lineSprite.setColor(color);
    	this._tileLayer.addChild(lineSprite, 999);
    	this._guideLineArray.push(lineSprite);
    },
    cleanGuideLine:function() {
    	for(var i = 0; i < this._guideLineArray.length; i++) {
            var lineSprite = this._guideLineArray[i];
            lineSprite.removeFromParent(true);
        }
    },
    randomTileLayerMask:function(maskCount) {
    	if (maskCount < 1 || maskCount > this._wTileCount * this._hTileCount)
    		return;
    	this._maskTileArray.length = 0;
    	// random mask tile
        for (var i = 0; i < maskCount; i++) {
        	var xIndex = 0, yIndex = 0;
        	var tile = null;
        	do {
        		xIndex = parseInt(1 + Math.random() * this._wTileCount);
            	yIndex = parseInt(1 + Math.random() * this._hTileCount);
            	tile = this._tileManager.getTile(xIndex, yIndex);
        	} while(tile == null || this._maskTileArray.contains(tile));
        	this._maskTileArray.push(tile);
    		// add mask
    		var maskSprite = FrameSprite.create(tile.getBoundingBox(), this._tileSize / 5, 0);
    		maskSprite.setOpacity(240);
    		maskSprite.setScale(0);
    		tile.addChild(maskSprite, Z_TILE_MASK, T_TILE_MASK);
    		maskSprite.runAction(cc.ScaleTo.create(0.5, 1.0));
        }
    },
    removeTileLayerMask:function() {
    	for (var i = 0; i < this._maskTileArray.length; i++) {
    		var tile = this._maskTileArray[i];
    		var maskSprite = tile.getChildByTag(T_TILE_MASK);
    		if (maskSprite) {
    			maskSprite.runAction(cc.Sequence.create(cc.ScaleTo.create(0.5, 0.0), cc.CallFunc.create(this.removeTargetAfterAction, maskSprite)));
    		}
    	}
    },
    decreaseTileLayerOpacity:function() {
        this._tileLayer.decreaseOpacity();
    },
    restoreTileLayerOpacity:function() {
        this._tileLayer.restoreOpacity();
    },
    updateTileLayerColor:function(color) {
    	this._tileLayer.updateColor(color);
    },
    updateTileLayerPosition:function(targetPosition) {
    	this._tileLayer.setPosition(targetPosition);
    },
    shakeTileLayer:function(duration, range) {
    	this._tileLayer.runAction(cc.Sequence.create(cc.Shaky3D.create(duration, cc.size(15,10), range, false), cc.CallFunc.create(this.restore3DEffect, this)));
    },
    restore3DEffect:function() {
        this._tileLayer.stopAllActions();
        this._tileLayer.setGrid(null);
    },
    lensTileLayer:function(duration, targetPosition, range) {
        this._tileLayer.runAction(cc.Sequence.create(cc.Lens3D.create(duration, cc.size(15,10), targetPosition, range), cc.CallFunc.create(this.restore3DEffect, this)));
    },
    shatterTileLayer:function(duration) {
    	this._tileLayer.runAction(cc.ShatteredTiles3D.create(duration, cc.size(16,12), 5, false));
    },
    rippleTileLayer:function(duration, targetPosition, range, waves) {
        this._tileLayer.runAction(cc.Sequence.create(cc.Ripple3D.create(duration, cc.size(32,24), targetPosition, range, waves, 120), cc.CallFunc.create(this.restore3DEffect, this)));
    },
    orbitTilLayer:function(duration, angleZ, angleX, interval) {
    	var orbitForward = cc.OrbitCamera.create(duration, 1, 0, 0, angleZ, angleX, 0);
        var orbitBackward = cc.OrbitCamera.create(duration, 1, 0, 0, -angleZ, angleX, 0);
        var intervalDelay = cc.DelayTime.create(interval);
        var orbit = cc.Sequence.create(orbitForward, orbitForward.reverse(), intervalDelay, orbitBackward, orbitBackward.reverse());
        this._tileLayer.runAction(cc.RepeatForever.create(orbit));
    },
    updateTileLayerEye:function(xOffset, yOffset, zOffset) {
    	this._tileLayer.getCamera().setEye(this._eye.x + xOffset, this._eye.y + yOffset, this._eye.z + zOffset);
    },
    restoreTileLayerEye:function() {
    	this._tileLayer.stopAllActions();
    	this._tileLayer.getCamera().setEye(this._eye.x, this._eye.y, this._eye.z);
    },
    // tile process
    processLinkedTile:function(linkedTileArray) {
    	var itemTileArray = new Array();
    	var timePlus = 0;
    	for (var i = 0; i < linkedTileArray.length; i++) {
            var tile = linkedTileArray[i];
            if (tile._tileType > 100) {
            	// item tile
            	timePlus += this.processItemEffect(tile, linkedTileArray, itemTileArray, timePlus);
            }
            else {
            	// normal tile
            	this.removeTile(tile);
            	if (!this._affectedColumnArray.contains(tile._xIndex))
            		this._affectedColumnArray.push(tile._xIndex);
            }
        }
    	if (linkedTileArray.length > 3) {
    		var tile = linkedTileArray[linkedTileArray.length - 1];
            this.addItemTile(tile, linkedTileArray.length);
    	}
    	timePlus += parseInt((linkedTileArray.length + itemTileArray.length) / 5);
    	if (this._delegate)
    		this._delegate.processLinkedTileFinished(linkedTileArray.length, itemTileArray.length, timePlus);
    },
    processSingleTile:function(targetTile) {
    	var itemTileArray = new Array();
    	var linkedTileArray = new Array();
        if (targetTile._tileType > 100) {
        	// item tile
        	this.processItemEffect(targetTile, linkedTileArray, itemTileArray, 0);
        }
        else {
        	// normal tile
        	this._tileManager.getLinkedTileArray(targetTile, linkedTileArray, targetTile._tileType);
        	if (linkedTileArray.length < 3) {
        		return;
        	}
        	for (var i = 0; i < linkedTileArray.length; i++) {
        		var tile = linkedTileArray[i];
        		this.removeTile(tile);
            	if (!this._affectedColumnArray.contains(tile._xIndex))
            		this._affectedColumnArray.push(tile._xIndex);
        	}
        }
    	if (this._delegate)
    		this._delegate.processLinkedTileFinished(linkedTileArray.length, itemTileArray.length, 0);
    },
    processAfterRemove:function() {
        // drop
        this.dropTiles();
        this._affectedColumnArray.length = 0;
        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.3), cc.CallFunc.create(this.makeupTiles, this)));
    },
    processItemEffect:function(itemTile, linkedTileArray, itemTileArray, timePlus) {
    	var _timePlus = timePlus;
    	if (!this._affectedColumnArray.contains(itemTile._xIndex))
    		this._affectedColumnArray.push(itemTile._xIndex);
    	var targetTileArray = new Array();
    	if (itemTile._tileType == 105) {
    		_timePlus += 5;
    	}
    	else {
    		targetTileArray = this._tileManager.getTargetTileArray(itemTile);
    	}
    	this.runItemEffectAction();
    	this.removeTile(itemTile);
    	for(var i = 0; i < targetTileArray.length; i++) {
    		var tile = targetTileArray[i];
    		if (this._tileManager.checkTileInArray(tile, linkedTileArray) || this._tileManager.checkTileInArray(tile, itemTileArray))
    			continue;
        	if (tile._tileType > 100) {
        		this.processItemEffect(tile, linkedTileArray, itemTileArray, _timePlus);
        	}
        	else {
        		if (!this._affectedColumnArray.contains(tile._xIndex))
            		this._affectedColumnArray.push(tile._xIndex);
        		itemTileArray.push(tile);
        		this.removeTile(tile);
        	}
    	}
    	return _timePlus;
    },
    addItemTile:function(targetTile, linkedTileCount) {
    	var itemType = this._randomItemType(linkedTileCount);
        if (itemType != 104) {
            var itemRange = this._randomTileRange(linkedTileCount);
            targetTile.setTileRange(itemRange);
        }
    	targetTile.setTileType(itemType);
    },
    removeTile:function(targetTile) {
    	this.runRemoveTileAction(targetTile);
        targetTile.setTileType(0);
    },
    dropTiles:function() {
        for(var i = 0; i < this._affectedColumnArray.length; i++) {
            var columnTileArray = this._tileManager.getTilesForColumn(this._affectedColumnArray[i]);
            // move in column
            var emptyTileArray = new Array();
            for(var j = columnTileArray.length - 1; j >= 0; j--) {
                var tile = columnTileArray[j];
                if (tile._tileType == 0) {
                    emptyTileArray.insertAt(0, tile);
                }
                else {
                	var emptyTilesBelow = emptyTileArray.length;
                	if (emptyTilesBelow > 0) {
                        // move tile
                		tile._yIndex += emptyTilesBelow;
                		this.runMoveTileAction(tile);
                	}
                }
            }
            if (emptyTileArray.length > 0) {
            	// move empty tiles to top
            	for(var k = 0; k < emptyTileArray.length; k++) {
            		var tile = emptyTileArray[k];
            		tile._yIndex = k + 1;
            		tile.setPosition(this._calcPosition(tile._xIndex - 1, tile._yIndex - 1));
            	}
            }
        }
    },
    resetAllTiles:function() {
    	var tilesArray = this._tileManager.getAllTiles();
        for(var i = 0; i < tilesArray.length; i++) {
            var tile = tilesArray[i];
            var tileType = this._randomTileType();
            tile.setTileType(tileType);
        }
    },
    getHintTiles:function() {
    	return this._tileManager.findAnyConnectedTiles();
    },
    // action
    removeTargetAfterAction:function(sender) {
    	sender.removeFromParent(true);
    },
    runMoveTileAction:function(targetTile) {
    	targetTile.runAction(cc.MoveTo.create(0.1, this._calcPosition(targetTile._xIndex - 1, targetTile._yIndex - 1)));
    },
    runRemoveTileAction:function(targetTile) {
    	// create 4 shape for action
    	var xOffsetArray = new Array(0.5, 0.5, -0.5, -0.5);
    	var yOffsetArray = new Array(0.5, -0.5, -0.5, 0.5);
    	for (var i = 0; i < 4; i++) {
    		var actionSprite = DotSprite.create(10, 1, 1);
    		actionSprite.setColor(COLOR_WHITE);
    		actionSprite.setPosition(targetTile.getPosition());
    		actionSprite.setPosition(targetTile.getPosition());
        	this._tileLayer.addChild(actionSprite);		
        	actionSprite.runAction(cc.Sequence.create(cc.Spawn.create(cc.MoveBy.create(0.3, cc.p(200 * xOffsetArray[i], 200 * yOffsetArray[i])), cc.ScaleTo.create(0.3, 0)), cc.CallFunc.create(this.removeTargetAfterAction, actionSprite)));
    	}
    },
    runItemEffectAction:function() {
    	this._tileLayer.runAction(cc.Blink.create(0.1, 1));
    },
    makeupTiles:function(sender) {
        for(var i = 0; i < this._wTileCount; i++) {
            var columnTileArray = this._tileManager.getTilesForColumn(i + 1);
            for(var j = 0; j < columnTileArray.length; j++) {
                var tile = columnTileArray[j];
                if (tile._tileType == 0) {
                	var tileType = this._randomTileType();
                    tile.setTileType(tileType);
                }
            }
        }
        // need reset?
        if (this._tileManager.findAnyConnectedTiles() == null) {
        	this.resetAllTiles();
        	if (this._delegate)
        		this._delegate.allTilesReset();
        }
        if (this._delegate)
    		this._delegate.processAfterRemoveFinished();
    },
    // touch
    tileFromTouch:function(touchLocation) {
        touchLocation = this._tileLayer.convertToNodeSpace(touchLocation);
        return this._tileManager.tileFromPosition(touchLocation);
    },
    isTouchInTileLayer:function(touchLocation) {
        return cc.rectContainsPoint(this._tileLayer.getBoundingBox(), touchLocation);
    }
});

TileController.create = function (wTileCount, hTileCount, tileSize, delegate) {
    var tileController = new TileController();
    if (tileController && tileController.init(wTileCount, hTileCount, tileSize, delegate)) 
        return tileController;
    return null;
};
