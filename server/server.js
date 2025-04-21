import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs/promises"
import express from "express"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const PORT  = 4500;
app.use(express.json())
app.use(express.static(path.join(__dirname, "../client")));



//GET
app.get(`/movies`, async (req, res)=>{
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)))
    return res.json(movies)
})
app.get("/movies/:id", async (req, res) => {
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)));

    const movie = movies.find(movie => movie.title === decodeURIComponent(req.params.id));

    return res.json(movie)
    
})

//Create
app.post(`/movies`, async (req, res)=>{
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)))
    const incomingMovie = req.body
    movies.push(incomingMovie)

    await fs.writeFile((path.join(__dirname, "../data/data.json")), JSON.stringify(movies, null, 2))

    return res.status(201).json(`Movie created.`).end()
})

app.put(`/movies/:id`, async (req, res)=>{
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)))
    const incomingMovie = req.body
    const title = decodeURI(req.params.id)
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].title === title) {
            movies[i] = incomingMovie
        }
    }
    
    await fs.writeFile((path.join(__dirname, "../data/data.json")), JSON.stringify(movies, null, 2))
    return res.status(200).json(title).end()
})

app.patch(`/movies/:id`, async (req, res)=>{
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)))
    const title = decodeURI(req.params.id)
    
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].title === title) {
            const updatedMovie = Object.assign(movies[i], req.body)
            movies[i]=updatedMovie
        }
    }
    
    await fs.writeFile((path.join(__dirname, "../data/data.json")), JSON.stringify(movies, null, 2))
    return res.status(200).json(title).end()


})

app.delete(`/movies/:id`, async (req, res)=>{
    const movies = JSON.parse(await fs.readFile(path.join(__dirname, `../data/data.json`)))
    const title = decodeURI(req.params.id)
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].title === title) {
            movies.splice(i, 1);
        }
    }
    await fs.writeFile((path.join(__dirname, "../data/data.json")), JSON.stringify(movies, null, 2))
    return res.status(200).json(title).end()

})
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
  });























app.listen(8080, () => {
    console.log("Server listens on port: 8080")
})