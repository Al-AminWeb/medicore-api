import app from "./app";
import {envVars} from "./app/config/env";

const bootstrap = async () => {
    try {
        app.listen(envVars.PORT, () => {
            console.log("Server is running on port 5000");
        })
    } catch (err) {
        console.log("Failed to sart the server", err);
    }
}

bootstrap()