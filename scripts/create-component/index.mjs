import fs from "fs";
import inquirer from "inquirer";
import path from "path";

inquirer
  .prompt([
    {
      type: "input",
      name: "componentName",
      message: "What's the name of the component? (ex. Button)",
      validate(value) {
        // exclude "ComponentName"
        if (value === "ComponentName") {
          return "ComponentName is not allowed as component name since it's used as placeholder";
        }

        const pass = value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/);
        if (pass) {
          return true;
        }
        return "Should be in PascalCase";
      },
    },
    {
      name: "componentType",
      type: "list",
      message: "What type of component is it?",
      choices: ["Atom", "Molecule", "Organism", "Template"],
    },
  ])
  .then((answers) => {
    // check if component already exists
    const componentType = answers.componentType.toLowerCase();
    const componentTypeDir =
      process.cwd() + `/src/components/${componentType}s`;

    const componentDir = componentTypeDir + `/${answers.componentName}`;
    if (fs.existsSync(componentDir)) {
      throw new Error("Component already exists");
    }

    // get template files

    const templatesDir = process.cwd() + "/scripts/create-component/templates";
    const files = fs.readdirSync(templatesDir);

    // get files content and replace placeholders
    const filesContent = files.map((file) => {
      const filePath = path.join(templatesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const replacedContent = fileContent
        .replace(/ComponentName/g, answers.componentName)
        .replace(/ComponentType/g, answers.componentType + "s");

      return {
        fileName: file.replace(/ComponentName/g, answers.componentName),
        content: replacedContent,
      };
    });

    // check if component type folder exists
    if (!fs.existsSync(componentTypeDir)) {
      fs.mkdirSync(componentTypeDir);
    }

    // create component folder
    fs.mkdirSync(componentDir);

    // create component files
    filesContent.forEach((fileContent) => {
      const filePath = path.join(componentDir, fileContent.fileName);
      fs.writeFileSync(filePath, fileContent.content);
    });
  })
  .catch((error) => {
    // show red error message
    console.error("\x1b[31m", error.message);

    // exit with error code
    process.exit(1);
  });
