import Penpal from 'penpal';
import { setupEditor, updateEditor } from './editor';

const conn = Penpal.connectToParent({
  methods: {
    setupEditor,
    updateEditor
  }
});

export default conn;
