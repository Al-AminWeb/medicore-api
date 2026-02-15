import app from "./app";

const bootstrap = async () => {
    try {
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        })
    } catch (err) {
        console.log("Failed to sart the server", err);
    }
}

bootstrap()