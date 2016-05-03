// PauseMenuLayer.js
var PauseMenuLayer = cc.LayerColor.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.LayerColor );
        this._super();
    },  
    init:function(delegate) {
        this._delegate = delegate;
        this._winSize = cc.Director.getInstance().getWinSize();
        cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 255), this._winSize.width, this._winSize.height);
        // menu
        cc.MenuItemFont.setFontSize(30);
        cc.MenuItemFont.setFontName(COMMON_FONT_NAME);
        this._newGameMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_NEW_GAME), this.newGameSeletor, this);
        this._resumeGameMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_RESUME_GAME), this.resumeGameSeletor, this);
		this._exitGameMenuItem = cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_EXIT_GAME), this.exitGameSeletor, this);
        this._musicMenuItem = cc.MenuItemToggle.create(
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_MUSIC_OFF)),
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_MUSIC_ON)));
        if (g_isMusicOn)
            this._musicMenuItem.setSelectedIndex(1);
        this._musicMenuItem.setCallback(this.onMusicSelector, this);
        this._seMenuItem = cc.MenuItemToggle.create(
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_SE_OFF)),
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_SE_ON)));
        if (g_isSEOn)
            this._seMenuItem.setSelectedIndex(1);
        this._seMenuItem.setCallback(this.onSESelector, this);
		this._languageMenuItem = cc.MenuItemToggle.create(
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_LANGUAGE_EN)),
            cc.MenuItemFont.create(LanguageUtil.getLocalizatedString(STRING_PAUSE_LANGUAGE_CN)));
        if (g_isSEOn)
            this._languageMenuItem.setSelectedIndex(LanguageUtil.languageType == LANGUAGE_ENGLISH ? 0 : 1);
        this._languageMenuItem.setCallback(this.onLanguageSelector, this);
        var menu = cc.Menu.create(this._newGameMenuItem, this._resumeGameMenuItem, this._exitGameMenuItem, this._musicMenuItem, this._seMenuItem);
        menu.alignItemsVerticallyWithPadding(20);
        this.addChild(menu);
        return true;
    },
    newGameSeletor:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        this.removeFromParent(true);
        if (this._delegate)
        	this._delegate.restartGame();
    },
    resumeGameSeletor:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        this.removeFromParent(true);
        if (this._delegate)
        	this._delegate.resumeGame();  
    },
	exitGameSeletor:function(sender) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        this.removeFromParent(true);
        if (this._delegate)
        	this._delegate.exitGame();  
    },
    onMusicSelector:function(sender) {
        if (g_isMusicOn) {
            g_isMusicOn = false;
            cc.AudioEngine.getInstance().stopMusic();
        }
        else {
            g_isMusicOn = true;
            cc.AudioEngine.getInstance().playMusic(s_loop, true);
        }
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
    },
    onSESelector:function(sender) {
        if (g_isSEOn) {
            g_isSEOn = false;
        }
        else {
            g_isSEOn = true;
        }
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
    },
	onLanguageSelector:function(sender) {
		if (sender.getSelectedIndex() == 0) {
			LanguageUtil.languageType = LANGUAGE_ENGLISH;
		}
		if (sender.getSelectedIndex() == 1) {
			LanguageUtil.languageType = LANGUAGE_CHINESE;
		}
		if (sender.getSelectedIndex() == 2) {
			LanguageUtil.languageType = LANGUAGE_JAPANESE;
		}
		if (this._delegate)
        	this._delegate.languageChanged();  
	}
});
PauseMenuLayer.create = function (delegate) {
    var pauseMenuLayer = new PauseMenuLayer();
    if (pauseMenuLayer && pauseMenuLayer.init(delegate)) 
        return pauseMenuLayer;
    return null;
};