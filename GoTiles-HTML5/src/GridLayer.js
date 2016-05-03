// GridLayer.js
var GridLayer = cc.Layer.extend({
    init:function(wTileCount, hTileCount, tileLength) {
        this._super();
        
        var xOffset = wTileCount * tileLength / 2;
        var yOffset = hTileCount * tileLength / 2;
        // create h lines
        for (var i = 0; i <= hTileCount; i++) {
            var lineSprite = LineSprite.create(cc.p(-xOffset, -yOffset + i * tileLength), cc.p(-xOffset + wTileCount * tileLength, -yOffset + i * tileLength), 1.0);
            lineSprite.setColor(COLOR_WHITE);
            this.addChild(lineSprite);    
        }
        // create v line
        for (var i = 0; i <= wTileCount; i++) {
            var lineSprite = LineSprite.create(cc.p(-xOffset + i * tileLength, -yOffset), cc.p(-xOffset + i * tileLength, -yOffset + hTileCount * tileLength), 1.0);
            lineSprite.setColor(COLOR_WHITE);
            this.addChild(lineSprite);            
        }  
        return true;
    },
    setColor:function(color) {
    	var children = this.getChildren();
    	for (var i = 0; i < children.length; i++) {
    		children[i].setColor(color);
    	}
    }
});
GridLayer.create = function (wTileCount, hTileCount, tileLength) {
    var gridLayer = new GridLayer();
    if (gridLayer && gridLayer.init(wTileCount, hTileCount, tileLength)) 
        return gridLayer;
    return null;
};