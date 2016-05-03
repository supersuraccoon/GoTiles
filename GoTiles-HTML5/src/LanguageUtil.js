//LanguageUtil.js

var LANGUAGE_CHINESE = 1;
var LANGUAGE_JAPANESE = 2;
var LANGUAGE_ENGLISH = 3;

// others
var STRING_GAMELAYER_KEY = 1000;
var STRING_NO_WEBGL_SUPPORT = ++STRING_GAMELAYER_KEY;

// GameRule Layer
var STRING_GAMERULE_KEY = 2000;
var STRING_GAMERULE_TITLE = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_1 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_2 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_3 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_4 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_5 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_6 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_7 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_8 = ++STRING_GAMERULE_KEY;
var STRING_GAMERULE_DETAIL_9 = ++STRING_GAMERULE_KEY;

// Leaderboard Layer
var STRING_LEADERBOARD_KEY = 3000;
var STRING_LEADERBOARD_TITLE = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_PLAYER_LABEL = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_LEVEL_LABEL = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_DATE_LABEL = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_SCORE_LABEL = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_LOADING_SCORE = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_LOADING_OK = ++STRING_LEADERBOARD_KEY;
var STRING_LEADERBOARD_LOADING_ERR = ++STRING_LEADERBOARD_KEY;

// Pause Layer
var STRING_PAUSE_KEY = 4000;
var STRING_PAUSE_NEW_GAME = ++STRING_PAUSE_KEY;
var STRING_PAUSE_RESUME_GAME = ++STRING_PAUSE_KEY;
var STRING_PAUSE_EXIT_GAME = ++STRING_PAUSE_KEY;
var STRING_PAUSE_MUSIC_ON = ++STRING_PAUSE_KEY;
var STRING_PAUSE_MUSIC_OFF = ++STRING_PAUSE_KEY;
var STRING_PAUSE_SE_ON = ++STRING_PAUSE_KEY;
var STRING_PAUSE_SE_OFF = ++STRING_PAUSE_KEY;
var STRING_PAUSE_LANGUAGE_CN = ++STRING_PAUSE_KEY;
var STRING_PAUSE_LANGUAGE_EN = ++STRING_PAUSE_KEY;
var STRING_PAUSE_LANGUAGE_JA = ++STRING_PAUSE_KEY;

// SubmitScore Layer
var STRING_SUBMIT_KEY = 5000;
var STRING_SUBMIT_TITLE = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_INPUT_NAME = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_CONFIRM = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_CANCEL = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_UPLOADING = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_OK = ++STRING_SUBMIT_KEY;
var STRING_SUBMIT_ERR = ++STRING_SUBMIT_KEY;

// MainMenu Layer
var STRING_MAINMENU_KEY = 6000;
var STRING_MAINMENU_TITLE = ++STRING_MAINMENU_KEY;

var LanguageUtil = function () {};
LanguageUtil.languageType = LANGUAGE_ENGLISH;

