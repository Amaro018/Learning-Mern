import app from "./app";
import  env from "./util/validateEnv";
import mongoose from "mongoose";


const port = env.PORT;

const mongoUri = env.MONGO_CONNECTION_STRING

mongoose.connect(mongoUri!).then(() => {
    console.log("Connected to MongoDB")
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}).catch(err => console.log(err))

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });



