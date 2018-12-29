/* eslint-disable no-undef, no-unused-vars */
import * as mon from 'monaco-editor';
import './conn';

declare global {
  const monaco: typeof mon;
  function require(deps: string[], cb: ((...args: any[]) => any)): void;
  interface Window {
    editor?: mon.editor.IStandaloneCodeEditor;
  }
}
