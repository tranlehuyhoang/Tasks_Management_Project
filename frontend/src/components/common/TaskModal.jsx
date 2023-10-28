import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TaskModal = ({ task, open, setOpen }) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setContent(task.content)

        }
    }, [task, open])

    return (
        <div>
            <Button onClick={() => setOpen(!open)}>Open modal</Button>
            <Modal
                open={open}

                aria-labelledby="modal-modal-title"
                closeAfterTransition
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    outline: 'none',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',

                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    bgcolor: 'background.paper',
                    border: '0px solid #000',
                    boxShadow: 24,
                    p: 1,
                    height: '80%',

                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%'
                    }}>
                        <IconButton
                            variant='outlined'
                            size='large'
                            sx={{
                                color: 'gray',
                                '&:hover': { color: 'red' }
                            }}

                        >
                            <CloseIcon fontSize='large' onClick={() => setOpen(!open)} />
                        </IconButton>
                        <IconButton
                            variant='outlined'
                            size='large'
                            sx={{
                                color: 'gray',
                                '&:hover': { color: 'rgb(102, 187, 106)' }
                            }}

                        >
                            <PublishedWithChangesIcon fontSize='large' onClick={() => setOpen(!open)} />
                        </IconButton>
                    </Box>
                    <Box sx={{}}>
                        <Box margin={'20px'}>

                            <TextField
                                value={title}

                                placeholder='Untitled'
                                variant='outlined'
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-input': { padding: 0 },
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                                    '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
                                }}
                            />
                            <br />
                            <br />
                            <br />

                            <CKEditor

                                editor={ClassicEditor}
                                data={content}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    console.log({ event, editor, data });
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                        </Box>

                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default TaskModal
