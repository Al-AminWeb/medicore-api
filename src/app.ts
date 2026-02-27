import dotenv from 'dotenv';
import express, {Application, NextFunction, Request, Response} from "express";
import {indexRoute} from "./app/routes";
import {prisma} from "./app/lib/prisma";
import {globalErrorHandler} from "./app/middleware/globalErrorHandler";
import {notFound} from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./app/lib/auth";
import path from "path";
import qs from "qs";


dotenv.config();


const app: Application = express();
app.set("query parser", (str : string) => qs.parse(str));
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), `src/app/templates/`));


app.use('/api/auth', toNodeHandler(auth))
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/v1", indexRoute)

app.get('/', async (req: Request, res: Response) => {
    const speciality = await prisma.specialty.create({
        data: {
            title: "cardiology",
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