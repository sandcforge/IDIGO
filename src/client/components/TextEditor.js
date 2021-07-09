import React from 'react';
import { useState } from 'react-redux';

import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

export const TextEditor = (pros) => {
  const { initialText, onConfirm, name } = pros;
  const [editorStatus, setEditorStatus] = React.useState(false);
  const [editorContent, setEditorContent] = React.useState(initialText || '');

  const handleChange = (event) => {
    setEditorContent(event.target.value);
  };

  return (<>
    <IconButton
      color='primary'
      onClick={() => {
        setEditorStatus(!editorStatus);
      }}
    >
      <EditIcon />
    </IconButton>
    <Collapse in={editorStatus} timeout="auto" unmountOnExit>
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

    </Collapse>
  </>
  );
};
