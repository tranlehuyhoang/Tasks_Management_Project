import { Box, Button, Typography, Divider, TextField, IconButton, Card, ListItemButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useCreateSectionMutation, useDeleteSectionMutation, useUpdateSectionMutation } from '../../slices/sectionsApiSlice'
import { toast } from 'react-toastify'
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdatePositionTaskMutation } from '../../slices/tasksApiSlice'
import TaskModal from './TaskModal'
import TaskViewModal from './TaskViewModal'
let timer
const timeout = 500

const Kanban = (props) => {
    const boardId = props.boardId
    const [taskIdModal, setTaskIdModal] = useState()


    const [deleteColor, setOpendeleteColor] = useState(true)
    const [updateColor, setOpenupdateolor] = useState(true)
    const [viewColor, setOpenviewColor] = useState(true)


    const [open, setOpen] = useState(false)
    const [openview, setOpenView] = useState(false)
    const [data, setData] = useState([])
    const [selectedTask, setSelectedTask] = useState(undefined)
    const [createSection, { isLoading }] = useCreateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [updatePositionTask] = useUpdatePositionTaskMutation();
    const [createTask] = useCreateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const createSections = async () => {
        try {
            const section = await createSection(boardId).unwrap();
            setData([...data, section])
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return

        if (destination.droppableId == 'delete') {
            setOpendeleteColor(false)
            console.log('delete', source.droppableId)
            try {
                const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
                console.log(data[sourceColIndex].tasks)

                setData(prevData => {
                    const newData = [...prevData]; // Create a shallow copy of the original data array
                    // console.log(newData[sourceColIndex].tasks);

                    const updatedTasks = newData[sourceColIndex].tasks.filter((task, index) => index !== source.index);
                    const updatedData = { ...newData[sourceColIndex], tasks: updatedTasks };
                    newData[sourceColIndex] = updatedData;

                    return newData; // Return the updated data array to set the state
                });
                await deleteTask({ taskId: data[sourceColIndex].tasks[source.index].id }).unwrap();
                toast.success('Delete Task Success');
                setOpendeleteColor(true)
            } catch (err) {
                setOpendeleteColor(true)

                toast.error(err?.data?.message || err.error);
            }
            return
        }
        if (destination.droppableId == 'update') {
            setOpenupdateolor(!updateColor)

            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)


            setTaskIdModal(data[sourceColIndex].tasks[source.index])
            // console.log(data[sourceColIndex].tasks[source.index])
            setOpen(true);
            setOpenupdateolor(!updateColor)


            return
        }
        if (destination.droppableId == 'views') {
            setOpenviewColor(!updateColor)

            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)


            setTaskIdModal(data[sourceColIndex].tasks[source.index])
            // console.log(data[sourceColIndex].tasks[source.index])
            setOpenView(true);
            setOpenviewColor(!updateColor)


            return
        }
        const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
        const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)
        const sourceCol = data[sourceColIndex]
        const destinationCol = data[destinationColIndex]

        const sourceSectionId = sourceCol.id
        const destinationSectionId = destinationCol.id

        const sourceTasks = [...sourceCol.tasks]
        const destinationTasks = [...destinationCol.tasks]

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            setData(prevData => {
                const newData = [...prevData]; // Create a shallow copy of the original data array
                newData[sourceColIndex] = { ...newData[sourceColIndex], tasks: sourceTasks }; // Update the source column tasks
                newData[destinationColIndex] = { ...newData[destinationColIndex], tasks: destinationTasks }; // Update the destination column tasks
                return newData; // Return the updated data array to set the state
            });
        } else {
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)

            setData(prevData => {
                const newData = [...prevData]; // Create a shallow copy of the original data array
                newData[destinationColIndex] = { ...newData[destinationColIndex], tasks: destinationTasks }; // Update the destination column tasks
                return newData; // Return the updated data array to set the state
            });
        }

        try {
            await updatePositionTask({
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionId: sourceSectionId,
                destinationSectionId: destinationSectionId
            }
            ).unwrap();
            // setData(data)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    const deleteSections = async (sectionId) => {
        try {
            await deleteSection({ boardId, sectionId }).unwrap()

            const newData = [...data].filter(e => e.id !== sectionId)
            setData(newData)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }



    const updateSectionTitle = async (e, sectionId) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        const newData = data.map(item => {
            if (item.id === sectionId) {
                return { ...item, title: newTitle };
            }
            return item;
        });
        setData(newData);
        timer = setTimeout(async () => {
            try {
                await updateSection({ boardId, sectionId, title: newTitle }).unwrap();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }, timeout);
    };
    const createTasks = async (sectionId) => {
        try {
            const task = await createTask({ boardId, sectionId }).unwrap();
            setData(prevData => {
                const newData = [...prevData];
                const index = newData.findIndex(e => e.id === sectionId);
                if (index !== -1) {
                    newData[index] = {
                        ...newData[index],
                        tasks: [task, ...newData[index].tasks]
                    };
                }
                return newData;
            });
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    const onUpdateTask = async (tasksss) => {
        console.log(data)
        // setData(prevData => {
        //     const newData = [...prevData];
        //     const sectionIndex = newData.findIndex(e => e.id === tasksss.section.id)
        //     if (sectionIndex !== -1) {
        //         newData[sectionIndex] = {
        //             ...newData[sectionIndex],
        //             tasks: [tasksss, ...newData[sectionIndex].tasks]
        //         };
        //     }
        //     return newData;
        // });

    }
    const onUpdateTaskTitle = async (title, sectionId, taskId, taskPositon) => {
        // console.log(title, sectionId, taskId, taskPositon)
        // console.log('mảng sections cũ: ', data)
        // const sectionIndex = data.findIndex(e => e.id === sectionId)
        // console.log('mảng sections cần update :', data[sectionIndex])
        // console.log('task trong section cần update :', data[sectionIndex].tasks[taskPositon])
        // console.log('title cần update :', title)
        // console.log(data[sectionIndex].tasks)
        // const indexTask = data[sectionIndex].tasks.findIndex(task => task.id === taskId);
        // console.log(data[sectionIndex].tasks[indexTask])

        setData(prevData => {
            const newData = [...prevData];
            const sectionIndex = newData.findIndex(e => e.id === sectionId);
            if (sectionIndex !== -1) {
                const taskIndex = newData[sectionIndex].tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    const updatedTask = {
                        ...newData[sectionIndex].tasks[taskIndex],
                        title: title
                    };

                    newData[sectionIndex].tasks = [
                        ...newData[sectionIndex].tasks.slice(0, taskIndex),
                        updatedTask,
                        ...newData[sectionIndex].tasks.slice(taskIndex + 1)
                    ];
                }
            }
            return newData;
        });

    }
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Button onClick={createSections}>
                    Add section
                </Button>
                <Typography variant='body2' fontWeight='700'>
                    {data.length} Sections
                </Typography>
            </Box>
            <Divider sx={{ margin: '10px 0' }} />
            <DragDropContext onDragEnd={onDragEnd}>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: 'calc(100vw - 400px)',
                    overflowX: 'auto',
                    justifyContent: 'space-around',
                    gap: '10px'


                }}>
                    <Droppable key={'views-key'} droppableId={'views'}>
                        {(provided) => (
                            <Box
                                bgcolor={viewColor ? '#F2F2F2' : 'rgb(66, 165, 245)'}
                                color={viewColor ? 'black' : 'white'}

                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ padding: '10px', minHeight: '50px', flex: '1 1 0', transition: ' 0.5s ease-in-out', }}
                            >
                                {provided.placeholder}
                                View
                            </Box>
                        )}
                    </Droppable>
                    <Droppable key={'update-key'} droppableId={'update'}>
                        {(provided) => (
                            <Box
                                bgcolor={updateColor ? '#F2F2F2' : 'rgb(102, 187, 106)'}
                                color={updateColor ? 'black' : 'white'}

                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ padding: '10px', minHeight: '50px', flex: '1 1 0', transition: ' 0.5s ease-in-out', }}

                            >
                                {provided.placeholder}
                                Update
                            </Box>
                        )}
                    </Droppable>
                    <Droppable key={'delete-key'} droppableId={'delete'}>
                        {(provided) => (
                            <Box
                                bgcolor={deleteColor ? '#F2F2F2' : 'rgb(244, 67, 54)'}
                                color={deleteColor ? 'black' : 'white'}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ padding: '10px', minHeight: '50px', flex: '1 1 0', transition: ' 0.5s ease-in-out', }}
                            >
                                {provided.placeholder}
                                Delete
                            </Box>
                        )}
                    </Droppable>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: 'calc(100vw - 400px)',
                    overflowX: 'auto'
                }}>

                    {
                        data.map((section, index) => (
                            <div key={section.id} style={{ width: '300px', margin: '5px', marginTop: '10px' }}>
                                <Droppable key={section.id} droppableId={section.id}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={{ width: '300px', padding: '10px', marginRight: '10px', backgroundColor: '#F2F2F2', borderRadius: '10px' }}
                                        >
                                            <Divider sx={{ margin: '10px 0' }} style={{ borderWidth: '2px' }} className={`hehehe${index}`} />

                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                            }}>
                                                <TextField
                                                    value={section.title}
                                                    className={`hehehe${index}`}
                                                    onChange={(e) => updateSectionTitle(e, section.id)}
                                                    placeholder='Untitled'
                                                    variant='outlined'
                                                    sx={{
                                                        flexGrow: 1,
                                                        '& .MuiOutlinedInput-input': { padding: 0 },
                                                        '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                                                        '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                                                    }}
                                                />
                                                <IconButton
                                                    variant='outlined'
                                                    size='small'
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': { color: 'green' }
                                                    }}
                                                    onClick={() => createTasks(section.id)}
                                                >
                                                    <AddOutlinedIcon />
                                                </IconButton>
                                                <IconButton
                                                    variant='outlined'
                                                    size='small'
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': { color: 'red' }
                                                    }}

                                                >
                                                    <DeleteOutlinedIcon onClick={() => deleteSections(section.id)} />
                                                </IconButton>
                                            </Box>
                                            {/* tasks */}
                                            {
                                                section.tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index} >
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    padding: '10px',
                                                                    marginBottom: '10px',
                                                                    cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                                }}
                                                                onClick={() => setSelectedTask(task)}
                                                            >
                                                                <Typography>
                                                                    {task.title === '' ? index + 1 + ":" + "  " + 'Untitled' : index + 1 + ":" + "  " + task.title}
                                                                </Typography>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                                <p style={{ textAlign: 'center', color: 'gray' }}>Incoming tasks, waiting to be done</p>
                            </div>
                        ))
                    }




                </Box>
            </DragDropContext>
            <TaskModal task={taskIdModal} open={open} setOpen={setOpen} setData={setData} dataBoard={data} onUpdateTask={onUpdateTask} onUpdateTaskTitle={onUpdateTaskTitle} />
            <TaskViewModal task={taskIdModal} open={openview} setOpen={setOpenView} />
        </>
    )
}

export default Kanban
