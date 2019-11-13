import babel from "rollup-plugin-babel";
import pkg from "./package.json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { uglify } from "rollup-plugin-uglify";

const deps = Object.keys(pkg.dependencies || {});
const peers = Object.keys(pkg.peerDependencies || {});
const allExternal = [...deps, ...peers];

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false;
  }
  const externalPattern = new RegExp(`^(${externalsArr.join("|")})($|/)`);
  return id => externalPattern.test(id);
};

const babelConfig = {
  babelrc: false,
  configFile: false,
  runtimeHelpers: true,
  exclude: /node_modules\/(?!callbag-)/,
  ...require("./babel.config.js")
};

const createConfig = ({ output, min = false, external = "all", env }) => ({
  input: "./src/index.js",
  output,
  external: makeExternalPredicate(external === "all" ? allExternal : peers),
  plugins: [
    resolve(),
    commonjs({ include: "node_modules/**" }),
    babel({
      ...babelConfig,
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          { useESModules: output.format !== "cjs" }
        ]
      ].concat(babelConfig.plugins || [])
    }),
    env &&
      replace({
        "process.env.NODE_ENV": JSON.stringify(env)
      }),
    min && uglify()
  ]
});

export default [
  createConfig({
    output: {
      format: "es",
      file: pkg.module
    }
  }),
  createConfig({
    output: {
      format: "cjs",
      file: pkg.main
    }
  }),
  createConfig({
    output: {
      format: "umd",
      file: pkg.unpkg,
      name: "LiveChat"
    },
    external: "peers",
    env: "production",
    min: true
  })
];
