import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOneMutation, useUpdateMutation } from '../slices/boardsApiSlice'
import EmojiPicker from '../components/common/EmojiPicker'
import { setBoards } from '../slices/boardSlice'

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

    const [getOne, { isLoading }] = useGetOneMutation();
    const [update] = useUpdateMutation();



    useEffect(() => {
        const getBoard = async () => {
            console.log(boardId)
            try {
                const res = await getOne(boardId).unwrap();
                console.log(res);
                setTitle(res.title)
                setDescription(res.description)
                setSections(res.sections)
                setIsFavourite(res.favourite)
                setIcon(res.icon)
            } catch (err) {
                console.log(err)
            }
        }
        getBoard()

    }, [boardId])

    const onIconChange = async (newIcon) => {
        let temp = [...boards]
        const index = temp.findIndex(e => e.id === boardId)
        temp[index] = { ...temp[index], icon: newIcon }

        // if (isFavourite) {
        //     let tempFavourite = [...favouriteList]
        //     const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
        //     tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
        //     dispatch(setFavouriteList(tempFavourite))
        // }

        setIcon(newIcon)
        dispatch(setBoards(temp))
        try {
            await update({
                icon: newIcon,
                boardId: boardId
            })
        } catch (err) {
            alert(err)
        }
    }

    const updateTitle = async (e) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        setTitle(newTitle)

        let temp = [...boards]
        const index = temp.findIndex(e => e.id === boardId)
        temp[index] = { ...temp[index], title: newTitle }

        // if (isFavourite) {
        //   let tempFavourite = [...favouriteList]
        //   const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
        //   tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
        //   dispatch(setFavouriteList(tempFavourite))
        // }

        dispatch(setBoards(temp))

        timer = setTimeout(async () => {
            try {
                await update({
                    boardId: boardId,
                    title: newTitle
                })
            } catch (err) {
                alert(err)
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
                alert(err)
            }
        }, timeout);
    }
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <IconButton variant='outlined'  >
                    {
                        isFavourite ? (
                            <StarOutlinedIcon color='warning' />
                        ) : (
                            <StarBorderOutlinedIcon />
                        )
                    }
                </IconButton>
                <IconButton variant='outlined' color='error'  >
                    <DeleteOutlinedIcon />
                </IconButton>
            </Box>
            <Box sx={{ padding: '10px 50px' }}>
                <Box>
                    {/* emoji picker */}

                    {/* <EmojiPicker icon={icon} />*/}
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
                            '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
                        }}
                    />
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
                    {/* Kanban board */}

                </Box>
            </Box>
        </>
    )
}

export default Board