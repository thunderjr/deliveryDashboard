import React, { useState } from 'react';

import clsx from 'clsx';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import EventIcon from '@material-ui/icons/Event';

import { Link } from 'react-router-dom';
import useStyles from './styles.js';

const AppBarPlaceholder = () => <div style={{height: 64}}></div>;

const menuItems = [
    { text: "Página Inicial", icon: (<HomeIcon />), route: '/' },
    { text: "Agenda", icon: (<EventIcon />), route: '/agenda' },
    { text: "Registrar Ganhos", icon: (<LibraryAddIcon />), route: '/logs/new' },
];

export default function SideMenu() {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(true);

    return (<>
        <AppBar position="fixed" className={classes.appBar} color="transparent">
            <Toolbar>
                <div className={classes.toggleButton} onClick={() => setExpanded(!expanded)}>
                    <MenuIcon />
                </div>
            </Toolbar>
        </AppBar>
        <Drawer 
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: expanded,
                [classes.drawerClose]: !expanded
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: expanded,
                    [classes.drawerClose]: !expanded
                })
            }}
        >
            <AppBarPlaceholder />
            <List>
                {
                    menuItems.map((item, i) => (
                        <ListItem button key={i} component={Link} to={item.route}>
                            <ListItemIcon style={{minWidth: 40}}>{ item.icon }</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))
                }
                <Divider />
            </List>
        </Drawer>
    </>);
}