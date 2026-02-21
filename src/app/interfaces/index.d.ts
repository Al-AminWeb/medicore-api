import {Role} from "../../generated/prisma/enums";
import {IRequestUser} from "./requestUser.Interfaces";


declare global{
    namespace Express{
        interface Request{
            user:IRequestUser
        }
    }
}