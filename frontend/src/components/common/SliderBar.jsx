import { useSelector, useDispatch } from 'react-redux';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import assets from '../../assets/index';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { setBoards } from '../../slices/boardSlice';
import { useCreateBoardMutation, useGetAllMutation, useUpdatePositionMutation } from '../../slices/boardsApiSlice';

const SliderBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { boardId } = useParams()
    const [activeIndex, setActiveIndex] = useState(0)

    const [getAll, { isLoading }] = useGetAllMutation();
    const [updatePosition] = useUpdatePositionMutation();
    const [createBoard] = useCreateBoardMutation();
    const { user } = useSelector((state) => state.auth.userInfo);
    const boardvalues = useSelector((state) => state.board.value);

    const sidebarWidth = 250

    const logout = () => {
        localStorage.removeItem('userInfo')
        navigate('/login')
    }
    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await getAll().unwrap();
                console.log({ res })
                dispatch(setBoards(res));
            } catch (err) {
                console.log(err)
            }
        }
        getBoards()
    }, [dispatch])

    useEffect(() => {
        const activeItem = boardvalues.findIndex(e => e.id === boardId)
        if (boardvalues.length > 0 && boardId === undefined) {
            navigate(`/boards/${boardvalues[0].id}`)
        }
        setActiveIndex(activeItem)
    }, [boardvalues, boardId, navigate])

    const onDragEnd = async ({ source, destination }) => {
        if (!destination) {
            return;
        }

        const newList = [...boardvalues];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination.index, 0, removed);

        const activeItem = newList.findIndex((e) => e.id === boardId);
        setActiveIndex(activeItem);
        dispatch(setBoards(newList));

        try {
            // await useUpdatePositionMutation({ boards: newList })
            const res = await updatePosition({ boards: newList }).unwrap();
        } catch (err) {
            console.log(err);
        }
    };

    const addBoard = async () => {
        try {
            const res = await createBoard().unwrap();
            const newList = [res, ...boardvalues]
            dispatch(setBoards(newList))
            navigate(`/boards/${res.id}`)
        } catch (err) {
            alert(err)
        }
    }

    return (
        <Drawer
            container={window.document.body}
            variant='permanent'
            open={true}
            sx={{
                width: sidebarWidth,
                height: '100vh',
                '& > div': { borderRight: 'none' }
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: '100vh',
                    backgroundColor: assets.colors.secondary
                }}
            >
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant='body2' fontWeight='700'>
                            {user.username}
                        </Typography>
                        <IconButton onClick={logout}>
                            <LogoutOutlinedIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </ListItem>
                <Box sx={{ paddingTop: '10px' }} >
                    <ListItem>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant='body2' fontWeight='700'>
                                Favorite
                            </Typography>
                            <IconButton >
                                <AddBoxOutlinedIcon fontSize='small' />
                            </IconButton>
                        </Box>
                    </ListItem>
                </Box>

                <Box sx={{ paddingTop: '10px' }} />
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant='body2' fontWeight='700'>
                            Private
                        </Typography>
                        <IconButton onClick={addBoard}>
                            <AddBoxOutlinedIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </ListItem>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    boardvalues.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <ListItemButton
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    selected={index === activeIndex}
                                                    component={Link}
                                                    to={`/boards/${item.id}`}
                                                    sx={{
                                                        pl: '20px',
                                                        cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                    }}
                                                >
                                                    <Typography
                                                        variant='body2'
                                                        fontWeight='700'
                                                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    >
                                                        {item.icon} {item.title}
                                                    </Typography>
                                                </ListItemButton>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </List>
        </Drawer>
    )
}

export default SliderBar