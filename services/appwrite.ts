// Track the searches made by the user
import { Client, Databases, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) // Your project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: any) => {
    const result = await database.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
        Query.equal('serchTerm', query)
    ])

    console.log(result)
    // check if the record of the searhas already been stored
    // if document is found increament the search field
    // else create a new document with the search field set to 1
}