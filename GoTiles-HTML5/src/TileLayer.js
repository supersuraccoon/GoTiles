// TileLayer.js
var TileLayer = cc.LayerColor.extend({
    ctor:function() {
    	cc.associateWithNative( this, cc.LayerColor );
		this._super();
	},	
    init:function(wTileCount, hTileCount, tileSize) {
		cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 255), wTileCount * tileSize, hTileCount * tileSize);
        this._wTileCount = wTileCount;
        this._hTileCount = hTileCount;
        this._tileSize = tileSize;
        // add grid layer
        this._gridLayer = GridLayer.create(wTileCount, hTileCount, tileSize);
        this._gridLayer.setPosition(cc.p(wTileCount * tileSize / 2, hTileCount * tileSize / 2));
        this.addChild(this._gridLayer);
        return true;
    },
    updateColor:function(color) {
    	this._gridLayer.setColor(color);
    },
    decreaseOpacity:function() {
        var opacity =  this.getOpacity();
        if (opacity > 0)
            opacity --;
        this.setOpacity(opacity);
    },
    restoreOpacity:function() {
      this.setOpacity(255);  
    }
});
TileLayer.create = function (wTileCount, hTileCount, tileSize) {
    var tileLayer = new TileLayer();
    if (tileLayer && tileLayer.init(wTileCount, hTileCount, tileSize)) 
        return tileLayer;
    return null;
};
