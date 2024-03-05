import fs from "fs";
import inquirer from "inquirer";

// Deprecated notice because of using Expo Router. add reference link https://docs.expo.dev/router/introduction/
console.log(
  "\x1b[33m",
  "⚠️ This script is deprecated because of using Expo Router. Please create pages and navigators manually in /src/app.",
  "\x1b[0m",
  "\n",
  "👉 https://docs.expo.dev/router/introduction/"
);

process.exit(1);

inquirer
  .prompt([
    {
      type: "input",
      name: "navigatorName",
      message: "What's the name of the navigator? (ex. HomeTabs)",
      validate(value) {
        // exclude "NavigatorName"
        if (value === "NavigatorName") {
          return "🚨 NavigatorName is not allowed as navigator name since it's used as placeholder";
        }

        // should not have words like "navigator" or "nav"
        if (
          value.toLowerCase().includes("navigator") ||
          value.toLowerCase().includes("nav")
        ) {
          return "🚨 Should not have words like 'navigator' or 'nav'. Suffix will be added automatically";
        }

        // should not have words like "screen"
        if (value.toLowerCase().includes("screen")) {
          return "🚨 Should not have words like 'screen' since it's a navigator. Create screen instead";
        }

        const pass = value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
        if (pass) {
          return true;
        }
        return "🚨 Should be in PascalCase";
      },
    },
    {
      type: "input",
      name: "screenName",
      message: "What's the name of the navigator's First Screen? (ex. Home)",
      validate(value) {
        // exclude "ScreenName"
        if (value === "ScreenName") {
          return "🚨 ScreenName is not allowed as component name since it's used as placeholder";
        }

        // should not have "Screen" suffix
        if (value.endsWith("Screen")) {
          return "🚨 Screen suffix is not allowed. It will be added automatically";
        }

        const pass = value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
        if (pass) {
          return true;
        }
        return "🚨 Should be in PascalCase";
      },
    },
  ])
  .then((answers) => {
    // check if navigator already exists
    const navigatorName = answers.navigatorName;
    const navigatorDir =
      process.cwd() + `/src/navigators/${navigatorName}Navigator.tsx`;
    if (fs.existsSync(navigatorDir)) {
      throw new Error("Navigator already exists");
    }

    // check if screen already exists
    const screenName = answers.screenName;
    const screenDir =
      process.cwd() +
      `/src/screens/${navigatorName}Navigator/${screenName}Screen.tsx`;
    if (fs.existsSync(screenDir)) {
      throw new Error("Screen already exists");
    }

    // get template file
    const templatesDir =
      process.cwd() + "/scripts/create-navigator/templates/Navigator.tsx";
    const fileContent = fs.readFileSync(templatesDir, "utf8");
    const replacedContent = fileContent
      .replace(/NavigatorName/g, navigatorName)
      .replace(/ImportScreenName/g, screenName)
      .replace(/ScreenName/g, navigatorName + "Nav_" + screenName);

    // create navigator file
    fs.writeFileSync(navigatorDir, replacedContent);

    // add navigator to AppNavigator.tsx
    const appNavigatorDir = process.cwd() + "/src/navigators/AppNavigator.tsx";
    const appNavigatorContent = fs.readFileSync(appNavigatorDir, "utf8");
    // replace // GENERATOR_ANCHOR_NAV_IMPORTS
    const replacedAppNavigatorContent = appNavigatorContent.replace(
      /\/\/ GENERATOR_ANCHOR_NAV_IMPORTS/g,
      `import { ${navigatorName}Navigator, ${navigatorName}NavParamList } from "./${navigatorName}Navigator";\n// GENERATOR_ANCHOR_NAV_IMPORTS`
    );
    // replace // GENERATOR_ANCHOR_PARAM_LIST
    const replacedAppNavigatorContent2 = replacedAppNavigatorContent.replace(
      /\/\/ GENERATOR_ANCHOR_PARAM_LIST/g,
      `${navigatorName}Navigator: NavigatorScreenParams<${navigatorName}NavParamList>;\n  // GENERATOR_ANCHOR_PARAM_LIST`
    );
    // replace {/* GENERATOR_ANCHOR_SCREENS */}
    const replacedAppNavigatorContent3 = replacedAppNavigatorContent2.replace(
      /{\/\* GENERATOR_ANCHOR_SCREENS \*\/}/g,
      `<Screen name="${navigatorName}Navigator" component={${navigatorName}Navigator} />\n      {/* GENERATOR_ANCHOR_SCREENS */}`
    );

    // rewrite AppNavigator.tsx
    fs.writeFileSync(appNavigatorDir, replacedAppNavigatorContent3);

    // add to index.tsx
    const indexDir = process.cwd() + "/src/navigators/index.ts";
    const indexContent = fs.readFileSync(indexDir, "utf8");
    // replace // GENERATOR_ANCHOR_NAVIGATOR
    const replacedIndexContent = indexContent.replace(
      /\/\/ GENERATOR_ANCHOR_NAVIGATOR/g,
      `export * from "./${navigatorName}Navigator";`
    );

    // remove last newline for sort
    const replacedIndexContent1 = replacedIndexContent.replace(/\n$/, "");

    // sort exports alphabetically in index.tsx
    const sortedIndexContent = replacedIndexContent1
      .split("\n")
      .sort()
      .join("\n");

    // add anchor for new navigator
    const replacedIndexContent2 =
      sortedIndexContent + "\n// GENERATOR_ANCHOR_NAVIGATOR\n";

    // rewrite index.tsx
    fs.writeFileSync(indexDir, replacedIndexContent2);

    // get template file
    const templatesDirScreen =
      process.cwd() + "/scripts/create-screen/templates/Screen.tpl";
    const fileContentScreen = fs.readFileSync(templatesDirScreen, "utf8");
    const replacedContentScreen = fileContentScreen
      .replace(/ScreenName/g, navigatorName + "Nav_" + screenName)
      .replace(/NavigatorName/g, navigatorName);

    // check if navigators screen folder exists
    const screenDirNavigator =
      process.cwd() + `/src/screens/${navigatorName}Navigator`;
    if (!fs.existsSync(screenDirNavigator)) {
      fs.mkdirSync(screenDirNavigator);
    }

    // create screen file
    fs.writeFileSync(screenDir, replacedContentScreen);

    // add to src/screens/index.ts
    const indexDirScreen = process.cwd() + "/src/screens/index.ts";
    const indexContentScreen = fs.readFileSync(indexDirScreen, "utf8");
    // replace // GENERATOR_ANCHOR_SCREEN
    const replacedIndexContentScreen = indexContentScreen.replace(
      /\/\/ GENERATOR_ANCHOR_SCREEN/g,
      `export * from "./${navigatorName}Navigator/${screenName}Screen";`
    );

    // remove last newline for sort
    const replacedIndexContentScreen1 = replacedIndexContentScreen.replace(
      /\n$/,
      ""
    );

    // sort exports alphabetically in index.tsx
    const sortedIndexContentScreen = replacedIndexContentScreen1
      .split("\n")
      .sort()
      .join("\n");

    // add anchor for new screen
    const replacedIndexContentScreen2 =
      sortedIndexContentScreen + "\n// GENERATOR_ANCHOR_SCREEN\n";

    // rewrite index.tsx
    fs.writeFileSync(indexDirScreen, replacedIndexContentScreen2);

    // show green success message
    console.log("\x1b[32m", "🎉 Navigator created successfully");
  })
  .catch((error) => {
    // show red error message
    console.error("\x1b[31m", "🚨 " + error.message);

    // exit with error code
    process.exit(1);
  });
