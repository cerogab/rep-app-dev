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

  app.post("/api/send-vonage-message", async (req, res) => {
    try {
      const { phone, message, contactName } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ error: "Phone and message are required" });
      }

      const apiKey = process.env.VONAGE_API_KEY;
      const apiSecret = process.env.VONAGE_API_SECRET;
      const fromNumber = process.env.VONAGE_FROM_NUMBER;

      if (!apiKey || !apiSecret || !fromNumber) {
        console.log(
          `[BRAM] Vonage message queued for ${contactName} (${phone}): ${message.substring(0, 50)}...`,
        );
        return res.json({
          success: true,
          queued: true,
          message: "Message queued (Vonage not configured)",
        });
      }

      const vonageUrl = "https://rest.nexmo.com/sms/json";
      const body = JSON.stringify({
        api_key: apiKey,
        api_secret: apiSecret,
        to: phone.replace(/[^+\d]/g, ""),
        from: fromNumber,
        text: message,
      });

      const vonageRes = await fetch(vonageUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!vonageRes.ok) {
        const errorData = await vonageRes.text();
        console.error("[BRAM] Vonage error:", errorData);
        return res.status(500).json({ error: "Failed to send SMS via Vonage" });
      }

      const result = await vonageRes.json();
      const smsResult = result.messages?.[0];

      if (smsResult && smsResult.status !== "0") {
        console.error("[BRAM] Vonage SMS error:", smsResult["error-text"]);
        return res.status(500).json({ error: smsResult["error-text"] || "Failed to send SMS" });
      }

      console.log(
        `[BRAM] Vonage SMS sent to ${contactName} (${phone}), ID: ${smsResult?.["message-id"]}`,
      );

      return res.json({
        success: true,
        messageId: smsResult?.["message-id"],
        message: "Message sent successfully via Vonage",
      });
    } catch (error) {
      console.error("[BRAM] Vonage send message error:", error);
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
