import app from "./app";
import  env from "./util/validateEnv";
import mongoose from "mongoose";


const port = env.PORT || 5000;

const mongoUri = env.MONGO_CONNECTION_STRING

mongoose.connect(mongoUri!,{ ssl: true, tlsAllowInvalidCertificates: true,} ).then(() => {
    
    console.log("Connected to MongoDB")
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}).catch(err => console.log(err))

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });



