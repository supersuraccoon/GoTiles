// SubmitScoreLayer.js

var SubmitScoreLayer = cc.LayerColor.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.LayerColor );
        this._super();
    },  
    init:function(delegate, level, tiles) {
        this._delegate = delegate;
        this._level = level;
        this._tiles = tiles;
        this._winSize = cc.Director.getInstance().getWinSize();
        cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 255), this._winSize.width * 2 / 3, this._winSize.height * 3 / 5);
        this.setPosition(cc.p(this._winSize.width / 2 - this.getContentSize().width / 2, this._winSize.height / 2 - this.getContentSize().height / 2));
        // layer title
        var label = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_SUBMIT_TITLE), COMMON_FONT_NAME, this._winSize.width / 26);
        label.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height * 18 / 20));
        this.addChild(label);
        // submit score status label
        this._statusLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_SUBMIT_INPUT_NAME), COMMON_FONT_NAME, this._winSize.width / 36);
        this._statusLabel.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height * 14 / 20));
        this._statusLabel.setColor(cc.c3b(255, 255, 0));
        this.addChild(this._statusLabel);
        // layer frame
        var layerFrame = FrameSprite.create(this.getBoundingBox(), 3, -3);
        layerFrame.setColor(cc.c3b(255, 255, 255));
        this.addChild(layerFrame);
        // edit box for playname
        var cliBoxSprite = cc.Scale9Sprite.create(s_editbox);
        this._editBox = cc.EditBox.create(cc.size(this.getContentSize().width * 2 / 3, this.getContentSize().width / 15), cliBoxSprite);
        this._editBox.setPlaceHolder("");
        this._editBox.setColor(cc.c3b(100, 100, 100));
        this._editBox.setFont(COMMON_FONT_NAME, this.getContentSize().width / 15);
        this._editBox.setFontColor(cc.c3b(255, 255, 255));
        this._editBox.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height / 2));
        this._editBox.setDelegate(this);
        this._editBox.setMaxLength(10);
        this.addChild(this._editBox);
        // common menu
        cc.MenuItemFont.setFontSize(this.getContentSize().width / 18);
        cc.MenuItemFont.setFontName(COMMON_FONT_NAME);
        this._submiteMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_SUBMIT_CONFIRM), this.submitSelector, this);
        var cancelMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_SUBMIT_CANCEL), this.cancelSelector, this);
        var menu = cc.Menu.create(this._submiteMenuItem, cancelMenuItem);
        menu.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height * 3 / 20));
        menu.alignItemsHorizontallyWithPadding(this.getContentSize().width / 15);
        this.addChild(menu);
        // menu for specific platform
        if (GAME_PLATFORM != "IOS") {
        	var twitterShareMenuItem = cc.MenuItemFont.create("   TWITTER   ", this.twitterShareSelector, this);
            var twitterMenu = cc.Menu.create(twitterShareMenuItem);
            twitterMenu.setPosition(cc.p(30, this.getContentSize().height / 2));
            this.addChild(twitterMenu);
	        var twitterShareMenuItemFrame = FrameSprite.create(twitterShareMenuItem.getBoundingBox(), 2, 6);
	        twitterShareMenuItemFrame.setColor(cc.c3b(255, 255, 255));
	        twitterShareMenuItem.addChild(twitterShareMenuItemFrame);
	        twitterShareMenuItem.setRotation(270);
        }
        if (GAME_PLATFORM == "WEIBO") {
        	var sinaShareMenuItem = cc.MenuItemFont.create("   WEIBO   ", this.sinaShareSelector, this);
            var sinaMenu = cc.Menu.create(sinaShareMenuItem);
            sinaMenu.setPosition(cc.p(this.getContentSize().width - 30, this.getContentSize().height / 2));
            this.addChild(sinaMenu);
	        var sinaMenuItemFrame = FrameSprite.create(sinaShareMenuItem.getBoundingBox(), 2, 5);
	        sinaMenuItemFrame.setColor(cc.c3b(255, 255, 255));
	        sinaShareMenuItem.addChild(sinaMenuItemFrame);
	        sinaShareMenuItem.setRotation(90);
        }
		if (GAME_PLATFORM == "FACEBOOK") {
        	var sinaShareMenuItem = cc.MenuItemFont.create("  FACEBOOK  ", this.facebookShareSelector, this);
            var sinaMenu = cc.Menu.create(sinaShareMenuItem);
            sinaMenu.setPosition(cc.p(this.getContentSize().width - 30, this.getContentSize().height / 2));
            this.addChild(sinaMenu);
	        var sinaMenuItemFrame = FrameSprite.create(sinaShareMenuItem.getBoundingBox(), 2, 5);
	        sinaMenuItemFrame.setColor(cc.c3b(255, 255, 255));
	        sinaShareMenuItem.addChild(sinaMenuItemFrame);
	        sinaShareMenuItem.setRotation(90);
        }
        return true;
    },
    submitSelector:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        if (this._editBox.getText() == "")
        	return;
		this._submiteMenuItem.setEnabled(false);
        this._statusLabel.setString(LanguageUtil.getLocalizatedString(STRING_SUBMIT_UPLOADING));
        var scoreObject = new ScoreObject();
        scoreObject.playerName = this._editBox.getText();
        scoreObject.gameLevel = this._level;
        scoreObject.tiles = this._tiles;
        scoreObject.pf = PARSE_PLATFORM;
        var that = this;
        scoreObject.saveScore(function (result) {
        	if (result == 1) {
        		// success
        		that._statusLabel.setString(LanguageUtil.getLocalizatedString(STRING_SUBMIT_OK));
        	}
        	else {
        		// fail
        		that._statusLabel.setString(LanguageUtil.getLocalizatedString(STRING_SUBMIT_ERR));
				this._submiteMenuItem.setEnabled(true);
        	}
        });
    },
    cancelSelector:function(sender) {
    	this.removeFromParent(true);
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        if (this._delegate)
        	this._delegate.submitScoreOver();
    },
    twitterShareSelector:function(sender) {
    	alert("Not in beta version :)");
    },
    sinaShareSelector:function(sender) {
    	alert("Not in beta version :)");
    },
	facebookShareSelector:function(sender) {
    	alert("Not in beta version :)");
    },
    removeLayer:function(sender) {
    	this.removeFromParent(true);
    	if (this._delegate)
    		this._delegate.submitScoreOver();
    },
    editBoxReturn: function (editBox) {
    }
});

SubmitScoreLayer.create = function (delegate, level, tiles) {
    var submitScoreLayer = new SubmitScoreLayer();
    if (submitScoreLayer && submitScoreLayer.init(delegate, level, tiles)) 
        return submitScoreLayer;
    return null;
};
