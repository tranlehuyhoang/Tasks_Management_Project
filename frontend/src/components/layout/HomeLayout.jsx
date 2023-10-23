import { useState } from 'react';
import React from 'react'
import Loading from '../common/Loading';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import assets from '../../assets/index.js';
import SliderBar from '../common/SliderBar'
const HomeLayout = () => {
    const [loading, setLoading] = useState(false);

    return (
        loading ? (
            <Loading fullHeight />
        ) : (
            <Box sx={{
                display: 'flex'
            }}>
                <SliderBar />
                <Box sx={{
                    flexGrow: 1,
                    p: 1,
                    width: 'max-content'
                }}>
                    <Outlet />
                </Box>
            </Box>
        )
    )

}

export default HomeLayout