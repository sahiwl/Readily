import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/baseURL'

// Configure baseQuery to include credentials for cookie-based auth
const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: 'include', // This ensures cookies are sent with every request
    prepareHeaders: (headers) => {
        // No need to set Authorization header anymore
        // The auth token is now in HTTP-only cookies
        headers.set('Content-Type', 'application/json');
        return headers;
    }
})

const booksApi = createApi({
    reducerPath: 'bookApi',
    baseQuery,
    tagTypes: ["Books"],
    endpoints: (builder) => ({
        fetchAllBooks: builder.query({
            query: () => "/",
            providesTags: ["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (results, error, id)=> [{ type: "Books", id}],
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/create-book`,
                method: 'POST',
                body: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: (id, ...rest) => ({
                url: `/edit/${id}`,
                method: 'PUT',
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id)=>({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags:["Books"]
        })
    })
})

export const {useFetchAllBooksQuery, useFetchBookByIdQuery, useAddBookMutation, useDeleteBookMutation, useUpdateBookMutation} = booksApi
export default booksApi;