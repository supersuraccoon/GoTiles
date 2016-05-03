//
//  GCTestAppDelegate.h
//  GCTest
//
//  Created by Rohan Kuruvilla on 06/08/2012.
//  Copyright __MyCompanyName__ 2012. All rights reserved.
//

#ifndef  _APP_DELEGATE_H_
#define  _APP_DELEGATE_H_

#include "CCApplication.h"

/**
 @brief    The cocos2d Application.
 
 The reason for implement as private inheritance is to hide some interface call by CCDirector.
 */
class  AppDelegate : private cocos2d::CCApplication
{
public:
    AppDelegate();
    virtual ~AppDelegate();
    virtual bool applicationDidFinishLaunching();
    virtual void applicationDidEnterBackground();
    virtual void applicationWillEnterForeground();
};

#endif // _APP_DELEGATE_H_

