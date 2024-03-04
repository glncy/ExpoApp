# Expo App Boilerplate

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) before proceeding.

## Running the app

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

2. Prebuild the app:

> **Note**: Since it's a new clone, you need to prebuild the app first before running to make sure all the native modules are installed. Only run this command when you modified `app.config.js` file. Read more about `expo prebuild` [here](https://docs.expo.dev/workflow/prebuild/).

```bash
yarn expo prebuild
```

3. Install pods: (iOS only)

```bash
cd ios && pod install && cd ..
```

4. Install and run the app:

> **Note**: Use when you don't have the app installed on your device. Use also when you installed a new native module

```bash
yarn run:[ios|android]
```

5. Run app server:

> **Note**: Use when you already have the app installed on your device

```bash
yarn start
```

## Debugging the app

- View Logs in Android:

```bash
yarn react-native log-android
```

- View Logs in iOS:

```bash
yarn react-native log-ios
```

## Installing new packages

It is recommended to use `yarn expo install` when installing new packages. This will install known working versions of the packages. If you want to install the latest version of the package, use `yarn add` instead.

For example:

```bash
# yarn expo install <package-name>
yarn expo install react-native-gesture-handler
```

Read more about `yarn expo install` [here](https://docs.expo.dev/more/expo-cli/#install).

Adding `--check` flag will validate the package version against the known working versions. If the package version is not known, it will prompt you to continue or not.

Adding `--fix` flag will automatically fix the package version to the known working version.

For example:

```bash
yarn expo install --check
yarn expo install --fix
```

Read more about Version Validation flags [here](https://docs.expo.dev/more/expo-cli/#version-validation).

## Generator Commands

> **Note**: Names follow PascalCase naming convention

- Generate a new component:

```bash
yarn create:component
```

- Generate a new screen:

```bash
yarn create:screen
```

- Generate a new navigator:

```bash
yarn create:navigator
```

### Generating a new component follows the Atomic Design Pattern

- **Atoms** are the smallest possible components, such as buttons, titles, inputs or event color pallets, animations, and fonts.
- **Molecules** are the composition of one or more components of atoms.
- **Organisms** are the combination of molecules that work together or even with atoms that compose more elaborate interfaces.
- **Templates** are the combination of organisms that work together to form pages.

Read more about the Atomic Design Pattern [here](https://blog.logrocket.com/atomic-design-react-native/).

## Documenting components

After creating a new component, you can create documentation of component props by adding comments above the prop keys. For example:

```tsx
export interface ButtonProps {
  /**
   * The text to display inside the button
   */
  text: string;
  /**
   * The background color of the button
   */
  backgroundColor?: string;
  /**
   * The color of the button text
   */
  color?: string;
  /**
   * The size of the button
   */
  size?: "small" | "medium" | "large";
  /**
   * The style of the button
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The function to call when the button is pressed
   */
  onPress?: () => void;
}
```

You can find all generated documentation by running the storybook docs server:

```bash
yarn storybook:docs
```

## Firebase Setup

1. Create a new project in [Firebase Console](https://console.firebase.google.com/)
2. Add an Android app and an iOS app
3. Download the `google-services.json` file and place it inside `src/credentials` folder
4. Download the `GoogleService-Info.plist` file and place it inside `src/credentials` folder
5. Run command to generate credentials in `android` and `ios` folder:

```bash
yarn expo prebuild
```

## Testing Expo Linking

To test expo linking, you need to run the app. You can use the following commands to test expo linking:

```bash
npx uri-scheme open expoapp://<link> --[ios|android]
```

Read more about testing expo linking [here](https://docs.expo.dev/guides/linking/#testing-urls).

## CodePush

- What is CodePush? [Guide](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
- Command for CodePush release:

```bash
appcenter codepush release-react -a <usernameOrOrgName/TargetApp> -d <targetEnvironment> -e node_modules/expo/AppEntry.js
```

## Folder Structure Overview

```
├── .husky/ (contains all the husky hooks)
├── .vscode/ (contains all the vscode settings)
├── .storybook/ (contains all the on device storybook settings)
├── .storybook-web/ (contains all the web storybook settings)
├── android/ (contains all the native code for Android)
├── assets/ (contains all the assets of the app)
├── ios/ (contains all the native code for iOS)
├── scripts/ (contains all the generator scripts)
├── src/
│   ├── assets/ (contains all the assets of the app)
│   ├── components/ (contains all the components of the app)
│   ├── credentials/ (contains all the credentials of the app)
│   ├── navigators/
│   │   ├── AppNavigator/ (contains the main app navigator)
│   │   ├── index.ts/ (entry point of all the navigators)
│   │   ├── navigationUtilities.ts (contains all the navigation utilities)
│   ├── screens/
│   │   ├── ErrorScreen/ (contains the error screen)
│   │   ├── index.ts (entry point of all the screens)
│   ├── store/ (contains all the store of the app)
│   ├── theme/ (contains all the theme of the app)
│   ├── types/ (contains all the types of the app)
│   ├── utils/ (contains all the utilities)
│   ├── app.tsx (the root component of the app)
│   └── index.tsx (configuration file of the app)
├── .env.example (.env example file)
├── .eslintrc.js (eslint configuration file)
├── .eslintignore (eslint ignore file)
├── .gitignore (git ignore file)
├── .lintstagedrc.json (lint staged configuration file)
├── .prettierrc (prettier configuration file)
├── app.config.js (expo configuration file)
├── App.tsx (entry point of the app)
├── babel.config.js (babel configuration file)
├── commitlint.config.js (commit lint configuration file)
├── jest.setup.js (jest setup file)
├── metro.config.js (metro configuration file)
├── package.json (package configuration file)
├── README.md (readme file)
├── tsconfig.json (typescript configuration file)
└── yarn.lock (yarn lock file)
```

- `yarn create:component` will generate a component inside `src/components/[atoms|molecules|organisms|templates]` folder.
- `yarn create:navigator` will generate a navigator inside `src/navigators` folder and will modify the `src/navigators/index.ts` file and `src/AppNavigator.tsx` file.
- `yarn create:screen` will generate a screen inside `src/screens` folder and will modify the `src/screens/index.ts` file and the target navigator file.

## Packages Included

- [Notifee](https://notifee.app/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Firebase](https://rnfirebase.io/)
- [React Native Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
- [Expo SplashScreen](https://docs.expo.io/versions/latest/sdk/splash-screen/)
- [Expo Status Bar](https://docs.expo.io/versions/latest/sdk/status-bar/)
- [Expo StatusBar](https://docs.expo.io/versions/latest/sdk/status-bar/)
- [Jest](https://jestjs.io/)
- [React Native Code Push](https://github.com/microsoft/react-native-code-push)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Lint Staged](https://github.com/lint-staged/lint-staged)
- [Commit Lint](https://commitlint.js.org/#/)

## Troubleshooting
`[CP-User] [Hermes] Replace Hermes for the right configuration`:
- To fix this issue, you need to run `rm ios\.xcode.env.local`

# TODO: 
- [ ] Add ErrorBoundary