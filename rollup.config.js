const defs = {
  input: 'src/index.js',
  external: ['jquery', 'underscore', 'backbone', 'backbone.marionette','yaff-entitybuilder', '@popperjs/core', '@floating-ui/dom'],
}
const byFormat = format => ({
  file: `lib/marionette.infrastructure.${format}.js`,
  format: format,
  name: 'MnInfra',
  globals: {
    "underscore": "_",
    "jquery": "$",
    "backbone":"Backbone",
    "backbone.marionette": "Mn",
    "yaff-entitybuilder": "YaffEb",
    "@floating-ui/dom": "FloatingUIDOM",
    "@popperjs/core" : "Popper"
  }
});

export default env => {

  return {
    ...defs,
    output: [
      byFormat('esm'),
      byFormat('umd'),
    ]
  }

  /*
  let options = {
      input: 'src/index.js',
      output: {
        file: `lib/marionette.infrastructure.${env.format}.js`,
        format: env.format,
        name: 'MnInfra',
        globals: {
          "underscore": "_",
          "jQuery": "$",
          "backbone":"Backbone",
          "backbone.marionette": "Mn"
        }
      },
      external: ['jQuery', 'underscore', 'backbone', 'backbone.marionette'],
  }
  return options;
  */
}