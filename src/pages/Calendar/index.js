import React, { useState, useEffect } from 'react';

import { Container, Breadcrumbs, Link, Typography, Paper, Badge, IconButton } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import moment from 'moment';
import 'moment/locale/pt-br';

import './styles.css';

const months = [...Array(12).keys()].map(x => ({ num: x + 1, name: moment(x+1, 'MM').format('MMMM') }));

const useDaysInMonth = month => Math.abs(moment(month, 'MM').diff(moment(month + 1, 'MM'), 'days'));
const useWeeks = month => {
    const days = useDaysInMonth(month);
    const firstDay = moment(month, 'MM');
    const firstDay_DOW = (firstDay.day() === 0) ? 6 : firstDay.day() - 1;
    const daysArray = [...Array((month === 12) ? 31 : days).keys()].map(i => moment(month, 'MM').add(i, 'days'));
    const qtdWeeks = Math.ceil(daysArray.length / 7);
    return [...Array(qtdWeeks).keys()].map(i => daysArray.splice(0, (i === 0) ? 7 - firstDay_DOW : 7));
}

const DayCard = ({ day, invisible }) => {
    return (
        <Badge>
            <div className={`dayCard ${(invisible) ? 'hidden' : ''}`}>
                <Paper square>
                    {(day || moment()).format('DD')}
                </Paper>
            </div>
        </Badge>
    )
}

const WeekdayLetters = () => ['S','T','Q','Q','S','S','D'].map((l, index) => (<div key={`weekCaption-${l+index}`} className="weekDayLetters">{ l }</div>));
const WeekPlaceholder = ({ lengthOfWeek }) => [...Array(7 - lengthOfWeek).keys()].map(x => <DayCard key={`calendarDayPlaceholder-${x}`} invisible />);

export default function Calendar() {
    const [actualMonth, setActualMonth] = useState(Number(moment().format("MM")));
    const daysInActualMonth = useDaysInMonth(actualMonth);
    let weeks = useWeeks(actualMonth);

    const handlePrevMonth = () => setActualMonth(Number(moment(actualMonth, 'MM').subtract(1, 'months').format('MM')));
    const handleNextMonth = () => (actualMonth === 12) ? [] : setActualMonth(Number(moment(actualMonth, 'MM').add(1, 'months').format('MM')));

    return (
        <Container>
            <header>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link color="inherit" href="/">Home</Link>
                    <Link color="inherit" href="/logs">Ganhos</Link>
                    <Link color="inherit" href="/logs/new">Registrar</Link>
                </Breadcrumbs>
                <Typography variant="h5" style={{ marginBottom: 30 }}>
                    Calendário
                </Typography>
            </header>
            <section className="body">
                <header>
                    { (actualMonth === 1) ? [] : <IconButton onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton> }
                    <Typography style={{color: "#FFFFFF71"}} variant="h3">{ moment(actualMonth, 'MM').format("MMMM").toUpperCase() }</Typography>
                    { (actualMonth === 12) ? [] : <IconButton onClick={handleNextMonth}><ChevronRightIcon /></IconButton> }
                </header>
                <div className="weeksWrapper">
                    <div className="daysWrapper">
                        <WeekdayLetters />
                    </div>
                    { weeks.map((w, wIndex) => (
                        <div key={`calendarWeek-${wIndex}`} className="daysWrapper">
                            { (wIndex === 0) ? <WeekPlaceholder lengthOfWeek={w.length} /> : [] }
                            { w.map(d => <DayCard key={`calendarDay-${d}`} day={d} />) }
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    );
}