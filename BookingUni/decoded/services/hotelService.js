const Hotel = require("../models/Hotel");

async function getAll() {
    return Hotel.find({}).lean();
}

async function getById(hotelId) {
    return Hotel.findById(hotelId).lean();
}

async function create(hotel) {
    return await Hotel.create(hotel);
}

async function update(hotelId, hotel) {
    const existing = await Hotel.findById(hotelId);

    
        existing.name = hotel.name;
        existing.city = hotel.city;
        existing.imageUrl = hotel.imageUrl;
        existing.rooms = hotel.rooms;
    

    await existing.save();
}

async function deleteById (hotelId) {
    await Hotel.findByIdAndRemove(id);
}

async function bookRoom(hotelId, userId) {
    const hotel =  await Hotel.findById(hotelId);
    
    if(hotel.bookings.includes(userId)) {
        throw new Error('Cannot book the same hotel twice');
    }

    hotel.bookings.push(userId);
    await hotel.save();
}

async function getByUserBooking (userId) {
    return Hotel.find({ bookings: userId}).lean();
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    bookRoom,
    getByUserBooking
};