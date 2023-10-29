import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useUpdateTaskMutation } from '../../slices/tasksApiSlice';
import ReactToPrint from 'react-to-print';
import { toast } from 'react-toastify'

let timer
const timeout = 500
const TaskViewModal = ({ task, open, setOpen }) => {
    const [title, setTitle] = useState('')
    const [taskData, setTask] = useState()
    const [updateicon, setupdateicon] = useState(true)
    const [content, setContent] = useState('')

    const [updateTask, { isLoading }] = useUpdateTaskMutation();

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setContent(task.content)

        }
    }, [task, open])



    return (
        <div>
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
                            <div style={{
                                overflowY: 'scroll',
                                height: '600px',
                                display: 'flex'
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: content }}></div></div>


                        </Box>

                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default TaskViewModal
