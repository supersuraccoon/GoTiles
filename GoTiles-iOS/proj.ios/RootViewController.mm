
#import "RootViewController.h"

@implementation RootViewController
@synthesize adView;
@synthesize admobView;
@synthesize bannerIsVisible;

- (void) popupSocialView:(int)tiles language:(int)language {
    // Prepare activities
    //
    NSString *postText;
    if (language == 1) {
        postText = [NSString stringWithFormat:@"我在「GO TILES :%@」游戏中拿到了高分%d ~~ 你也来挑战试试吧，免费的哦^_^", @"http://goo.gl/NJ3jJj", tiles];
    }
    else if (language == 2) {
        postText = [NSString stringWithFormat:@"私が「GO TILES :%@」で%dの高得点を獲得しました ~~ 貴方も挑戦してみれば、無料だよ^_^", @"http://goo.gl/NJ3jJj", tiles];
    }
    else {
        postText = [NSString stringWithFormat:@"I cleared %d tiles in 「GO TILES :%@」 ~~ Come on and give it try, it's free :)", tiles, @"http://goo.gl/NJ3jJj"];
    }
    UIImage *shareImage = [UIImage imageNamed:@"Icon.png"];
    NSArray *activityItems = @[postText, shareImage];
    
    UIActivityViewController *activityController =
    [[UIActivityViewController alloc]
     initWithActivityItems:activityItems applicationActivities:nil];
    activityController.excludedActivityTypes = [NSArray arrayWithObjects:UIActivityTypePrint, UIActivityTypeCopyToPasteboard, UIActivityTypeAssignToContact, UIActivityTypeSaveToCameraRoll, nil];
    [self presentViewController:activityController animated:YES completion:nil];
}

-(void)enableAds {
    if (!adView) {
        adView = [[ADBannerView alloc]initWithFrame:CGRectZero];
        adView.delegate = self;
        [self.view addSubview:adView];
        CGRect adFrame = adView.frame;
        adFrame.origin.x = 0;
        adFrame.origin.y = self.view.frame.size.height - adView.frame.size.height;
        adView.frame = adFrame;
    }
}

-(void)disableAds {
    if (adView) {
        [adView removeFromSuperview];
    }
    if (admobView) {
        [admobView removeFromSuperview];
    }
}

#pragma mark - iad
- (void)bannerViewDidLoadAd:(ADBannerView *)banner {
    if (admobView) {
        [admobView removeFromSuperview];
        admobView.delegate = nil;
        admobView = nil;
    }
}

- (void)bannerView:(ADBannerView *)banner didFailToReceiveAdWithError:(NSError *)error {
    if (adView) {
        [adView removeFromSuperview];
        adView.delegate = nil;
        adView = nil;
    }
    if (!admobView) {
        admobView = [[GADBannerView alloc] initWithAdSize:kGADAdSizeSmartBannerPortrait];
        admobView.adUnitID = @"a1531a83322ff8d";
        admobView.rootViewController = self;
        admobView.delegate = self;
        CGRect adFrame = admobView.frame;
        adFrame.origin.x = 0;
        adFrame.origin.y = self.view.frame.size.height - admobView.frame.size.height;
        admobView.frame = adFrame;
        GADRequest *request = [GADRequest request];
        [self.view addSubview:admobView];
        [admobView loadRequest:request];
    }
}

- (BOOL)bannerViewActionShouldBegin:(ADBannerView *)banner willLeaveApplication:(BOOL)willLeave {
    return YES;
}

- (void)bannerViewActionDidFinish:(ADBannerView *)banner {
}

#pragma mark - Google Admob
//Google Ad Delegates
-(void) adView:(GADBannerView *)view didFailToReceiveAdWithError:(GADRequestError *)error {
    if (admobView) {
        [admobView removeFromSuperview];
        admobView.delegate = nil;
        admobView = nil;
    }
    if (!adView) {
        adView = [[ADBannerView alloc]initWithFrame:CGRectZero];
        adView.delegate = self;
        [self.view addSubview:adView];
        CGRect adFrame = adView.frame;
        adFrame.origin.x = 0;
        adFrame.origin.y = self.view.frame.size.height - adView.frame.size.height;
        adView.frame = adFrame;
    }
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return UIInterfaceOrientationIsPortrait( interfaceOrientation );
}

// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
- (NSUInteger) supportedInterfaceOrientations{
#ifdef __IPHONE_6_0
    return UIInterfaceOrientationMaskAllButUpsideDown;
#endif
}

- (BOOL) shouldAutorotate {
    return YES;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}


- (void)dealloc {
    [super dealloc];
}


@end
