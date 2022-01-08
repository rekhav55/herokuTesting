const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    pdf:{
        type: String
    },
    cloudinaryImage_id: {
        type: String
    },
    cloudinaryPdf_id: {
        type: String
    }
})

module.exports = new mongoose.model('book', bookSchema);