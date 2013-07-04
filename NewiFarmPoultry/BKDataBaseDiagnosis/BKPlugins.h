//
//  BKDatabaseDiagnosis.h
//  SsIPoultry2.9
//
//  Created by Sakarn Limnitikarn on 7/2/13.
//
//

#import <Cordova/CDVPlugin.h>
#import "BKPluginsViewController.h"
@interface BKPlugins :CDVPlugin
@property (nonatomic, retain) UINavigationController *navController;
-(void) testAlert:(CDVInvokedUrlCommand*) command;
-(void) callExpertTools:(CDVInvokedUrlCommand *) command;
@end
