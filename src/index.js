const daisyuiInfo = require("../package.json");
const colors = require("./colors/index");
const utilities = require("../dist/utilities");
const base = require("../dist/base");
const unstyled = require("../dist/unstyled");
const unstyledRtl = require("../dist/unstyled.rtl");
const styled = require("../dist/styled");
const styledRtl = require("../dist/styled.rtl");
const utilitiesUnstyled = require("../dist/utilities-unstyled");
const utilitiesStyled = require("../dist/utilities-styled");
const themes = require("./colors/themes");
const colorFunctions = require("./colors/functions");

const mainFunction = ({ addBase, addComponents, addUtilities, config }) => {
  let diasyuiIncludedItems = [];
  let logs = false;
  if (config("daisyui.logs") != false) {
    logs = true;
  }
  if (logs) {
    console.log();
    console.log(
      "\x1b[35m%s\x1b[0m",
      "🌼 daisyUI components " + daisyuiInfo.version,
      "\x1b[0m",
      daisyuiInfo.homepage
    );
    console.group();
  }

  // inject @base style
  if (config("daisyui.base") != false) {
    addBase(base);
    diasyuiIncludedItems.push("base");
  }

  // inject components
  // because rollupjs doesn't supprt dynamic require
  let file = styled;
  if (config("daisyui.styled") == false && config("daisyui.rtl") != true) {
    diasyuiIncludedItems.push("unstyled components");
    file = unstyled;
  } else if (
    config("daisyui.styled") == false &&
    config("daisyui.rtl") == true
  ) {
    diasyuiIncludedItems.push("unstyled components");
    console.log("\x1b[36m%s\x1b[0m", " Direction:", "\x1b[0m", "RTL");
    file = unstyledRtl;
  } else if (
    config("daisyui.styled") != false &&
    config("daisyui.rtl") != true
  ) {
    diasyuiIncludedItems.push("components");
    file = styled;
  } else if (
    config("daisyui.styled") !== false &&
    config("daisyui.rtl") == true
  ) {
    diasyuiIncludedItems.push("components");
    console.log("\x1b[36m%s\x1b[0m", " Direction:", "\x1b[0m", "RTL");
    file = styledRtl;
  }
  addComponents(file);

  const themeInjector = colorFunctions.injectThemes(addBase, config, themes)
  themeInjector;

  diasyuiIncludedItems.push("themes[" + themeInjector.themeOrder.length + "]");

  // inject @utilities style needed by components
  if (config("daisyui.utils") != false) {
    addComponents(utilities, { variants: ["responsive"] });
    addComponents(utilitiesUnstyled, { variants: ["responsive"] });
    addComponents(utilitiesStyled, { variants: ["responsive"] });
    diasyuiIncludedItems.push("utilities");
  }
  if (logs) {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "✔︎ Including:",
      "\x1b[0m",
      "" + diasyuiIncludedItems.join(", ")
    );
    console.log();
    console.groupEnd();
  }
};

module.exports = require("tailwindcss/plugin")(mainFunction, {
  theme: { extend: { colors } },
});
