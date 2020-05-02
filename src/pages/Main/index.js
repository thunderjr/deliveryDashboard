import React, { useState, useEffect } from 'react';

import { Container, Breadcrumbs, Select, MenuItem, Paper, Link, Typography, Avatar } from '@material-ui/core';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { TodayGainsCard, WeekGainsCard, MonthGainsCard } from './cards';

import './styles.css';

const money = m => Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL'}).format(m);

export default function Main() {
    const [periodo, setPeriodo] = useState("all");
    const [apiData, setData] = useState({});
    const [weekData, setWeekData] = useState([]);

    const getData = async () => {
        const response = await fetch('http://localhost:3333/');
        const data = await response.json();
        setData(data);
    }

    const getWeekData = async () => {
        const response = await fetch('http://localhost:3333/week');
        const data = await response.json();
        setWeekData(data);
    }

    useEffect(() => {
        getData();
        getWeekData();
    }, []);

    return (
        <Container>
            {/* HEADER */}
            <header>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link color="inherit" href="/">Home</Link>
                </Breadcrumbs>
                <Typography variant="h5">
                    Resumo de Ganhos
                </Typography>
            </header>
            {/* Fim HEADER */}
            
            {/* Linha Resumo */}
            <section className="row resumeRow">
                <TodayGainsCard data={apiData} />
                <WeekGainsCard data={apiData} weekData={weekData} />
                <MonthGainsCard />
            </section>
            {/* Fim Linha Resumo */}
            
            {/* Resto do conteúdo */}
            <section className="allTimeData">
                <Paper className="Card" square>
                    <Typography variant="h4" gutterBottom>All Time Data</Typography>
                    <Typography variant="h6"> Ganhos </Typography>
                    <div className="row" style={{alignItems: 'center', marginBottom: 20}}>
                        <span>
                            <Typography variant="h6">{ money(apiData.ganhos) }</Typography>
                            <Typography variant="caption">{apiData.corridas} corridas</Typography>
                        </span>
                        <Avatar id="moneyAvatar">$</Avatar>
                    </div>
                    <div className="row">
                        <span>
                            <Typography variant="subtitle2"> Média p/ Dia </Typography>
                            <Typography variant="h6">{ money(apiData.mediaDia) }</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2"> Dias Trabalhados </Typography>
                            <Typography variant="h6">{ apiData.qtdDias }</Typography>
                        </span>
                    </div>
                </Paper>
            </section>
        </Container>
    );
}