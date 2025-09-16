#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

function runCommand(command, options = {}) {
  try {
    console.log(`▶️ Running: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      timeout: 300000, // 5 minute timeout
      ...options 
    });
    console.log(`✅ Command completed: ${command}`);
    return result;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(`Exit code: ${error.status}`);
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

try {
  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  runCommand('npm install', { cwd: process.cwd() });

  // Step 2: Install function dependencies if directory exists
  const functionsDir = path.join(process.cwd(), 'netlify', 'functions');
  if (existsSync(functionsDir)) {
    console.log('🔧 Installing function dependencies...');
    runCommand('npm install', { cwd: functionsDir });
    
    console.log('🔨 Compiling TypeScript functions...');
    try {
      runCommand('npm run build', { cwd: functionsDir });
    } catch (error) {
      console.log('⚠️ TypeScript compilation failed, but continuing...');
      console.log('Error details:', error.message);
    }
  }

  // Step 3: Generate the site
  console.log('🏗️ Generating static site...');
  runCommand('npm run generate', { cwd: process.cwd() });

  // Step 4: Verify output directory was created
  const outputDir = path.join(process.cwd(), '.output', 'public');
  if (existsSync(outputDir)) {
    console.log('✅ Output directory confirmed: .output/public exists');
  } else {
    console.error('❌ Output directory missing: .output/public does not exist');
    throw new Error('Build completed but output directory was not created');
  }

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
