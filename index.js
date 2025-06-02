import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import axios from 'axios';

const db = new pg.Client({
    user : '',
    host : '',
    database : '',
    password : '',
    port : '',
});

const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : true }));

db.connect();

let sort_type = 'date';

async function getBook() {
   const response = await db.query('SELECT * FROM read_book ORDER BY date DESC');
   const books = response.rows;
   return books;
};

async function getBookBy(sort) {
   const response = await db.query(`SELECT * FROM read_book ORDER BY ${sort} DESC`);
   const books = response.rows;
   return books;
};

app.get('/', async (req, res) => {
    const books = await getBookBy(sort_type);
    const date = new Date();
    
    res.render('index.ejs', {books : books});
});

app.post('/sort', async (req, res) => {
    try {
        const tyv = req.body['typev'];
        sort_type = tyv;
        res.redirect('/');
    }
    catch (error)
    {
        res.send(error);
    }    
});

app.post('/add', async (req, res) => {
    try {
        const title = req.body['bookTitle'];
        const isbn = req.body['bookISBN'];
        const description =  req.body['bookDescription'];
        const rate = req.body['bookRate'];
        const author = req.body['bookAuthor'];
        const mydate = new Date();
        const date = `${mydate.getFullYear()}-${months[mydate.getMonth()]}-${mydate.getUTCDate()}`;
        
        await db.query('INSERT INTO read_book (isbn, title, description, rate, date, author) VALUES ($1, $2, $3, $4, $5, $6);', [isbn, title, description, rate, date, author]);
        res.redirect('/');
    }
    catch (error)
    {
        res.send(error);
    }    
});

app.post('/addNote/:id', async (req, res) => {
    try {
        const note_title = req.body['noteTitle'];
        const note = req.body['bookNote'];
        const book_id =  req.params.id;
        const mydate = new Date();
        const date = `${mydate.getFullYear()}-${months[mydate.getMonth()]}-${mydate.getUTCDate()}`;
        
        await db.query('INSERT INTO notes (note_title, note, book_id, date) VALUES ($1, $2, $3, $4);', [note_title, note, book_id, date]);
        res.redirect(`/book/${book_id}`);
    }
    catch (error)
    {
        res.send(error);
    }    
});

app.get('/book/:id',  async (req, res) => {
    const book_id = parseInt(req.params.id);
    const result = await db.query('SELECT * FROM read_book WHERE id = $1;', [book_id]);
    const book = result.rows[0];

    const response = await db.query('SELECT * FROM notes WHERE book_id = $1', [book_id]);
    const notes =  response.rows;

    res.render('book.ejs', {book : book, notes : notes });
});

app.post('/book_edit/:id', async (req, res) => {
    const book_id = parseInt(req.params.id);
    const title = req.body['bookTitle'];
    const isbn = req.body['bookISBN'];
    const description =  req.body['bookDescription'];
    const rate = req.body['bookRate'];
    const author = req.body['bookAuthor'];
    await db.query('UPDATE read_book SET isbn = $1, title = $2, description = $3, rate = $4, author = $5 WHERE id = $6', [isbn, title, description, rate, author, book_id]);

    res.redirect(`/book/${book_id}`);
});

app.post('/editNote/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const note_title = req.body['noteTitle'];
        const note = req.body['bookNote'];
        const book_id =  req.body.book_id;

        await db.query('UPDATE notes SET note_title = $1, note = $2 WHERE id = $3', [note_title, note, id]);
        res.redirect(`/book/${book_id}`);
    }
    catch (error)
    {
        res.send(error);
    }    
});

app.post('/book_delete/:id', async (req, res) => {
    try {
        const book_id = req.params.id;
        await db.query('DELETE FROM read_book WHERE id = $1;', [book_id]);
        res.redirect('/');

    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/note_delete/:id', async (req, res) => {
    try {
        const book_id = req.body.book_id;
        const note_id = req.params.id;
        await db.query('DELETE FROM notes WHERE id = $1;', [note_id]);
        res.redirect(`/book/${book_id}`);

    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, (req, res) => {
    console.log('This is working');
})