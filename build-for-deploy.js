#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } = require('fs');
const path = require('path');

console.log('🚀 Building for manual deployment...');

function runCommand(command, options = {}) {
  try {
    console.log(`▶️ Running: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      timeout: 300000,
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

function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const items = readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`📁 Copied: ${srcPath} → ${destPath}`);
    }
  }
}

try {
  // Step 1: Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  const { rmSync } = require('fs');
  if (existsSync('.output')) {
    rmSync('.output', { recursive: true, force: true });
    console.log('🗑️ Removed .output directory');
  }
  if (existsSync('deploy-package')) {
    rmSync('deploy-package', { recursive: true, force: true });
    console.log('🗑️ Removed deploy-package directory');
  }

  // Step 2: Install root dependencies
  console.log('📦 Installing root dependencies...');
  runCommand('npm install');

  // Step 3: Build TypeScript functions
  const functionsDir = path.join(process.cwd(), 'netlify', 'functions');
  if (existsSync(functionsDir)) {
    console.log('🔧 Installing function dependencies...');
    runCommand('npm install', { cwd: functionsDir });
    
    console.log('🔨 Compiling TypeScript functions...');
    runCommand('npm run build', { cwd: functionsDir });
  }

  // Step 4: Generate static site
  console.log('🏗️ Generating static site...');
  runCommand('npm run generate');

  // Step 5: Create deployment package
  console.log('📦 Creating deployment package...');
  const deployDir = 'deploy-package';
  mkdirSync(deployDir, { recursive: true });

  // Copy static site
  const publicDir = path.join('.output', 'public');
  if (existsSync(publicDir)) {
    console.log('📁 Copying static site...');
    copyDirectory(publicDir, deployDir);
  }

  // For manual deployment, copy functions to root netlify/functions structure
  const functionsJsDir = path.join(functionsDir);
  const deployFunctionsDir = path.join(deployDir, 'netlify', 'functions');
  
  if (existsSync(functionsJsDir)) {
    console.log('📁 Copying compiled functions...');
    mkdirSync(deployFunctionsDir, { recursive: true });
    
    // Copy only .js files (compiled from TypeScript)
    const functionFiles = readdirSync(functionsJsDir).filter(file => file.endsWith('.js'));
    
    for (const file of functionFiles) {
      const srcFile = path.join(functionsJsDir, file);
      const destFile = path.join(deployFunctionsDir, file);
      copyFileSync(srcFile, destFile);
      console.log(`📁 Copied function: ${file}`);
    }
    
    // Also copy to the expected location for manual deployments
    const altFunctionsDir = path.join(deployDir, 'functions');
    mkdirSync(altFunctionsDir, { recursive: true });
    
    for (const file of functionFiles) {
      const srcFile = path.join(functionsJsDir, file);
      const destFile = path.join(altFunctionsDir, file);
      copyFileSync(srcFile, destFile);
      console.log(`📁 Copied function to /functions/: ${file}`);
    }

    // Copy package.json for function dependencies
    const functionsPackageJson = path.join(functionsDir, 'package.json');
    if (existsSync(functionsPackageJson)) {
      copyFileSync(functionsPackageJson, path.join(altFunctionsDir, 'package.json'));
      console.log('📁 Copied functions package.json');
    }

    // Copy node_modules for function dependencies (critical for manual deployment)
    const functionsNodeModules = path.join(functionsDir, 'node_modules');
    if (existsSync(functionsNodeModules)) {
      console.log('📁 Copying functions node_modules...');
      copyDirectory(functionsNodeModules, path.join(altFunctionsDir, 'node_modules'));
      console.log('📁 Copied functions node_modules');
    } else {
      console.log('⚠️ Functions node_modules not found - installing dependencies...');
      try {
        runCommand('npm install', { cwd: functionsDir });
        if (existsSync(functionsNodeModules)) {
          copyDirectory(functionsNodeModules, path.join(altFunctionsDir, 'node_modules'));
          console.log('📁 Copied functions node_modules after install');
        }
      } catch (error) {
        console.log('⚠️ Could not install function dependencies, continuing...');
      }
    }
  }

  // Create netlify.toml for manual deployment
  const netlifyConfig = `[build]
  publish = "."
  command = "echo 'Manual deployment - no build needed'"
  functions = "functions"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
  NITRO_PRESET = "netlify"

# Redirect API calls to functions
[[redirects]]
  from = "/api/quiz/generate"
  to = "/.netlify/functions/quiz-generate"
  status = 200

[[redirects]]
  from = "/api/summary/generate"
  to = "/.netlify/functions/summary-generate"
  status = 200
`;
  
  require('fs').writeFileSync(path.join(deployDir, 'netlify.toml'), netlifyConfig);
  console.log('📁 Created netlify.toml for manual deployment');

  // Create _redirects file for manual deployment  
  const redirectsContent = `# API redirects for manual deployment
/api/quiz/generate /.netlify/functions/quiz-generate 200
/api/summary/generate /.netlify/functions/summary-generate 200

# SPA fallback
/* /200.html 200`;

  require('fs').writeFileSync(path.join(deployDir, '_redirects'), redirectsContent);
  console.log('📁 Created _redirects for manual deployment');

  console.log('✅ Build completed successfully!');
  console.log('📂 Deploy directory: deploy-package/');
  console.log('🚀 Ready for manual deployment!');
  
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Netlify dashboard');
  console.log('2. Go to "Sites" and find your site');
  console.log('3. Click "Deploys" tab');
  console.log('4. Drag and drop the entire "deploy-package" folder');
  console.log('5. Your site will be deployed with both static files AND functions!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
