// TileManager.js

var TileManager = function() {
	this._tilesArray = new Array(); 
	this.getAllTiles = function() {
		return this._tilesArray; 
	},
	this.addTile = function(tile) {
		this._tilesArray.push(tile);
	},
    this.getTargetTileArray = function(itemTile) {
    	if (itemTile._tileType == 101)
    		return this.getAroundTiles(itemTile);
    	if (itemTile._tileType == 102)
    		return this.getTilesForColumnWithRange(itemTile);
    	if (itemTile._tileType == 103)
    		return this.getTilesForRowWithRange(itemTile);
        if (itemTile._tileType == 104)
            return this.getTilesForType(itemTile._tileRange);
    	return new Array();
    },
    this.getLinkedTileArray = function(itemTile, linkedTileArray, targetType) {
    	if (itemTile._tileType != targetType)
    		return
    		
		// Check if idx is already visited
		for (var i = 0; i < linkedTileArray.length; i++) {
			var tile = linkedTileArray[i];
			if (tile._xIndex == itemTile._xIndex &&
				tile._yIndex == itemTile._yIndex) 
				return;
		}
    	linkedTileArray.push(itemTile);
    	
        var leftTile = this.getTile(itemTile._xIndex - 1, itemTile._yIndex);
        if (leftTile) 
        	this.getLinkedTileArray(leftTile, linkedTileArray, targetType);
        var rightTile = this.getTile(itemTile._xIndex + 1, itemTile._yIndex);
        if (rightTile) 
        	this.getLinkedTileArray(rightTile, linkedTileArray, targetType);
        var upTile = this.getTile(itemTile._xIndex, itemTile._yIndex - 1);
        if (upTile) 
        	this.getLinkedTileArray(upTile, linkedTileArray, targetType);
        var downTile = this.getTile(itemTile._xIndex, itemTile._yIndex + 1);
        if (downTile) 
        	this.getLinkedTileArray(downTile, linkedTileArray, targetType);
    },
    this.getTile = function(xIndex, yIndex) {
        for(var i = 0; i < this._tilesArray.length; i++) {
            var tile = this._tilesArray[i];
            if (tile._xIndex == xIndex && tile._yIndex == yIndex) {
                return tile;
            }
        }
        return null;
    },
    this.getTilesForColumn = function(column) {
        var columnTileArray = new Array();
        var counter = 1;
        do {
        	var tile = this.getTile(column, counter);
        	if (tile) {
        		columnTileArray.push(tile);
        		counter ++;
        	}
        }while(tile);
        return columnTileArray;
    },
    this.getTilesForRowWithRange = function(itemTile) {
        var rowTileArray = new Array();
        var counter = 0;
        do {
        	// get left tile
        	var tile = this.getTile(itemTile._xIndex - 1 - counter, itemTile._yIndex);  
        	if (tile) {
        		rowTileArray.push(tile);
        		counter ++;
        	}
        }while(tile && counter < itemTile._tileRange);
        counter = 0;
        do {
        	// get right tile
        	var tile = this.getTile(itemTile._xIndex + 1 + counter, itemTile._yIndex);  
        	if (tile) {
        		rowTileArray.push(tile);
        		counter ++;
        	}
        }while(tile && counter < itemTile._tileRange);
        return rowTileArray;
    },
    this.getTilesForColumnWithRange = function(itemTile) {
        var columnTileArray = new Array();
        var counter = 0;
        do {
        	// get up tile
        	var tile = this.getTile(itemTile._xIndex, itemTile._yIndex - 1 - counter);  
        	if (tile) {
        		columnTileArray.push(tile);
        		counter ++;
        	}
        }while(tile && counter < itemTile._tileRange);
        counter = 0;
        do {
        	// get down tile
        	var tile = this.getTile(itemTile._xIndex, itemTile._yIndex + 1 + counter);  
        	if (tile) {
        		columnTileArray.push(tile);
        		counter ++;
        	}
        }while(tile && counter < itemTile._tileRange);
        return columnTileArray;
    },
    this.getTilesForRow = function(row) {
        var rowTileArray = new Array();
        var counter = 1;
        do {
        	var tile = this.getTile(counter, row);
        	if (tile) {
        		rowTileArray.push(tile);
        		counter ++;
        	}	
        }while(tile);
        return rowTileArray;
    },
    this.getAroundTiles = function(centerTile) {
        var aroundTileArray = new Array();
        var leftTile = this.getTile(centerTile._xIndex - 1, centerTile._yIndex);
        if (leftTile) 
        	aroundTileArray.push(leftTile);
        var rightTile = this.getTile(centerTile._xIndex + 1, centerTile._yIndex);
        if (rightTile) 
        	aroundTileArray.push(rightTile);    
        var upTile = this.getTile(centerTile._xIndex, centerTile._yIndex - 1);
        if (upTile) 
        	aroundTileArray.push(upTile);   
        var downTile = this.getTile(centerTile._xIndex, centerTile._yIndex + 1);
        if (downTile) 
        	aroundTileArray.push(downTile);    
        var leftUpTile = this.getTile(centerTile._xIndex - 1, centerTile._yIndex - 1);
        if (leftUpTile) 
        	aroundTileArray.push(leftUpTile);     
        var leftDownTile = this.getTile(centerTile._xIndex - 1, centerTile._yIndex + 1);
        if (leftDownTile) 
        	aroundTileArray.push(leftDownTile);     
        var rightUpTile = this.getTile(centerTile._xIndex + 1, centerTile._yIndex - 1);
        if (rightUpTile) 
        	aroundTileArray.push(rightUpTile);     
        var rightDownTile = this.getTile(centerTile._xIndex + 1, centerTile._yIndex + 1);
        if (rightDownTile) 
        	aroundTileArray.push(rightDownTile);  
        return aroundTileArray;
    },
    this.getCrossTiles = function(centerTile) {
    	var crossTileArray = new Array();
        var leftTile = this.getTile(centerTile._xIndex - 1, centerTile._yIndex);
        if (leftTile) 
        	crossTileArray.push(leftTile);
        var rightTile = this.getTile(centerTile._xIndex + 1, centerTile._yIndex);
        if (rightTile) 
        	crossTileArray.push(rightTile);    
        var upTile = this.getTile(centerTile._xIndex, centerTile._yIndex - 1);
        if (upTile) 
        	crossTileArray.push(upTile);   
        var downTile = this.getTile(centerTile._xIndex, centerTile._yIndex + 1);
        if (downTile) 
        	crossTileArray.push(downTile);    
        return crossTileArray;    	
    },
    this.getTilesForType = function(targetType) {
        var colorTileArray = new Array();
        for (var i = 0; i < this._tilesArray.length; i++) {
            var tile = this._tilesArray[i];
            if (tile._tileType == targetType)
                colorTileArray.push(tile);
        }
        return colorTileArray;
    },
    this.checkTileInArray = function(targetTile, tileArray) {
    	for (var i = 0; i < tileArray.length; i++) {
            var tile = tileArray[i];
            if (tile._xIndex == targetTile._xIndex && tile._yIndex == targetTile._yIndex)
            	return true;
        }
    	return false;
    },
    this.tileFromPosition = function(tilePosition) {
        for(var i = 0; i < this._tilesArray.length; i++) {
            var tile = this._tilesArray[i];
            if (cc.rectContainsPoint(tile.getRect(), tilePosition)) {
                return tile;
            }
        }
        return null;
    },
    this.findAnyConnectedTiles = function() {
    	for(var i = 0; i < this._tilesArray.length; i++) {
    		var connectTilesArray = new Array();
    		var sourceTile = this._tilesArray[i];
    		connectTilesArray.push(sourceTile);
            var crossTilesArray = this.getCrossTiles(sourceTile);
            if (sourceTile._tileType > 100) {
        		for (var j = 0; j < crossTilesArray.length; j++) {
        			// pick one
        			var crossTile = crossTilesArray[j];
        			// try pich another
        			for (var k = j + 1; k < crossTilesArray.length; k++) {
        				var anotherCrossTile = crossTilesArray[k];
        				// possible pattern: two tiles / at least one item
        				if ((crossTile._tileType > 100 || anotherCrossTile._tileType > 100) ||
        					(crossTile._tileType == anotherCrossTile._tileType)) {
        					connectTilesArray.push(crossTile);
        					connectTilesArray.push(anotherCrossTile);
        					return connectTilesArray;
        				}
        			}
        		}
        	}
        	else {
        		// pick the tile with same type as source tile or which is a item
        		for (var j = 0; j < crossTilesArray.length; j++) {
        			var crossTile = crossTilesArray[j];
        			if (crossTile._tileType == sourceTile._tileType || crossTile._tileType > 100)
        				connectTilesArray.push(crossTile);
	        			if (connectTilesArray.length >= 3)
	        	        	return connectTilesArray;
        		}
        	}
    	}
    	return null;
    }
};
