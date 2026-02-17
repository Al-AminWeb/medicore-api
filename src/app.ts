import express, {Application, NextFunction, Request, Response} from "express";
import {indexRoute} from "./app/routes";
import {prisma} from "./app/lib/prisma";
import {globalErrorHandler} from "./app/middleware/globalErrorHandler";
import {notFound} from "./app/middleware/notFound";

const app: Application = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use("/api/v1/", indexRoute)

app.get('/', async (req: Request, res: Response) => {
    const speciality = await prisma.speciality.create({
        data: {
            title: "caridiology",
            id: "1"
        }
    })
    res.status(201).json({
        success: true,
        data: speciality,
        message: "Speciality created successfully"
    })
});


app.use(globalErrorHandler)
app.use(notFound)

export default app;