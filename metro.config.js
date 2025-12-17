// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = withNativeWind(
  (() => {
    const config = getDefaultConfig(__dirname);

    // 1️⃣ Tell Metro to use the SVG transformer for `.svg` files:
    config.transformer.babelTransformerPath = require.resolve(
      "react-native-svg-transformer"
    );

    // 2️⃣ Remove "svg" from assetExts, add it to sourceExts:
    const { assetExts, sourceExts } = config.resolver;
    config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
    config.resolver.sourceExts = [...sourceExts, "svg"];

    return config;
  })(),
  {
    // your native-wind options:
    input: "./global.css",
  }
);
