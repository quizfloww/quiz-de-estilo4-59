#!/usr/bin/env node
/**
 * Lovable Prepare Script
 *
 * This script prepares the project for Lovable deployment by:
 * 1. Validating the Lovable configuration
 * 2. Ensuring all required files are present
 * 3. Setting up any necessary environment variables
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Preparing Lovable deployment...");

// Check if lovable.config.js exists
const configPath = path.join(process.cwd(), "lovable.config.js");
if (!fs.existsSync(configPath)) {
  console.warn("⚠️  lovable.config.js not found, skipping config validation");
} else {
  console.log("✅ Found lovable.config.js");
}

// Check if required directories exist
const requiredDirs = ["src", "public"];
requiredDirs.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ Found ${dir}/ directory`);
  } else {
    console.warn(`⚠️  ${dir}/ directory not found`);
  }
});

// Check for package.json
const packagePath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  console.log(`✅ Project: ${pkg.name || "unnamed"}`);
  console.log(`✅ Version: ${pkg.version || "0.0.0"}`);
} else {
  console.error("❌ package.json not found");
  process.exit(1);
}

// Ensure lovable-uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "lovable-uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created public/lovable-uploads directory");
} else {
  console.log("✅ Found public/lovable-uploads directory");
}

console.log("");
console.log("🎉 Lovable preparation complete!");
console.log("");
