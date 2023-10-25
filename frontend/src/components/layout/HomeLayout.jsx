import { useEffect, useState } from 'react';
import React from 'react'
import Loading from '../common/Loading';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import assets from '../../assets/index.js';
import SliderBar from '../common/SliderBar'
import { useDispatch, useSelector } from 'react-redux';
const HomeLayout = () => {


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth);
    // navigate('/login');
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