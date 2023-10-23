import { Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
const Register = () => {


    const [usernameErrText, setUsernameErrText] = useState('')
    const [passwordErrText, setPasswordErrText] = useState('')
    const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (passwordErrText !== confirmPasswordErrText) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await register({ username: usernameErrText, password: passwordErrText }).unwrap();

                dispatch(setCredentials({ ...res }));
                navigate('/login');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
        setUsernameErrText('')
        setPasswordErrText('')
        setConfirmPasswordErrText('')

    }

    return (
        <>
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
                    value={usernameErrText}
                    disabled={isLoading}
                    error={usernameErrText !== ''}
                    helperText={usernameErrText}
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
                    disabled={isLoading} value={passwordErrText}
                    error={passwordErrText !== ''}
                    helperText={passwordErrText} onChange={e => setPasswordErrText(e.target.value)}
                />
                <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    disabled={isLoading}
                    value={confirmPasswordErrText}
                    error={confirmPasswordErrText !== ''}
                    helperText={confirmPasswordErrText} onChange={e => setConfirmPasswordErrText(e.target.value)}
                />
                <LoadingButton
                    sx={{ mt: 3, mb: 2 }}
                    variant='outlined'
                    fullWidth
                    color='success'
                    type='submit'
                    loading={isLoading}
                >
                    Signup
                </LoadingButton>
            </Box>
            <Button
                component={Link}
                to='/login'
                sx={{ textTransform: 'none' }}
            >
                Already have an account? Login
            </Button>
        </>
    )
}

export default Register