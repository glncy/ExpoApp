import fs from "fs";
import inquirer from "inquirer";
import path from "path";

// Deprecated notice because of using Expo Router. add reference link https://docs.expo.dev/router/introduction/
console.log(
  "\x1b[33m",
  "⚠️ This script is deprecated because of using Expo Router. Please create pages and navigators manually in /src/app.",
  "\x1b[0m",
  "\n",
  "👉 https://docs.expo.dev/router/introduction/"
);

process.exit(1);

// list of navigators
const navigators = fs
  .readdirSync(path.join(process.cwd(), "src", "navigators"))
  .filter((file) => file !== "index.ts" && file !== "navigationUtilities.ts")
  // filter with test files
  .filter((file) => !file.includes(".test."))
  // remove tsx extension
  .map((file) => file.replace(/\.tsx$/, ""));

// list of screens folders
const screensFolders = fs
  .readdirSync(path.join(process.cwd(), "src", "screens"), {
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory())
  // filter with "Navigator" suffix and Folder Name "ErrorScreen"
  .filter(
    (dirent) =>
      !dirent.name.includes("Navigator") && dirent.name !== "ErrorScreen"
  )
  .map((dirent) => dirent.name);

inquirer
  .prompt([
    {
      type: "input",
      name: "screenName",
      message: "What's the name of the screen? (ex. Home)",
      validate(value) {
        // exclude "ScreenName"
        if (value === "ScreenName") {
          return "ScreenName is not allowed as component name since it's used as placeholder";
        }

        // should not have words like "screen"
        if (value.toLowerCase().includes("screen")) {
          return "Should not have words like 'screen'. Suffix will be added automatically";
        }

        // should not have words like "navigator" or "nav"
        if (
          value.toLowerCase().includes("navigator") ||
          value.toLowerCase().includes("nav")
        ) {
          return "Should not have words like 'navigator' or 'nav' since it's a screen. Create navigator instead";
        }

        const pass = value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
        if (pass) {
          return true;
        }
        return "Please enter a valid screen name";
      },
    },
    {
      name: "targetNavigator",
      type: "list",
      message: "Which navigator should the screen be added to?",
      choices: navigators,
    },
    // if AppNavigator is selected, it should ask if it should be added to folder or not
    {
      name: "addToFolder",
      type: "confirm",
      message: "Should the screen be added to a folder?",
      when: (answers) => answers.targetNavigator === "AppNavigator",
    },
    // if AppNavigator is selected and addToFolder is true, it should ask which folder or create a new one
    {
      name: "folderName",
      type: "list",
      message: "Which folder should the screen be added to?",
      choices: ["Create new folder", ...screensFolders],
      when: (answers) =>
        answers.targetNavigator === "AppNavigator" && answers.addToFolder,
    },
    // if AppNavigator is selected and addToFolder is true and folderName is "Create new folder", it should ask for folder name
    {
      name: "newFolderName",
      type: "input",
      message: "What should the folder be called?",
      validate(value) {
        // exclude names with words like "navigator" or "nav"
        if (
          value.toLowerCase().includes("navigator") ||
          value.toLowerCase().includes("nav")
        ) {
          return "Should not have words like 'navigator' or 'nav'. It is used for navigators";
        }

        // exclude names with words like "screen"
        if (value.toLowerCase().includes("screen")) {
          return "Should not have words like 'screen'. It is used for screen components.";
        }

        const pass = value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
        if (pass) {
          return true;
        }
        return "Should be in PascalCase";
      },
      when: (answers) =>
        answers.targetNavigator === "AppNavigator" &&
        answers.addToFolder &&
        answers.folderName === "Create new folder",
    },
  ])
  .then((answers) => {
    let screenFolder = null;
    if (answers.targetNavigator === "AppNavigator") {
      if (answers.addToFolder) {
        if (answers.folderName === "Create new folder") {
          screenFolder = answers.newFolderName;
        } else {
          screenFolder = answers.folderName;
        }
      }
    } else {
      screenFolder = answers.targetNavigator;
    }

    const screenName = answers.screenName;
    const screenDir = path.join(
      process.cwd(),
      "src",
      "screens",
      screenFolder ? screenFolder : "",
      screenName + "Screen.tsx"
    );

    // check if screen already exists
    if (fs.existsSync(screenDir)) {
      throw new Error("Screen already exists");
    }

    // replace NavigatorName
    // remove "Navigator" suffix
    const navigatorName = answers.targetNavigator.replace(/Navigator$/, "");

    // get template files
    const templatesDir =
      process.cwd() + "/scripts/create-screen/templates/Screen.tpl";
    const fileContent = fs.readFileSync(templatesDir, "utf8");
    let finalScreenName = screenName;
    if (answers.targetNavigator === "AppNavigator") {
      finalScreenName = screenFolder
        ? screenFolder + "_" + screenName
        : screenName;
    } else {
      finalScreenName = navigatorName + "Nav_" + screenName;
    }
    const replacedContent = fileContent.replace(/ScreenName/g, finalScreenName);

    const replacedContent2 = replacedContent.replace(
      /NavigatorName/g,
      navigatorName
    );

    let replacedContent3 = replacedContent2;

    if (answers.targetNavigator === "AppNavigator") {
      // change "AppScreenProps" to "AppStackScreenProps"
      replacedContent3 = replacedContent2.replace(
        /AppNavScreenProps/g,
        "AppStackScreenProps"
      );
    }

    // check if screen folder exists
    if (screenFolder) {
      const screenFolderDir = path.join(
        process.cwd(),
        "src",
        "screens",
        screenFolder
      );
      if (!fs.existsSync(screenFolderDir)) {
        fs.mkdirSync(screenFolderDir);
      }
    } else {
      const screensDir = path.join(process.cwd(), "src", "screens");
      if (!fs.existsSync(screensDir)) {
        fs.mkdirSync(screensDir);
      }
    }

    // create screen file
    fs.writeFileSync(screenDir, replacedContent3);

    // add to index.ts
    const indexDir = path.join(process.cwd(), "src", "screens", "index.ts");
    const indexContent = fs.readFileSync(indexDir, "utf8");
    // replace // GENERATOR_ANCHOR_SCREEN
    const replacedIndexContent = indexContent.replace(
      /\/\/ GENERATOR_ANCHOR_SCREEN/g,
      `export * from "./${screenFolder ? screenFolder + "/" : ""}${screenName}Screen";`
    );

    // removes last newline for sort
    const replacedIndexContent2 = replacedIndexContent.replace(/\n$/, "");

    // sort imports
    const sortedIndexContent = replacedIndexContent2
      .split("\n")
      .sort()
      .join("\n");

    // add anchor for new screen
    const replacedIndexContent3 =
      sortedIndexContent + "\n// GENERATOR_ANCHOR_SCREEN\n";

    // rewrite index.ts
    fs.writeFileSync(indexDir, replacedIndexContent3);

    // add to navigator
    const navigatorDir = path.join(
      process.cwd(),
      "src",
      "navigators",
      answers.targetNavigator + ".tsx"
    );
    const navigatorContent = fs.readFileSync(navigatorDir, "utf8");
    // replace // GENERATOR_ANCHOR_PARAM_LIST
    const replacedNavigatorContent = navigatorContent.replace(
      /\/\/ GENERATOR_ANCHOR_PARAM_LIST/g,
      `${finalScreenName}Screen: undefined;\n  // GENERATOR_ANCHOR_PARAM_LIST`
    );
    // replace {/* GENERATOR_ANCHOR_SCREENS */}
    const screenPrefix =
      answers.targetNavigator === "AppNavigator" ? "Screens." : "";
    const replacedNavigatorContent2 = replacedNavigatorContent.replace(
      /{\/\* GENERATOR_ANCHOR_SCREENS \*\/}/g,
      `<Screen name="${finalScreenName}Screen" component={${screenPrefix}${finalScreenName}Screen} />\n      {/* GENERATOR_ANCHOR_SCREENS */}`
    );

    let replacedNavigatorContent3 = replacedNavigatorContent2;
    if (answers.targetNavigator !== "AppNavigator") {
      // replace // GENERATOR_ANCHOR_SCREEN_IMPORTS
      replacedNavigatorContent3 = replacedNavigatorContent2.replace(
        /\/\/ GENERATOR_ANCHOR_SCREEN_IMPORTS/g,
        `import { ${finalScreenName}Screen } from "@/src/screens/${screenFolder ? screenFolder + "/" : ""}${screenName}Screen";\n// GENERATOR_ANCHOR_SCREEN_IMPORTS`
      );
    }

    // rewrite navigator
    fs.writeFileSync(navigatorDir, replacedNavigatorContent3);
  })
  .catch((error) => {
    // show red error message
    console.error("\x1b[31m", "🚨 " + error.message);

    // exit with error code
    process.exit(1);
  });
