import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

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
        const x = frameDoc.querySelector('.monaco-editor');
        return !!x;
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
    const frameDoc = frameWin.document;
    const linesContent = frameDoc.querySelector<HTMLDivElement>(
      '.lines-content'
    );
    if (!linesContent) throw new Error('No frame content');
    assert.equal(
      linesContent.innerText.replace(/\s/g, ' '),
      "let x: string = 'foo';"
    );
  });
});