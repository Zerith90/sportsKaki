/**
 * GET /chat
 get the chat page
 */
exports.chat = function(req, res) {
    //if (req.user) return res.redirect('/');
    res.render('/chat', {
        title: 'Attribution Dashboard'

    })
}
