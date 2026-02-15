import express, {Application, Request, Response} from "express";
import {specialityRoute} from "./app/module/specialty/speciality.route";
import {indexRoute} from "./app/routes";
import {prisma} from "./app/lib/prisma";

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


export default app;