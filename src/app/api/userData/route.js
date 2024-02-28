import { User } from "@/models/User";
import mongoose from "mongoose";

const connectToMongoDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URL);
};

export async function PUT(req) {
  await connectToMongoDB();

  try {
    const { userEmail, rowId, entry } = await req.json();

    const existingEntry = await User.findOne({
      userEmail,
      "entries.rowId": rowId,
    });
    const user = existingEntry
      ? await User.findOneAndUpdate(
          { userEmail, "entries.rowId": rowId },
          { $set: { "entries.$": entry } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      : await User.findOneAndUpdate(
          { userEmail },
          { $push: { entries: entry } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

    return new Response(
      JSON.stringify({ message: "Data saved successfully", user }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in PUT /api/userData:", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  return Response.json(await User.find());
}
