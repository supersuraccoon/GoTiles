// PauseMenuLayer.js

var LeaderboardLayer = cc.LayerColor.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.LayerColor );
        this._super();
    },  
    init:function(delegate) {
        this._delegate = delegate;
        this._winSize = cc.Director.getInstance().getWinSize();
        cc.LayerColor.prototype.init.call(this, cc.c4b(0, 0, 0, 255), this._winSize.width, this._winSize.height);
        // layer title
        var gameLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_TITLE), COMMON_FONT_NAME, 40);
        gameLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 18.5 / 20));
        this.addChild(gameLabel);
        // score title
        var nameLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_PLAYER_LABEL), COMMON_FONT_NAME, 26);
        var tilesLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_SCORE_LABEL), COMMON_FONT_NAME, 26);
        var gameLevelLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_LEVEL_LABEL), COMMON_FONT_NAME, 26);
        var dateLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_DATE_LABEL), COMMON_FONT_NAME, 26);
        nameLabel.setPosition(cc.p(this._winSize.width * 2 / 10, this._winSize.height * 8 / 10));
        tilesLabel.setPosition(cc.p(this._winSize.width * 4 / 10, this._winSize.height * 8 / 10));
        gameLevelLabel.setPosition(cc.p(this._winSize.width * 6 / 10, this._winSize.height * 8 / 10));
        dateLabel.setPosition(cc.p(this._winSize.width * 8 / 10, this._winSize.height * 8 / 10));
        this.addChild(nameLabel);
        this.addChild(tilesLabel);
        this.addChild(gameLevelLabel);
        this.addChild(dateLabel);
        // score loading status label
        var loadingLabel = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_LOADING_SCORE), COMMON_FONT_NAME, 30);
        loadingLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));
        this.addChild(loadingLabel);
        // load score
        var query = new Parse.Query(ScoreObject);
        var that = this;
        query.descending("tiles");
        query.equalTo("pf", PARSE_PLATFORM);
        query.limit(10);
        query.find({
            success: function(results) {
                that.removeChild(loadingLabel);
                for (var i = 0; i < results.length; i++) {
                    var scoreData = results[i];
                    var name = cc.LabelTTF.create(scoreData.attributes.playerName, COMMON_FONT_NAME, 25);
                    var tiles = cc.LabelTTF.create(scoreData.attributes.tiles, COMMON_FONT_NAME, 25);
                    var gameLevel = cc.LabelTTF.create(scoreData.attributes.gameLevel, COMMON_FONT_NAME, 25);
                    var date = cc.LabelTTF.create(scoreData.attributes.playDate, COMMON_FONT_NAME, 25);
                    name.setPosition(cc.p(nameLabel.getPositionX(), nameLabel.getPositionY() - 35 * (i + 1)));
                    tiles.setPosition(cc.p(tilesLabel.getPositionX(), tilesLabel.getPositionY() - 35 * (i + 1)));
                    gameLevel.setPosition(cc.p(gameLevelLabel.getPositionX(), gameLevelLabel.getPositionY() - 35 * (i + 1)));
                    date.setPosition(cc.p(dateLabel.getPositionX(), dateLabel.getPositionY() - 35 * (i + 1)));
                    that.addChild(name);
                    that.addChild(tiles);
                    that.addChild(gameLevel);
                    that.addChild(date);
                }
            },
            error: function(error) {
                loadingLabel.setString(LanguageUtil.getLocalizatedString(STRING_LEADERBOARD_LOADING_ERR));
            }
        });
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
LeaderboardLayer.create = function (delegate) {
    var leaderboardLayer = new LeaderboardLayer();
    if (leaderboardLayer && leaderboardLayer.init(delegate)) 
        return leaderboardLayer;
    return null;
};
