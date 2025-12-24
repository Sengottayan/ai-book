import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category
        ? { category: req.query.category }
        : {};

    const featured = req.query.featured
        ? { featured: true }
        : {};

    const bestseller = req.query.bestseller
        ? { bestseller: true }
        : {};

    const books = await Book.find({ ...keyword, ...category, ...featured, ...bestseller });
    res.json(books);
});

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        await Book.deleteOne({ _id: book._id });
        res.json({ message: 'Book removed' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
    const book = new Book({
        title: 'Sample name',
        price: 0,
        user: req.user._id,
        coverImage: '/images/sample.jpg',
        category: 'Sample category',
        stock: 0,
        rating: 0,
        reviewCount: 0,
        description: 'Sample description',
        author: 'Sample Author'
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
    const {
        title,
        price,
        description,
        coverImage,
        category,
        stock,
        author,
        featured,
        bestseller
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        book.title = title;
        book.price = price;
        book.description = description;
        book.coverImage = coverImage;
        book.category = category;
        book.stock = stock;
        book.author = author;
        book.featured = featured;
        book.bestseller = bestseller;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Create new review
// @route   POST /api/books/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        const alreadyReviewed = book.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Book already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        book.reviews.push(review);

        book.reviewCount = book.reviews.length;

        book.rating =
            book.reviews.reduce((acc, item) => item.rating + acc, 0) /
            book.reviews.length;

        await book.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

export { getBooks, getBookById, deleteBook, createBook, updateBook, createProductReview };
