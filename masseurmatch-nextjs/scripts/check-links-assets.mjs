import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(appRoot, "app");
const publicDir = path.join(appRoot, "public");

const extsToScan = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".html", ".css"]);
const assetExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".pdf", ".mp4", ".webm"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    const ext = path.extname(entry.name);
    if (extsToScan.has(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

function collectRoutes() {
  const routes = new Set();
  const entries = walk(appDir);

  for (const file of entries) {
    const rel = path.relative(appDir, file);
    const parts = rel.split(path.sep);
    const fileName = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1).filter((part) => !part.startsWith("(") || !part.endsWith(")"));

    if (/^page\.(t|j)sx?$/.test(fileName)) {
      const route = "\/" + dirParts.join("/");
      routes.add(route === "\/" ? "\/" : route);
    }

    if (/^route\.(t|j)sx?$/.test(fileName)) {
      const route = "\/" + dirParts.join("/");
      routes.add(route === "\/" ? "\/" : route);
    }

    if (/^sitemap\.(t|j)sx?$/.test(fileName)) {
      routes.add("/sitemap.xml");
    }

    if (/^robots\.(t|j)sx?$/.test(fileName)) {
      routes.add("/robots.txt");
    }
  }

  return routes;
}

function toRoutePattern(route) {
  if (route === "/") {
    return /^\/$/;
  }

  const parts = route.split("/").filter(Boolean);
  const pattern = parts
    .map((segment) => {
      if (segment.startsWith("[[...") && segment.endsWith("]]")) {
        return "(?:.+)?";
      }
      if (segment.startsWith("[...") && segment.endsWith("]")) {
        return ".+";
      }
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return "[^/]+";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("\\/");

  return new RegExp(`^/${pattern}$`);
}

function stripQueryAndHash(value) {
  return value.split("#")[0].split("?")[0];
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(value);
}

function extractMatches(content, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

const routes = collectRoutes();
const routePatterns = Array.from(routes).map(toRoutePattern);
const files = walk(appRoot);

const linkErrors = [];
const assetErrors = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const candidates = new Set([
    ...extractMatches(content, /href\s*=\s*["']([^"']+)["']/g),
    ...extractMatches(content, /href\s*=\s*\{\s*["']([^"']+)["']\s*\}/g),
    ...extractMatches(content, /href\s*:\s*["']([^"']+)["']/g),
    ...extractMatches(content, /src\s*=\s*["']([^"']+)["']/g),
    ...extractMatches(content, /src\s*=\s*\{\s*["']([^"']+)["']\s*\}/g),
    ...extractMatches(content, /src\s*:\s*["']([^"']+)["']/g),
    ...extractMatches(content, /\]\((\/[^)\s]+)\)/g),
    ...extractMatches(content, /url\(\s*["']?(\/[^"')]+)["']?\s*\)/g),
  ]);

  for (const value of candidates) {
    if (!value || value.startsWith("#") || isExternal(value)) {
      continue;
    }

    const cleaned = stripQueryAndHash(value);
    if (!cleaned.startsWith("/")) {
      continue;
    }

    if (cleaned.startsWith("/_next")) {
      continue;
    }

    const ext = path.extname(cleaned);
    if (ext && assetExts.has(ext)) {
      const assetPath = path.join(publicDir, cleaned.replace(/^\\//, ""));
      if (!fs.existsSync(assetPath)) {
        assetErrors.push({ file, value });
      }
      continue;
    }

    const isRoute = routePatterns.some((pattern) => pattern.test(cleaned));
    if (!isRoute) {
      linkErrors.push({ file, value });
    }
  }
}

if (linkErrors.length || assetErrors.length) {
  if (linkErrors.length) {
    console.error("Broken internal links:");
    for (const err of linkErrors) {
      console.error(`- ${path.relative(appRoot, err.file)} -> ${err.value}`);
    }
  }

  if (assetErrors.length) {
    console.error("Missing local assets:");
    for (const err of assetErrors) {
      console.error(`- ${path.relative(appRoot, err.file)} -> ${err.value}`);
    }
  }

  process.exit(1);
}

console.log("Link and asset checks passed.");
