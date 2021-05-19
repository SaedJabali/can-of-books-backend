const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const User = require('./Models/User');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('mongodb is connected!'));

// seed our books database
function bookCollection() {
    const saed = new User({
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
    const dania = new User({
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

    saed.save();
    dania.save();
}
bookCollection();
/* use save when you seed the database, comment out when you finish seeding the database */
// user.save(function (err) {
//   if (err) console.err(err);
//   else console.log('saved successfully!');
// });

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//  (request, response) => {
    app.get('/books',(request, response)=> {

        const { email } = request.query;
    
        User.find({ email : email }, function (err, result) {
            if (err) response.send('didnt work');
            // console.log(result);
            response.send(result[0]);
        });
    
    }
    )

app.post('/books', (req, res) => {
  // find the user by email
  User.find({ email: req.body.email }, (err, result) => {
    // error handling
    if (err) {
      res.status(500).send(err);
    }

    // if the user not found, send 'user does not exist' message to the frontend
    if (result.length < 1) {
      res.status(400).send('User does not exist');
    } else {
      // if the user found, add new book to that user
      console.log(req.body);
      const user = result[0];
      user.books.push({
        name: req.body.books.name,
        description: req.body.books.description,
        status: req.body.books.status,
        // image: req.body.books.image
      });
      // save the user
      user.save()
        .then(result => {
          res.send(result);
        });
    }
  });
});

app.delete('/books/:id', (req, res) => {
  // find the user by email
  console.log(req.query.email, req.params.id)
  User.find({ email: req.query.email }, (err, result) => {
    // err handling
    if (err) {
      res.status(500).send(err);
    }

    if (result.length < 1) {
      res.status(400).send('User does not exist');
    } else {
      // if the user found, delete the book
      const user = result[0];
      user.books = user.books.filter(book => `${book._id}` !== req.params.id);
      // save the user
      user.save().then(userData => {
        console.log('delete', userData);
        res.send(userData.books);
      });
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});