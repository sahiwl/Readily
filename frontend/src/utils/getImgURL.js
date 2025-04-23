function getImgURL(path) {
    // check if the path is already a full URL (starts with http:// or https://)
    if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
        return path;
    }
    
    // if it's not a URL, assume it's a local file path
    try {
        return new URL(`../assets/books/${path}`, import.meta.url).href;
    } catch (error) {
        console.error("Error loading image:", error);
        return '/placeholder.png'; 
    }
}

export { getImgURL };