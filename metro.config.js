/* eslint-env node */
// Learn more https://docs.expo.io/guides/customizing-metro
const { generate } = require("@storybook/react-native/scripts/generate");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const STORYBOOK_ENABLED = process.env.STORYBOOK_ENABLED === "1";

if (STORYBOOK_ENABLED) {
  generate({
    configPath: path.resolve(__dirname, "./.storybook"),
  });
}

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (STORYBOOK_ENABLED) {
  config.transformer.unstable_allowRequireContext = true;
  config.resolver.sourceExts.push("mjs");
}

config.resolver.requireCycleIgnorePatterns.push(
  /(^|\/|\\)src\/db\/schemas($|\/|\\)/
);

config.resolver.sourceExts.push("sql");

module.exports = config;
