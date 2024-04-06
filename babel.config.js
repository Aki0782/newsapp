/* eslint-disable import/no-commonjs */
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "@Api": "./src/API",
          "@Callbacks": "./src/CallBacks",
          "@Assets": "./src/Assets",
          "@Components": "./src/Components",
          "@Utils": "./src/Utils",
          "@Constants": "./src/Constants",
          "@Pages": "./src/Pages"
        }
      }
    ]
  ]
};
