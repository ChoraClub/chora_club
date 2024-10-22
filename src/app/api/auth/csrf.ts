import { getCsrfToken } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const csrfToken = await getCsrfToken({ req });
    
    if (!csrfToken) {
      return res.status(400).json({ error: "Failed to generate CSRF token" });
    }

    // Send just the token string, not a JSON object
    res.status(200).send(csrfToken);
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}