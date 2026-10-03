import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const candidateExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".css", ".yml", ".yaml", ".html"]);
const blockedPatterns = [
  { label: "email address", expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { label: "US Social Security number", expression: /\b\d{3}-\d{2}-\d{4}\b/ },
  { label: "OpenAI API key", expression: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/ },
  { label: "AWS access key", expression: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "private key material", expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: "publicly exposed secret variable", expression: /NEXT_PUBLIC_[A-Z0-9_]*(?:KEY|SECRET|TOKEN)/i },
];

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter((file) => file !== "package-lock.json")
  .filter((file) => file && candidateExtensions.has(extname(file).toLowerCase()));

const findings = [];
for (const file of files) {
  const contents = readFileSync(file, "utf8");
  for (const { label, expression } of blockedPatterns) {
    const match = expression.exec(contents);
    if (match) findings.push(`${file}: found ${label}`);
  }
}

if (findings.length) {
  console.error(`Privacy scan failed:\n${findings.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Privacy scan passed for ${files.length} tracked/untracked text files (email, SSN, API-key, AWS-key, private-key, and NEXT_PUBLIC secret patterns).`);
}