LanguageUtil.getLocalizatedString = function (key) {
	// others
	if (key == STRING_NO_WEBGL_SUPPORT) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "你的浏览器不支持WEBGL :(";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "YOUR BROWSER DOES NOT SUPPORT WEBGL :(";
	}
	// GameRule Layer
	if (key == STRING_GAMERULE_TITLE) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "游戏规则";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "GAME RULE";
	}
	if (key == STRING_GAMERULE_DETAIL_1) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R1. 通过连接相同颜色的砖块来消除它们";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R1. Remove tiles with same color by linking them together";
	}
	if (key == STRING_GAMERULE_DETAIL_2) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R2. 通常情况下只能妊连接水平或垂直相邻的砖块";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R2. Normally, only tiles vertically / horizontally can be connected";
	}
	if (key == STRING_GAMERULE_DETAIL_3) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R3. 通过把道具和砖块连接(任何颜色砖块)来使用道具";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R3. Connect items with any tiles to use them";
	}
	if (key == STRING_GAMERULE_DETAIL_4) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R4. 至少需要连接3块砖块才能将其消除";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R4. You need to connect at least 3 tiles to remove them";
	}
	if (key == STRING_GAMERULE_DETAIL_5) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R5. 每次消除的砖块越多就越有机会获得好的道具";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R5. More tiles removed at one time better items rewarded";
	}
	if (key == STRING_GAMERULE_DETAIL_6) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R6. 每次消除的砖块越会获得越多的时间奖励";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R6. More tiles removed at one time more time plus rewarded";
	}
	if (key == STRING_GAMERULE_DETAIL_7) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R7. 道具各有不同的效果，你可以通过尝试发现它们的用途";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R7. Items have different effects, try figure'em out";
	}
	if (key == STRING_GAMERULE_DETAIL_8) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R8. 点击网格外的任意地方可以暂停游戏";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R8. Click outside the board to pause the game";
	}
	if (key == STRING_GAMERULE_DETAIL_9) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "R9. 进入疯狂模式/超级疯狂模式后你几乎可以/可以为所欲为^_^";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "R9. Try figure out what you can do in (SUPER) FEVER MODE";
	}
	// Leaderboard Layer
	if (key == STRING_LEADERBOARD_TITLE) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "高分榜";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LEADERBOARD";
	}
	if (key == STRING_LEADERBOARD_PLAYER_LABEL) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "玩家";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "NAME";
	}
	if (key == STRING_LEADERBOARD_LEVEL_LABEL) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "等级";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LEVEL";
	}
	if (key == STRING_LEADERBOARD_DATE_LABEL) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "日期";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "DATE";
	}
	if (key == STRING_LEADERBOARD_SCORE_LABEL) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "得分";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "SCORE";
	}
	if (key == STRING_LEADERBOARD_LOADING_SCORE) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "高分榜加载中 ......";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LOADING SCORE ......";
	}
	if (key == STRING_LEADERBOARD_LOADING_OK) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "加载成功";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LOADING OK ......";
	}
	if (key == STRING_LEADERBOARD_LOADING_ERR) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "加载失败";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LOADING ERROR, TRY LATER ......";
	}
	// Pause Layer
	if (key == STRING_PAUSE_NEW_GAME) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "开始游戏";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "NEW GAME";
	}
	if (key == STRING_PAUSE_RESUME_GAME) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "继续游戏";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "RESUME GAME";
	}
	if (key == STRING_PAUSE_EXIT_GAME) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "退出游戏";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "EXIT GAME";
	}
	if (key == STRING_PAUSE_MUSIC_ON) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "开启音乐";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "MUSIC ON";
	}
	if (key == STRING_PAUSE_MUSIC_OFF) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "关闭音乐";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "MUSIC OFF";
	}
	if (key == STRING_PAUSE_SE_ON) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "开启音效";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "SE ON";
	}
	if (key == STRING_PAUSE_SE_OFF) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "关闭音效";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "SE OFF";
	}
	if (key == STRING_PAUSE_LANGUAGE_CN) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "语言: 中文";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LANG: CHINESE";
	}
	if (key == STRING_PAUSE_LANGUAGE_EN) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "语言: 英语";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LANG: ENGLISH";
	}
	if (key == STRING_PAUSE_LANGUAGE_JA) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "语言: 日语";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "LANG: JAPANESE";
	}
	// SubmitScore Layer
	if (key == STRING_SUBMIT_TITLE) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "上传高分";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "SUBMIT HIGHSCORE";
	}
	if (key == STRING_SUBMIT_INPUT_NAME) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "请输入玩家名";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "PLEASE INPUT YOUR NAME ......";
	}
	if (key == STRING_SUBMIT_CONFIRM) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "上传";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "SUBMIT";
	}
	if (key == STRING_SUBMIT_CANCEL) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "关闭";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "CLOSE";
	}
	if (key == STRING_SUBMIT_UPLOADING) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "高分上传中 ......";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "UPLOADING HIGHSCORE ......";
	}
	if (key == STRING_SUBMIT_OK) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "上传成功";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "UPLOADING OK ......";
	}
	if (key == STRING_SUBMIT_ERR) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "上传失败";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "UPLOADING ERROR ......";
	}
	// MainMenu Layer
	if (key == STRING_MAINMENU_TITLE) {
	    if (LanguageUtil.languageType == LANGUAGE_CHINESE) return "TILES PUZZLE";
	    if (LanguageUtil.languageType == LANGUAGE_JAPANESE) return "TILES PUZZLE";
	    return "TILES PUZZLE";
	}
    return "ERROR";
};
