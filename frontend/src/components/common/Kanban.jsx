import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useCreateSectionMutation, useDeleteSectionMutation, useUpdateSectionMutation } from '../../slices/sectionsApiSlice'
import { toast } from 'react-toastify'
import { useCreateTaskMutation } from '../../slices/tasksApiSlice'
let timer
const timeout = 500

const Kanban = (props) => {
    const boardId = props.boardId
    const [data, setData] = useState([])
    const [selectedTask, setSelectedTask] = useState(undefined)
    const [createSection, { isLoading }] = useCreateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [createTask] = useCreateTaskMutation();

    useEffect(() => {
        setData(props.data)
        console.log(props.data)
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
        console.log({ source, destination })
        if (!destination) return
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
            data[sourceColIndex].tasks = sourceTasks
            data[destinationColIndex].tasks = destinationTasks
        } else {
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            data[destinationColIndex].tasks = destinationTasks
        }

        try {
            await updateSection(boardId, {
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionId: sourceSectionId,
                destinationSectionId: destinationSectionId
            }).unwrap();
            setData(data)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    const deleteSections = async (sectionId) => {
        try {
            await deleteSection({ boardId, sectionId }).unwrap()

            const newData = [...data].filter(e => e.id !== sectionId)
            console.log(newData)
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
            console.log(task)
            // setData(prevData => {
            //     const newData = [...prevData];
            //     const index = newData.findIndex(e => e.id === sectionId);
            //     newData[index].tasks.unshift(task);
            //     return newData;
            // });
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
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
                    overflowX: 'auto'
                }}>
                    {
                        data.map(section => (
                            <div key={section.id} style={{ width: '300px' }}>
                                <Droppable key={section.id} droppableId={section.id}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '10px'
                                            }}>
                                                <TextField
                                                    value={section.title}
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
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                                                    {task.title === '' ? 'Untitled' : task.title}
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
                            </div>
                        ))
                    }
                </Box>
            </DragDropContext>

        </>
    )
}

export default Kanban
