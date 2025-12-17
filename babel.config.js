module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Keep reanimated plugin last to inject worklet helpers.
      "react-native-reanimated/plugin",
    ],
  };
};
