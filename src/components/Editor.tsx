import { FC } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export const Editor: FC<EditorProps> = ({ code, onChange, language = 'javascript' }) => {
  return (
    <MonacoEditor
      height="400px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};