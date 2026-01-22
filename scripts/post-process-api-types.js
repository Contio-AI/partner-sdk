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
  
  fs.writeFileSync(API_TYPES_PATH, content);
  
  console.log(`Replaced ${count} occurrences of 'Record<string, any>' with 'Record<string, unknown>'`);
}

postProcess();

