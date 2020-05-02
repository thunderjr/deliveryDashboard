import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import SideMenu from './components/SideMenu';
import Routes from './routes';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseLine from '@material-ui/core/CssBaseLine';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#90a4ae'
        }
    },
});

export default function App() {
    return (<div style={{ display: 'flex' }}>
        <ThemeProvider theme={darkTheme}>
            <CssBaseLine />
            <BrowserRouter>
                <SideMenu />
                <Routes />
            </BrowserRouter>
        </ThemeProvider>
    </div>);
}