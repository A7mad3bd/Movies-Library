'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const datajson = require('./Movie data/data.json');


const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;

const server = express();
server.use(cors());


server.get('/', handleHomePage);
server.get('/favorite', handelfavorite)
server.get('/trending', trendingHandler);
server.get('/changes', ChangesgHandler);
server.get('/certification', certificationHandler);
server.get('/search', searchgHandler);
server.get('/*', handelNotFound);
server.get('', handelerror);


function Movie1(id, title, release_date, vote_average, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.overview = overview;
}


let numberOfMovies = 5;
let userSearch = "The Shawshank Redemption";


let url=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}`;
let url1=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
let url2=`https://api.themoviedb.org/3/movie/changes?api_key=${process.env.APIKEY}&page=1`
let url3=`https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.APIKEY}`

function trendingHandler(req, res) {
    let newArr = [];
    axios.get(url1).then((result) => {
            console.log(result);
            result.data.results.forEach(Movie => {
                newArr.push(new Movie1(Movie.id, Movie.title, Movie.release_date, Movie.vote_average, Movie.overview));
            })
            console.log(newArr);
            res.status(400).json(newArr);

        }).catch((err) => {

        })
}
function searchgHandler(req, res) {
    let newArr = [];
   //  userSearch = "The-Shawshank-Redemption";
    axios.get(url).then((result) => {
             
            res.status(200).json(result.data);

        }).catch((err) => {

        })
}

function ChangesgHandler(req, res) {
    let newArr = [];
    axios.get(url2).then((result) => {
             
            res.status(200).json(result.data);

        }).catch((err) => {

        })
}


function certificationHandler(req, res) {
    let newArr = [];
    axios.get(url3).then((result) => {
             
            res.status(200).json(result.data);

        }).catch((err) => {

        })
}

function handelfavorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}

function handleHomePage(request, response) {
    let Movie12 = new Movie1 (datajson.id,datajson.title,  datajson.release_date,datajson.vote_average, datajson.overview);
    
    return response.status(200).json(Movie12);
 } 



function handelNotFound(req, res) {
    res.status(404).send('page not found error :/ ')
}


function handelerror(error, request, response) {

    return response.status(500).send("Sorry, something went wrong")

}



server.listen(PORT, () => {
    console.log(`listining to port ${PORT}`)
   
})




