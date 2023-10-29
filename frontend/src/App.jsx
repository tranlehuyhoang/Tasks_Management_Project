import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import CssBaseLine from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeLayout from './components/layout/HomeLayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './screen/Home';
import Board from './screen/Board';
import Register from './screen/Register.jsx';
import Login from './screen/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CssBaseline } from '@mui/material';
function App() {
  const theme = createTheme({
    palette: { mode: 'light' }
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Route>
            <Route path='/' element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path='boards' element={<Home />} />
              <Route path='boards/:boardId' element={<Board />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer />
    </>

  );
}

export default App;