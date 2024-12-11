import express, { Request, Response} from "express"
import { router } from "./routes/loginRoutes";
import bodyParser, { BodyParser } from "body-parser";
import cookieSession from "cookie-session";
const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieSession({keys: ["chsjwieiiiiiis"]}));
app.use(router);


app.listen(3000, ()=>{
    console.log("listening on port 3000")
} )