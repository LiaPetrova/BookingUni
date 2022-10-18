const { create, getById, update, deleteById, bookRoom } = require('../services/hotelService');
const { parseError } = require('../util/parser');

const hotelController = require('express').Router();

hotelController.get('/:id/details', async (req, res) => {
    const hotel = await getById(req.params.id);

    if(req.user._id == hotel.owner) {
        hotel.isOwner = true;
    } else if (hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
        hotel.isBooked = true;
    }

    res.render('details', {
        title: 'Hotel Details',
        hotel
    });
});

hotelController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Hotel'
    });
});

hotelController.post('/create', async (req, res) => {
    const hotel = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
        owner: req.user._id
    };

    
    try {

        if(Object.values(hotel).some(v => !v)) {
            throw new Error ('All fields are required')
        }

        await create(hotel);
        res.redirect('/');
    } catch(error) {
        const errors = parseError(error);
        res.render('create', {
            title: 'Create Hotel',
            body: hotel,
            errors
        });
    }
});

hotelController.get('/:id/edit', async (req, res) => {
    const hotel = await getById(req.params.id);

    if(req.user._id != hotel.owner) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Hotel',
        hotel
    });
});

hotelController.post('/:id/edit', async (req, res) => {
    const hotel = await getById(req.params.id);

    if(req.user._id != hotel.owner) {
        return res.redirect('/auth/login');
    }

    const edited = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
        owner: req.user._id
    };

    
    try {

        if(Object.values(edited).some(v => !v)) {
            throw new Error ('All fields are required')
        }

        await update(hotel._id, edited);
        res.redirect(`/hotel/${hotel._id}/details`);
        
    } catch(error) {
        const errors = parseError(error);
        res.render('edit', {
            title: 'Edit Hotel',
            hotel: Object.assign(edited, { _id: req.params.id}),
            errors
        });
    }
});

hotelController.get('/:id/delete', async (req, res) => {
    const hotel = await getById(req.params.id);

    if(req.user._id != hotel.owner) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
});

hotelController.get('/:id/book', async (req, res) => {
    const hotel = await getById(req.params.id);

    try {
        if(req.user._id == hotel.owner) {
        hotel.isOwner = true;
        throw new Error('Cannot book your own hotel');
        } 

        if(hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
            hotel.isBooked = true;
            throw new Error('Cannot book the same hotel twice');
        }

    await bookRoom(req.params.id, req.user._id);
    res.redirect(`/hotel/${req.params.id}/details`);

    } catch(error) {
        res.render('details', {
            title: 'Hotel Details',
            hotel,
            errors: parseError(error)
        });
    }
    
});



module.exports = hotelController;