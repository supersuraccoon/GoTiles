// ScoreObject.js
var ScoreObject = Parse.Object.extend("ScoreObject", {
        initialize:function() {
            this.playerName = "ANONYMOUS";
            this.tiles = 0;
            this.gameLevel = 1;
            this.playDate = nowStringDate();
            this.pf = "";
        },
        updateScore:function() {
            this.set("playerName", this.playerName);
            this.set("tiles", this.tiles);
            this.set("gameLevel", this.gameLevel);
            this.set("playDate", this.playDate);
            this.set("pf", this.pf);
        },
        saveScore:function(callback) {
            this.updateScore();
            this.save(null, {
                  success: function(scoreObject) {
            	      callback(1);
                  },
                  error: function(error) {
                	  callback(0);
                  }
            });
        }
    }
);