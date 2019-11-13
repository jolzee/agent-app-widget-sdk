const { NODE_ENV, BABEL_ENV } = process.env;

const cjs = NODE_ENV === "test" || BABEL_ENV === "cjs";

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        loose: true,
        modules: false
      }
    ]
  ],
  plugins: [cjs && "@babel/transform-modules-commonjs"].filter(Boolean)
};
