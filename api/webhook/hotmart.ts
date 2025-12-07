// API Endpoint para Webhook Hotmart
// Compatível com Vercel Serverless Functions

import {
  hotmartWebhookManager,
  HotmartWebhookData,
} from "../../src/utils/hotmartWebhook.js";

export default async function handler(req: any, res: any) {
  try {
    // Verificar método HTTP
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Verificar Content-Type
    const contentType = req.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      return res.status(400).json({ error: "Invalid content type" });
    }

    // Parsear dados do webhook
    const webhookData: HotmartWebhookData = req.body;

    // Validar estrutura básica
    if (!webhookData.event || !webhookData.data || !webhookData.webhook_id) {
      return res.status(400).json({ error: "Invalid webhook data" });
    }

    // Log do webhook recebido
    console.log("[Hotmart Webhook API] Webhook recebido:", {
      event: webhookData.event,
      transaction_id: webhookData.data.transaction?.id,
      buyer_email: webhookData.data.buyer?.email,
      webhook_id: webhookData.webhook_id,
      timestamp: webhookData.timestamp,
    });

    // Processar webhook usando nosso gerenciador
    await hotmartWebhookManager.processWebhook(webhookData);

    // Resposta de sucesso para a Hotmart
    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      event: webhookData.event,
      transaction_id: webhookData.data.transaction?.id,
    });
  } catch (error) {
    console.error("[Hotmart Webhook API] Erro ao processar webhook:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Configuração para Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
