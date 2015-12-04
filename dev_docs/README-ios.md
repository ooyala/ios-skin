# iOS Skin Getting Started Guide

#Prerequisites

In order to be successful running this sample app, you are expected to understand the following:

  1. An understanding of the Apple Developer ecosystem, with an understanding of building, running, and provisioning applications
  2. An understanding of the Core Ooyala SDK, how to configure and run simple Ooyala integrations (see [https://github.com/ooyala/ios-sample-apps](https://github.com/ooyala/ios-sample-apps))
  3. A passing understanding of brew, git, and node

# Overview

This document will explain a number of different use cases:

1. How to Run the Sample Application
2. How to perform simple customizations to the Sample Application
3. How to perform complex modifications to the Sample Application
4. How to update an existing Application with the iOS Skin

it's *highly* reccomended that you attempt these use cases in order, to have a complete understanding of the iOS Skin.

# How to Run the Sample Application

This will be the first four steps that would allow you to run the Ooyala Skin Sample App, and should be the first thing you try

1. `git clone https://github.com/ooyala/ios-sample-apps`
2. `open ios-sample-apps/OoyalaSkinSampleApp/OoyalaSkinSampleApp.xcodeproj`
3. Run the application


# How to Perform Simple Customizations to the Sample Application

### Modify the Skin Config

This will allow you to modify some of the configurations allowed by the Skin Config.  For more information, check out the skin-config repo README.

1. Open OoyalaSkinSampleApp.xcodeproj
2. Modify skin-config/skin.json
3. Re-run the application

### Add your own test assets to the Sample App

Just like all other sample applications, you can modify the ListViewController with your own embed codes to see how your videos work.  Note that your assets may require additional configuration of the application to work.

1. Open OoyalaSkinSampleApp.xcodeproj
2. Modify OoyalaSkinSampleApp/players/BasicTestsListViewController.m
3. Re-run the application

# How to Perform Complex Modifications to the Sample Application

The following will run you through linking the OoyalaSkinSDK source code to the OoyalaSkinSampleApp.  This will allow you to do cool things, like modify the UI code and add your own features

You will need to perform a number of steps to succeed here:

### Setup React Native Dependencies

Please follow the requirements section of the following site: [http://facebook.github.io/react-native/docs/getting-started.html#requirements](http://facebook.github.io/react-native/docs/getting-started.html#requirements)

### Configure OoyalaSkinSDK.xcodeproj

run `npm install` in the Ooyala Skin SDK

    cd ios-skin/sdk/react/ && npm install

run `git submodule update --init` to initialize the skin-config

### Connect OoyalaSkinSDK to OoyalaSkinSampleApp

1. Open OoyalaSkin.xcworkspace
2. Add the OoyalaSkinSampleApp.xcodeproj into OoyalaSkin.xcworkspace
3. In OoyalaSkinSampleApp Project Settings, remove existing OoyalaSkinSDK and add the Workspace version

3. Modify Sample App Players to point to React-Native server

    Comment out the original jsCodeLocation that points to the compiled bundle, and point it to the server that will be started by React Native

        // NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
4. Run the Ooyala Skin Sample App in a Simulator

In order to run the Sample App on the device,  you will need to provide a url that would be accessible by the physical hardware device (i.e. the local ip of the dev computer)

### Connect correct skin-config to OoyalaSkinSampleApp

The Skin-config may have been updated since the last release, and if you are using the OoyalaSkinSDK source code, you will have to reference the correct version of the skin-config.

Assuming you have connected the OoyalaSkinSDK to the OoyalaSkinSampleApp:

1. Delete the existing 'skin-config' folder from OoyalaSkinSampleApp project
2. Add the new 'skin-config' files from ios-skin/skin-config

# How to Update an Existing Application with the iOS Skin

By this point, you should have a strong understanding of how the iOS Skin works, and how to manipulate it within the Ooyala Skin Sample App. Here are the steps to integrate the iOS Skin into your own application.

If you'd like to take another extra step, try _following these steps to update the BasicPlaybackSampleApp_ as proof of the process

1. Download [OoyalaSDK-iOS](http://support.ooyala.com/resources/mobile-and-client-sdks), which contains:
    * Ooyala SDK (link binary with this library)
2. Download [OoyalaSkinSDK-iOS](https://ooyala.box.com/ios-skin-prerelease), which contains:
    * __NOTE:__ the framework in the download link will always point to the most up to date commit in the 'stable' branch (when the branch is created).
    * iOS Skin SDK (link binary with this library)
    * Alice font (Add to bundle. Then in Info.plist, add "alice.ttf" to "Fonts Provided by Application")
    * (temporary) FontAwesome font (Add to bundle. Then in Info.plist, add "fontawesome-webfont.ttf" to "Fonts Provided by Application")
    * Default localization files (Add to app bundle)
    * Default skin-config.json (Add to app bundle)
    * main.jsbundle (Add to app bundle)
3. Link JavascriptCore, Social, and MessageUI Frameworks to your binary
4. In Build Settings, ensure the Other Linker Flag "-ObjC" is enabled

5. Modify your PlayerViewController to use the new OOSkinViewController

    Replace the OoyalaPlayerViewController in your application to this new class.  Below is an example of what this could look like

        NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main"
                                                        withExtension:@"jsbundle"];
        OOSkinOptions *skinOptions = [[OOSkinOptions alloc] initWithDiscoveryOptions:nil
                                                                      jsCodeLocation:jsCodeLocation
                                                                      configFileName:@"skin"
                                                                     overrideConfigs:nil];
        self.skinController = [[OOSkinViewController alloc] initWithPlayer:ooyalaPlayer
                                                               skinOptions:skinOptions
                                                                    parent:_videoView
                                                             launchOptions:nil];
        [self addChildViewController:self.skinController];

5. Double Check your app.  The following is a list of all known requirements for Ooyala Skin SDK to work in your application

    - Ooyala SDK
        * Should be linked
    - Ooyala Skin SDK
        * Should be linked
        * SDK Version in the Skin package's VERSION file should match the VERSION file in the Ooyala SDK
    - Alice Font
        * Should be bundled
        * Should be part of Info.plist
    - FontAwesome Font
        * Should be bundled
        * Should be part of Info.plist
    - Localization Files (en.json, zh.json, etc.)
        * Should be bundled
    - skin-config.json
        * Should be bundled
    - main.jsbundle
        * Should be bundled
    - Ojbective-C code
        * Should use the OOSkinViewController
        * Should use main.jsbundle as the jsCodeLocaiton
    - JavascriptCore
        * Should be linked
    - Other Linker Flags
        * Should have -ObjC


##Generate ipa for distribution

  1. Open the OoyalaSkinSampleApp, confirm that the the application plays on a physical device
  2. With a provisioned device connected, select OoyalaSkinSampleApp schema and the connected device in Xcode.
  3. From Xcode menu, choose "Product->Archive"
  4. From Xcode orgnizer, choose "Export"
  5. Select "Save for enterprise" and follow the instructions to generate ipa file. 

##Build the OoyalaSkinSDK.framework

  1. xcodebuild -project sdk/OoyalaSkinSDK/OoyalaSkinSDK.xcodeproj/ -sdk iphonesimulator -target OoyalaSkinSDKUniversal
  2. find OoyalaSkinSDK.framework in sdk/OoyalaSkinSDK/build/
