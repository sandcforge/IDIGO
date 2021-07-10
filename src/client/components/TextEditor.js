import React from 'react';
import { useState } from 'react-redux';

import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    margin: 8,
  }
}));


export const TextEditor = (pros) => {
  const { initialText, onConfirm, onCancel, name } = pros;
  const [editorContent, setEditorContent] = React.useState(initialText || '');
  const classes = useStyles();

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
    <div className={classes.actionContainer}>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        startIcon={<ClearIcon />}
        onClick={() => {
          setEditorContent(initialText);
          onCancel(editorContent);
        }}
      >
        取消
      </Button>

      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={<CheckIcon />}
        onClick={() => {
          onConfirm(editorContent);
        }}
      >
        确定
      </Button>
    </div>
  </>
  );
};
