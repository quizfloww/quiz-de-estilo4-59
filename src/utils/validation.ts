/**
 * Input Validation & Sanitization Utilities
 * Funções de segurança para validação e sanitização de dados
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza HTML para prevenir XSS
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
};

/**
 * Sanitiza texto simples (remove HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valida telefone brasileiro
 */
export const isValidBrazilianPhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, "");

  // Valida: (11) 98765-4321 ou (11) 3456-7890
  return /^[1-9]{2}9?[0-9]{8}$/.test(cleanPhone);
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false; // Todos iguais

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/**
 * Valida nome (apenas letras e espaços)
 */
export const isValidName = (name: string): boolean => {
  return (
    /^[a-zA-ZÀ-ÿ\s]+$/.test(name) &&
    name.trim().length >= 2 &&
    name.length <= 100
  );
};

/**
 * Valida URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    return parsedURL.protocol === "http:" || parsedURL.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Valida slug (URLs amigáveis)
 */
export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
};

/**
 * Sanitiza objeto removendo campos perigosos
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> => {
  const sanitized: Partial<T> = {};

  allowedKeys.forEach((key) => {
    if (key in obj) {
      sanitized[key as keyof T] = obj[key];
    }
  });

  return sanitized;
};

/**
 * Escapa caracteres especiais para regex
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Limita tamanho de string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Remove caracteres especiais de string
 */
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9\s]/g, "");
};

/**
 * Normaliza espaços em branco
 */
export const normalizeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, " ").trim();
};

/**
 * Valida JSON string
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitiza JSON parse com fallback
 */
export const safeJSONParse = <T = any>(str: string, fallback: T): T => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
};

/**
 * Valida range numérico
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Sanitiza número (garante que é número válido)
 */
export const sanitizeNumber = (value: any, fallback: number = 0): number => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

/**
 * Valida array de strings
 */
export const isValidStringArray = (arr: any): arr is string[] => {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
};

/**
 * Sanitiza array de strings
 */
export const sanitizeStringArray = (
  arr: any[],
  maxLength: number = 100
): string[] => {
  return arr
    .filter((item) => typeof item === "string")
    .map((item) => sanitizeText(item))
    .slice(0, maxLength);
};

/**
 * Valida data ISO
 */
export const isValidISODate = (date: string): boolean => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!isoDateRegex.test(date)) return false;

  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

/**
 * Rate limiting check (simples)
 */
const rateLimitStore = new Map<string, number[]>();

export const checkRateLimit = (
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const timestamps = rateLimitStore.get(key) || [];

  // Remove timestamps antigos
  const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit excedido
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, validTimestamps);

  return true;
};

/**
 * Valida tipo de arquivo por extensão
 */
export const isValidFileType = (
  filename: string,
  allowedExtensions: string[]
): boolean => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Valida tamanho de arquivo
 */
export const isValidFileSize = (
  sizeInBytes: number,
  maxSizeInMB: number
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
};

/**
 * Objeto com todas as validações para forms
 */
export const validators = {
  email: isValidEmail,
  phone: isValidBrazilianPhone,
  cpf: isValidCPF,
  name: isValidName,
  url: isValidURL,
  slug: isValidSlug,
  json: isValidJSON,
  date: isValidISODate,
};

/**
 * Objeto com todas as sanitizações
 */
export const sanitizers = {
  html: sanitizeHTML,
  text: sanitizeText,
  number: sanitizeNumber,
  array: sanitizeStringArray,
  object: sanitizeObject,
};
