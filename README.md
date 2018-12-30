# ember-monaco

[Monaco editor](https://github.com/Microsoft/monaco-editor) for ember.js apps

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
}
```

###### templates/application.hbs

```hbs
{{code-editor
  language="typescript"
  code=sample1
  onChange=(action (mut sample1))
  theme="light"
}}
```

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
