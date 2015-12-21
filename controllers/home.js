/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
    res.render('./chat', {
        title: 'Home'
    });
};
