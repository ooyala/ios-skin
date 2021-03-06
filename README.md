# native-skin

This is the repository that contains all information regarding the new iOS and Android Skins. This repo is the source for all things related to the new Ooyala SDK User Interface ('skin').  

**The sample applications will not run without configuration. Please consult the Getting Started Guides for setup.**

# First Steps: iOS Getting Started Guide

Trying things for the first time? [Check out the iOS Skin Getting Started Guide](dev_docs/README-ios.md) to try the sample application, while getting a better understanding of the new iOS Skin, OoyakaSkinSDK-iOS, and OoyalaSkinSampleApp

# First Steps: Android Getting Started Guide

Trying things for the first time? [Check out the Android Skin Getting Started Guide](dev_docs/README-android.md) to try the sample application, while getting a better understanding of the new Android Skin, OoyakaSkinSDK-Android, and OoyalaSkinSampleApp



# Overview

This project focuses on the creation of Ooyala's new Player UI for the native Ooyala SDKs. This new UI must...

1. be visually consistent with the Ooyala Web UI.  
2. be easily integratable with existing Ooyala SDK applications
3. be easily configurable with customization that supports a majority of use cases.
4. be easily modifiable for larger interface changes that some developers may need to make.

This project relies on __React Native__, a UI Framework that allows for similar code to be run for all of Web, Android, and iOS SDKs.

- (iOS) However, in most cases you do not necessarily need to install any React Native dependencies

# Definitions

- **OoyalaSkinSDK.zip**: The zip package that contains all libraries, resources, and auxilary files that are necessary to add the Skin UI to an application
- **OoyalaSkinSDK**: This can refer to two different things:
    1. *Compiled Skin SDK*: This is the OoyalaSkinSDK.framework or OoyalaSkinSDK.jar which you can embed into your application directly
    2. *Source Code SDK*: This is the raw source code that would compile into (1).  You can link this directly into your application as an alternative to (1)
- **OoyalaSkinSampleApp**: The Android or iOS Sample Application that highlights scenarios which demonstrate various features of the Skin UI
- **React Native Javascript**: The javscript that is written with the React Native framework. This code defines the entire UI interface.  This can be delivered to the application in two ways:
    1. *JSBundle*: This refers to the method where you pre-package all of your javascript files into one (called the jsbundle), and you physically insert that into your application (for example, added into the iOS application through the application's bundle).
    2. *Local Hosting*: React Native provides a way to quickly debug and test javascript code by hosting a Node server that packages all of our javascript files on the fly, and put it into the sample app
- **Skin Config**: A series of JSON files that can be found at [https://github.com/ooyala/skin-config](https://github.com/ooyala/skin-config). These files define:
    1. *skin.json*: A configuration that is applied to the OoyalaSkinSDK, which outlines the desired look and feel of the user interface.
    2. *skin-schema.json*: A JSON schema that defines all of the possible options for the skin.json
    3. *[language].json*: A series of files that represent the localization of all strings used in our Skin UI (i.e. en.json, zh.json)

# Development

## JavaScript

JavaScript project located in the `sdk/react` directory and requires Node v10+ and npm v6+ to operate. Consider using
[nvm](https://github.com/creationix/nvm), [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage your Node
installations.

Navigate to the `sdk/react` directory and start with installing dependencies:

```sh
npm install
```

### Before Push

**When touching JavaScript or updating npm dependencies, please ensure all checks are passing (no errors and the exit
code is 0) by running the following command:**

```sh
npm run ci
```

### Tasks

The following tasks relate to the JavaScript project only, what means you have to be in the `sdk/react` directory to run
them.

#### Development server

* `npm start` - starts local development server serving dynamically bundled JavaScript.

#### Code checks

Code checks are important parts of development process, the following commands should be used to check source code
quality:

* `npm run lint` - outputs lint errors.
* `npm run flow` - outputs [Flow](https://flow.org/) errors.

#### Tests

* `npm test` - runs test suite.
* `npm run test:coverage` - runs test suite to generate coverage report in the `coverage` directory, you can open
`coverage/lcov-report/index.html` page in your browser to check what's covered and what's not.
* `npm run test:update` - runs test suite and updates snapshots, helpful if you made intended changes and want to
actualize snapshots.
* `npm run coverage` - does the same as `test:coverage` but cleans `coverage` directory previously to ensure no old
files are present there.

#### Build

JavaScript project produces only one type of artifacts: bundled JavaScript files that can be used in the mobile SDK
build process. Use the following commands to create production bundles in the `dist` directory:

* `npm run build:android` - creates Android production bundle `index.android.jsbundle`.
* `npm run build:ios` - creates iOS production bundle `main.jsbundle`.
* `npm run build` - creates both production bundles.

Also, for development purposes you can build bundles with the development mode enabled. That means bundles will not be
minified (to ease debugging process) and warning and errors will be shown in yellow or red boxes over the user
interface.

* `npm run build:dev:android` - creates Android development bundle.
* `npm run build:dev:ios` - creates iOS development bundle.
* `npm run build:dev` - creates both development bundles.

You can also pass your own `bundle-output` path like so:

```sh
npm run build:android -- --bundle-output ../../../android-sample-apps/vendor/Ooyala/OoyalaSkinSDK-Android/index.android.jsbundle
npm run build:ios -- --bundle-output ../../../ios-sample-apps/vendor/Ooyala/OoyalaSkinSDK-iOS/main.jsbundle
```

#### Continuous integration

* `npm run ci` - runs all checks, generates coverage report and build production bundles for Android and iOS, stops the
process if any errors occur.

### File structure

* The app sources are located in the `src` directory, except `index.android.js` and `index.ios.js`.
* Tests should be placed next to the code they cover.
* Root level contains only core functionality required in `index.android.js` and `index.ios.js`, constants and script to
setup tests.
* `lib` contains different services used across the project.
* `types` contains Flow types definitions.
* `shared` and `views` contains only React components and some common styles that are used by them.
* `shared` components are components used (e.g. imported) in more than one place, in views or in other shared
components.
* `views` components are components directly used in `ViewsRenderer.js`.

#### Components

Each component should be treated as a small package and placed in its own directory:

```
SomeComponent
|-- __fixtures__
|   `-- data for tests
|-- __snapshots__
|   `-- test snapshots
|-- ChildComponent
|   `-- child component files
|-- index.js
|-- SomeComponent.js
|-- SomeComponent.styles.js
`-- SomeComponent.test.js
```

Component should be as clean (dumb, stateless) as possible, `index.js` can be used to apply higher order components if
needed. `index.js` exports ready to use component as default, so you shouldn't import component directly:

```
// DON'T!
import SomeComponent from 'shared/SomeComponent/SomeComponent';
```

```
// DO!
import SomeComponent from 'shared/SomeComponent';
```

Component can also have children components in its directory, but only in the case when those children components are
not used anywhere else (in this case they should be moved to the `shared` directory).

#### Namings

* service in `lib` - `someService.js`
* types file in `types` - `SomeTypes.js`
* component - `SomeComponent.js`
* component styles - `SomeComponent.styles.js`
* common styles file - `someStyles.styles.js` or `someStyle.style.js` if the file contains only one style object
* test should have the same name as the module it covers ending with `.test.js`
