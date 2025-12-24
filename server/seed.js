import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Book from './models/Book.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const books = [
    {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        price: 499,
        originalPrice: 699,
        category: "Fiction",
        genre: "Contemporary Fiction",
        stock: 45,
        rating: 4.5,
        reviewCount: 2847,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        publishedDate: "2020-08-13",
        isbn: "978-0525559474",
        pages: 304,
        language: "English",
        featured: true,
        bestseller: true,
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. Learn how tiny changes in behavior will add up to remarkable results.",
        price: 399,
        originalPrice: 599,
        category: "Self-Help",
        genre: "Personal Development",
        stock: 120,
        rating: 4.8,
        reviewCount: 5621,
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
        publishedDate: "2018-10-16",
        isbn: "978-0735211292",
        pages: 320,
        language: "English",
        featured: true,
        bestseller: true,
    },
    {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        description: "Alicia Berenson's life is seemingly perfect. Until one evening, her husband Gabriel returns home late from work, and Alicia shoots him five times in the face.",
        price: 349,
        originalPrice: 499,
        category: "Mystery",
        genre: "Psychological Thriller",
        stock: 67,
        rating: 4.3,
        reviewCount: 3892,
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
        publishedDate: "2019-02-05",
        isbn: "978-1250301697",
        pages: 336,
        language: "English",
        featured: true,
    },
    {
        title: "Wings of Fire",
        author: "APJ Abdul Kalam",
        description: "An autobiography of one of India's most distinguished scientists and the man who led India's missile program. A story of determination and courage.",
        price: 299,
        category: "Biography",
        genre: "Autobiography",
        stock: 89,
        rating: 4.6,
        reviewCount: 4521,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        publishedDate: "1999-01-01",
        isbn: "978-8173711466",
        pages: 180,
        language: "English",
        bestseller: true,
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        description: "A magical fable about following your dream, this international bestseller has inspired millions of readers around the world.",
        price: 299,
        originalPrice: 399,
        category: "Fiction",
        genre: "Philosophical Fiction",
        stock: 156,
        rating: 4.7,
        reviewCount: 8934,
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
        publishedDate: "1988-01-01",
        isbn: "978-0062315007",
        pages: 208,
        language: "English",
        bestseller: true,
    },
    {
        title: "Five Point Someone",
        author: "Chetan Bhagat",
        description: "What not to do at IIT. The story of three friends whose lives change forever in the hallowed corridors of India's premier engineering institute.",
        price: 199,
        category: "Fiction",
        genre: "Contemporary Fiction",
        stock: 234,
        rating: 4.2,
        reviewCount: 6723,
        coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
        publishedDate: "2004-01-01",
        isbn: "978-8129135476",
        pages: 288,
        language: "English",
    },
    {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        description: "A brief history of humankind. How did our species succeed in the battle for dominance? Why did our ancestors come together to create cities and kingdoms?",
        price: 599,
        originalPrice: 799,
        category: "Non-Fiction",
        genre: "History",
        stock: 78,
        rating: 4.6,
        reviewCount: 7234,
        coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop",
        publishedDate: "2011-01-01",
        isbn: "978-0062316097",
        pages: 464,
        language: "English",
        featured: true,
    },
    {
        title: "It Ends with Us",
        author: "Colleen Hoover",
        description: "A brave and heartbreaking novel that digs its claws into you and doesn't let go, long after you've finished it.",
        price: 349,
        originalPrice: 449,
        category: "Romance",
        genre: "Contemporary Romance",
        stock: 92,
        rating: 4.4,
        reviewCount: 5123,
        coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
        publishedDate: "2016-08-02",
        isbn: "978-1501110368",
        pages: 384,
        language: "English",
        bestseller: true,
    },
    {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
        price: 449,
        originalPrice: 599,
        category: "Science Fiction",
        genre: "Hard Science Fiction",
        stock: 56,
        rating: 4.8,
        reviewCount: 3456,
        coverImage: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=400&h=600&fit=crop",
        publishedDate: "2021-05-04",
        isbn: "978-0593135204",
        pages: 496,
        language: "English",
        featured: true,
    },
    {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        description: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.",
        price: 349,
        category: "Self-Help",
        genre: "Personal Finance",
        stock: 145,
        rating: 4.7,
        reviewCount: 4892,
        coverImage: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=600&fit=crop",
        publishedDate: "2020-09-08",
        isbn: "978-0857197689",
        pages: 256,
        language: "English",
        bestseller: true,
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A portrait of the Jazz Age in all of its decadence and excess, this is the quintessential novel of the Roaring Twenties.",
        price: 199,
        category: "Fiction",
        genre: "Classic Literature",
        stock: 178,
        rating: 4.4,
        reviewCount: 9234,
        coverImage: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=600&fit=crop",
        publishedDate: "1925-04-10",
        isbn: "978-0743273565",
        pages: 180,
        language: "English",
    },
    {
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        description: "Harry Potter has no idea how famous he is. The first book in the beloved Harry Potter series.",
        price: 399,
        category: "Children's",
        genre: "Fantasy",
        stock: 234,
        rating: 4.9,
        reviewCount: 12456,
        coverImage: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400&h=600&fit=crop",
        publishedDate: "1997-06-26",
        isbn: "978-0590353427",
        pages: 309,
        language: "English",
        bestseller: true,
    },
    {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        description: "The organizing principle in this book is a dichotomy between two modes of thought: 'System 1' is fast, instinctive and emotional; 'System 2' is slower, more deliberative, and more logical.",
        price: 499,
        originalPrice: 699,
        category: "Non-Fiction",
        genre: "Psychology",
        stock: 85,
        rating: 4.6,
        reviewCount: 12543,
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
        publishedDate: "2011-10-25",
        isbn: "978-0374275631",
        pages: 499,
        language: "English",
        featured: true,
    },
    {
        title: "Educated",
        author: "Tara Westover",
        description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.",
        price: 399,
        category: "Non-Fiction",
        genre: "Memoir",
        stock: 110,
        rating: 4.7,
        reviewCount: 9876,
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
        publishedDate: "2018-02-18",
        isbn: "978-0399590504",
        pages: 334,
        language: "English",
    },
    {
        title: "The Subtle Art of Not Giving a F*ck",
        author: "Mark Manson",
        description: "A counterintuitive approach to living a good life. Manson advises us to get to know our limitations and accept them.",
        price: 299,
        originalPrice: 499,
        category: "Self-Help",
        genre: "Personal Development",
        stock: 200,
        rating: 4.4,
        reviewCount: 15678,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        publishedDate: "2016-09-13",
        isbn: "978-0062457714",
        pages: 224,
        language: "English",
        bestseller: true,
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
        price: 349,
        category: "Self-Help",
        genre: "Personal Finance",
        stock: 150,
        rating: 4.6,
        reviewCount: 22345,
        coverImage: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=600&fit=crop",
        publishedDate: "1997-04-01",
        isbn: "978-1612680194",
        pages: 336,
        language: "English",
    }
];

import Offer from './models/Offer.js';

const importData = async () => {
    try {
        await Book.deleteMany();
        await User.deleteMany();
        await Offer.deleteMany();

        await Book.insertMany(books);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            isAdmin: true,
        });

        const regularUser = new User({
            name: 'John Doe',
            email: 'user@example.com',
            password: hashedPassword,
            isAdmin: false,
        });

        await adminUser.save();
        await regularUser.save();

        await Offer.insertMany([
            {
                code: 'WELCOME10',
                discountPercentage: 10,
                expirationDate: new Date('2025-12-31'),
                description: 'Welcome offer: 10% off'
            },
            {
                code: 'BOOKLOVER',
                discountPercentage: 15,
                expirationDate: new Date('2025-12-31'),
                description: 'Special offer for book lovers: 15% off'
            }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
