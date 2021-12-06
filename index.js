/* eslint-disable node/no-extraneous-require*/
'use strict';

const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const stew = require('broccoli-stew');
const concat = require('broccoli-concat');
const path = require('path');
const Ts = require('broccoli-typescript-compiler').default;
const rollup = require('broccoli-rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupBabel = require('rollup-plugin-babel');
const resolvePackagePath = require('resolve-package-path');

let environment;

const DEBUG = true || process.env.BROCCOLI_DEBUG;
function maybeDebug(tree, name) {
  if (DEBUG) return stew.debug(tree, { name });
  else return tree;
}

function getMonacoEditorModulePath() {
  const monacoEditorModulePath = resolvePackagePath('monaco-editor')
    .split('/')
    .slice(0, -1)
    .join('/');

  return environment !== 'production'
    ? monacoEditorModulePath + '/dev/vs'
    : monacoEditorModulePath + '/min/vs';
}

const EDITOR_SCRIPTS_TS_CONFIG = {
  compilerOptions: {
    module: 'es2015',
    target: 'es2017',
    types: ['monaco-editor'],
    lib: ['scripthost', 'es2015', 'dom'],
    moduleResolution: 'node',
    inlineSourceMap: true,
    inlineSources: true,
    declaration: true
  },
  include: ['index.ts', './**/*.ts']
};

const EDITOR_SCRIPTS_BABEL_CONFIG = {
  sourceMaps: 'inline',
  runtimeHelpers: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions']
        }
      }
    ]
  ]
};

module.exports = {
  name: require('./package').name,
  config: function(env /*, appConfig*/) {
    environment = env;
  },
  included: function(parent) {
    parent.options.fingerprint = parent.options.fingerprint || {};
    parent.options.fingerprint.exclude =
      parent.options.fingerprint.exclude || [];
    // the monaco-editor loader doesn't work with fingerprinted assets (yet),
    // so we exclude it.
    parent.options.fingerprint.exclude.push('ember-monaco/vs');

    // TODO: disable uglify for CSS and JS to speed up the build and:
    // [WARN] `ember-monaco-editor/vs/editor/editor.main.js` took: 87370ms (more than 20,000ms)
    parent.import('node_modules/penpal/lib/index.js', {
      using: [{ transformation: 'cjs', as: 'penpal' }]
    });
    // TODO: consider lazy-loading the loader using the LoaderService
    // parent.import('vendor/ember-monaco-editor/vs/loader.js');
    // parent.import('vendor/ember-monaco-editor/vs/editor/editor.main');
  },
  importTransforms() {
    return this.addons
      .filter(addon => addon.importTransforms)
      .reduce((transforms, addon) => Object.assign(transforms, addon.importTransforms()), {});
  },
  treeForFrameScripts: function() {
    let src = maybeDebug(
      new Funnel(path.join(__dirname, 'editor'), {
        include: ['**/*.js', '**/*.ts'],
        destDir: 'editor-scripts'
      }),
      '1-es-src'
    );
    let es7Tree = maybeDebug(
      new Ts(src, {
        tsconfig: EDITOR_SCRIPTS_TS_CONFIG,
        throwOnError: false,
        annotation: 'compile program'
      }),
      '2-es-typescript'
    );
    const frameBundleTree = maybeDebug(
      new rollup(es7Tree, {
        rollup: {
          input: './editor-scripts/index.js',
          output: {
            file: 'frame-bundle.js',
            format: 'iife'
          },
          plugins: [
            rollupNodeResolve({
              jsnext: true,
              main: true
            }),
            rollupCommonjs(),
            rollupBabel(EDITOR_SCRIPTS_BABEL_CONFIG)
          ]
        }
      }),
      '3-es-rollup'
    );

    const regeneratorPath = require.resolve('regenerator-runtime')
      .split('/')
      .slice(0, -1)
      .join('/');

    const regeneratorTree = maybeDebug(
      new Funnel(regeneratorPath, {
        include: ['runtime.js'],
        destDir: '.'
      }),
      '1.1-regenerator-src'
    );

    const finalScript = maybeDebug(
      new concat(mergeTrees([frameBundleTree, regeneratorTree]), {
        headerFiles: ['runtime.js'],
        inputFiles: ['**/*'],
        outputFile: 'ember-monaco/frame.js'
      }),
      '9-finalScript'
    );

    return maybeDebug(mergeTrees([finalScript]), '999-out');
  },
  treeForMonacoScripts: function() {
    return new Funnel(getMonacoEditorModulePath(), {
      destDir: 'ember-monaco/vs'
    });
  },
  treeForFrameHtml: function() {
    return new Funnel(path.join(__dirname, 'editor'), {
      include: ['**/*.html'],
      destDir: 'ember-monaco'
    });
  },

  treeForPublic: function() {
    var publicTree = this._super.treeForPublic.apply(this, arguments);
    return maybeDebug(
      mergeTrees(
        [
          this.treeForMonacoScripts(),
          this.treeForFrameHtml(),
          this.treeForFrameScripts(),
          publicTree
        ].filter(Boolean)
      ),
      'x-public'
    );
  }
};
