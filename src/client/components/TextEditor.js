import React from 'react';
import { useState } from 'react-redux';

import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';

export const TextEditor = (pros) => {
  const { initialText, onConfirm, name } = pros;
  const [editorContent, setEditorContent] = React.useState(initialText || '');

  const handleChange = (event) => {
    setEditorContent(event.target.value);
  };

  return (<>
      <TextField
        label={name}
        multiline
        fullWidth={true}
        rowsMax={4}
        value={editorContent}
        onChange={handleChange}
        variant="outlined"
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckIcon />}
        onClick={()=> {
          setEditorStatus(false);
          setEditorContent(initialText);
        }}
      >
        取消
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckIcon />}
        onClick={()=> {
          onConfirm(editorContent);
        }}
      >
        确定
      </Button>
  </>
  );
};
