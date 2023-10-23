import React from 'react';
import { useState } from 'react';
import Loading from '../common/Loading';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import assets from '../../assets/index.js';

const AuthLayout = () => {
    const [loading, setLoading] = useState(false);

    return (
        loading ? (
            <Loading />
        ) : (
            <Container component='main' maxWidth='xs'>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <img src={assets.images.logoDark} alt="Logo" style={{ width: '100px' }} />
                    <Outlet />
                </Box>
            </Container>
        )
    );
}

export default AuthLayout;