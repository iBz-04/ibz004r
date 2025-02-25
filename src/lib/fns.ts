const ENDPOINT = process.env.NODE_ENV === "production"
? "https://www.ibz04.pro"
: "http://localhost:5678"

export { ENDPOINT }
