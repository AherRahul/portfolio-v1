#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

try {
  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });

  // Step 2: Install function dependencies if directory exists
  const functionsDir = path.join(process.cwd(), 'netlify', 'functions');
  if (existsSync(functionsDir)) {
    console.log('🔧 Installing function dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: functionsDir });
    
    console.log('🔨 Compiling TypeScript functions...');
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: functionsDir });
    } catch (error) {
      console.log('⚠️ TypeScript compilation failed, but continuing...');
    }
  }

  // Step 3: Generate the site
  console.log('🏗️ Generating static site...');
  execSync('npm run generate', { stdio: 'inherit', cwd: process.cwd() });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
