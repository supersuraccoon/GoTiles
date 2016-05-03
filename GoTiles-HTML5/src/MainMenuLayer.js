// MainMenuLayer.js
var MainMenuLayer = cc.LayerColor.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.LayerColor );
        this._super();
    },  
    init:function(delegate) {
        this._delegate = delegate;
        this._winSize = cc.Director.getInstance().getWinSize();
        cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 150), this._winSize.width, this._winSize.height);
        // layer title
        var gameLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_MAINMENU_TITLE), COMMON_FONT_NAME, 50);
        gameLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 18.5 / 20));
        this.addChild(gameLabel);
        // menu
        this._createMenu();
        this._splitRowAction = cc.Sequence.create(cc.SplitRows.create(0.5, 10));

        return true;
    },
    _createMenu:function() {
        this.removeChildByTag(T_MAIN_MENU, true);
        cc.MenuItemFont.setFontSize(30);
        cc.MenuItemFont.setFontName(COMMON_FONT_NAME);
        this._newGameMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_NEW_GAME), this.newGameSelector, this);
        this._leaderboardMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_TITLE), this.leaderboardSelector, this);
        this._helpMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_GAMERULE_TITLE), this.gameRuleSelector, this);
        var menu = cc.Menu.create(this._newGameMenuItem, this._leaderboardMenuItem, this._helpMenuItem);
        menu.alignItemsVerticallyWithPadding(40);
        this.addChild(menu, Z_MAIN_MENU, T_MAIN_MENU);
    },
    runSplitRowAction:function() {
        this.removeChildByTag(T_MAIN_MENU, true);
        this.runAction(cc.Sequence.create(this._splitRowAction, cc.CallFunc.create(this.rowSplitActionDone, this)));
    },
    runSplitRowReverseAction:function() {
        this._createMenu();
        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), this._splitRowAction.reverse()));
    },
    newGameSelector:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        this.runSplitRowAction();
    },
    rowSplitActionDone:function() {
        if (this._delegate)
            this._delegate.newGame();
    },
    leaderboardSelector:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        if (this._delegate)
        	this._delegate.leaderboard();  
    },
    gameRuleSelector:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        var gameRuleLayer= GameRuleLayer.create(sender);
        this.addChild(gameRuleLayer, Z_HELPER_LAYER);
    }
});
MainMenuLayer.create = function (delegate) {
    var mainMenuLayer = new MainMenuLayer();
    if (mainMenuLayer && mainMenuLayer.init(delegate)) 
        return mainMenuLayer;
    return null;
};