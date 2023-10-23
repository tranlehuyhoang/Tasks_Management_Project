import React, { useState } from 'react'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
const Home = () => {
    const [loading, setLoading] = useState(false)
    const createBoard = async () => {
        setLoading(true)

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
                onClick={createBoard}
                loading={loading}
            >
                Click here to create your first board
            </LoadingButton>
        </Box>
    )
}

export default Home