import app from "./app";
import {envVars} from "./app/config/env";
import {seedSuperAdmin} from "./app/utils/seed";

const bootstrap = async () => {
    try {
        await seedSuperAdmin();
        app.listen(envVars.PORT, () => {
            console.log("Server is running on port 5000");
        })
    } catch (err) {
        console.log("Failed to sart the server", err);
    }
}

bootstrap()