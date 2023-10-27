import React, { useEffect, useState } from 'react'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"

import { useNavigate } from "react-router-dom"
import LoadingButton from '@mui/lab/LoadingButton'
import { useCreateBoardMutation } from '../slices/boardsApiSlice'
import { setBoards } from '../slices/boardSlice'
import { toast } from 'react-toastify'
const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false)

    const [createBoard, { isLoading }] = useCreateBoardMutation();


    const createBoards = async () => {
        setLoading(true)
        try {
            const res = await createBoard().unwrap();
            dispatch(setBoards([res]))
            navigate(`/boards/${res.id}`)
        } catch (err) {
            toast.error(err?.data?.message || err.error);
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