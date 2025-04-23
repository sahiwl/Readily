export const getBaseUrl= ()=>{
    const api = import.meta.env.VITE_BE_URL;
    return api;
}
