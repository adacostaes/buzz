module.exports = {
  ensureNotAuthenticated: function(request, response, next) {
    if (!request.isAuthenticated()) {
      return next();
    } else {
      request.flash('error_msg', 'Vous êtes déjà connecté.')
      response.redirect('/home')
    }
  }
}
