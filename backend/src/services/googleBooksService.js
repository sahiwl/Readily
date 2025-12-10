import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_URL = process.env.GOOGLE_BOOKS_API_URL || 'https://www.googleapis.com/books/v1';

const googleBooksService = {
  /**
   * Search books from Google Books API
   * @param {Object} options - Search options
   * @param {string} options.query - Search query
   * @param {string} options.category - Book category
   * @param {number} options.maxResults - Maximum number of results
   * @param {number} options.startIndex - Starting index for pagination
   * @param {string} options.orderBy - Order by relevance or newest
   * @param {string} options.printType - Filter by print type (all, books, magazines)
   */
  searchBooks: async ({ 
    query = '', 
    category = '', 
    maxResults = 20,
    startIndex = 0,
    orderBy = 'relevance',
    printType = 'books'
  }) => {
    try {
      let searchQuery = query;
      
      // Add category to search query if provided
      if (category && category !== 'Choose a genre') {
        searchQuery = searchQuery ? `${searchQuery}+subject:${category}` : `subject:${category}`;
      }
      
      // If no query and no category, fetch popular books
      if (!searchQuery) {
        searchQuery = 'subject:bestseller';
      }
      
      // Make sure we're using the URL correctly
      const url = `${GOOGLE_BOOKS_API_URL}/volumes`;
      
      const response = await axios.get(url, {
        params: {
          q: searchQuery,
          maxResults,
          startIndex,
          orderBy,
          printType,
          key: GOOGLE_BOOKS_API_KEY,
          fields: 'items(id,volumeInfo(title,authors,description,categories,imageLinks,publishedDate,publisher,pageCount,averageRating,ratingsCount,language)),totalItems'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching books from Google Books API:', error);
      throw new Error('Failed to search books');
    }
  },
  
  getBookById: async (id) => {
    try {

      const url = `${GOOGLE_BOOKS_API_URL}/volumes/${id}`;
      
      const response = await axios.get(url, {
        params: {
          key: GOOGLE_BOOKS_API_KEY,
          fields: 'id,volumeInfo(title,subtitle,authors,publisher,publishedDate,description,categories,pageCount,language,imageLinks,previewLink,infoLink,averageRating,ratingsCount,industryIdentifiers)'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching book from Google Books API:', error);
      throw new Error('Failed to fetch book');
    }
  },
  

  getTrendingBooks: async (maxResults = 25) => {
    try {

      return await googleBooksService.searchBooks({
        query: '',
        category: 'bestseller',
        maxResults,
        orderBy: 'relevance'
      });
    } catch (error) {
      console.error('Error fetching trending books from Google Books API:', error);
      throw new Error('Failed to fetch trending books');
    }
  },


  getNewReleases: async (maxResults = 25) => {
    try {
      const currentYear = new Date().getFullYear();
      return await googleBooksService.searchBooks({
        query: `publishedDate:${currentYear}`,
        maxResults,
        orderBy: 'newest'
      });
    } catch (error) {
      console.error('Error fetching new releases from Google Books API:', error);
      throw new Error('Failed to fetch new releases');
    }
  },

  
  getBooksByAuthor: async (author, maxResults = 25) => {
    try {
      return await googleBooksService.searchBooks({
        query: `inauthor:${author}`,
        maxResults
      });
    } catch (error) {
      console.error('Error fetching books by author from Google Books API:', error);
      throw new Error('Failed to fetch books by author');
    }
  },

  /**
   * Get similar books based on a book ID
   * @param {Object} book - Book data with title, author, and category
   * @param {number} maxResults - Maximum number of results
   */
  getSimilarBooks: async (book, maxResults = 6) => {
    try {
      let query = '';
      
      if (book.category) {
        query = `subject:${book.category}`;
      } else if (book.authors && book.authors.length > 0) {
        query = `inauthor:${book.authors[0]}`;
      } else if (book.title) {
        // Extract meaningful keywords from the title
        const keywords = book.title
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 2)
          .join(' ');
        query = keywords;
      }
      
      if (!query) {
        query = 'subject:fiction';
      }
      
      const response = await googleBooksService.searchBooks({
        query,
        maxResults
      });
      
      // Filter out the original book if it's in the results
      const books = googleBooksService.adaptGoogleBooksData(response);
      return books.filter(b => b._id !== book._id);
    } catch (error) {
      console.error('Error fetching similar books from Google Books API:', error);
      throw new Error('Failed to fetch similar books');
    }
  },
  
  /**
   * Format Google Book data to match our app's book model
   * @param {Object} googleBook - Google Book data
   */
  formatGoogleBookData: (googleBook) => {
    const { volumeInfo } = googleBook;
    const imageLinks = volumeInfo.imageLinks || {};
    
    // Generate random price directly in INR (no USD conversions)
    const newPriceInr = Math.floor(Math.random() * 1800) + 300; // ₹300 - ₹2100
    const oldPriceInr = Math.round(newPriceInr * (1 + Math.random() * 0.4)); // up to 40% higher

    // Extract ISBN numbers if available
    let isbn10 = '', isbn13 = '';
    if (volumeInfo.industryIdentifiers && Array.isArray(volumeInfo.industryIdentifiers)) {
      const isbn10Obj = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
      const isbn13Obj = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
      
      if (isbn10Obj) isbn10 = isbn10Obj.identifier;
      if (isbn13Obj) isbn13 = isbn13Obj.identifier;
    }
    
    return {
      _id: googleBook.id,
      title: volumeInfo.title,
      description: volumeInfo.description || 'No description available',
      authors: volumeInfo.authors || ['Unknown Author'],
      author: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author',
      publisher: volumeInfo.publisher,
      publishedDate: volumeInfo.publishedDate,
      category: volumeInfo.categories ? volumeInfo.categories[0].toLowerCase() : 'fiction',
      categories: volumeInfo.categories || ['fiction'],
      pageCount: volumeInfo.pageCount,
      language: volumeInfo.language,
      coverImage: imageLinks.thumbnail || imageLinks.smallThumbnail || '/images/placeholder.png',
      image: imageLinks.thumbnail || imageLinks.smallThumbnail || '/images/placeholder.png', 
      previewLink: volumeInfo.previewLink,
      infoLink: volumeInfo.infoLink,
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
      isbn10: isbn10,
      isbn13: isbn13,
      // Prices provided directly in INR
      newPriceInr,
      oldPriceInr,
      // Keep USD fields null to avoid frontend using them accidentally
      newPrice: null,
      oldPrice: null,
      trending: false,
      createdAt: new Date().toISOString()
    };
  },
  
  /**
   * Adapt Google Books API response to match our app's data structure
   * @param {Object} googleBooksResponse - Google Books API response
   */
  adaptGoogleBooksData: (googleBooksResponse) => {
    if (!googleBooksResponse.items || !Array.isArray(googleBooksResponse.items)) {
      return [];
    }
    return googleBooksResponse.items.map(item => googleBooksService.formatGoogleBookData(item));
  },

  
  getBooksByCategory: async (category, maxResults = 12) => {
    try {
      return await googleBooksService.searchBooks({
        query: '',
        category,
        maxResults
      });
    } catch (error) {
      console.error('Error fetching books by category from Google Books API:', error);
      throw new Error('Failed to fetch books by category');
    }
  },

 
  getBooksByPublisher: async (publisher, maxResults = 10) => {
    try {
      return await googleBooksService.searchBooks({
        query: `inpublisher:${publisher}`,
        maxResults
      });
    } catch (error) {
      console.error('Error fetching books by publisher from Google Books API:', error);
      throw new Error('Failed to fetch books by publisher');
    }
  },

  /**
   * Get book recommendations based on user preferences
   * @param {Array} preferences - User's preferred genres/categories
   * @param {Array} recentlyViewed - Recently viewed book IDs
   * @param {number} maxResults - Maximum number of results
   */
  getRecommendedBooks: async (preferences = [], recentlyViewed = [], maxResults = 25) => {
    try {
      if (!preferences || preferences.length === 0) {
        preferences = ['horror', 'romance'];
        console.log('default preferences:', preferences);
      }

      if (preferences.length > 0) {
        // Get a random preference to ensure variety
        const randomIndex = Math.floor(Math.random() * preferences.length);
        const category = preferences[randomIndex];
        console.log('Selected category for recommendations:', category);
        
        return await googleBooksService.getBooksByCategory(category, maxResults);
      }
      
      // If we have recently viewed books, get similar books
      if (recentlyViewed && recentlyViewed.length > 0) {
        // Get the most recent book
        const recentBookId = recentlyViewed[0];
        try {
          const recentBook = await googleBooksService.getBookById(recentBookId);
          if (recentBook) {
            const category = recentBook.volumeInfo.categories ? 
              recentBook.volumeInfo.categories[0] : null;
              
            if (category) {
              return await googleBooksService.getBooksByCategory(category, maxResults);
            }
          }
        } catch (err) {
          console.log('Error fetching recent book, falling back to trending books');
        }
      }
      
      // Default to trending books as a last resort
      return await googleBooksService.getTrendingBooks(maxResults);
    } catch (error) {
      console.error('Error fetching recommended books:', error);
      throw new Error('Failed to fetch recommended books');
    }
  },

  
  advancedSearch: async ({
    title = '',
    author = '',
    publisher = '',
    subject = '',
    isbn = '',
    lccn = '',
    oclc = '',
    maxResults = 10,
    startIndex = 0,
    orderBy = 'relevance',
    printType = 'all',
    filter = ''
  }) => {
    try {
      let query = '';
      
      // Build the query string with the provided parameters
      if (title) query += `intitle:${title} `;
      if (author) query += `inauthor:${author} `;
      if (publisher) query += `inpublisher:${publisher} `;
      if (subject) query += `subject:${subject} `;
      if (isbn) query += `isbn:${isbn} `;
      if (lccn) query += `lccn:${lccn} `;
      if (oclc) query += `oclc:${oclc} `;
      
      // If no parameters provided, default to popular books
      if (!query.trim()) {
        query = 'subject:fiction';
      }

      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/volumes`, {
        params: {
          q: query.trim(),
          maxResults,
          startIndex,
          orderBy,
          printType,
          filter,
          key: GOOGLE_BOOKS_API_KEY,
          fields: 'items(id,volumeInfo(title,authors,description,categories,imageLinks,publishedDate,publisher,pageCount,averageRating,ratingsCount,language,industryIdentifiers,previewLink)),totalItems'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw new Error('Failed to perform advanced search');
    }
  },

  /**
   * Get book preview information
   * @param {string} id - Book ID
   */
  getBookPreview: async (id) => {
    try {
      const book = await googleBooksService.getBookById(id);
      return {
        id: book.id,
        previewLink: book.volumeInfo.previewLink,
        isEmbeddable: book.accessInfo && book.accessInfo.embeddable,
        viewability: book.accessInfo && book.accessInfo.viewability
      };
    } catch (error) {
      console.error('Error getting book preview:', error);
      throw new Error('Failed to get book preview');
    }
  },

  /**
   * Adapt Google Books API response to match our app's format
   * @param {Object} response - Google Books API response
   */
  // Keep single adapt function only (above)
};

export default googleBooksService;