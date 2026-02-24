import express, {Application, NextFunction, Request, Response} from "express";
import {indexRoute} from "./app/routes";
import {prisma} from "./app/lib/prisma";
import {globalErrorHandler} from "./app/middleware/globalErrorHandler";
import {notFound} from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./app/lib/auth";

const app: Application = express();

app.use('/api/auth',toNodeHandler(auth))


app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/v1", indexRoute)

app.get('/', async (req: Request, res: Response) => {
    const speciality = await prisma.specialty.create({
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