'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/books', {useNewUrlParser: true, useUnifiedTopology: true});

// requiring the model AFTER running mongoose.connect -- connect to the DB before dealing with the things
const User = require('./models/User.js');

//test the server
app.get('/', (request, response) => {
  response.send('hello from the test, root/home');
});

// create routes and callbacks

// eslint-disable-next-line no-unused-vars
const firstUser = new User({
  email: 'sa3d1994@gmail.com',
  books: [
      {
          name: 'The Great Gatsby',
          description: `The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan`,
          status: 'Completed',
          image: `https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/220px-The_Great_Gatsby_Cover_1925_Retouched.jpg`,
      },
      {
          name: 'And Then There Were None',
          description: `And Then There Were None is a mystery novel by the English writer Agatha Christie, described by her as the most difficult of her books to write.It was first published in the United Kingdom by the Collins Crime Club on 6 November 1939, as Ten Little Niggers, after the children's counting rhyme and minstrel song, which serves as a major element of the plot.`,
          status: 'Completed',
          image: `https://images-na.ssl-images-amazon.com/images/I/81B9LhCS2AL.jpg`,
      },
      {
          name: 'The Alchemist',
          description: `The Alchemist (Portuguese: O Alquimista) is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller. An allegorical novel, The Alchemist follows a young Andalusian shepherd in his journey to the pyramids of Egypt, after having a recurring dream of finding a treasure there.`,
          status: 'Completed',
          image: `https://upload.wikimedia.org/wikipedia/en/c/c4/TheAlchemist.jpg`,
      }
  ]
});
// eslint-disable-next-line no-unused-vars
const secondUser = new User({
 
    email: `ms1dodo@gmail.com`,
    books: [
        {
            name: `War and Peace`,
            description: `is a novel by the Russian author Leo Tolstoy, first published serially, then published in its entirety in 1869. It is regarded as one of Tolstoy's finest literary achievements and remains an internationally praised classic of world literature.`,
            status: `Completed`,
            image: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg/220px-Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg`,
        },
        {
            name: `Taming of the shrew`,
            description: `is a comedy by William Shakespeare, believed to have been written between 1590 and 1592. The play begins with a framing device, often referred to as the induction,[a] in which a mischievous nobleman tricks a drunken tinker named Christopher Sly into believing he is actually a nobleman himself. The nobleman then has the play performed for Sly's diversion.`,
            status: `Completed`,
            image: `https://cdn2.rsc.org.uk/sitefinity/images/whatson-images/plays/2019/2427-shrew-review_play-hub-image_1440x1368.tmb-wo-720.jpg?sfvrsn=3b031421_1`,
        },
        {
            name: `Murder on the Orient Express`,
            description: ` is a work of detective fiction by English writer Agatha Christie featuring the Belgian detective Hercule Poirot. It was first published in the United Kingdom by the Collins Crime Club on 1 January 1934. In the United States, it was published on 28 February 1934,under the title of Murder in the Calais Coach, by Dodd, Mead and Company.`,
            status: `not completed`,
            image: `https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Murder_on_the_Orient_Express_First_Edition_Cover_1934.jpg/220px-Murder_on_the_Orient_Express_First_Edition_Cover_1934.jpg`,
        }
    ]
});

app.get('/users', (request, response) => {
  // console.log(User.find({}));
  User.find((err, userResults) => {
    // console.log(userResults);
    response.send(userResults);
  });
});

app.get('/books', (request, response) => {
  User.find({email: request.query.email}, (err, bookResults) => {
    if(err) return console.error(err);
    else response.status(200).send(bookResults);
    // console.log('my RSPN',bookResults);
  });
});

// book creation
app.post('/books', (request, response) => {
  console.log(request.body);
  User.find({email: request.body.email}, (err, usersData) => {
    if (usersData < 1) {
      response.status(400).send('User does not exist');
    } else {
      let user = usersData[0];
      user.books.push({
        name: request.body.name,
        description: request.body.description,
        status: request.body.status
      });
      user.save().then( (usersData) => {
        console.log(usersData);
        response.send(usersData.books);
      }).catch(err => {
        response.status(500).send(err);
      });
    }
  });
});

app.delete('/books/:id', (request, response) => {
  // console.log('In request.query', request.query);
  let email = request.query.user;
  User.find({email: email}, (err, usersData) => {
    let user = usersData[0];
    // console.log(user);
    user.books = user.books.filter(book => `${book._id}` !== request.params.id);
    // console.log(user.books);
    user.save().then( (usersData) => {
      response.send(usersData.books);
    }).catch(err => {
      response.status(500).send(err);
    });
  });
});

app.put('/books/:id', (request, response)=>{
  console.log(request.body);
  let {email} = request.body;
  User.find({email: email}, (err,usersData)=>{
    let bookId = request.params.id;
    let user = usersData[0];
    user.books.forEach( book => {
      if(`${book._id}` === bookId){
        book.name = request.body.name;
        book.description = request.body.description;
        book.status = request.body.status;
      }
    });
    user.save().then(savedUsersData => {
      console.log('savedUserData: ',savedUsersData);
      response.status(200).send(savedUsersData.books);
    });
  });
});

app.listen(PORT, ()=> console.log(`server listens on PORT:${PORT}`));
