import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { accountId } = req.body;

    // Here you would typically save the accountId to your database
    // For demonstration, we will just return a success response
    if (accountId) {
      // ...save accountId to database...
      return res.status(200).json({ message: "Account ID saved successfully" });
    } else {
      return res.status(400).json({ message: "Account ID is required" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
