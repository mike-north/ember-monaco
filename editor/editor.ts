import * as mon from 'monaco-editor';
import conn from './conn';
let editor: undefined | mon.editor.IStandaloneCodeEditor;

export function updateEditor({
  value,
  language
}: {
  value: string;
  language: 'typescript' | 'javascript';
}) {
  require(['vs/editor/editor.main'], () => {
    if (typeof monaco !== 'undefined' && typeof editor !== 'undefined') {
      editor.setValue(value);
      const lang = editor.getModel();
      if (!lang) throw new Error('Editor has no model');
      monaco.editor.setModelLanguage(lang, language);
    }
  });
}

function setupKeyBindings(
  editor: mon.editor.IStandaloneCodeEditor,
  client: any
) {
  // save
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
    function() {
      client.keyCommand({
        cmd: true,
        keys: ['s']
      });
    },
    ''
  );
  // save all
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_S,
    function() {
      client.keyCommand({
        cmd: true,
        shift: true,
        keys: ['s']
      });
    },
    ''
  );
}

function installResizeWatcher(
  el: HTMLElement,
  fn: (...args: any[]) => any,
  interval: number
) {
  let offset = { width: el.offsetWidth, height: el.offsetHeight };
  setInterval(() => {
    const newOffset = { width: el.offsetWidth, height: el.offsetHeight };
    if (
      offset.height !== newOffset.height ||
      offset.width !== newOffset.width
    ) {
      offset = newOffset;
      fn();
    }
  }, interval);
}

export function setupEditor(cfg: {
  theme: string;
  value: string;
  language: 'typescript' | 'javascript';
}) {
  require(['vs/editor/editor.main'], async () => {
    if (typeof monaco !== 'undefined') {
      const wrapper = window.document.getElementById('monaco-editor-wrapper');
      if (!wrapper) {
        throw new Error('No wrapper found');
      }
      const { language, theme, value } = cfg;
      const ed = (editor = window.editor = monaco.editor.create(wrapper, {
        language,
        theme,
        value
      }));
      const client = await conn.promise;
      ed.onDidChangeModelContent(event => {
        if (!event) {
          return;
        }
        client.onValueChanged({
          event,
          value: ed.getValue()
        });
      });

      client.onReady()

      setupKeyBindings(ed, client);
      installResizeWatcher(wrapper, editor.layout.bind(editor), 2000);
    }
  });
}
