import type { Express } from "express";
import { createServer, type Server } from "node:http";
import twilio from "twilio";
import supabase from "./supabaseClient";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return null;
  return { client: twilio(accountSid, authToken), fromNumber };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/supabase-test", async (_req, res) => {
    try {
      const { data, error } = await supabase.from("namesz").select("*").limit(1);

      if (error) {
        return res.json({
          success: false,
          message: "Supabase connected but query failed",
          details: { connected: true, errorCode: error.code, errorMessage: error.message },
        });
      }

      return res.json({
        success: true,
        message: "Supabase connected and query succeeded",
        details: { connected: true, rowCount: data?.length ?? 0 },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to connect to Supabase",
        details: { connected: false, error: err.message },
      });
    }
  });

  app.post("/api/send-message", async (req, res) => {
    try {
      const { contactId, phone, message, contactName } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ error: "Phone and message are required" });
      }

      const tw = getTwilioClient();
      if (!tw) {
        console.log(
          `[BRAM] Message queued for ${contactName} (${phone}): ${message.substring(0, 50)}...`,
        );
        return res.json({
          success: true,
          queued: true,
          message: "Message queued (Twilio not configured)",
        });
      }

      const result = await tw.client.messages.create({
        body: message,
        from: tw.fromNumber,
        to: phone.replace(/[^+\d]/g, ""),
      });

      console.log(
        `[BRAM] SMS sent to ${contactName} (${phone}), SID: ${result.sid}`,
      );

      return res.json({
        success: true,
        sid: result.sid,
        message: "Message sent successfully",
      });
    } catch (error: any) {
      console.error("[BRAM] Send message error:", error.message);
      return res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  app.post("/api/send-sms-to-all", async (req, res) => {
    try {
      const { messageBody } = req.body;

      if (!messageBody) {
        return res.status(400).json({ error: "messageBody is required" });
      }

      const { data: contacts, error } = await supabase
        .from("namesz")
        .select("name, phone");

      if (error) {
        console.error("[BRAM] Error fetching contacts from Supabase:", error.message);
        return res.status(500).json({ error: "Failed to fetch contacts from Supabase", details: error.message });
      }

      if (!contacts || contacts.length === 0) {
        return res.json({ success: true, message: "No contacts found in Supabase", sent: 0, failed: 0, results: [] });
      }

      const tw = getTwilioClient();
      if (!tw) {
        console.log(`[BRAM] Twilio not configured. ${contacts.length} messages queued.`);
        return res.json({
          success: true,
          queued: true,
          message: `${contacts.length} messages queued (Twilio not configured)`,
          contactCount: contacts.length,
        });
      }

      console.log(`[BRAM] Sending SMS to ${contacts.length} contacts...`);

      const results: { name: string; phone: string; status: string; sid?: string; error?: string }[] = [];

      for (const contact of contacts) {
        try {
          const msg = await tw.client.messages.create({
            body: messageBody,
            from: tw.fromNumber,
            to: contact.phone,
          });
          console.log(`[BRAM] Sent to ${contact.name}: ${msg.sid}`);
          results.push({ name: contact.name, phone: contact.phone, status: "sent", sid: msg.sid });
        } catch (err: any) {
          console.error(`[BRAM] Failed for ${contact.name}:`, err.message);
          results.push({ name: contact.name, phone: contact.phone, status: "failed", error: err.message });
        }
      }

      const sent = results.filter((r) => r.status === "sent").length;
      const failed = results.filter((r) => r.status === "failed").length;

      return res.json({
        success: true,
        message: `SMS batch complete: ${sent} sent, ${failed} failed`,
        sent,
        failed,
        results,
      });
    } catch (error: any) {
      console.error("[BRAM] Send SMS to all error:", error.message);
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
