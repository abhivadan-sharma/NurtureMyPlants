require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

async function testClaudeConnection() {
  console.log('🧪 Testing Claude API Connection');
  console.log('================================');
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('🔑 API Key available:', apiKey ? 'Yes' : 'No');
  console.log('🔑 API Key starts with:', apiKey ? apiKey.substring(0, 20) + '...' : 'Not found');
  
  if (!apiKey) {
    console.error('❌ No API key found!');
    return;
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Test different model names to find which ones work
  const modelsToTest = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-sonnet-20240229', 
    'claude-3-opus-20240229',
    'claude-3-haiku-20240307'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🤖 Testing model: ${modelName}`);
      
      const message = await anthropic.messages.create({
        model: modelName,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello! Just testing the API. Please respond with "API test successful"'
          }
        ],
      });

      console.log(`✅ Model ${modelName} works!`);
      console.log('📝 Response:', message.content[0].text);
      
      // If this model works, we found our answer
      console.log(`\n🎉 SUCCESS! Use this model: ${modelName}`);
      break;
      
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.status, error.error?.error?.message || error.message);
    }
  }
}

testClaudeConnection().catch(console.error);