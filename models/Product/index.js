
const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const productSchema = new Schema({
    productId: {
        type: Number,
        index: true,
    },
    productName: {
        type: String,
        required: true,
    },

}, { timestamps: true })

productSchema.plugin(MongooseSequence, {inc_field: 'productId'});

module.exports = Product = mongoose.model('Product', productSchema);