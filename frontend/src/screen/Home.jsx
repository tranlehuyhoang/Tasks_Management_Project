import React, { useState } from 'react'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useDispatch } from "react-redux"

import { useNavigate } from "react-router-dom"
import LoadingButton from '@mui/lab/LoadingButton'
import { useCreateBoardMutation } from '../slices/boardsApiSlice'
import { setBoards } from '../slices/boardSlice'
const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [createBoard, { isLoading }] = useCreateBoardMutation();


    const createBoards = async () => {
        setLoading(true)
        try {
            const res = await createBoard().unwrap();
            dispatch(setBoards([res]))
            // navigate(`/boards/${res.id}`)
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false)
        }
    }
    return (



        <Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <LoadingButton
                variant='outlined'
                color='success'
                onClick={createBoards}
                loading={loading}
            >
                Click here to create your first board
            </LoadingButton>
        </Box>
    )
}

export default Home