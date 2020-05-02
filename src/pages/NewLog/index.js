import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Container, Breadcrumbs, Link, Typography, Paper, TextField, InputAdornment, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import moment from 'moment';
import 'moment/locale/pt-br';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import './styles.css';

export default function NewLog() {
    const history = useHistory();
    const [apiData, setData] = useState({});
    const [appsOptions, setApps] = useState([]);

    const [fieldsController, setInputText] = useState({
        data: new Date(),
        app: '',
        valor: '',
        gorjetas: '0,00',
        corridas: ''
    });

    const gorjetasFieldHandlers = {
        focus: e => {
            if (fieldsController.gorjetas === '0,00') {
                setInputText({ ...fieldsController, gorjetas: '' });
            }
        },
        blur: e => {
            if (fieldsController.gorjetas === '') {
                setInputText({ ...fieldsController, gorjetas: '0,00' });
            } else {
                let x = (typeof fieldsController.valor == 'string') ? Number(fieldsController.valor.replace(',', '.')) : fieldsController.valor;
                setInputText({ ...fieldsController, valor: (x - Number(fieldsController.gorjetas.replace(',', '.'))).toFixed(2).toString().replace('.', ',') });
            }
        },
        change: e => {
            setInputText({ ...fieldsController, gorjetas: e.target.value });
        }
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (fieldsController.app === '' || fieldsController.valor === '' || fieldsController === '') {
            return alert('Por favor, preencha todos os campos!');
        }

        const data = {
            data: (typeof fieldsController.data !== 'string') ? moment(fieldsController.data).format('YYYY/MM/DD') : fieldsController.data,
            app: fieldsController.app,
            valor: (typeof fieldsController.valor === 'string') ? Number(fieldsController.valor.replace(',', '.')) : fieldsController.valor,
            gorjetas: (typeof fieldsController.gorjetas === 'string') ? Number(fieldsController.gorjetas.replace(',', '.')) : fieldsController.gorjetas,
            corridas: (typeof fieldsController.corridas === 'string') ? Number(fieldsController.corridas) : fieldsController.corridas
        }
        
        try {
            fetch('http://localhost:3333/logs/new', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            // eslint-disable-next-line no-restricted-globals
            confirm('Ganhos registrados com sucesso!');
            history.push('/')
        } catch (e) {
            alert('Não foi possível adicionar o registro!');
        }
    }

    const getApiData = async () => {
        const response = await fetch('http://localhost:3333/');
        const data = await response.json();
        setData(data);
        return data;
    }

    useEffect(() => {
        getApiData()
            .then(data => setApps(data.apps.map(a => a.nome)));
    }, []);
    
    return (
        <Container>
            <header>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link color="inherit" href="/">Home</Link>
                    <Link color="inherit" href="/logs">Ganhos</Link>
                    <Link color="inherit" href="/logs/new">Registrar</Link>
                </Breadcrumbs>
            </header>
            <section className="newLogFormBox">
                <Paper className="newLogCard" square>
                    <Typography variant="h5" style={{ marginBottom: 30 }}>
                        Registrar Ganhos
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                className="datepicker"
                                variant="inline"
                                format="DD/MM/YYYY"
                                label="Data"
                                value={moment(fieldsController.data, 'YYYY/MM/DD')}
                                onChange={d => setInputText({ ...fieldsController, data: d.format('YYYY/MM/DD') })}
                            />
                        </MuiPickersUtilsProvider>
                        
                        <Autocomplete 
                            options={appsOptions}
                            getOptionLabel={o => o}
                            freeSolo
                            value={" "}
                            onChange={(e, val) => setInputText({ ...fieldsController, app: val })}
                            renderInput={params => <TextField {...params} label="App" />}
                        />
                    
                        <TextField
                            label="Valor"
                            value={fieldsController.valor}
                            onChange={e => setInputText({ ...fieldsController, valor: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />
                        
                        <TextField
                            id="gorjetas"
                            label="Gorjetas"
                            value={fieldsController.gorjetas}
                            helperText="Digite o valor total no campo anterior e depois a gorjeta. O calculo é automático."
                            onFocus={gorjetasFieldHandlers.focus}
                            onBlur={gorjetasFieldHandlers.blur}
                            onChange={gorjetasFieldHandlers.change}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />

                        <TextField
                            id="corridas"
                            label="Corridas"
                            onChange={e => setInputText({ ...fieldsController, corridas: e.target.value })}
                        />
                        
                        <Button variant="contained" color="primary" type="submit">
                            Enviar
                        </Button>
                    </form>
                </Paper>
            </section>
        </Container>
    );
}