// Netlify Function para Webhook Hotmart
// Arquivo: netlify/functions/hotmart-webhook.ts

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import {
  hotmartWebhookManager,
  HotmartWebhookData,
} from "../../src/utils/hotmartWebhook";

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  try {
    // Verificar método HTTP
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Verificar Content-Type
    const contentType = event.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid content type" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Parsear dados do webhook
    const webhookData: HotmartWebhookData = JSON.parse(event.body);

    // Validar estrutura básica
    if (!webhookData.event || !webhookData.data || !webhookData.webhook_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid webhook data" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Log do webhook recebido
    console.log("[Netlify Hotmart Webhook] Webhook recebido:", {
      event: webhookData.event,
      transaction_id: webhookData.data.transaction?.id,
      buyer_email: webhookData.data.buyer?.email,
      webhook_id: webhookData.webhook_id,
      timestamp: webhookData.timestamp,
    });

    // Processar webhook usando nosso gerenciador
    await hotmartWebhookManager.processWebhook(webhookData);

    // Resposta de sucesso para a Hotmart
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        event: webhookData.event,
        transaction_id: webhookData.data.transaction?.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(
      "[Netlify Hotmart Webhook] Erro ao processar webhook:",
      error
    );

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
