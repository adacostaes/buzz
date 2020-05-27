module.exports = {
  ensureAuthenticated: function(request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    } else {
      request.flash('error_msg', 'Vous devez être connecté.')
      response.redirect('/')
    }
  },
}
