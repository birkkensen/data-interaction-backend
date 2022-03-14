import mongodb from "mongodb";

const db = () => {
  try {
    const mongoClient = new mongodb.MongoClient("mongodb://localhost:27017");
    if (!mongoClient.connect()) {
      mongoClient.connect();
      console.log(`Connected to MongoDB ${mongoClient.serverApi}`);
    }
    const db = mongoClient.db("data-interaction");
    return db;
  } catch (err) {
    console.err(err);
  }
};

export default db;
