import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const hfApiKey = process.env.HF_API_KEY;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HF API error: ${errText}`);
    }

    // Check content type
    const contentType = response.headers.get("content-type");

    let base64Image;

    if (contentType.includes("application/json")) {
      // JSON response
      const result = await response.json();
      base64Image = result[0]?.generated_image || result?.[0]?.image;
      if (!base64Image) throw new Error("No image returned in JSON");
    } else if (contentType.includes("image")) {
      // Raw image bytes
      const arrayBuffer = await response.arrayBuffer();
      base64Image = Buffer.from(arrayBuffer).toString("base64");
    } else {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    res.status(200).json({ photo: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
