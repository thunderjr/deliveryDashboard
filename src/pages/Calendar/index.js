import React, { useState, useEffect } from 'react';

import { Container, Breadcrumbs, Link, Typography, Paper } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import moment from 'moment';
import 'moment/locale/pt-br';

import './styles.css';

const months = [...Array(12).keys()].map(x => ({ num: x + 1, name: moment(x+1, 'MM').format('MMMM') }));

const useDaysInMonth = month => Math.abs(moment(month, 'MM').diff(moment(month + 1, 'MM'), 'days'));
const useWeeks = month => {
    const days = useDaysInMonth(month);
    const firstDay = moment(month, 'MM');
    const firstDay_DOW = (firstDay.day() === 0) ? 6 : firstDay.day() - 1;
    
    const daysArray = [...Array(days).keys()].map(i => moment(month, 'MM').add(i, 'days'));
    const qtdWeeks = Math.ceil(daysArray.length / 7);

    return [...Array(qtdWeeks).keys()].map(i => daysArray.splice(0, (i === 0) ? 7 - firstDay_DOW : 7));
}


const WeekdayLetters = () => ['S','T','Q','Q','S','S','D'].map(l => (<div className="weekDayLetters">{ l }</div>));

const WeekPlaceholder = ({ lengthOfWeek }) => [...Array(7 - lengthOfWeek).keys()].map(x => <DayCard key={`calendarDayPlaceholder-${x}`} invisible />);

const DayCard = ({ day, invisible }) => {
    return (
        <div className={`dayCard ${(invisible) ? 'hidden' : ''}`}>
            <Paper square>
                {(day || moment()).format('DD')}
            </Paper>
        </div>
    )
}

export default function Calendar() {
    const [actualMonth, setActualMonth] = useState(Number(moment().format("MM")));
    const daysInActualMonth = useDaysInMonth(actualMonth);
    const weeks = useWeeks(actualMonth);

    useEffect(() => {
        // console.log(weeks.map(w => w.map(d => d.format('LL'))))
    }, [weeks]);

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