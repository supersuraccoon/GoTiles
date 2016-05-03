// cocos2d.js
(function () {
    var d = document;
    var c = {
        COCOS2D_DEBUG:0, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        chipmunk:false,
        showFPS:false,
        frameRate:60,
        loadExtension:false,
        tag:'gameCanvas', //the dom element to run cocos2d on
        //engineDir:'../cocos2d/',
        SingleEngineFile:'./lib/Cocos2d-html5-v2.2.3.min.js',
        appFiles:[
			'./TilesPuzzleHtml5-v1.0.js'
        ]
    };
     if(!document.createElement('canvas').getContext){
    	alert("Please use chrome, firefox, safari(enable webgl) or IE (>=10.0)");
		//alert("很抱歉您的浏览器不支持HTML5游戏... \n\n解决方法：\n\n1.使用最新的Chrome浏览器\n2.使用最新的Firefox浏览器\n3.使用10.0以上的IE浏览器");
        return;
    } 
    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }
        else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'platform/jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'Packed_Release_File.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        d.body.appendChild(s);
        //else if single file specified, load singlefile
    });
})();
