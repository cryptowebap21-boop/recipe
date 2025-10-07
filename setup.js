#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => {
  rl.question(prompt, resolve);
});

async function setup() {
  console.log('\n🚀 AI Detector & Humanizer Setup');
  console.log('==================================\n');
  
  console.log('This script will help you configure your Router API connection.');
  console.log('You will need:');
  console.log('1. Router API Key (required for DeepSeek v3 access)');
  console.log('2. Router API URL (optional, will use default if not provided)\n');
  
  try {
    // Get Router API Key
    const apiKey = await question('Enter your Router API Key: ');
    if (!apiKey.trim()) {
      console.log('❌ Router API Key is required! Setup cancelled.');
      process.exit(1);
    }
    
    // Get Router API URL
    const defaultUrl = 'https://api.router.example.com/v1/completions';
    const apiUrl = await question(`Enter Router API URL (press Enter for default: ${defaultUrl}): `);
    const finalUrl = apiUrl.trim() || defaultUrl;
    
    // Create .env file content
    const envContent = `# AI Detector & Humanizer Configuration
# Generated on ${new Date().toISOString()}

# Router API Configuration (Required)
ROUTER_API_KEY=${apiKey.trim()}
ROUTER_API_URL=${finalUrl}

# Application Configuration
NODE_ENV=production
PORT=5000

# Session Configuration (auto-generated)
SESSION_SECRET=${require('crypto').randomBytes(32).toString('hex')}
`;

    // Write .env file
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration saved successfully!');
    console.log(`📁 Created: ${envPath}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Run: npm install');
    console.log('2. Start development: npm run dev');
    console.log('3. Start production: npm start');
    
    console.log('\n🔒 Security Notes:');
    console.log('- Your .env file contains sensitive information');
    console.log('- Never commit .env to version control');
    console.log('- For Replit deployment, set these as environment secrets');
    
    console.log('\n🌐 For Replit Deployment:');
    console.log('1. Go to your Repl secrets tab');
    console.log('2. Add these secrets:');
    console.log('   - ROUTER_API_KEY: [your-api-key]');
    console.log(`   - ROUTER_API_URL: ${finalUrl}`);
    console.log('   - SESSION_SECRET: [auto-generated-or-custom]');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setup();
