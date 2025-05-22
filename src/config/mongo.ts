import { connect } from "mongoose";

// process.loadEnvFile();
import dotenv from "dotenv";
dotenv.config();

const URI_DB = process.env.URI_DB || "";

const connectMongodb = async () => {
  try {
    await connect(URI_DB);
    console.log("✅ Conectado con éxito a mongodb");
  } catch (error) {
    console.log(`🚫 No se pudo conectar a mongodb`);
  }
};

export { connectMongodb };
