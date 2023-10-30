import { useSelector, useDispatch } from 'react-redux';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import assets from '../../assets/index';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { setBoards } from '../../slices/boardSlice';
import { useCreateBoardMutation, useGetAllMutation, useUpdatePositionMutation } from '../../slices/boardsApiSlice';
import { logout } from '../../slices/authSlice';
import FavouriteList from './FavouriteList';
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Home from '@mui/icons-material/Home';

import { toast } from 'react-toastify'
const SliderBar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { boardId } = useParams()
    const [activeIndex, setActiveIndex] = useState(0)

    const [getAll, { isLoading }] = useGetAllMutation();
    const [updatePosition] = useUpdatePositionMutation();
    const [createBoard] = useCreateBoardMutation();
    const { userInfo } = useSelector((state) => state.auth);
    console.log(userInfo.token)



    const boardvalues = useSelector((state) => state.board.value);

    const sidebarWidth = 250
    // navigate('/login');

    const logouts = () => {
        localStorage.removeItem('userInfo')
        dispatch(logout());
        navigate('/login')
    }
    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        const getBoards = async () => {
            try {
                const res = await getAll().unwrap();

                dispatch(setBoards(res));
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
        getBoards()
    }, [userInfo])

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
            const res = await updatePosition({ boards: newList, token: userInfo.token }).unwrap();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const addBoard = async () => {
        try {
            const res = await createBoard().unwrap();
            const newList = [res, ...boardvalues]
            dispatch(setBoards(newList))
            navigate(`/boards/${res.id}`)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <Drawer
            container={window.document.body}
            variant='permanent'
            open={true}

            sx={{
                width: sidebarWidth,
                color: 'white',
                height: '100vh',
                '& > div': { borderRight: 'none' }
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: '100vh',
                    color: 'white',
                    backgroundColor: assets.colors.secondary
                }}
            >
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center', color: 'white',
                        justifyContent: 'space-between'
                    }}>

                        {userInfo != null ? (
                            <Typography variant="body2" fontWeight={700}>
                                {userInfo.name}
                            </Typography>
                        ) : (
                            <Typography variant="body2" fontWeight={700}>
                                {/* Placeholder content */}
                            </Typography>
                        )}

                        <IconButton onClick={logouts}>
                            <LogoutOutlinedIcon fontSize='small' style={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                </ListItem>
                <Box sx={{ paddingTop: '10px', color: 'white', }} />
                <FavouriteList />
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex', color: 'white',

                    }}>
                        <Divider />
                        <ListItem component="div" disablePadding>
                            <ListItemButton sx={{ height: 56 }}>
                                <ListItemIcon>
                                    <Home color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="My Board "
                                    primaryTypographyProps={{
                                        color: 'white',
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                            <Tooltip title="Add Board">
                                <IconButton
                                    size="large"
                                    sx={{
                                        '& svg': {
                                            color: 'rgba(255,255,255,0.8)',
                                            transition: '0.2s',
                                            transform: 'translateX(0) rotate(0)',
                                        },
                                        '&:hover, &:focus': {
                                            bgcolor: 'unset',
                                            '& svg:first-of-type': {
                                                transform: 'translateX(-4px) rotate(-20deg)',
                                            },
                                            '& svg:last-of-type': {
                                                right: 0,
                                                opacity: 1,
                                            },
                                        },
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            height: '80%',
                                            display: 'block',
                                            left: 0,
                                            width: '1px',
                                            bgcolor: 'divider',
                                        },
                                    }}
                                >
                                    <AddBoxOutlinedIcon onClick={addBoard} fontSize='small' style={{ color: 'white' }} />

                                    <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                                </IconButton>
                            </Tooltip>
                        </ListItem>


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
                                                        pl: '20px', color: 'white',
                                                        cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                    }}
                                                >
                                                    <Typography
                                                        variant='body2'
                                                        fontWeight='700'
                                                        sx={{ whiteSpace: 'nowrap', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis' }}
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