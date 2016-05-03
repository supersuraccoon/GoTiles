#include "AppDelegate.h"

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "generated/jsb_cocos2dx_auto.hpp"
#include "generated/jsb_cocos2dx_extension_auto.hpp"
#include "generated/jsb_cocos2dx_studio_auto.hpp"
#include "jsb_cocos2dx_extension_manual.h"
#include "jsb_cocos2dx_studio_manual.h"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_system_registration.h"
#include "js_bindings_ccbreader.h"
#include "jsb_opengl_registration.h"
#include "XMLHTTPRequest.h"
#include "jsb_websocket.h"

#import "RootViewController.h"


USING_NS_CC;
using namespace CocosDenshion;

JSBool popupSocialView(JSContext *cx, uint32_t argc, jsval *vp) {
    jsval *argv = JS_ARGV(cx, vp);
    jsval tileJSV =  argv[0];
    int language = CCApplication::sharedApplication()->getCurrentLanguage();
    if (language == kLanguageChinese) {
        language = 1;
    }
    else if (language == kLanguageJapanese) {
        language = 2;
    }
    else
        language = 0;
    [(RootViewController *)[UIApplication sharedApplication].keyWindow.rootViewController popupSocialView:JSVAL_TO_INT(tileJSV) language:language];
    JS_SET_RVAL(cx, vp, JSVAL_NULL);
    return JS_TRUE;
}

JSBool enableAds(JSContext *cx, uint32_t argc, jsval *vp) {
    [(RootViewController *)[UIApplication sharedApplication].keyWindow.rootViewController enableAds];
    JS_SET_RVAL(cx, vp, JSVAL_NULL);
    return JS_TRUE;
}

static JSFunctionSpec myjs_global_functions[] = {
    JS_FS("popupSocialView", popupSocialView, 1, 0),
    JS_FS("enableAds", enableAds, 0, 0),
    JS_FS_END
};

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    CCScriptEngineManager::purgeSharedManager();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    CCDirector *pDirector = CCDirector::sharedDirector();
    pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());
    
    // turn on display FPS
    pDirector->setDisplayStats(true);
    
    // set FPS. the default value is 1.0/60 if you don't call this
    pDirector->setAnimationInterval(1.0 / 60);
    
    vector<string> searchPaths = CCFileUtils::sharedFileUtils()->getSearchPaths();
    searchPaths.push_back("jsb_script");
    searchPaths.push_back("res/");
    CCFileUtils::sharedFileUtils()->setSearchPaths(searchPaths);
    
    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    sc->addRegisterCallback(register_all_cocos2dx_studio);
    sc->addRegisterCallback(register_all_cocos2dx_studio_manual);
    sc->addRegisterCallback(register_CCBuilderReader);
    sc->addRegisterCallback(jsb_register_chipmunk);
    sc->addRegisterCallback(jsb_register_system);
    sc->addRegisterCallback(JSB_register_opengl);
    sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
    sc->addRegisterCallback(register_jsb_websocket);

    sc->start();
    if (!JS_DefineFunctions(sc->getGlobalContext(), sc->getGlobalObject(), myjs_global_functions)) {
        return false;
    }
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
    ScriptingCore::getInstance()->runScript("BindingEntrance.jsc");
    
    return true;
}

void handle_signal(int signal) {
    static int internal_state = 0;
    ScriptingCore* sc = ScriptingCore::getInstance();
    // should start everything back
    CCDirector* director = CCDirector::sharedDirector();
    if (director->getRunningScene()) {
        director->popToRootScene();
    } else {
        CCPoolManager::sharedPoolManager()->finalize();
        if (internal_state == 0) {
            //sc->dumpRoot(NULL, 0, NULL);
            sc->start();
            internal_state = 1;
        } else {
            sc->runScript("BindingEntrance.jsc");
            internal_state = 0;
        }
    }
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    CCDirector::sharedDirector()->stopAnimation();
    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->pauseAllEffects();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
}
