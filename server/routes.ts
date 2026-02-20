import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/send-message", async (req, res) => {
    try {
      const { contactId, phone, message, contactName } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ error: "Phone and message are required" });
      }

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.log(
          `[BRAM] Message queued for ${contactName} (${phone}): ${message.substring(0, 50)}...`,
        );
        return res.json({
          success: true,
          queued: true,
          message: "Message queued (Twilio not configured)",
        });
      }

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString(
        "base64",
      );

      const body = new URLSearchParams({
        To: phone.replace(/[^+\d]/g, ""),
        From: fromNumber,
        Body: message,
      });

      const twilioRes = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!twilioRes.ok) {
        const errorData = await twilioRes.text();
        console.error("[BRAM] Twilio error:", errorData);
        return res.status(500).json({ error: "Failed to send SMS" });
      }

      const result = await twilioRes.json();
      console.log(
        `[BRAM] SMS sent to ${contactName} (${phone}), SID: ${result.sid}`,
      );

      return res.json({
        success: true,
        sid: result.sid,
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
