'use strict';

const datajson = require('./Movie data/data.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
// DATABASE_URL=postgres://username:password@localhost:5432/databaseName

const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;

const server = express();
server.use(cors());
server.use(express.json());

server.get('/', handleHomePage);
server.get('/favorite', handelfavorite);//empty
server.get('/trending', trendingHandler);//trend
server.get('/search', searchgHandler);//search-userSearch=The-Shawshank-Redemption-example

server.get('/changes', ChangesgHandler);//changes-API
server.get('/certification', certificationHandler);//cer-API


server.post('/addMovie', addMovie);//Post
server.get('/getMovies', getMovies);//GET


server.put('/UPDATE/:id', updateMovsHandler);//PUT
server.delete('/DELETE/:id', deleteMovsHandler);//DELETE
server.get('/getMovie/:id', getMovie);//GET

server.use('*', notFoundHandler);
server.use(errorHandler)

function Movie1(id, title, release_date, vote_average, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.overview = overview;
}

// let userSearch = "The Sahwshank"; // an input from the user 
let url1 = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
let url2 = `https://api.themoviedb.org/3/movie/changes?api_key=${process.env.APIKEY}&page=1`
let url3 = `https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.APIKEY}`


function handleHomePage(req, res) {
    res.status(200).send("Welcome :) ");
}


function handelfavorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}


function notFoundHandler(req, res) {
    res.status(404).send("This page is not found")
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        messgae: error
    }
    res.status(500).send(err);
}



function trendingHandler(req, res) {
    let newArr = [];
    axios.get(url1)
        .then((result) => {
            result.data.results.forEach(Movie => {
                newArr.push(new Movie1(Movie.id, Movie.title, Movie.release_date, Movie.vote_average, Movie.overview));
            })
            res.status(200).json(newArr);

        }).catch((err) => {
            errorHandler(err, req, res);
        })
}

function searchgHandler(req, res) {
    let newArr = [];

    let userSearch = req.query.userSearch;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}`;

    axios.get(url)
        .then(result => {
            let Movies = result.data.results.forEach(Movie => {
                newArr.push(new Movie1(Movie.id, Movie.title, Movie.release_date, Movie.vote_average, Movie.overview));
            });
            res.status(200).json(newArr);
        }).catch(err => {
            errorHandler(err, req, res);
        })
}



function ChangesgHandler(req, res) {
    let newArr = [];
    axios.get(url2).then((result) => {

        res.status(200).json(result.data);

    }).catch((err) => {
        errorHandler(err, req, res);
    })
}

function certificationHandler(req, res) {
    let newArr = [];
    axios.get(url3).then((result) => {

        res.status(200).json(result.data);

    }).catch((err) => {

    })
}



function addMovie(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO myfavmovietable( title, release_date, vote_average, overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values = [mov.title, mov.release_date, mov.vote_average, mov.overview];
    client.query(sql, values).then(data => {
        res.status(201).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}



function getMovies(req, res) {
    let sql = `SELECT * FROM myfavmovietable;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}




function updateMovsHandler(req, res) {
    const id = req.params.id;
    const Movs = req.body;
    const sql = `UPDATE myfavmovietable SET title =$1, release_date = $2, vote_average = $3 ,overview=$4  WHERE  id=$5 RETURNING *;`
    let values = [Movs.title, Movs.release_date, Movs.vote_average, Movs.overview, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}


function deleteMovsHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM myfavmovietable WHERE id=${id};`
    client.query(sql).then(() => {
        res.status(200).send("The Movies has been deleted");
    }).catch(error => {
        errorHandler(error, req, res)
    });
}



function getMovie(req, res) {
    const id = req.params.id;
    let sql = `SELECT * FROM myfavmovietable WHERE id=${id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}



client.connect().then(() => {

    server.listen(PORT, () => {

        console.log(`listining to port ${PORT}`)
    })
})
