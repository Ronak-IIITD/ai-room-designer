import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Configure CORS to only allow requests from your domain
const corsHandler = cors({
  origin: true, // In production, replace with your actual domain
  credentials: true,
});

/**
 * Rate limiting helper using Firestore
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  const rateLimitRef = admin.firestore()
    .collection('rateLimits')
    .doc(userId);
  
  const doc = await rateLimitRef.get();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (!doc.exists) {
    await rateLimitRef.set({
      count: 1,
      resetAt: now + oneDay,
    });
    return true;
  }
  
  const data = doc.data()!;
  
  // Reset if past reset time
  if (now > data.resetAt) {
    await rateLimitRef.set({
      count: 1,
      resetAt: now + oneDay,
    });
    return true;
  }
  
  // Check if under limit (10 per day)
  if (data.count < 10) {
    await rateLimitRef.update({
      count: admin.firestore.FieldValue.increment(1),
    });
    return true;
  }
  
  return false;
}

/**
 * Sanitize user input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  // Remove any potentially dangerous characters
  return input
    .replace(/[<>\"\'&]/g, '') // Remove HTML special chars
    .trim()
    .slice(0, 5000); // Limit to 5000 characters
}

/**
 * Generate room design using AI
 * This function securely calls the OpenRouter API from the backend
 */
export const generateRoomDesign = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to generate designs'
    );
  }
  
  const userId = context.auth.uid;
  
  // Check rate limit
  const withinLimit = await checkRateLimit(userId);
  if (!withinLimit) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Daily generation limit reached. Please try again tomorrow.'
    );
  }
  
  // Validate input
  if (!data.prompt || typeof data.prompt !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Prompt is required and must be a string'
    );
  }
  
  if (!data.imageDataUrl || typeof data.imageDataUrl !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Image data URL is required'
    );
  }
  
  // Sanitize inputs
  const sanitizedPrompt = sanitizeInput(data.prompt);
  
  if (sanitizedPrompt.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Prompt cannot be empty'
    );
  }
  
  try {
    // Get API key from Firebase environment configuration
    const apiKey = functions.config().openrouter?.apikey;
    
    if (!apiKey) {
      functions.logger.error('OpenRouter API key not configured');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Service configuration error'
      );
    }
    
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://your-app-domain.com', // Replace with your domain
        'X-Title': 'AI Room Designer',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: data.imageDataUrl,
                },
              },
              {
                type: 'text',
                text: `As an interior design expert, analyze this room image and provide detailed design suggestions based on this request: "${sanitizedPrompt}". 
                
Please provide:
1. Analysis of the current room
2. Specific design recommendations
3. Color palette suggestions
4. Furniture and decor ideas
5. Layout improvements

Be specific and actionable in your suggestions.`,
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      functions.logger.error('OpenRouter API error:', errorText);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate design suggestions'
      );
    }
    
    const result = await response.json();
    const designSuggestions = result.choices[0]?.message?.content;
    
    if (!designSuggestions) {
      throw new functions.https.HttpsError(
        'internal',
        'No design suggestions generated'
      );
    }
    
    // Log successful generation (without sensitive data)
    functions.logger.info('Design generated successfully', {
      userId,
      promptLength: sanitizedPrompt.length,
    });
    
    return {
      success: true,
      suggestions: designSuggestions,
      timestamp: Date.now(),
    };
    
  } catch (error) {
    functions.logger.error('Error generating design:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An unexpected error occurred while generating the design'
    );
  }
});

/**
 * Get user's current usage stats
 */
export const getUserUsageStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }
  
  const userId = context.auth.uid;
  const rateLimitRef = admin.firestore()
    .collection('rateLimits')
    .doc(userId);
  
  const doc = await rateLimitRef.get();
  
  if (!doc.exists) {
    return {
      count: 0,
      limit: 10,
      resetAt: Date.now() + (24 * 60 * 60 * 1000),
    };
  }
  
  const rateLimitData = doc.data()!;
  const now = Date.now();
  
  // If past reset time, return fresh stats
  if (now > rateLimitData.resetAt) {
    return {
      count: 0,
      limit: 10,
      resetAt: now + (24 * 60 * 60 * 1000),
    };
  }
  
  return {
    count: rateLimitData.count,
    limit: 10,
    resetAt: rateLimitData.resetAt,
  };
});
