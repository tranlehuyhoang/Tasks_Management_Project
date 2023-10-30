import { Box, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { setFavoriteList } from '../../slices/boardFavoriteSlice'
import { useGetFavouritesMutation, useUpdateFavouritePositionMutation } from '../../slices/boardsApiSlice'
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify'
import Home from '@mui/icons-material/Home'
import ArrowRight from '@mui/icons-material/ArrowRight'
const FavouriteList = () => {
    const dispatch = useDispatch()
    const list = useSelector((state) => state.favorite.value)
    const [activeIndex, setActiveIndex] = useState(0)
    const { boardId } = useParams()
    const [getFavourites] = useGetFavouritesMutation();
    const [updateFavouritePosition] = useUpdateFavouritePositionMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await getFavourites().unwrap();
                console.log(res)
                dispatch(setFavoriteList(res))
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
        getBoards()
    }, [])

    useEffect(() => {
        const index = list.findIndex(e => e.id === boardId)
        setActiveIndex(index)
    }, [list, boardId])

    const onDragEnd = async ({ source, destination }) => {
        const newList = [...list]
        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        const activeItem = newList.findIndex(e => e.id === boardId)
        setActiveIndex(activeItem)

        dispatch(setFavoriteList(newList))

        try {
            await updateFavouritePosition({ boards: newList })
        } catch (err) {
            alert(err)
        }
    }
    return (
        <>
            <ListItem>
                <Box sx={{
                    width: '100%',
                    display: 'flex',


                }}>
                    <ListItem component="div" disablePadding>
                        <ListItemButton sx={{ height: 56 }}>
                            <ListItemIcon>
                                <Home color="error" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Favourite "
                                primaryTypographyProps={{
                                    color: 'white',
                                    fontWeight: 'medium',
                                    variant: 'body2',
                                }}
                            />
                        </ListItemButton>
                        <Tooltip title="Starred">
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
                                <StarIcon fontSize='small' style={{ color: 'yellow' }} />

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
                                list.map((item, index) => (
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
        </>
    )
}

export default FavouriteList
