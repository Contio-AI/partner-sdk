#!/usr/bin/env node
/**
 * Post-process generated API types to replace 'any' with 'unknown'
 *
 * This script runs after swagger-typescript-api generates types
 * to ensure stricter type safety by replacing Record<string, any>
 * with Record<string, unknown>.
 *
 * Usage: node scripts/post-process-api-types.js
 */

const fs = require('fs');
const path = require('path');

const API_TYPES_PATH = path.join(__dirname, '..', 'src', 'generated', 'api-types.ts');

/**
 * Rename map for generated type names that leak Go package internals.
 *
 * The backend's OpenAPI generator (swag) emits definition keys derived from
 * Go package names, and falls back to the full underscored import path when
 * package names collide — e.g. `rome_api_services_partner.AutomationAction`.
 * swagger-typescript-api pascal-cases those keys into type names like
 * `RomeApiServicesPartnerAutomationAction`.
 *
 * Until the spec normalizes its definition keys upstream (CON-7378), we map
 * the leaked generated names back to their clean canonical names here. When
 * the spec is fixed, the generated names become clean on their own and the
 * corresponding entries simply stop matching — the map is safe to leave in
 * place (and serves as the reference list for the spec-side rename).
 */
const TYPE_RENAMES = {
  // services/partner.AutomationAction (regressed from partner.AutomationAction)
  RomeApiServicesPartnerAutomationAction: 'PartnerAutomationAction',
  // controllers/external/partner/admin/toolkit.* (regressed from toolkit.*)
  RomeApiControllersExternalPartnerAdminToolkitManifestRef: 'ToolkitManifestRef',
  RomeApiControllersExternalPartnerAdminToolkitNextStepActionButtonRelation: 'ToolkitNextStepActionButtonRelation',
  RomeApiControllersExternalPartnerAdminToolkitTemplateNextStepRelation: 'ToolkitTemplateNextStepRelation',
  // controllers/external/partner/user/transcript_import.* (new in v1.12)
  RomeApiControllersExternalPartnerUserTranscriptImportTranscriptImportResponse: 'TranscriptImportResponse',
  TranscriptImportAudioTranscriptImportStatusResponse: 'AudioTranscriptImportStatusResponse',
};

function postProcess() {
  console.log('Post-processing API types:', API_TYPES_PATH);

  if (!fs.existsSync(API_TYPES_PATH)) {
    console.error('Error: api-types.ts not found at', API_TYPES_PATH);
    process.exit(1);
  }

  let content = fs.readFileSync(API_TYPES_PATH, 'utf8');
  
  // Count replacements for reporting
  const matches = content.match(/Record<string, any>/g);
  const count = matches ? matches.length : 0;
  
  // Replace Record<string, any> with Record<string, unknown>
  content = content.replace(/Record<string, any>/g, 'Record<string, unknown>');
  console.log(`Replaced ${count} occurrences of 'Record<string, any>' with 'Record<string, unknown>'`);

  // Rename types that leak Go package internals to their clean names
  for (const [from, to] of Object.entries(TYPE_RENAMES)) {
    const re = new RegExp(`\\b${from}\\b`, 'g');
    const hits = (content.match(re) || []).length;
    if (hits > 0) {
      content = content.replace(re, to);
      console.log(`Renamed ${hits} occurrence(s) of '${from}' -> '${to}'`);
    }
  }

  fs.writeFileSync(API_TYPES_PATH, content);
}

postProcess();

