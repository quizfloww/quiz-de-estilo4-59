import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Lock, ShieldCheck, CreditCard, CheckCircle } from "lucide-react";

interface SecurePurchaseBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const defaultSecurityBadges = [
  "Compra 100% Segura",
  "Dados Criptografados",
  "Ambiente Protegido",
];

const defaultPaymentMethods = ["Pix", "Cartão de Crédito", "Boleto"];

export const SecurePurchaseBlock: React.FC<SecurePurchaseBlockProps> = ({
  content,
  isPreview,
}) => {
  const badges = content.securityBadges || defaultSecurityBadges;
  const payments = content.paymentMethods || defaultPaymentMethods;
  const secureText =
    content.secureText ||
    "Pagamento processado pela Hotmart, maior plataforma de produtos digitais da América Latina.";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full py-6 px-4 rounded-xl"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <div className="max-w-md mx-auto text-center">
        {/* Selos de Segurança */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Compra Segura
            </span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              SSL 256-bit
            </span>
          </div>
        </div>

        {/* Badges de Segurança */}
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Formas de Pagamento */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {payments.map((payment, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
              >
                {payment}
              </span>
            ))}
          </div>
        </div>

        {/* Texto de Segurança */}
        <p className="text-xs text-gray-500 leading-relaxed">
          <Lock className="w-3 h-3 inline-block mr-1" />
          {secureText}
        </p>

        {/* Logos de Segurança (placeholder visual) */}
        <div className="flex justify-center items-center gap-4 mt-4 opacity-60">
          <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
            SSL
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
            Hotmart
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
            PCI DSS
          </div>
        </div>
      </div>
    </div>
  );
};
