//
//  BKDatabaseDiagnosis.m
//  SsIPoultry2.9
//
//  Created by Sakarn Limnitikarn on 7/2/13.
//
//
#import <Cordova/CDVViewController.h>
#import "BKPlugins.h"

@implementation BKPlugins
@synthesize navController;

-(void) testAlert:(CDVInvokedUrlCommand *)command{
//    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"BKDatabaseDiagnosis" message:@"Test." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
//    [alert show];
    BKPluginsViewController *bkdd = [[BKPluginsViewController alloc]initWithNibName:@"BKDDSampleScreenViewController" bundle:nil];
    self.navController = [[UINavigationController alloc]initWithRootViewController:bkdd ];
    [self.navController setTitle:@"Expert Tools"];
   // UIViewController *con = [[UIViewController alloc]init];
    CDVViewController *cont = (CDVViewController*) [super viewController];
    [cont presentViewController:self.navController animated:YES completion:nil];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"testAlert is called"];
	//Call  the Success Javascript function
	//[self writeJavascript: [pluginResult toSuccessCallbackString:@"success"]];
     [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
-(void) callExpertTools:(CDVInvokedUrlCommand *)command {
    
    
    NSMutableDictionary *argDict = [NSJSONSerialization JSONObjectWithData:[[NSString stringWithFormat:@"%@", command.arguments[0]] dataUsingEncoding:NSUTF8StringEncoding]  options:NSJSONReadingMutableContainers error:nil];
    NSLog(@"%@", argDict);
    //[[NSUserDefaults standardUserDefaults] setValue:argDict forKey:@"CDVPluginsCommand"];
    
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
   
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:argDict];
    [defaults setObject:data forKey:@"theKey"];
    
    BKPluginsViewController *bkdd = [[BKPluginsViewController alloc]initWithNibName:@"BKPluginsViewController" bundle:nil];
    self.navController = [[UINavigationController alloc]initWithRootViewController:bkdd ];
    [self.navController setTitle:@"Expert Tools"];
    // UIViewController *con = [[UIViewController alloc]init];
    CDVViewController *cont = (CDVViewController*) [super viewController];
    [cont presentViewController:self.navController animated:YES completion:nil];
    
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"testAlert is called"];
	//Call  the Success Javascript function
	//[self writeJavascript: [pluginResult toSuccessCallbackString:@"success"]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}
@end
