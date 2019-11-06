# ember-monaco

[Monaco editor](https://github.com/Microsoft/monaco-editor) for ember.js apps

[![Build Status](https://travis-ci.org/mike-north/ember-monaco.svg?branch=master)](https://travis-ci.org/mike-north/ember-monaco)
[![Version](https://img.shields.io/npm/v/ember-monaco.svg)](https://www.npmjs.com/package/ember-monaco)

## Installation

```
ember install ember-monaco
```

## Usage

###### controllers/application.ts

```ts
import Controller from '@ember/controller';

export default class Application extends Controller {
  sample1 = "let x: string = 'foo'";

  @action
  editorReady (editor) {
    // editor: Monaco editor instance
  }
}
```

###### templates/application.hbs

```hbs
{{code-editor
  language="typescript"
  code=sample1
  onChange=(action (mut sample1))
  theme="light"
  onReady=(action editorReady)
}}
```

**Additional options:**

To create a read-only editor, pass `readOnly=true` to the `code-editor` component.
`readOnly` defaults to false.

## Contributing

### Installation

- `git clone <repository-url>`
- `cd ember-monaco`
- `yarn install`

### Linting

- `yarn lint:hbs`
- `yarn lint:js`
- `yarn lint:js --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [BSD-2-Clause](LICENSE.md).

## Thanks

Thanks to @MiguelMadero for writing [ember-monaco-editor](https://github.com/MiguelMadero/ember-monaco-editor), which served as a starting point for this work
