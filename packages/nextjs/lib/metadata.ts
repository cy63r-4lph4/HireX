import crypto from "crypto";
import fs from "fs";
import path from "path";

export const METADATA_DIR = path.join(process.cwd(), "metadata-store");

// Ensure dir exists
export function ensureMetadataDir() {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }
}

// Deterministic mock "CID" (sha256 over JSON, base32-ish string)
export function generateMockCID(data: unknown) {
  const json = typeof data === "string" ? data : JSON.stringify(data);
  const hash = crypto.createHash("sha256").update(json).digest("hex"); // 64 hex chars
  // Keep it short-ish but stable; prefix to signal mock
  return `mockcid-${hash.slice(0, 59)}`; // ~CID-length feel
}

export function saveMetadataAsCid(metadata: unknown) {
  ensureMetadataDir();
  const cid = generateMockCID(metadata);
  const filePath = path.join(METADATA_DIR, `${cid}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), "utf8");
  return { cid, filePath };
}

export function readMetadataByCid(cid: string) {
  ensureMetadataDir();
  const filePath = path.join(METADATA_DIR, `${cid}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}
