'use strict';

const express = require('express');
const router = express.Router();

// Article model
let Article = require('../models/article');
// User model
let User = require('../models/user');


// Add Article Page
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  })
});

// Add Article submit POST route
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Article text is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user.username;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        req.flash('danger', 'Failed adding article');
        res.redirect('/');
        return;
      } else{
        req.flash('success', 'Article added!');
        res.redirect('/');
      }
    });
  }
});

// Edit article form page
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user.username){
      req.flash('danger', 'Not authorised')
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Edit Article submit POST route
router.post('/edit/:id', function(req, res){
  // Create empty object
  let article = {};
  // Add data from request body like this
  article.title = req.body.title;
  article.author = req.user.username;
  article.body = req.body.body;
  // Query object
  let query = {_id:req.params.id}
  // Use update method on our articles model, pass in query and article objects
  Article.update(query, article, function(err){
    if(err){
      req.flash('danger', 'Update failed');
      res.redirect('/');
      return;
    } else{
      req.flash('success', 'Article updated');
      res.redirect('/');
    }
  });
});





// Delete article AJAX request
// router.delete('/:id', function(req, res){
//     let query = {_id:req.params.id}
//     console.log('ba bang');
//     Article.remove(query, function(err){
//       if(err){
//         console.log(err);
//         req.flash('danger', 'Failed to delete article');
//         res.redirect('/articles/'+req.params.id);
//       }
//       console.log('deletedddd');
//       req.flash('success', 'Article deleted');
//       console.log('apres redirect');
//     });
// });


// Delete article AJAX request
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
      if(err){
        console.log(err);
        req.flash('danger', 'Failed to delete article');
                res.redirect('/articles/'+req.params.id);
      }
      req.flash('success', 'Deleted article');
      res.send('Success');
    });
});













// Get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log(err);
      req.flash('danger', 'Failed to find article');
      res.redirect('/');
    }else{
      res.render('article', {
        article: article,
        author: User.username
      });
    }
  });
});

// Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please log in');
    res.redirect('/users/login');
  }
}



module.exports = router;
