import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useCreateSectionMutation } from '../../slices/sectionsApiSlice'

let timer
const timeout = 500

const Kanban = (props) => {
    const boardId = props.boardId
    const [data, setData] = useState([])
    const [selectedTask, setSelectedTask] = useState(undefined)
    const [createSection, { isLoading }] = useCreateSectionMutation();

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const createSections = async () => {
        try {
            const section = await createSection(boardId).unwrap();
            setData([...data, section])
        } catch (err) {
            console.log(err)
        }
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
            <DragDropContext  >
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
                                                    <DeleteOutlinedIcon />
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
