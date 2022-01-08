const mongoose =require('mongoose');
const expenseSchema = new mongoose.Schema({
    name: String
});

module.exports = new mongoose.model('expense', expenseSchema);