import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tableApi = createApi({
  reducerPath: "tableApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getEntries: builder.query({
      query: () => `/userData`,
    }),
    updateEntry: builder.mutation({
      query: ({ userEmail, rowId, entry }) => ({
        url: `/userData`,
        method: "PUT",
        body: { userEmail, rowId, entry },
      }),
    }),
  }),
});

export const { useGetEntriesQuery, useUpdateEntryMutation } = tableApi;
