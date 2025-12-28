#!/usr/bin/env node
/**
 * License Checker Script
 * Enterprise-Grade License Compliance Check
 *
 * This script checks all dependencies for license compliance
 * and fails if any blocked licenses are found (excluding approved exceptions).
 */

const checker = require("license-checker");
const fs = require("fs");
const path = require("path");

// Load license configuration
const configPath = path.join(__dirname, "..", "license-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const ALLOWED_LICENSES = config.allowedLicenses || [];
const BLOCKED_LICENSES = config.blockedLicenses || [];
const WARNING_LICENSES = config.warningLicenses || [];
const EXCEPTIONS = config.exceptions || {};

console.log("🔍 Checking licenses for compliance...\n");

// Helper function to extract package name without version
function getPackageName(fullName) {
  return fullName.split("@").slice(0, -1).join("@");
}

checker.init(
  {
    start: path.join(__dirname, ".."),
    production: true,
    summary: false,
  },
  (err, packages) => {
    if (err) {
      console.error("❌ Error checking licenses:", err);
      process.exit(1);
    }

    const violations = [];
    const warnings = [];
    const exceptions = [];

    Object.keys(packages).forEach((pkg) => {
      const license = packages[pkg].licenses;
      const licenseString = Array.isArray(license)
        ? license.join(", ")
        : license;
      const pkgName = getPackageName(pkg);

      // Check if package is in exceptions list
      if (EXCEPTIONS[pkgName] && EXCEPTIONS[pkgName].approved) {
        exceptions.push({
          package: pkg,
          license: licenseString,
          reason: EXCEPTIONS[pkgName].reason,
        });
        return; // Skip further checks for approved exceptions
      }

      // Check if license is in allowed list
      const isAllowed = ALLOWED_LICENSES.some(
        (allowed) =>
          licenseString.includes(allowed) || licenseString === allowed
      );

      // Check for blocked licenses
      const isBlocked = BLOCKED_LICENSES.some((blocked) =>
        licenseString.includes(blocked)
      );

      // Check for warning licenses
      const isWarning = WARNING_LICENSES.some((warning) =>
        licenseString.includes(warning)
      );

      if (isBlocked) {
        violations.push({
          package: pkg,
          license: licenseString,
          repository: packages[pkg].repository,
        });
      } else if (isWarning) {
        warnings.push({
          package: pkg,
          license: licenseString,
          repository: packages[pkg].repository,
        });
      } else if (!isAllowed) {
        warnings.push({
          package: pkg,
          license: licenseString,
          repository: packages[pkg].repository,
          reason: "Unknown/unrecognized license",
        });
      }
    });

    // Report approved exceptions
    if (exceptions.length > 0) {
      console.log("ℹ️  APPROVED EXCEPTIONS:\n");
      exceptions.forEach((e) => {
        console.log(`  Package: ${e.package}`);
        console.log(`  License: ${e.license}`);
        console.log(`  Reason: ${e.reason}`);
        console.log("");
      });
    }

    // Report violations
    if (violations.length > 0) {
      console.log("❌ BLOCKED LICENSES FOUND:\n");
      violations.forEach((v) => {
        console.log(`  Package: ${v.package}`);
        console.log(`  License: ${v.license}`);
        console.log(`  Repository: ${v.repository || "N/A"}`);
        console.log("");
      });
      console.log(
        `\n❌ Found ${violations.length} package(s) with blocked licenses.`
      );
      console.log(
        "   Action required: Remove these packages or add approved exception.\n"
      );
      process.exit(1);
    }

    // Report warnings
    if (warnings.length > 0) {
      console.log("⚠️  WARNING LICENSES FOUND:\n");
      warnings.forEach((w) => {
        console.log(`  Package: ${w.package}`);
        console.log(`  License: ${w.license}`);
        console.log(`  Repository: ${w.repository || "N/A"}`);
        if (w.reason) {
          console.log(`  Reason: ${w.reason}`);
        }
        console.log("");
      });
      console.log(
        `\n⚠️  Found ${warnings.length} package(s) with warning/unknown licenses.`
      );
      console.log(
        "   Review these licenses and add to exceptions if acceptable.\n"
      );
    }

    console.log("✅ License compliance check passed!");
    console.log(`   Total packages checked: ${Object.keys(packages).length}`);
    console.log(`   Approved exceptions: ${exceptions.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Violations: ${violations.length}\n`);

    process.exit(0);
  }
);
