# Esercitazione Finale - JAC Curvatura Cloud
## OBIETTIVO
Realizzare un'API di una libreria con le seguenti caratteristiche:
- Login tramite email e password con diversi livelli di ruoli e autorizzazioni (sola lettura, lettura e scrittura);
- Possibilità di visualizzare un elenco di libri;
- Possibilità di filtrare tramite codice isbn, titolo e numero di pagine, insieme al filtraggio dell'ordine (ASC o DESC);
- Possibilità di visualizzazione degli acquirenti di ogni libro.
- Possibilità di aggiunta nuovi libri, aggiornamento di libri esistenti (es. numero totale di vendite), eliminazione e aggiunta nuovi acquirenti.

## STACK RICHIESTO
- NodeJS
- Express
- MongoDB

### JSON di esempio da utilizzare per la strutturazione del database e dei dati:
```json
[
    {
        "isbn":"9781593279509",
        "title":"Eloquent JavaScript, Third Edition",
        "subtitle":"A Modern Introduction to Programming",
        "author":"Marijn Haverbeke",
        "publisher":"No Starch Press",
        "pages":472,
        "description":"JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
        "purchases":100,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781491943533",
        "title":"Practical Modern JavaScript",
        "subtitle":"Dive into ES6 and the Future of JavaScript",
        "author":"Nicolás Bevacqua",
        "publisher":"O'Reilly Media",
        "pages":334,
        "description":"To get the most out of modern JavaScript, you need learn the latest features of its parent specification, ECMAScript 6 (ES6). This book provides a highly practical look at ES6, without getting lost in the specification or its implementation details.",
        "purchases":145,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781593277574",
        "title":"Understanding ECMAScript 6",
        "subtitle":"The Definitive Guide for JavaScript Developers",
        "author":"Nicholas C. Zakas",
        "publisher":"No Starch Press",
        "pages":352,
        "description":"ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.",
        "purchases":745,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781449365035",
        "title":"Speaking JavaScript",
        "subtitle":"An In-Depth Guide for Programmers",
        "author":"Axel Rauschmayer",
        "publisher":"O'Reilly Media",
        "pages":460,
        "description":"Like it or not, JavaScript is everywhere these days -from browser to server to mobile- and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.",
        "purchases":396,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781449331818",
        "title":"Learning JavaScript Design Patterns",
        "subtitle":"A JavaScript and jQuery Developer's Guide",
        "author":"Addy Osmani",
        "publisher":"O'Reilly Media",
        "pages":254,
        "description":"With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
        "purchases":120,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9798602477429",
        "title":"You Don't Know JS Yet",
        "subtitle":"Get Started",
        "author":"Kyle Simpson",
        "publisher":"Independently published",
        "pages":143,
        "description":"The worldwide best selling You Don't Know JS book series is back for a 2nd edition: You Don't Know JS Yet. All 6 books are brand new, rewritten to cover all sides of JS for 2020 and beyond.",
        "purchases":965,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781484200766",
        "title":"Pro Git",
        "subtitle":"Everything you neeed to know about Git",
        "author":"Scott Chacon and Ben Straub",
        "publisher":"Apress; 2nd edition",
        "pages":458,
        "description":"Pro Git (Second Edition) is your fully-updated guide to Git and its usage in the modern world. Git has come a long way since it was first developed by Linus Torvalds for Linux kernel development. It has taken the open source world by storm since its inception in 2005, and this book teaches you how to use it like a pro.",
        "purchases":223,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    },
    {
        "isbn":"9781484242216",
        "title":"Rethinking Productivity in Software Engineering",
        "subtitle":"",
        "author":"Caitlin Sadowski, Thomas Zimmermann",
        "publisher":"Apress",
        "pages":310,
        "description":"Get the most out of this foundational reference and improve the productivity of your software teams. This open access book collects the wisdom of the 2017 \"Dagstuhl\" seminar on productivity in software engineering, a meeting of community leaders, who came together with the goal of rethinking traditional definitions and measures of productivity.",
        "purchases":874,
        "buyers": [
            {
                "first_name":"Mario",
                "last_name":"Rossi",
                "email":"mario.rossi@example.com"
            },
            {
                "first_name":"Luigi",
                "last_name":"Rossi",
                "email":"luigi.rossi@example.com"
            }
        ]
    }
]
```
# Svolgimento

## MongoDB
### Struttura Database
- libreria_api
    - books
        - books_data
    - users
        - user_data


### - books
```json
[{
  "_id": {
    "$oid": "645e3734da61d3953c7da70d"
  },
  "isbn": "9781593279509",
  "title": "Eloquent JavaScript, Third Edition",
  "subtitle": "A Modern Introduction to Programming",
  "author": "Marijn Haverbeke",
  "publisher": "No Starch Press",
  "pages": 472,
  "description": "JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
  "purchases": 100,
  "buyers": [
    {
      "first_name": "Mario",
      "last_name": "Rossi",
      "email": "mario.rossi@example.com"
    },
    {
      "first_name": "Luigi",
      "last_name": "Rossi",
      "email": "luigi.rossi@example.com"
    }
  ]
}]
```
### - users
```json
[{
  "_id": {
    "$oid": "645dfb6d603fefac176165e1"
  },
  "email": "admin@admin.com",
  "password": "$2b$10$h/nL/F9WuxGZTHwRXKYpNOMI8zbErzKDMyCWicHwUjxY./X6JISxK",
  "role": "admin",
  "stats": {
    "numberOfRequests": 145,
    "lastRequest": {
      "$numberLong": "1683905559970"
    }
  }
},{
  "_id": {
    "$oid": "645e04bca57f7ef54ed3bd1c"
  },
  "email": "test@test.com",
  "password": "$2b$10$xh8z1rt16EyFQDJFsq8Ix.HLKMYbwOoG1HmGAAFpIt3voPXNaQUR2",
  "role": "user",
  "stats": {
    "numberOfRequests": 4,
    "lastRequest": {
      "$numberLong": "1683884027276"
    }
  }
}]
```

## Endpoints Implementati

### `/user/`
 - POST `/user/login`
 - POST `/user/register`
 - GET `/user/:email`
 - POST `/user/:email`
 - DELETE `/user/:email`

 ### `/books/`
 - GET `/books`
 - GET `/books/:isbn`
 - POST `/books`
 - POST `/books/:isbn`
 - DELETE `/books/:isbn`

### `/books/:isbn/buyers`
- GET `/books/:isbn/buyers`
- GET `/books/:isbn/buyers/:email`
- POST `/books/:isbn/byers`
- POST `/books/:isbn/buyers/:email`
- DELETE `/books/:isbn/byers/:email`
