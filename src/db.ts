import mongoose from "mongoose";

//this types show the output after the db gets connected
type connectionObject = {
    isConnected ?: number,
}

const connection : connectionObject = {}

async function dbConnect () :Promise<void>{
    // since backend code always deploy in serverless architecture also called edge server in vercel
    // so we check if db is aleady connected then no need for further connection
    
    if(connection.isConnected){
        console.log("Already connected to db");
        return 
    }
    try {
      const db = await mongoose.connect(process.env.DATABASE_URL || '')
    //   console.log("db:",db);
    //   console.log("db.connections:",db.connections);
      connection.isConnected = db.connections[0].readyState;

      console.log(" ~ DB connected successsfully ~");

       
    } catch (error) {
        console.log('~ DB connection failed ~',error)
        process.exit(1)
    }
}

export default dbConnect
