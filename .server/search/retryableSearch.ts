import axios, { AxiosInstance } from 'axios';
import https from "https";

// PISA's certificates are often unauthorized or invalid, so specifically for pisa.ucsc.edu
// we ignore certificate errors.
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false,
});

const client = axios.create({
  httpsAgent: agent,
});

export function GET(url: string, options?: any) {
    return _handle_GET(url, options ?? undefined, axios);
}
export function UNSAFE_GET(url: string, options?: any) {
    return _handle_GET(url, options ?? undefined, client);
}
export function POST(url: string, data: any, options?: any) {
    return _handle_POST(url, data, options ?? undefined, client);
}
export function UNSAFE_POST(url: string, data: any, options?: any) {
    return _handle_POST(url, data, options ?? undefined, client);
}


export async function _handle_GET(url: string, options: any, client: AxiosInstance) {
    let attempts = 0;
    let maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            return await client.get(url, options)
        } catch(e) {
            attempts++;
            console.log(e)
        }
        // backoff retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts * attempts))
    }

    throw new Error(`Could not GET URL ${url} after 5 attempts`);
}

export async function _handle_POST(url: string, data: any, options: any, client: AxiosInstance) {
    let attempts = 0;
    let maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            return await client.post(url, data, options)
        } catch(e) {
            attempts++;
            console.log(e)
        }
        // backoff retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts * attempts))
    }

    // log options for debugging
    console.log(data, options);
    throw new Error(`Could not POST URL ${url} after 5 attempts`);
}