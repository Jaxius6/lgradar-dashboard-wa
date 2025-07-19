// Quick verification script to check if Stripe is configured correctly
// Run with: node verify-setup.js

const fs = require('fs');
const path = require('path');

// Simple .env.local parser
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  } catch (error) {
    console.log('❌ Could not read .env.local file');
    process.exit(1);
  }
}

loadEnvFile();
console.log('🔍 Verifying Stripe Configuration...\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_MONTHLY_PRICE_ID',
  'STRIPE_YEARLY_PRICE_ID'
];

let allConfigured = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const isConfigured = value && !value.includes('your_') && !value.includes('_here');
  
  console.log(`${isConfigured ? '✅' : '❌'} ${envVar}: ${isConfigured ? 'Configured' : 'Missing or placeholder'}`);
  
  if (!isConfigured) {
    allConfigured = false;
  }
});

console.log('\n📋 Configuration Status:');
if (allConfigured) {
  console.log('✅ All Stripe environment variables are configured!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run the SQL script in your Supabase dashboard');
  console.log('2. Set up webhooks in Stripe dashboard');
  console.log('3. Enable authentication by removing test mode');
  console.log('4. Test your subscription flow');
} else {
  console.log('❌ Some environment variables need to be configured.');
  console.log('\n📝 Please update your .env.local file with:');
  console.log('- Your actual Stripe API keys');
  console.log('- Your actual Price IDs from Stripe products');
  console.log('- Your webhook secret from Stripe webhooks');
}

console.log('\n📖 See SETUP_CHECKLIST.md for detailed instructions.');