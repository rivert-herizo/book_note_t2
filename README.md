Hello,

Welcome to this book list note app.
This app allows you to list the book you read and add note that you value important after the reading.

So this app is using node.js with the following packages

1- Express.js as backend

2- Postgre SQL for the database

3- BodyParser 

4- EJS for templating


So how to use it

1- Download the app (Go to code and download zip or you can just clone the repo) 

2- Download Node.js at https://nodejs.org/en/download

3- Install Node.js

4- Open the app in your code editor 

5- Install the necessary packages by typing the command 'npm i'

    Optional to avoid relaunching the app for every update in the code install nodemon by using the commande 'npm i -g nodemon'
    
6- Download and Install Pg admin https://www.pgadmin.org/download/pgadmin-4-windows/

7- Set up postgre sql 

8- Create a new database called 'book_list'

9- Create Tables 

    - CREATE TABLE read_book (
        id SERIAL PRIMARY KEY,
        isbn TEXT UNIQUE,
        title TEXT,
        description TEXT,
        rate TEXT,
        date TEXT,
        author TEXT
    );
    - CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        note_title TEXT,
        note TEXT,
        book_id INTEGER REFERENCES read_book(id),
        date TEXT
    );
    
10- Go to index.js and link the app to the database by filling this with your own info

const db = new pg.Client({
    user : 'postgres',
    host : "localhost",
    database : "book_list",
    password : '123Abc567..',
    port : 5432,
});

11- Launch the app with the following command if you didn't install nodemon

node index.js

or nodemon index.js if you did

12- Now enjoy reading and remember the important lines by creating some notes 
