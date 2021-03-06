import React, { useState, useEffect } from 'react';

import { Paper, Typography, Avatar, Badge } from '@material-ui/core';

import Carousel from 'react-material-ui-carousel';

import moment from 'moment';
import 'moment/locale/pt-br';

const money = m => Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL'}).format(m);

export const TodayGainsCard = ({ data }) => {
    const ganhos = (data.logs || [{}]).filter(log => log.data === moment().format('YYYY-MM-DD')).reduce((s, g) => s + g.valor + g.gorjetas, 0);
    const corridas = (data.logs || [{}]).filter(log => log.data === moment().format('YYYY-MM-DD')).reduce((s, g) => s + g.corridas, 0);

    return (
        <Paper className="Card" style={{flex:0.3}} square>
            <Typography variant="h5"> Hoje </Typography>
            <div className="row" style={{alignItems: 'center'}}>
                <span>
                    <Typography variant="h6">{ money(ganhos) }</Typography>
                    <Typography variant="caption">{(corridas === 0) ? 'Nenhuma' : corridas} corrida{(corridas > 1) ? 's' : ''}</Typography>
                </span>
            </div>
        </Paper>
    );
}

export const WeekGainsCard = ({ weekData, data }) => {
    // const ganhos = (data.logs || [{}]).filter(log => moment(log.data).isBetween(moment().startOf('week').add(1, 'days'), moment())).reduce((s, g) => s + g.valor + g.gorjetas, 0);
    // const corridas = (data.logs || [{}]).filter(log => moment(log.data).isBetween(moment().startOf('week').add(1, 'days'), moment())).reduce((s, g) => s + g.corridas, 0);
    const datesArray = (data.logs || [{}]).map(l => new Date(l.data));
    const maxDate = Math.max.apply(null, datesArray)
    const todayWeekNum = ((data.logs || [{}]).filter(log => log.data === moment(maxDate).format('YYYY-MM-DD'))[0] || {}).week;

    return (
        <Carousel
            autoPlay={false}
            indicators={false}
            timeout={800}
            className="flex1"
        >
            { weekData.map(w => (
                <Paper key={`semana-${w.week}`} className="Card" style={{flex: 0.5}} square>
                    <Typography variant="h5"> 
                        {(w.week === todayWeekNum) ? 'Esta Semana' : `Semana ${w.week}`} 
                    </Typography>
                    <div className="row" style={{alignItems: 'center'}}>
                        <span>
                            <Typography variant="h6">{ money(w.ganhos) }</Typography>
                            <Typography variant="caption">{(w.corridas === 0) ? 'Nenhuma' : w.corridas} corrida{(w.corridas > 1) ? 's' : ''}</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2"> Média p/ dia </Typography>
                            <Typography variant="caption">{ money(w.media) }</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2">Qtd. dias</Typography>
                            <Typography variant="caption">{w.dias_trabalhados}</Typography>
                        </span>
                    </div>
                </Paper>
            ))}
        </Carousel>
    );
}

export const MonthGainsCard = () => {
    const thisMonth = Number(moment().format("MM"));
    const [monthData, setData] = useState([]);

    const getData = async () => {
        const response = await fetch('http://localhost:3333/month');
        const data = await response.json();
        setData(data);
    }

    useEffect(() => { getData() }, []);
    
    return (
        <Carousel
            autoPlay={false}
            indicators={false}
            timeout={800}
            className="flex1"
        >
            { monthData.map(m => (
                <Paper key={`mes-${m.mes}`} className="Card" square>
                    <Badge variant="dot" color="secondary" invisible={m.mes !== thisMonth}>
                        <Typography variant="h5">
                            {moment(m.mes, "MM").format("MMMM")}
                        </Typography>
                    </Badge>
                    <div className="row" style={{alignItems: 'center'}}>
                        <span>
                            <Typography variant="h6">{ money(m.ganhos) }</Typography>
                            <Typography variant="caption">{(m.corridas === 0) ? 'Nenhuma' : m.corridas} corrida{(m.corridas > 1) ? 's' : ''}</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2"> Média p/ dia </Typography>
                            <Typography variant="caption">{ money(m.media_dia) }</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2">Média p/ Semana</Typography>
                            <Typography variant="caption">{ money(m.media_semana) }</Typography>
                        </span>
                        <span>
                            <Typography variant="subtitle2">Qtd. dias</Typography>
                            <Typography variant="caption">{m.dias_trabalhados}</Typography>
                        </span>
                    </div>
                </Paper>
            ))}
        </Carousel>
    );
}