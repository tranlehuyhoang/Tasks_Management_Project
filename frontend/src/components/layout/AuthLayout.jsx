import React from 'react';
import { useState } from 'react';
import Loading from '../common/Loading';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import assets from '../../assets/index.js';

import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
}));


const AuthLayout = () => {
    const [loading, setLoading] = useState(false);
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));

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

                    <Outlet />
                </Box>
            </Container>
        )
    );
}

export default AuthLayout;