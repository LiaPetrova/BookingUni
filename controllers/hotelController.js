const hotelController = require('express').Router();

hotelController.get('/:id/details', (req, res) => {
    res.render('details', {
        title: 'Hotel Details'
    });
});

hotelController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Hotel'
    });
});

hotelController.post('/create', async (req, res) => {

});

hotelController.get('/:id/edit', async (req, res) => {
    res.render('edit', {
        title: 'Edit Hotel'
    });
});

hotelController.post('/:id/edit', async (req, res) => {

});



module.exports = hotelController;