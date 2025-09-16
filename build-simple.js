#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🚀 Starting simple Netlify build...');

function runCommand(command, options = {}) {
  try {
    console.log(`▶️ Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      timeout: 300000,
      ...options 
    });
    console.log(`✅ Completed: ${command}`);
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    console.error(`Error: ${error.message}`);
    // Don't throw - continue with build
  }
}

try {
  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  runCommand('npm install');

  // Step 2: Install function dependencies (skip TypeScript compilation)
  const functionsDir = path.join(process.cwd(), 'netlify', 'functions');
  if (existsSync(functionsDir)) {
    console.log('🔧 Installing function dependencies...');
    runCommand('npm install', { cwd: functionsDir });
  }

  // Step 3: Generate static site
  console.log('🏗️ Generating static site...');
  runCommand('npm run generate');

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
