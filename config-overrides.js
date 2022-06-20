// const { override, fixBabelImports, addLessLoader } = require('customize-cra');
// const { getThemeVariables } = require('antd/dist/theme');

// module.exports = override(
//    fixBabelImports('import', {
//       libraryName: 'antd',
//       libraryDirectory: 'es',
//       style: true,
//    }),
//    addLessLoader({
//       javascriptEnabled: true,
//       modifyVars: { '@primary-color': '#402E96', '@font-size-base': '14px' },
//       // modifyVars: getThemeVariables({
//       //    dark: true
//       // })
//    }),
// );
//'@card-shadow': '0 1px 4px rgba(0, 0, 0, 0.2)'
//

const {
  override,
  fixBabelImports,
  addLessLoader,
  addPostcssPlugins,
  adjustStyleLoaders,
  addWebpackPlugin,
} = require("customize-cra");

const AntdThemePlugin = require("antd-theme/plugin");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "true",
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#402E96", "@font-size-base": "14px" },
  }),
  adjustStyleLoaders((loaders) => {
    loaders.use[0] = {
      loader: AntdThemePlugin.loader,
    };
  }),
  addWebpackPlugin(
    new AntdThemePlugin({
      variables: ["primary-color"],
      themes: [
        {
          name: "dark",
          filename: require.resolve("antd/lib/style/themes/dark.less"),
        },
      ],
    })
  )
);
