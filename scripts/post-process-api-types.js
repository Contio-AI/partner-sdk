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
 * Rename map for generated type names whose swagger-typescript-api output
 * differs from the SDK's canonical public name.
 *
 * The spec's definition keys are `<pkg>.<Type>` (Go package-path leaks were
 * fixed at the source in CON-7378), so this map only smooths over cases where
 * the pascal-cased `<Pkg><Type>` form is awkwardly redundant.
 */
const TYPE_RENAMES = {
  // transcript_import.TranscriptImportResponse / transcript_import.AudioTranscriptImportStatusResponse
  TranscriptImportTranscriptImportResponse: 'TranscriptImportResponse',
  TranscriptImportAudioTranscriptImportStatusResponse: 'AudioTranscriptImportStatusResponse',
};

/**
 * Generated type names that must never appear in the public type surface.
 * A match means the upstream spec regressed to leaking Go import paths.
 */
const FORBIDDEN_NAME_PATTERN = /\bRomeApi\w+/g;

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

  // Rename generated types to their canonical SDK names
  for (const [from, to] of Object.entries(TYPE_RENAMES)) {
    const re = new RegExp(`\\b${from}\\b`, 'g');
    const hits = (content.match(re) || []).length;
    if (hits > 0) {
      content = content.replace(re, to);
      console.log(`Renamed ${hits} occurrence(s) of '${from}' -> '${to}'`);
    }
  }

  const leaked = [...new Set(content.match(FORBIDDEN_NAME_PATTERN) || [])];
  if (leaked.length > 0) {
    console.error('Error: generated types leak Go package paths (fix the spec upstream, see CON-7378):');
    for (const name of leaked) console.error(`  - ${name}`);
    process.exit(1);
  }

  fs.writeFileSync(API_TYPES_PATH, content);
}

postProcess();

