import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    reviewCount: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    originalPrice: { type: Number },
    genre: { type: String },
    isbn: { type: String },
    pages: { type: Number },
    language: { type: String },
    publishedDate: { type: Date },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
