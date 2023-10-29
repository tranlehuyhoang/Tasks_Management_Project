import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOneMutation, useUpdateMutation, useDeleteBoardMutation } from '../slices/boardsApiSlice'
import EmojiPicker from '../components/common/EmojiPicker'
import { setBoards } from '../slices/boardSlice'
import { setFavoriteList } from '../slices/boardFavoriteSlice'
import Loading from '../components/common/Loading'
import Kanban from '../components/common/Kanban'
import { toast } from 'react-toastify'
let timer
const timeout = 500
const Board = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { boardId } = useParams()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [sections, setSections] = useState([])
    const [isFavourite, setIsFavourite] = useState(false)
    const [icon, setIcon] = useState('')

    const boards = useSelector((state) => state.board.value)
    const { userInfo } = useSelector((state) => state.auth);
    const favouriteList = useSelector((state) => state.favorite.value)
    const [getOne, { isLoading: getOneIsLoading }] = useGetOneMutation();
    const [deleteBoard, { isLoading: deleteBoardIsLoading }] = useDeleteBoardMutation();
    const [update] = useUpdateMutation();



    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = await getOne(boardId).unwrap();
                // console.log(res)
                setTitle(res.title)
                setDescription(res.description)
                setSections(res.sections)
                setIsFavourite(res.favourite)
                setIcon(res.icon)
            } catch (err) {
                navigate('/boards')
                toast.error(err?.data?.message || err.error);
            }
        }
        getBoard()

    }, [boardId])

    const onIconChange = async (newIcon) => {

        let temp = [...boards]
        const index = temp.findIndex(e => e.id === boardId)
        temp[index] = { ...temp[index], icon: newIcon }

        if (isFavourite) {
            let tempFavourite = [...favouriteList]
            const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
            tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
            dispatch(setFavoriteList(tempFavourite))
        }

        setIcon(newIcon)
        dispatch(setBoards(temp))
        try {
            await update({
                icon: newIcon,
                boardId: boardId
            })
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const updateTitle = async (e) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        setTitle(newTitle)

        let temp = [...boards]
        const index = temp.findIndex(e => e.id === boardId)
        temp[index] = { ...temp[index], title: newTitle }

        if (isFavourite) {
            let tempFavourite = [...favouriteList]
            const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
            tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
            dispatch(setFavoriteList(tempFavourite))
        }

        dispatch(setBoards(temp))

        timer = setTimeout(async () => {
            try {
                await update({
                    boardId: boardId,
                    title: newTitle
                })
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }, timeout);
    }

    const updateDescription = async (e) => {
        clearTimeout(timer)
        const newDescription = e.target.value
        setDescription(newDescription)
        timer = setTimeout(async () => {
            try {
                await update({ boardId: boardId, description: newDescription })
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }, timeout);
    }

    const addFavourite = async () => {
        try {
            const board = await update({ boardId: boardId, favourite: !isFavourite }).unwrap()
            let newFavouriteList = [...favouriteList]
            if (isFavourite) {
                newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
            } else {
                newFavouriteList.unshift(board)
            }
            dispatch(setFavoriteList(newFavouriteList))
            setIsFavourite(!isFavourite)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const deleteBoards = async () => {
        try {
            await deleteBoard(boardId).unwrap();
            if (isFavourite) {
                const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
                dispatch(setFavoriteList(newFavouriteList))
            }

            const newList = boards.filter(e => e.id !== boardId)
            if (newList.length === 0) {
                navigate('/boards')
            } else {
                navigate(`/boards/${newList[0].id}`)
            }
            dispatch(setBoards(newList))
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    return (

        getOneIsLoading || deleteBoardIsLoading ? (
            <Loading />
        ) : (
            <>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',

                }}>
                    <IconButton variant='outlined' onClick={addFavourite}>
                        {
                            isFavourite ? (
                                <StarOutlinedIcon color='warning' />
                            ) : (
                                <StarBorderOutlinedIcon />
                            )
                        }
                    </IconButton>
                    <EmojiPicker icon={icon} onChange={onIconChange} />
                    <TextField
                        value={title}
                        onChange={updateTitle}
                        placeholder='Untitled'
                        variant='outlined'
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                            '& .MuiOutlinedInput-root': { fontSize: '20px', fontWeight: '700' }
                        }}
                    />
                    <IconButton variant='outlined' color='error' onClick={deleteBoards}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                </Box>
                <Box sx={{ padding: '10px 50px' }}>
                    <Box>
                        {/* emoji picker */}

                        <TextField
                            value={description}
                            onChange={updateDescription}
                            placeholder='Add a description'
                            variant='outlined'
                            multiline
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-input': { padding: 0 },
                                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                                '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
                            }}
                        />
                    </Box>
                    <Box>
                        <Kanban boardId={boardId} data={sections} />
                    </Box>
                </Box>
            </>
        )

    )
}

export default Board