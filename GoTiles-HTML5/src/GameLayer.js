// GameLayer.js

var g_isMusicOn = true;
var g_isSEOn = true;

var GameLayer = cc.Layer.extend({
    init:function(tileCountX, tileCountY, tileSize) {	
        this._super();
        // get window size
        this._winSize = cc.Director.getInstance().getWinSize();
        // init data
        this.initData();
        // init sound
        cc.AudioEngine.getInstance().playMusic(s_loop, true);
		// add version info
		if (GAME_PLATFORM != "IOS") {
			this._versionInfo = cc.LabelTTF.create(GAME_VERSION, COMMON_FONT_NAME, 18);
			this._versionInfo.setPosition(cc.p(this._winSize.width - 40, 10));
			this.addChild(this._versionInfo);
		}
        // add MainMenuLayer
        this._mainMenuLayer = MainMenuLayer.create(this);
        this.addChild(this._mainMenuLayer, Z_MAIN_MENU_LAYER);
        // create title label
        this._gameTitle = cc.LabelTTF.create(LanguageUtil.getLocalizatedString(STRING_MAINMENU_TITLE), COMMON_FONT_NAME, 40);
        this._gameTitle.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 18.5 / 20));
        this.addChild(this._gameTitle);
        // create level label
        this._levelInfo = cc.LabelTTF.create("LEVEL: 1", COMMON_FONT_NAME, 22);
        this._levelInfo.setPosition(cc.p(this._winSize.width * 3 / 20, this._winSize.height * 16.5 / 20));
        this.addChild(this._levelInfo);
        // create time label
        this._timerInfo = cc.LabelTTF.create("TIME: 60 S", COMMON_FONT_NAME, 22);
        this._timerInfo.setPosition(cc.p(this._winSize.width * 6.5 / 20, this._winSize.height * 16.5 / 20));
        this.addChild(this._timerInfo);
        // create score label
        this._scoreInfo = cc.LabelTTF.create("TILES: 0 ", COMMON_FONT_NAME, 22);
        this._scoreInfo.setPosition(cc.p(this._winSize.width * 11 / 20, this._winSize.height * 16.5 / 20));
        this.addChild(this._scoreInfo);
        // create world Record label (pull from Parse.com)
        this._worldRecordLabel = cc.LabelTTF.create("WR: ??? TILES", COMMON_FONT_NAME, 22);
        this._worldRecordLabel.setPosition(cc.p(this._winSize.width * 16 / 20, this._winSize.height * 16.5 / 20));
        this.addChild(this._worldRecordLabel);
        // create tile controller
        this._tileController = TileController.create(tileCountX, tileCountY, tileSize, this);
        this._tileController.updateTileLayerPosition(cc.p(this._winSize.width / 2 - tileCountX * tileSize / 2, this._winSize.height * 2 / 5 - tileCountY * tileSize / 2 + 15));
        this.addChild(this._tileController);
        this.addChild(this._tileController._tileLayer, Z_TILE_LAYER);
        // add floating dot
        this.createFloatingDot();
        // enable touch
        this.setTouchEnabled(true);
		
		// fps
		if( 'keyboard' in sys.capabilities ) {
            this.setKeyboardEnabled(true);
        }
        // return
        return true;
    },
	onKeyDown:function(key) {
		if (key == 70) {
			var director = cc.Director.getInstance();
			var flag = director.isDisplayStats();
			director.setDisplayStats(!flag);
		}
	},
    // init
    initData:function() {
        this._gameLevel = 1;
        this._tilesRemoved = 0;
        this._timeLeft = 60;
        this._touchEnabled = false;
        this._isLockDirection = false;
        this._hoveredTileDirection = 0;
        this._targetTileType = 0;
        this._targetTileColor = COLOR_WHITE;
        this._hoveredTile = null;
        this._linkedTileArray ? this._linkedTileArray.length = 0 : this._linkedTileArray = new Array();
        this._isFeverOn = false;
        this._isSuperFeverOn = false;
        this._superFeverModeProtector = false; // prevent from consecutive clicking
        this._worldRecordTiles = -1;
    },
    // touch
    onTouchesBegan:function(touches, event) {
    	if (!this._touchEnabled)
    		return;
    	var touchLocation = touches[0].getLocation();
        // pause game ?
        if (!this._tileController.isTouchInTileLayer(touchLocation)) {
            this.pauseGame();
            return;
        }
        // super fever mode ?
        if (this._isSuperFeverOn && this._superFeverModeProtector) {
            var targetTile = this._tileController.tileFromTouch(touchLocation);
            if (targetTile) {            
                this._tileController.processSingleTile(targetTile);
                this._superFeverModeProtector = false;
                this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), cc.CallFunc.create(this.superFeverModeTimer)));
            }	
        }
    },
    onTouchesMoved:function(touches, event) {
    	if (!this._touchEnabled || this._isSuperFeverOn)
    		return;
        var touchLocation = touches[0].getLocation();
        var targetTile = this._tileController.tileFromTouch(touchLocation);
        if (targetTile) {
            if (targetTile != this._hoveredTile) {
                // check linked tiles by rule
                if (this._hoveredTile && (this._linkedTileArray.contains(targetTile) || !this.checkTilePosition(this._hoveredTile, targetTile) || !this.checkTileType(targetTile))) {
                	// invalid link
                    if (g_isSEOn)
                        cc.AudioEngine.getInstance().playEffect(s_error);
                    this.updateTimeLeft(-3, true);
                    this._tileController.cleanGuideLine();
                    this.resetLinkedTile();
                    return;
                }
                // check again if direction is locked 
                if (this._isLockDirection) { 
                	if (this._linkedTileArray.length + 1 == 2) {
                		// record direction
                		this._hoveredTileDirection = this.calcDirection(this._hoveredTile, targetTile);
                	}
                	if (this._linkedTileArray.length + 1 > 2 && this.calcDirection(this._hoveredTile, targetTile) != this._hoveredTileDirection) {
                		if (g_isSEOn)
                            cc.AudioEngine.getInstance().playEffect(s_error);
                		this.updateTimeLeft(-3, true);
                		this._tileController.cleanGuideLine();
                        this.resetLinkedTile();
                        return;
                	}
                }
                // valid link
                if (this._targetTileType == 0 && targetTile._tileType <= 100) {
                	// record color
                	this._targetTileType = targetTile._tileType;
                	this._targetTileColor = targetTile._shapeSprite.getColor();
                }
                // add guide line
                if (this._hoveredTile) {
            		this._tileController.addGuideLine(this._hoveredTile.getPosition(), targetTile.getPosition(), this._targetTileColor);
            	}
                this._hoveredTile = targetTile;
                targetTile.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.ScaleTo.create(0.3, 1.1), cc.ScaleTo.create(0.3, 0.8))));
                this._linkedTileArray.push(targetTile);
                // sound effect
                this.playLinkTileSE(this._linkedTileArray.length)               
            }
        }
    },
    onTouchesEnded:function(touches, event) {
    	if (!this._touchEnabled || this._linkedTileArray.length == 0)
    		return;
    	this._tileController.cleanGuideLine();
    	if (this._linkedTileArray.length >= 3) {
    		this._touchEnabled = false;
    		this._tileController.processLinkedTile(this._linkedTileArray);
    	}
    	else {
            if (g_isSEOn)
                cc.AudioEngine.getInstance().playEffect(s_error);
            this.updateTimeLeft(-3, true);
    		this.resetLinkedTile();
    	}
    },
    // link rule check
    checkTilePosition:function(preTile, newTile) {
        if (this._isFeverOn) {
        	if (Math.abs(newTile._xIndex - preTile._xIndex) <= 1 && Math.abs(newTile._yIndex - preTile._yIndex) <= 1)
                return true;
        }
        else {
        	if ((Math.abs(newTile._xIndex - preTile._xIndex) == 1 && newTile._yIndex == preTile._yIndex) ||
                (Math.abs(newTile._yIndex - preTile._yIndex) == 1 && newTile._xIndex == preTile._xIndex))
                return true;
        }
        return false;
    },
    checkTileType:function(targetTile) {
        if (targetTile._tileType > 100 || this._targetTileType == 0)
        	return true;
    	if (this._targetTileType != targetTile._tileType)
            return false;
        return true;
    },
    calcDirection:function(preTile, newTile) {
    	return (preTile._xIndex == newTile._xIndex) ? X_DIRECTION : Y_DIRECTION;
    },
    // link tile stuff
    playLinkTileSE:function(linkCount) {
    	var seArray = new Array(s_tile0, s_tile1, s_tile2, s_tile3, s_tile4);
    	if (g_isSEOn) {
    		linkCount = (linkCount > 5) ? 5 : linkCount;
    		cc.AudioEngine.getInstance().playEffect(seArray[linkCount - 1]);
        }
    },
    resetLinkedTile:function() {
        this._targetTileType = 0;
        for (var i = 0; i < this._linkedTileArray.length; i++) {
        	var tile = this._linkedTileArray[i];
        	tile.stopAllActions();
        	tile.setScale(1.0);
        }
        this._linkedTileArray.length = 0;
        this._hoveredTile = null;
    },
    // fever mode && super fever mode
    feverModeOn:function(isSuper) {
        this._gameTitle.setOpacity(100);
        var feverLabel = cc.LabelTTF.create(isSuper ? "SUPER FEVER MODE" : "FEVER MODE", COMMON_FONT_NAME, 24);
        feverLabel.setPosition(this._gameTitle.getPosition());
        feverLabel.setOpacity(0);
        feverLabel.setScale(8.0);
        this.addChild(feverLabel, Z_FEVER_LABEL, T_FEVER_LABEL);
        feverLabel.runAction(cc.Sequence.create(cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 2.0)), cc.CallFunc.create(this.runFeverLabelAction, feverLabel)));
        isSuper ? this._isSuperFeverOn = true : this._isFeverOn = true;
        isSuper ? this._superFeverModeProtector = true : this._superFeverModeProtector = false;
        this.runAction(cc.Sequence.create(cc.DelayTime.create(5.0), cc.CallFunc.create(this.feverModeOff, this)));
    },
    feverModeOff:function(sender) {
        sender._gameTitle.setOpacity(255);
        sender.removeChildByTag(T_FEVER_LABEL, true);
        sender._isFeverOn = false;
        sender._isSuperFeverOn = false;
        sender._superFeverModeProtector = false;
    },
    // delegate
    processLinkedTileFinished:function(linkedTileCount, extraTileCount, timePlus) {
    	this.updateScore(linkedTileCount + extraTileCount);
    	if (!this._isFeverOn && !this._isSuperFeverOn && linkedTileCount + extraTileCount > 10 && linkedTileCount + extraTileCount < 15) {
            this.feverModeOn(false);
        }
        if (!this._isFeverOn && !this._isSuperFeverOn && linkedTileCount + extraTileCount >= 15) {
            this.feverModeOn(true);
        } 
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_pop);
        this.updateUIColor(this._targetTileColor);
  		if (timePlus > 0)
  			this.updateTimeLeft(timePlus, true);
  		this.showInfo("TILES: {0} + {1} - Time: +{2}".format(linkedTileCount, extraTileCount, timePlus));
   		this._tileController.processAfterRemove();	
    },
    processAfterRemoveFinished:function() {
    	this.resetLinkedTile();
    	this._touchEnabled = true;
    },
    allTilesReset:function() {
        this.showInfo("No More Moves, Tiles Reset !!!");
    },
    submitScoreOver:function() {
    	this._mainMenuLayer.runSplitRowReverseAction();
    },
	exitGame:function() {
		this.processGameOver(false)
	},
    shareScore:function() {
        popupSocialView(this._tilesRemoved);
    },
	languageChanged:function() {
		if (this._pauseMenuLayer) {
			this._pauseMenuLayer.removeFromParent(true);
		}
		this._pauseMenuLayer = PauseMenuLayer.create(this);
        this.addChild(this._pauseMenuLayer, Z_PAUSE_LAYER);
	},
    // action
    runReadySetGoAction:function() {
    	var countDownLabelArray = new Array();
    	for (var i = 0; i < 4; i++) {
    		var countDownLabel = cc.LabelTTF.create("", COMMON_FONT_NAME, 30);
    		countDownLabel.setOpacity(0);
    		countDownLabel.setScale(10);
    		countDownLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));
    		this.addChild(countDownLabel, Z_COUNTDOWN_LABEL);
        	countDownLabelArray.push(countDownLabel);
    	}
    	countDownLabelArray[0].setString("3");
    	countDownLabelArray[1].setString("2");
    	countDownLabelArray[2].setString("1");
    	countDownLabelArray[3].setString("START!!!");
    	countDownLabelArray[0].runAction(cc.Sequence.create(cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 2.0)), cc.FadeOut.create(0.2), cc.CallFunc.create(this.removeTargetAfterAction, countDownLabelArray[0])));
    	countDownLabelArray[1].runAction(cc.Sequence.create(cc.DelayTime.create(0.6), cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 2.0)), cc.FadeOut.create(0.2), cc.CallFunc.create(this.removeTargetAfterAction, countDownLabelArray[1])));
    	countDownLabelArray[2].runAction(cc.Sequence.create(cc.DelayTime.create(1.2), cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 2.0)), cc.FadeOut.create(0.2), cc.CallFunc.create(this.removeTargetAfterAction, countDownLabelArray[2])));
    	countDownLabelArray[3].runAction(cc.Sequence.create(cc.DelayTime.create(1.8), cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 1.0)), cc.DelayTime.create(0.3), cc.Spawn.create(cc.FadeOut.create(0.5), cc.ScaleTo.create(0.5, 8.0)), cc.CallFunc.create(this.removeTargetAfterAction, countDownLabelArray[3])));
    	this.runAction(cc.Sequence.create(cc.DelayTime.create(3.1), cc.CallFunc.create(this.enableTimerAndTouch, this)));
    },
    createFloatingDot:function() {
        for (var i = 0; i < 50; i++) {
            var dotSprite = DotSprite.create(5 + Math.random() * 10);
            dotSprite.setColor(cc.c3b(Math.random() * 255, Math.random() * 255, Math.random() * 255));
            dotSprite.setOpacity(100 + Math.random() * 100);
            dotSprite.setPosition(cc.p(Math.random() * this._winSize.width, Math.random() * this._winSize.height));
            this.addChild(dotSprite, Z_FLOATING_DOT);
            var targetPosition = cc.p(Math.random() * this._winSize.width, Math.random() * this._winSize.height);
            dotSprite.runAction(cc.Sequence.create(cc.MoveTo.create(10.0 + Math.random() * 5, targetPosition), cc.CallFunc.create(this.moveFloatingDot, dotSprite)));
        }
    },
    removeTargetAfterAction:function(sender) {
    	sender.removeFromParent(true);
    },
    moveFloatingDot:function(sender) {
        var that = sender.getParent();
        var targetPosition = cc.p(Math.random() * that.getContentSize().width, Math.random() * that.getContentSize().height);
        sender.runAction(cc.Sequence.create(cc.MoveTo.create(10.0 + Math.random() * 5, targetPosition), cc.CallFunc.create(that.moveFloatingDot, sender)));
    },
    runFeverLabelAction:function(sender) {
    	sender.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(0.5), 
    			cc.Spawn.create(cc.FadeOut.create(0.3), cc.ScaleTo.create(0.3, 5), cc.TintBy.create(0.3, 255, 0, 0)), 
    			cc.Spawn.create(cc.FadeIn.create(0.01), cc.ScaleTo.create(0.01, 2.0), cc.TintBy.create(0.01, 255, 255, 255)))));
    },
    //menu
    newGame:function() {
		this.tryLoadWorldRecord();
    	this.resetAllTimer(true);
    	this._tileController.restore3DEffect();
        this._tileController.updateRandomTypeCount(3);
    	this._tileController.resetAllTiles();
        this.initData();
        this.updateScore(this._tilesRemoved);
        this.updateTimeLeft(0, false);
        this.updateGameLevel(this._gameLevel);
        this.runReadySetGoAction();
    },
    enableTimerAndTouch:function() {
    	this.schedule(this.onTimer, 1); 
    	this._touchEnabled = true;
    },
    resetGame:function() {
    	this._tileController.resetAllTiles();
    },
    restartGame:function() {
        cc.Director.getInstance().getScheduler().resumeTarget(this);
        this._touchEnabled = false;
        this.newGame();
    },
    showHint:function() {
    	var hintTilesArray = this._tileController.getHintTiles();
    	if (hintTilesArray.length > 0) {
    		for (var i = 0; i < hintTilesArray.length; i ++) {
    			var tile = hintTilesArray[i];
    			tile.runAction(cc.Blink.create(0.5, 10));
    		}
    	}
    },
    pauseGame:function() {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_click);
        this._touchEnabled = false;
        cc.Director.getInstance().getScheduler().pauseTarget(this);
        this._pauseMenuLayer = PauseMenuLayer.create(this);
        this.addChild(this._pauseMenuLayer, Z_PAUSE_LAYER);
    },
    resumeGame:function() {
        cc.Director.getInstance().getScheduler().resumeTarget(this);
        this._touchEnabled = true;
    },
    leaderboard:function() {
        var leaderboardLayer = LeaderboardLayer.create(this);
        this.addChild(leaderboardLayer, Z_LEADERBOARD_LAYER);
    },
    submitScore:function() {
    	var submitScoreLayer = SubmitScoreLayer.create(this, this._gameLevel, this._tilesRemoved);
    	this.addChild(submitScoreLayer, Z_SUBMIT_SCORE_LAYER);
    },
    // time && level && score ui stuff
    restoreLabel:function() {
    	this._tileController.cleanGuideLine();
    	this._timerInfo.stopAllActions();
    	this._worldRecordLabel.setColor(COLOR_WHITE);
    	// label for direction locked
    	this.removeChildByTag(T_LOCK_DIRECTION_LABEL, true);
    	// label for fever mode
    	this._gameTitle.setOpacity(255);
    	this.removeChildByTag(T_FEVER_LABEL, true);
    },
    updateUIColor:function(color) {
    	this._tileController.updateTileLayerColor(color);
        this._gameTitle.setColor(color);
        this._timerInfo.setColor(color);
        this._scoreInfo.setColor(color);
        this._levelInfo.setColor(color);
    },
    updateScore:function(tilesRemoved) {
    	this.gameLevelup(this._tilesRemoved + tilesRemoved);
    	this._tilesRemoved += tilesRemoved;
    	this._scoreInfo.setString("TILES: " + this._tilesRemoved);
    	// check world record
    	if (this._worldRecordTiles != -1 && this._tilesRemoved + 50 > this._worldRecordTiles) {
    		this._worldRecordLabel.setColor(COLOR_RED);
    		this._worldRecordLabel.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.5), cc.ScaleTo.create(0.1, 1.0)));
    	}
    	if (this._worldRecordTiles != -1 && this._tilesRemoved > this._worldRecordTiles) {
    		this._worldRecordLabel.setColor(COLOR_GREEN);
    		this._worldRecordTiles = this._tilesRemoved;
    		this._worldRecordLabel.setString("WR: " + this._worldRecordTiles + " TILES");
    		this._worldRecordLabel.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.5), cc.ScaleTo.create(0.1, 1.0)));
    	}
    },
    updateTimeLeft:function(delta, bAnimate) {
    	this._timeLeft += delta;
    	if (this._timeLeft <= 0) {
    		// game over
    		this._timeLeft = 0;
            this._timerInfo.setString("Time: 0 S");
    		this.processGameOver(true);
    	}
    	if (this._timeLeft < 20) {
    		this._timerInfo.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.5), cc.ScaleTo.create(0.1, 1.0)));
    	}
    	else {
    		if (bAnimate) {
    			this._timerInfo.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.5), cc.ScaleTo.create(0.1, 1.0)));
    		}
    	}
    	this._timerInfo.setString("Time: " + this._timeLeft + " S");
    },
    updateGameLevel:function(gameLevel) {
    	if (gameLevel > 1) {
    		this._levelInfo.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 2.0), cc.ScaleTo.create(0.1, 1.0)));
    	}
        this._levelInfo.setString("LEVEL: " + gameLevel);
    },
    showInfo:function(infoString) {
    	var infoLabel = cc.LabelTTF.create(infoString, COMMON_FONT_NAME, 26);
        infoLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));
        infoLabel.setColor(this._targetTileColor);
        this.addChild(infoLabel, Z_SHOW_INFO_LABEL);
        infoLabel.runAction(cc.Sequence.create(cc.MoveBy.create(1, cc.p(0, 200)), cc.FadeOut.create(1), cc.CallFunc.create(this.removeTargetAfterAction, infoLabel)));
    },
    // game logic
    processGameOver:function(isFinished) {
        if (g_isSEOn)
            cc.AudioEngine.getInstance().playEffect(s_endgame);
        this._touchEnabled = false;
        this.restoreLabel();
        this.resetAllTimer(true);
        this.resetLinkedTile();
        this._tileController.restore3DEffect();
        this._tileController.restoreTileLayerEye();
        this._tileController.restoreTileLayerOpacity();
        this._tileController.removeTileLayerMask();
        this._tileController.shatterTileLayer(0.1);
    	// create gameover layer
		if (isFinished)
			this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), cc.CallFunc.create(this.submitScore, this)));
		else
			this._mainMenuLayer.runSplitRowReverseAction();
    },
    gameLevelup:function(score) {
    	var newLevel = parseInt(score / 100 + 1);
        if (newLevel > this._gameLevel) {
            this._gameLevel = newLevel;
            this.updateGameLevel(this._gameLevel);
            this.processGameLevelup();
        }
    },
    processGameLevelup:function() {
    	this.resetAllTimer(false);
        this._tileController.restore3DEffect();
        this._tileController.restoreTileLayerEye();
        // add effect
    	if (this._gameLevel == 2) {
    		this._tileController.updateRandomTypeCount(4);
    		this._tileController.orbitTilLayer(3, 5, 0, 3);
    	}
    	else if (this._gameLevel == 3) {
    		this._tileController.updateRandomTypeCount(5);
    		this.schedule(this.rippleTileTimer, 7);
    	}
    	else if (this._gameLevel == 4) {
            this.schedule(this.shakeTileTimer, 10);
    	}
    	else if (this._gameLevel == 5) {
    		this._tileController.updateRandomTypeCount(6);
    		this.schedule(this.lensTileTimer, 7);
    	}
    	else if (this._gameLevel == 6) {
    		this.schedule(this.maskTileTimer, 10);
    	}
    	else if (this._gameLevel == 7) {
    		this._tileController.orbitTilLayer(1, 5, 90, 3);
            this.schedule(this.switchModeTimer, 10);
    	}
    	else {
    		this._tileController.orbitTilLayer(1, 10, 90, 3);
    		this.schedule(this.switchModeTimer, 10);
    		this.schedule(this.maskTileTimer, 10);
    	}
    },
    // timer
    onTimer:function(dt) {
    	this._tileController.decreaseTileLayerOpacity();
    	this.updateTimeLeft(-1, false);
    },
    shakeTileTimer:function(dt) {
    	this._tileController.shakeTileLayer(5, 5);
    },
    lensTileTimer:function(dt) {
        var targetPosition = cc.p(this._winSize.width / 2 + (-50 + Math.random() * 100), this._winSize.height / 2 + (-50 + Math.random() * 100));
    	this._tileController.lensTileLayer(5, targetPosition, parseInt(100 + Math.random() * 100));
    },
    rippleTileTimer:function(dt) {
        var targetPosition = cc.p(this._winSize.width / 2 + (-50 + Math.random() * 100), this._winSize.height / 2 + (-50 + Math.random() * 100));
        this._tileController.rippleTileLayer(5, targetPosition, parseInt(100 + Math.random() * 100), 4);
    },
    switchModeTimer:function(dt) {
    	this._isLockDirection = this._isLockDirection ? false : true;
        var lockLabel = this.getChildByTag(T_LOCK_DIRECTION_LABEL);
        if (!lockLabel) {
            lockLabel = cc.LabelTTF.create("DIRECTION LOCKED", COMMON_FONT_NAME, 24);
            lockLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));
            lockLabel.setOpacity(0);
            lockLabel.setScale(8.0);
            this.addChild(lockLabel, Z_LOCK_DIRECTION_LABEL, T_LOCK_DIRECTION_LABEL);
            lockLabel.runAction(cc.Spawn.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.5, 2.0), cc.RotateBy.create(0.5, -30)));
        }
        else {
            lockLabel.runAction(cc.Sequence.create(cc.Spawn.create(cc.ShuffleTiles.create( 0.5, cc.size(16,12), 25), cc.FadeOut.create(0.5)), cc.CallFunc.create(this.removeFromParent, lockLabel)));
        }
    },
    maskTileTimer:function(dt) {
        var maskTileCount = parseInt(3 + Math.random() * 7);
        this._tileController.removeTileLayerMask();
        this._tileController.randomTileLayerMask(maskTileCount);
    },
    resetAllTimer:function(isMainTimerIncluded) {
    	if (isMainTimerIncluded)
    		this.unschedule(this.onTimer);
        this.unschedule(this.shakeTileTimer);
        this.unschedule(this.lensTileTimer);
        this.unschedule(this.rippleTileTimer);
        this.unschedule(this.switchModeTimer);
        this.unschedule(this.maskTileTimer);
    },
    superFeverModeTimer:function(sender) {
        sender._superFeverModeProtector = true;
    },
    // world record
    tryLoadWorldRecord:function () {
    	var query = new Parse.Query(ScoreObject);
        var that = this;
        query.descending("tiles");
        query.equalTo("pf", PARSE_PLATFORM);
        query.limit(1);
        var that = this;
        query.find({
            success: function(results) {
        		that._worldRecordTiles = (results.length > 0) ? results[0].attributes.tiles : 0;
                that._worldRecordLabel.setString("WR: " + that._worldRecordTiles + " TILES");
            },
            error: function(error) {}
        });
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function() {
        this._super();
        if (GAME_PLATFORM != "IOS") {
            // check if the browser have opengl support
            if('opengl' in sys.capabilities == false) {
                alert(LanguageUtil.getLocalizatedString(STRING_NO_WEBGL_SUPPORT));
                return;
            }
        }
        var layer = new GameLayer();
        layer.init(TILE_ROW_COUNT, TILE_COLUMN_COUNT, TILE_SIZE);
        this.addChild(layer);
    }
});
