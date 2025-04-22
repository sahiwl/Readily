import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String], // Support multiple authors
    required: true,
  },
  publisher: {
    type: String,
  },
  publishedDate: {
    type: String, // Keeping as string for flexibility (e.g., just year)
  },
  description: {
    type: String,
  },
  categories: {
    type: [String],
  },
  pageCount: {
    type: Number,
  },
  language: {
    type: String,
    default: "en",
  },
  isbn10: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  coverImage: {
    type: String, // Google provides a thumbnail
  },
  previewLink: {
    type: String,
  },
  infoLink: {
    type: String,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  newPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
