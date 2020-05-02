const express = require("express");
const con = require('./connection'); // mysql connection pool

const moment = require('moment');

const routes = express.Router();


routes.get("/", (request, response) => {
    const { data, app } = request.query;
    const query =
        `SELECT * FROM gains_logs
            ${(data && data !== '') ? `WHERE data='${data}'` : ''}
            ${(app && app !== '') ? `WHERE app='${app}'` : ''}
        `;
    
    con.query(query, (err, results) => {
        if (err) throw err;

        const corridas = results.reduce((s, x) => s + x.corridas, 0);
        const ganhos = Number(results.reduce((s, x) => s + x.valor + x.gorjetas, 0).toFixed(2));
        
        const qtdDiasTrabalhados = [...new Set(results.map(x => x.data))].length;
        const mediaDia = Number((ganhos / qtdDiasTrabalhados).toFixed(2));

        const apps = [...new Set(results.map(x => x.app))];
        const appsData = apps.map(app => ({ 
            nome: app,
            corridas: results.filter(y => y.app === app).reduce((s, x) => s + x.corridas, 0),
            ganhos: Number(results.filter(y => y.app === app).reduce((s, x) => s + x.valor + x.gorjetas, 0).toFixed(2))
        }));
        
        response.json({
            ...(app === undefined && { apps: appsData }),
            ...(data === undefined && { mediaDia }),
            ...(data === undefined && { qtdDias: qtdDiasTrabalhados }),
            corridas,
            ganhos,
            logs: results
        });
    });
});

// week resume
routes.get("/week", (request, response) => {
    con.query("SELECT SUM(valor + gorjetas) as ganhos, SUM(corridas) as corridas , COUNT(DISTINCT data) as dias_trabalhados, ROUND(SUM(valor+gorjetas) / COUNT(DISTINCT data), 2) as media, week FROM gains_logs GROUP BY week ORDER BY week DESC", (err, results) => {
        response.json(results);
    });
});

routes.get("/month", (request, response) => {
    con.query("SELECT SUM(valor + gorjetas) as ganhos, SUM(corridas) as corridas, COUNT(DISTINCT data) as dias_trabalhados, ROUND(SUM(valor+gorjetas) / COUNT(DISTINCT data), 2) as media, CAST(SUBSTRING(data, 6, 2) as SIGNED) as mes FROM gains_logs GROUP BY mes ORDER BY mes DESC", (err, results) => {
        response.json(results);
    });
});

routes.post("/logs/new", (request, response) => {
    const { data, app, valor, gorjetas, corridas } = request.body;
    
    /* week calc
     * if (data) is between last_item.data and last_item End of Week THEN same week as last item
     * else week = last_item.week + 1
     */ 
    con.query("SELECT data, week FROM gains_logs WHERE data=(SELECT MAX(data) FROM gains_logs) LIMIT 1", (err, weekResult) => {
        if (err) throw err;
        const week = (moment(data, "YYYY/MM/DD").isBetween(moment(weekResult[0].data), moment(weekResult[0].data).endOf('week').add(1, 'days'), null, "[]")) ? weekResult[0].week : weekResult[0].week + 1;
        const query = `INSERT INTO gains_logs (data, app, valor, gorjetas, corridas, week) VALUES ('${data}', '${app}', ${valor}, ${gorjetas}, ${corridas}, ${week})`;
        con.query(query, (err, results) => {
            if (err) throw err;
            response.status(204).send();
        });
    })
})

module.exports = routes;