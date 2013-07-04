//
//  BKDDSampleScreenViewController.h
//  SsIPoultry2.9
//
//  Created by Sakarn Limnitikarn on 7/3/13.
//
//

#import <UIKit/UIKit.h>
#import <MessageUI/MFMailComposeViewController.h>
#import <MBProgressHUD/MBProgressHUD.h>
#import <AVFoundation/AVFoundation.h>

@interface BKPluginsViewController : UIViewController<UITableViewDataSource, UITableViewDelegate, MFMailComposeViewControllerDelegate, UIAlertViewDelegate>
@property (strong, nonatomic) IBOutlet UISwipeGestureRecognizer *swipeRecognizer;
@property (retain, nonatomic) IBOutlet UITableView *tableView;
-(IBAction)swipeDownToClose:(id)sender;
@end
