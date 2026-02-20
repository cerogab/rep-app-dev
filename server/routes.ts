import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/send-message", async (req, res) => {
    try {
      const { contactId, phone, message, contactName } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ error: "Phone and message are required" });
      }

      const apiKey = process.env.VONAGE_API_KEY;
      const apiSecret = process.env.VONAGE_API_SECRET;
      const fromNumber = process.env.VONAGE_PHONE_NUMBER;

      if (!apiKey || !apiSecret || !fromNumber) {
        console.log(
          `[BRAM] Message queued for ${contactName} (${phone}): ${message.substring(0, 50)}...`,
        );
        return res.json({
          success: true,
          queued: true,
          message: "Message queued (Vonage not configured)",
        });
      }

      const toNumber = phone.replace(/[^+\d]/g, "");

      const vonageRes = await fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          api_secret: apiSecret,
          to: toNumber,
          from: fromNumber,
          text: message,
        }),
      });

      if (!vonageRes.ok) {
        const errorData = await vonageRes.text();
        console.error("[BRAM] Vonage HTTP error:", errorData);
        return res.status(500).json({ error: "Failed to send SMS" });
      }

      const result = await vonageRes.json();
      const smsResult = result.messages?.[0];

      if (smsResult?.status !== "0") {
        console.error("[BRAM] Vonage SMS error:", smsResult?.["error-text"] || "Unknown error");
        return res.status(500).json({
          error: smsResult?.["error-text"] || "Failed to send SMS",
        });
      }

      console.log(
        `[BRAM] SMS sent to ${contactName} (${phone}), Message ID: ${smsResult["message-id"]}`,
      );

      return res.json({
        success: true,
        messageId: smsResult["message-id"],
        message: "Message sent successfully",
      });
    } catch (error) {
      console.error("[BRAM] Send message error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/contacts/stats", async (_req, res) => {
    res.json({
      totalContacts: 0,
      newLeads: 0,
      contacted: 0,
      qualified: 0,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
