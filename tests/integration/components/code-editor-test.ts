import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const setUpEditor = async function() {
  await waitUntil(() => {
    const frame = document.querySelector('iframe');
    if (!frame) return false;
    const frameWin = frame.contentWindow;
    if (!frameWin) return false;
    return frameWin.document;
  });

  await waitUntil(
    () => {
      const frame = document.querySelector('iframe');
      if (!frame) throw new Error('No frame');
      const frameWin = frame.contentWindow;
      if (!frameWin) throw new Error('No frame window');
      const frameDoc = frameWin.document;
      if (!frameDoc) throw new Error('No frame document');
      const x = frameDoc.querySelector<HTMLDivElement>('.monaco-editor');
      if (!x) return false;
      return x.innerText.trim();
    },
    {
      timeout: 60000,
      timeoutMessage: 'Waiting for line content'
    }
  );
  const frame = document.querySelector('iframe');
  if (!frame) throw new Error('No frame');
  const frameWin = frame.contentWindow;
  if (!frameWin) throw new Error('No frame window');
  return frameWin
}

module('Integration | Component | code-editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{code-editor
  code="let x: string = 'foo';"
  language="typescript"
}}`);
    await settled();
    const frameWin = await setUpEditor();
    const frameDoc = frameWin.document
    const linesContent = frameDoc.querySelector<HTMLDivElement>(
      '.lines-content'
    );
    if (!linesContent) throw new Error('No frame content');
    assert.equal(
      linesContent.innerText.replace(/\s/g, ' '),
      "let x: string = 'foo';"
    );
  });

  test('readOnly mode works', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{code-editor
  code="let x: string = 'foo';"
  language="typescript"
  readOnly=true
}}`);
    await settled();
    const frameWin = await setUpEditor();
    const isReadOnly = (<any>frameWin).editor.getConfiguration().readOnly
    assert.equal(isReadOnly, true);
  });

  test('readOnly defeaults to false', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{code-editor
  code="let x: string = 'foo';"
  language="typescript"
}}`);
    await settled();
    const frameWin = await setUpEditor();
    const isReadOnly = (<any>frameWin).editor.getConfiguration().readOnly
    assert.equal(isReadOnly, false);
  });
});
