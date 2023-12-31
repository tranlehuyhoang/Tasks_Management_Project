import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import { logout, setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../slices/usersApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles';

const Login = () => {
    const [usernameErrText, setUsernameErrText] = useState('');
    const [passwordErrText, setPasswordErrText] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            console.log('userInfo true')
            navigate('/');
        } else {
            console.log('userInfo false')
        }
    }, [navigate, userInfo]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        e.preventDefault();
        try {
            const res = await login({ username: usernameErrText, password: passwordErrText }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));
    return (
        <>
            <Typography variant="h1" component="h2">
                Login
            </Typography>
            <Box
                component='form'
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
                noValidate
            >
                <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='username'
                    label='Username'
                    name='username'
                    disabled={isLoading}
                    helperText={usernameErrText}
                    value={usernameErrText}
                    onChange={e => setUsernameErrText(e.target.value)}
                />
                <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='password'
                    label='Password'
                    name='password'
                    type='password'
                    disabled={isLoading}
                    helperText={passwordErrText}
                    value={passwordErrText}
                    onChange={e => setPasswordErrText(e.target.value)}
                />
                <LoadingButton
                    sx={{ mt: 3, mb: 2 }}
                    variant='outlined'
                    fullWidth
                    color='success'
                    type='submit'
                    loading={isLoading}
                >
                    Login
                </LoadingButton>
            </Box>
            <Button
                component={Link}
                to='/register'
                sx={{ textTransform: 'none' }}
            >
                Don't have an account? Signup
            </Button>
        </>
    )
}

export default Login