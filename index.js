import path from 'path'
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import { writeFile, readFile} from "node:fs/promises";

// Will contain trailing slash
const __dirname = new URL('.', import.meta.url).pathname;

const ruta = path.join(__dirname + "/public/index.html")

// importar express e instanciarlo en variable app
import express from "express";
const app = express();

//Para el servicio de archivos estáticos en una carpeta definida
app.use(express.static('public'));

// activacion de middleware para enviar informacion al servidor
app.use(express.json());

// defino constante con 2 posibles valores si hay un .env y valor en PORT o sino el valor 4000
const PORT = process.env.PORT || 5000;

// levantamos el servidor
app.listen(PORT, () => {
    console.log(`Server en puerto: http://localhost:${PORT}`);
});

// ejecutando el metodo get en la ruta raiz /, que devolvera un archivo estatico index.html
app.get("/", (req, res) => {
    res.sendFile(ruta);
})

// ruta consumida desde el frontend 
// MOSTRANDO CANCIONES EN FRONT
app.get("/canciones", async (req, res) => {
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const canciones = JSON.parse(fsResponse);
    res.json(canciones);
});

// BORRANDO CANCIONES
app.delete("/canciones/:id", async (req, res) => {   
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const {id} = req.params;
    const canciones = JSON.parse(fsResponse);
    const songs = canciones.filter(item => item.id !== parseInt(id))
    await writeFile('mirepertorio.json', JSON.stringify(songs));
    res.json(songs);   
});

// AGREGANDO CANCION
app.post("/canciones", async (req, res) => {
    const {id, titulo, artista, tono} = req.body
    
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const canciones = JSON.parse(fsResponse);
    const newSong = {
        id, titulo, artista, tono
    }
    canciones.push(newSong)
    await writeFile('mirepertorio.json', JSON.stringify(canciones));
    res.json(canciones);
});

// MODIFICANDO CANCION
app.put("/canciones/:id", async (req, res) => {   
    const fsResponse = await readFile("mirepertorio.json", "utf-8");
    const {titulo, artista, tono} = req.body
    const {id} = req.params; 
    const canciones = JSON.parse(fsResponse);
    const songs = canciones.map(item => {
        if(item.id === parseInt(id)) {
            item.titulo  = titulo
            item.artista  = artista
            item.tono  = tono
        }
        return item
    })
    await writeFile('mirepertorio.json', JSON.stringify(songs));
    res.json(songs);   
});






