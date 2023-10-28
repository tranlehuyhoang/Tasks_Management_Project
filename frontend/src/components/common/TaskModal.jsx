import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useUpdateTaskMutation } from '../../slices/tasksApiSlice';
import { toast } from 'react-toastify'

let timer
const timeout = 500
const TaskModal = ({ task, open, setOpen, setData, dataBoard, onUpdateTask, onUpdateTaskTitle }) => {
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

    // const updateTitle = async (e) => {
    //     clearTimeout(timer)
    //     const newTitle = e.target.value
    //     timer = setTimeout(async () => {
    //       try {
    //         await taskApi.update(boardId, task.id, { title: newTitle })
    //       } catch (err) {
    //         alert(err)
    //       }
    //     }, timeout)

    //     task.title = newTitle
    //     setTitle(newTitle)
    //     props.onUpdate(task)
    //   }

    const updateContent = async (event, editor) => {
        const data = editor.getData();
        setContent(data);
        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                const res = await updateTask({ taskId: task.id, content: data }).unwrap();
                setTask(res);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }, timeout);
        task.content = data

        // setData(newData); // Set the updated dataBoard state
        onUpdateTask(task)
    };
    const updateTitle = async (event) => {

        setTitle(event.target.value);


        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                const res = await updateTask({ taskId: task.id, title: event.target.value }).unwrap();
                setTask(res);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }, timeout);
        task.title = event.target.value
        console.log(task)


        onUpdateTaskTitle(task)
    };
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
                        <IconButton
                            variant={isLoading ? 'contained' : 'contained'}
                            size='large'
                            sx={{
                                color: isLoading ? 'rgb(102, 187, 106)' : 'gray',
                                '&:hover': { color: 'rgb(102, 187, 106)' }
                            }}

                        >
                            <PublishedWithChangesIcon fontSize='inherit' />
                        </IconButton>
                    </Box>
                    <Box sx={{}}>
                        <Box margin={'20px'}>

                            <TextField
                                value={title}
                                onChange={(event) => updateTitle(event)}
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

                                onChange={(event, editor) => {
                                    updateContent(event, editor)

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
