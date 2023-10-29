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
import LoginNew from './screen/new/LoginNew';
import RegisterNew from './screen/new/RegisterNew';
import HomeNew from './screen/new/HomeNew';
import BoardNew from './screen/new/BoardNew';
import AuthLayoutNew from './components/layout/new/AuthLayoutNew'
import HomeLayoutNew from './components/layout/new/HomeLayoutNew'
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
    // <>


    //   <BrowserRouter>
    //     <Routes>
    //       <Route path='/' element={<AuthLayoutNew />}>
    //         <Route path='/login' element={<LoginNew />} />
    //         <Route path='/register' element={<RegisterNew />} />
    //       </Route>
    //       <Route path='/' element={<HomeLayoutNew />}>
    //         <Route index element={<HomeNew />} />
    //         <Route path='boards' element={<HomeNew />} />
    //         <Route path='boards/:boardId' element={<BoardNew />} />
    //       </Route>
    //     </Routes>
    //   </BrowserRouter>

    //   <ToastContainer />
    // </>
  );
}

export default App;