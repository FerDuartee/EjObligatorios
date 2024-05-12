import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';

export const collectionName = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        required: false
    }
});

productSchema.plugin(mongoosePaginateV2);

const productsModel = mongoose.model(collectionName, productSchema);

export default productsModel;