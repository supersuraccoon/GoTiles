// TileSprite.js
var TileSprite = cc.Node.extend({
    init:function(tileType, xIndex, yIndex, tileSize) {
        this._super();        
        this._winSize = cc.Director.getInstance().getWinSize();
        // add shape sprite
        this._xIndex = xIndex + 1;
        this._yIndex = yIndex + 1;
        this._tileSize = tileSize;
        this._tileType = tileType;
        this._tileRange = 0; // item use only
        this._shapeSprite = null;
        this.updateShapeSprite();

        return true;
    },
    updateShapeSprite:function() {
        if (this._shapeSprite) {
            this.removeChild(this._shapeSprite, true);
            this._shapeSprite = null;
        }
    	if (this._tileType == 0) {
            // empty tile
            // do nothing
        }
        else if (this._tileType >= 1 && this._tileType <= 100) {
            // normal tile
            this._shapeSprite = DotSprite.create(this._tileSize / 4, 1, 1);
            if (this._tileType == 1) {
                this._shapeSprite.setColor(COLOR_WHITE);
            }
            else if (this._tileType == 2) {
                this._shapeSprite.setColor(COLOR_RED);
            }
            else if (this._tileType == 3) {
                this._shapeSprite.setColor(COLOR_GREEN);
            }
            else if (this._tileType == 4) {
                this._shapeSprite.setColor(COLOR_YELLOW);
            }
            else if (this._tileType == 5) {
                this._shapeSprite.setColor(COLOR_BLUE);
            }
            else if (this._tileType == 6) {
                this._shapeSprite.setColor(COLOR_MAGENTA);
            }
            else {
                this._shapeSprite.setColor(COLOR_CYAN);
            }
        }
        else if (this._tileType > 100) {
            // item
        	this._shapeSprite = PolygonSprite.create(6, this._tileSize / 3);
        	if (this._tileType == 101) {
                this._shapeSprite.setColor(COLOR_FIREBRICK);
                var itemName = cc.LabelTTF.create("A", COMMON_FONT_NAME, 18);
                itemName.setColor(COLOR_BLACK);
                this._shapeSprite.addChild(itemName, Z_TILE_NAME);
            }
            else if (this._tileType == 102) {
            	this._shapeSprite.setColor(COLOR_GOLD);
                var itemName = cc.LabelTTF.create("V" + (this._tileRange == 99 ? "*" : this._tileRange), COMMON_FONT_NAME, 18);
                itemName.setColor(COLOR_BLACK);
                this._shapeSprite.addChild(itemName, Z_TILE_NAME);
            }
            else if (this._tileType == 103) {
            	this._shapeSprite.setColor(COLOR_SKYBLUE);
                var itemName = cc.LabelTTF.create("H" + (this._tileRange == 99 ? "*" : this._tileRange), COMMON_FONT_NAME, 18);
                itemName.setColor(COLOR_BLACK);
                this._shapeSprite.addChild(itemName, Z_TILE_NAME);
            }
            else if (this._tileType == 104) {
                this._tileRange = parseInt(1 + Math.random() * 4);
                if (this._tileRange == 1) {
                    this._shapeSprite.setColor(COLOR_WHITE);
                }
                else if (this._tileRange == 2) {
                    this._shapeSprite.setColor(COLOR_RED);
                }
                else if (this._tileRange == 3) {
                    this._shapeSprite.setColor(COLOR_GREEN);
                }
                else if (this._tileRange == 4) {
                    this._shapeSprite.setColor(COLOR_YELLOW);
                }
                var itemName = cc.LabelTTF.create("C", COMMON_FONT_NAME, 18);
                itemName.setColor(COLOR_BLACK);
                this._shapeSprite.addChild(itemName, Z_TILE_NAME);   
            }
            else {
            	this._shapeSprite.setColor(COLOR_VIOLETRED);
                var itemName = cc.LabelTTF.create("T5", COMMON_FONT_NAME, 18);
                itemName.setColor(COLOR_BLACK);
                this._shapeSprite.addChild(itemName, Z_TILE_NAME);
            }
        }
        if (this._shapeSprite)
            this.addChild(this._shapeSprite);    
    },
    setTileType:function(tileType) {
        if (this._tileType == tileType)
            return;
        if (tileType > 105)
            tileType = 105;
        this._tileType = tileType;
        this.updateShapeSprite();
    },
    setTileRange:function(tileRange) {
    	this._tileRange = tileRange;
    },
    getRect:function() {
        return cc.rect(this.getPositionX() - this._tileSize / 2 + this._tileSize / 4, 
                       this.getPositionY() - this._tileSize / 2 + this._tileSize / 4, 
                       this._tileSize - this._tileSize / 4, 
                       this._tileSize - this._tileSize / 4);
    },
    getCenter:function() {
    	return cc.p(this.getPositionX() + this.getContentSize().width,
    				this.getPositionY() + this.getContentSize().height);
    }
});
TileSprite.create = function (tileType, xIndex, yIndex, tileSize) {
    var tileSprite = new TileSprite();
    if (tileSprite && tileSprite.init(tileType, xIndex, yIndex, tileSize)) 
        return tileSprite;
    return null;
};
