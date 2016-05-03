// GameRuleLayer.js

var GameRuleLayer = cc.LayerColor.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.LayerColor );
        this._super();
    },  
    init:function(delegate) {
        this._delegate = delegate;
        this._winSize = cc.Director.getInstance().getWinSize();
        cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 180), this._winSize.width, this._winSize.height);
        // create Label label
        var gameLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_GAMERULE_TITLE), COMMON_FONT_NAME, 50);
        gameLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 18.5 / 20));
        this.addChild(gameLabel);
        // add rule label
        var ruleArray = new Array(
        		LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_1),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_2),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_3),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_4),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_5),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_6),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_7),
                LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_8),
				LanguageUtil.getLocalizatedString(STRING_GAMERULE_DETAIL_9));
        for (var i = 0; i < ruleArray.length; i++) {
        	var ruleLabel = cc.LabelTTF.create(ruleArray[i], COMMON_FONT_NAME, 22, new cc.size(this._winSize.width * 9 / 10, 100), cc.TEXT_ALIGNMENT_LEFT, cc.TEXT_ALIGNMENT_CENTER);
        	ruleLabel.setAnchorPoint(cc.p(0, 0.5));
        	ruleLabel.setPosition(cc.p(this._winSize.width * 2 / 20, this._winSize.height * 16 / 20 - i * 40));
            this.addChild(ruleLabel);	
        }
        
        // touch to close
        this.setTouchEnabled(true);
        this.onTouchesBegan = function (touches, event) {
        	if (g_isSEOn)
                cc.AudioEngine.getInstance().playEffect(s_click);
            this.removeFromParent(true);
        }
        return true;
    }
});
GameRuleLayer.create = function (delegate) {
    var gameRuleLayer = new GameRuleLayer();
    if (gameRuleLayer && gameRuleLayer.init(delegate)) 
        return gameRuleLayer;
    return null;
};