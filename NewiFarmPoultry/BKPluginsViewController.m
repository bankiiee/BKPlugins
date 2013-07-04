//
//  BKDDSampleScreenViewController.m
//  SsIPoultry2.9
//
//  Created by Sakarn Limnitikarn on 7/3/13.
//
//

#import "BKPluginsViewController.h"
#import "MTStatusBarOverlay.h"
@interface BKPluginsViewController ()
@property (retain, nonatomic) NSMutableArray *menus;

@end

@implementation BKPluginsViewController
@synthesize menus;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        [self setTitle:@"Expret Tools"];
        self.menus = [[NSMutableArray alloc]initWithObjects:@"Send Database to admin",@"Send email to admin", @"Help", @"Contact Admin", @"About", nil];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    UIBarButtonItem *rightbutton = [[UIBarButtonItem alloc]initWithTitle:@"Done" style:UIBarButtonItemStyleDone target:self action:@selector(doneExpertTools:)];
    [self.navigationItem setRightBarButtonItem:rightbutton animated:YES];
}
-(void) doneExpertTools:(id *)sender{
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - TableView Delegate and DataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return [self.menus count];
    
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSString *cellSignature = @"Cell";
    UITableViewCell *cell  = [tableView dequeueReusableCellWithIdentifier:cellSignature];
    if(cell == nil){
        cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellSignature];
    }
    [cell.textLabel setText:self.menus[indexPath.row]];
    return cell;
    
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    UIAlertView *alertView = [[UIAlertView alloc]initWithTitle:@"Message" message:[NSString stringWithFormat:@"Selected Menu:%@", self.menus[indexPath.row]] delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
    if(indexPath.row == 0){
        MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        [hud setMode:MBProgressHUDModeIndeterminate];
        [hud setLabelText:@"Preparing..."];
        [hud setLabelFont:[UIFont fontWithName:@"Futura" size:16.0]];
        [hud show:YES];
        [self composeEmailWithAttachment:nil];
       
    }else{
        [alertView show];
    }
    
}
#pragma mark - Mail Composer
-(void) composeEmailWithAttachment:(id*) sender{
        //[self getFilePath];
    if([MFMailComposeViewController canSendMail]){
        MFMailComposeViewController *mailViewController = [[MFMailComposeViewController alloc]init];

        mailViewController.mailComposeDelegate = self;
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSData *argsData = [defaults objectForKey:@"theKey"];
        NSMutableDictionary *args = [NSKeyedUnarchiver unarchiveObjectWithData:argsData];        [mailViewController setTitle:@"Export Tools | Send Email"];
        [mailViewController setSubject:[NSString stringWithFormat:@"[Expert Tools]Database Diagnosis for iPoultry(UserID:%@)", [args objectForKey:@"UserId"]]];
        NSString * msgBody = [NSString stringWithFormat:@"Database of: %@, Device ID: %@, Remote Service Url: %@, App Name: %@, App Version: %@, Date: %@, Current UserID: %@, Sub Operation: %@, Warehouse: %@",[args objectForKey:@"DbName"],[args objectForKey:@"DeviceId"], [args objectForKey:@"SvcUrl"], [args objectForKey:@"AppName"], [args objectForKey:@"AppVersion"], [args objectForKey:@"BusinessDate"], [args objectForKey:@"UserId"], [args objectForKey:@"SubOp"], [args objectForKey:@"Warehouse"] ];
        NSString *mailBody = [[NSString alloc]initWithString:msgBody];
        [mailViewController setMessageBody:mailBody isHTML:NO];
        NSData *data = [NSData dataWithContentsOfURL:[self getFilePath]];
        [mailViewController addAttachmentData:data mimeType:@"application/x-sqlite3" fileName:@"Database.db"];
        [MBProgressHUD hideHUDForView:self.view animated:YES];
        [self presentViewController:mailViewController animated:YES completion:nil];
    }else{
        UIAlertView *alertView = [[UIAlertView alloc]initWithTitle:@"Email Account is Required!" message:@"Please set up an email account in Setting." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [MBProgressHUD hideHUDForView:self.view animated:YES];
        [alertView show];
        
    }
}
- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error
{
    // Notifies users about errors associated with the interface
    UIAlertView *alertView = [[UIAlertView alloc]init];
    [alertView setTitle:@"Mail Composer"];
    [alertView setDelegate:self];
    [alertView addButtonWithTitle:@"OK"];
    [alertView setCancelButtonIndex:0];
    switch (result)
    {
        case MFMailComposeResultCancelled:
            NSLog(@"Result: canceled");
            [alertView setMessage:@"Email composer has been canceled."];
            [alertView show];
              [self dismissViewControllerAnimated:YES completion:nil];
            [alertView show];

            break;
        case MFMailComposeResultSaved:
            NSLog(@"Result: saved");
            [alertView setMessage:@"Email composer has been saved."];
            [alertView show];
              [self dismissViewControllerAnimated:YES completion:nil];
            [alertView show];

            break;
        case MFMailComposeResultSent:
            NSLog(@"Result: sent");
            //[alertView setMessage:@"Email composer has been sent."];
            //[alertView show];
        {MTStatusBarOverlay *overlay = [MTStatusBarOverlay sharedInstance];
            overlay.animation = MTStatusBarOverlayAnimationFallDown;  // MTStatusBarOverlayAnimationShrink
            overlay.detailViewMode = MTDetailViewModeHistory;         // enable automatic history-tracking and show in detail-view
            overlay.delegate = self;
            [overlay postFinishMessage:@"Email has been sent!" duration:3 animated:YES];}
            [self dismissViewControllerAnimated:YES completion:nil];
            break;
        case MFMailComposeResultFailed:
            [alertView setMessage:@"Sending Email failed, please try again."];
            [alertView show];

            break;
        default:
            NSLog(@"Result: not sent");
            [alertView setMessage:@"Email composer has't been sent."];
            [alertView show];

            break;
    }
    NSURL *url = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@", [[NSBundle mainBundle] pathForResource:@"beep" ofType:@"wav"]]];
    NSLog(@"%@", url);
    NSData *soundData = [NSData dataWithContentsOfURL:url];
    AVAudioPlayer *audioPlayer = [[AVAudioPlayer alloc]initWithData:soundData error:nil ];
    audioPlayer.numberOfLoops = -1;
    [audioPlayer play];
    
  
}
#pragma mark - Export File from App Data
-(NSURL *) getFilePath{
    NSString *filename = @"WebKit/LocalStorage/file__0/0000000000000001.db";
    NSArray *pathArray = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask,YES);
    NSLog(@"%@", pathArray);
    NSString *documentsDirectory = [pathArray objectAtIndex:0];
    NSString *filePath = [documentsDirectory stringByAppendingPathComponent:filename];
    NSLog(@"file path: %@", filePath);
    if ([[NSFileManager defaultManager] fileExistsAtPath:filePath])
    {
        NSURL *fileURL = [NSURL fileURLWithPath:filePath isDirectory:NO];
        NSLog(@"Found %@", fileURL);
        return fileURL;
    }else{
        NSLog(@"File not Found at %@", filePath);
        //[self listFileAtPath:filePath];
        return nil;
    }
}
-(NSArray *)listFileAtPath:(NSString *)path
{
    //-----> LIST ALL FILES <-----//
    NSLog(@"LISTING ALL FILES FOUND");
    
    int count;
    
    NSArray *directoryContent = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:path error:NULL];
    for (count = 0; count < (int)[directoryContent count]; count++)
    {
        NSLog(@"File %d: %@", (count + 1), [directoryContent objectAtIndex:count]);
    }
    return directoryContent;
}
#pragma mark - Swipe Down To Close

-(IBAction)swipeDownToClose:(id)sender{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    

}


#pragma mark - Memory Warning



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//- (void)dealloc {
//    [_tableView release];
//    [super dealloc];
//}
- (void)viewDidUnload {
    [self setSwipeRecognizer:nil];
    [super viewDidUnload];
}
@end
