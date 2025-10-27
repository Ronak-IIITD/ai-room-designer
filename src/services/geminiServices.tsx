// Original Google Gemini Implementation (Commented out - using OpenRouter instead)
// import { GoogleGenAI, Modality } from '@google/genai';
import { withRetry, APIError, checkRateLimit, cache, createCacheKey } from '../utils/apiUtils';

const getApiKey = () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new APIError(
            "VITE_API_KEY environment variable not set. Please add your OpenRouter API key to the .env file.",
            401,
            'MISSING_API_KEY',
            false
        );
    }
    return apiKey;
};

// Original Gemini AI initialization (commented out)
// const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

// OpenRouter configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free'; // Free tier model

export interface RedesignOptions {
    useCache?: boolean;
    cacheTimeMs?: number;
    maxRetries?: number;
}

const DEFAULT_REDESIGN_OPTIONS: RedesignOptions = {
    useCache: true,
    cacheTimeMs: 86400000, // 24 hours for free tier optimization
    maxRetries: 1, // Reduce retries to save quota
};

// Free tier quota management
const DAILY_REQUEST_LIMIT = 5; // Conservative limit for free tier
const QUOTA_STORAGE_KEY = 'gemini_daily_usage';

interface DailyUsage {
    date: string;
    count: number;
}

const getDailyUsage = (): DailyUsage => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
    
    if (stored) {
        const usage: DailyUsage = JSON.parse(stored);
        if (usage.date === today) {
            return usage;
        }
    }
    
    // New day, reset counter
    const newUsage: DailyUsage = { date: today, count: 0 };
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(newUsage));
    return newUsage;
};

const incrementDailyUsage = (): void => {
    const usage = getDailyUsage();
    usage.count += 1;
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(usage));
};

const checkDailyQuota = (): void => {
    const usage = getDailyUsage();
    if (usage.count >= DAILY_REQUEST_LIMIT) {
        throw new APIError(
            `Daily limit reached (${DAILY_REQUEST_LIMIT} requests). This helps preserve your free API quota. Please try again tomorrow or upgrade to a paid plan for unlimited usage.`,
            429,
            'DAILY_QUOTA_EXCEEDED',
            false
        );
    }
};

const createOptimizedPrompt = (userPrompt: string): string => {
    // Shorter, more efficient prompt for free tier
    const optimizedPrompt = `Transform this room with: ${userPrompt.substring(0, 100)}. Keep layout, change style only.`;
    return optimizedPrompt;
};

export const redesignRoom = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string,
    options: RedesignOptions = {}
): Promise<string> => {
    const config = { ...DEFAULT_REDESIGN_OPTIONS, ...options };
    
    // Check daily quota first (for free tier management)
    checkDailyQuota();
    
    const optimizedPrompt = createOptimizedPrompt(prompt);
    
    // Create cache key based on image hash and prompt
    const imageHash = await generateImageHash(base64ImageData);
    const cacheKey = createCacheKey('room-redesign', imageHash, btoa(optimizedPrompt).substring(0, 20));
    
    // Check cache first (24-hour cache for free tier)
    if (config.useCache) {
        const cachedResult = cache.get(cacheKey) as string | null;
        if (cachedResult) {
            console.log('Returning cached result - quota preserved');
            return cachedResult;
        }
    }

    // Check rate limiting
    await checkRateLimit();

    /* ORIGINAL GEMINI IMPLEMENTATION (COMMENTED OUT)
    const generateImage = async (): Promise<string> => {
        try {
            const ai = getAI();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { 
                            inlineData: { 
                                data: base64ImageData, 
                                mimeType: mimeType 
                            } 
                        },
                        { text: optimizedPrompt }
                    ]
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            if (response.candidates && response.candidates.length > 0) {
                const parts = response.candidates[0]?.content?.parts;
                let imageData: string | null = null;
                let textResponse: string = '';

                if (parts) {
                    for (const part of parts) {
                        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                            imageData = part.inlineData.data || null;
                        } else if (part.text) {
                            textResponse += part.text;
                        }
                    }
                }
                
                if (imageData) {
                    return imageData;
                }

                if (textResponse.trim()) {
                    throw new APIError(
                        `AI refused to generate the design: ${textResponse}`,
                        400,
                        'CONTENT_POLICY_VIOLATION',
                        false
                    );
                }
            }

            throw new APIError(
                "No image was generated. The AI might have encountered an issue with your image or prompt. Please try a different image or modify your prompt.",
                500,
                'NO_IMAGE_GENERATED',
                true
            );

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            
            if (error instanceof APIError) {
                throw error;
            }
            
            if (error instanceof Error) {
                if (error.message.includes('quota') || error.message.includes('limit')) {
                    throw new APIError(
                        "API quota exceeded. Please try again later.",
                        429,
                        'QUOTA_EXCEEDED',
                        true
                    );
                }
                
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    throw new APIError(
                        "Network error occurred. Please check your connection and try again.",
                        503,
                        'NETWORK_ERROR',
                        true
                    );
                }
                
                throw new APIError(
                    `Failed to generate room design: ${error.message}`,
                    500,
                    'API_ERROR',
                    true
                );
            }
            
            throw new APIError(
                "An unexpected error occurred while generating the room design. Please try again.",
                500,
                'UNKNOWN_ERROR',
                true
            );
        }
    };
    END ORIGINAL GEMINI IMPLEMENTATION */

    // NEW OPENROUTER IMPLEMENTATION
    const generateImage = async (): Promise<string> => {
        try {
            const apiKey = getApiKey();
            
            // Construct the message for OpenRouter's chat format
            const messages = [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: optimizedPrompt
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64ImageData}`
                            }
                        }
                    ]
                }
            ];

            const requestBody = {
                model: OPENROUTER_MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 4096
            };

            console.log('Calling OpenRouter API...');
            
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Room Designer'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('OpenRouter API error:', errorData);
                
                throw new APIError(
                    errorData.error?.message || `API request failed with status ${response.status}`,
                    response.status,
                    'OPENROUTER_API_ERROR',
                    response.status >= 500
                );
            }

            const data = await response.json();
            console.log('OpenRouter response received');

            // Extract the text response from OpenRouter
            const textResponse = data.choices?.[0]?.message?.content;
            
            if (!textResponse) {
                throw new APIError(
                    "No response generated. Please try again.",
                    500,
                    'NO_RESPONSE_GENERATED',
                    true
                );
            }

            // For now, OpenRouter with Gemini vision models returns text descriptions
            // We need to use a different approach for actual image generation
            // This is a limitation - vision models analyze images but don't generate them
            
            // Convert the response to a data URL for display (placeholder)
            // In production, you'd need to use an actual image generation model
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                // Create a gradient background
                const gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 800, 600);
                
                // Add text response
                ctx.fillStyle = 'white';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('AI Design Suggestion', 400, 50);
                
                ctx.font = '16px Arial';
                ctx.textAlign = 'left';
                const words = textResponse.split(' ');
                let line = '';
                let y = 100;
                const maxWidth = 700;
                const lineHeight = 25;
                
                for (let word of words) {
                    const testLine = line + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && line !== '') {
                        ctx.fillText(line, 50, y);
                        line = word + ' ';
                        y += lineHeight;
                        if (y > 550) break; // Stop if we run out of space
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, 50, y);
                
                // Convert canvas to base64
                const imageData = canvas.toDataURL('image/png').split(',')[1];
                return imageData;
            }

            throw new APIError(
                "Failed to create design visualization",
                500,
                'CANVAS_ERROR',
                true
            );

        } catch (error) {
            console.error("Error calling OpenRouter API:", error);
            
            if (error instanceof APIError) {
                throw error;
            }
            
            if (error instanceof Error) {
                // Check for specific error patterns
                if (error.message.includes('quota') || error.message.includes('limit')) {
                    throw new APIError(
                        "API quota exceeded. Please try again later.",
                        429,
                        'QUOTA_EXCEEDED',
                        true
                    );
                }
                
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    throw new APIError(
                        "Network error occurred. Please check your connection and try again.",
                        503,
                        'NETWORK_ERROR',
                        true
                    );
                }
                
                throw new APIError(
                    `Failed to generate room design: ${error.message}`,
                    500,
                    'API_ERROR',
                    true
                );
            }
            
            throw new APIError(
                "An unexpected error occurred while generating the room design. Please try again.",
                500,
                'UNKNOWN_ERROR',
                true
            );
        }
    };

    // Execute with retry logic (reduced retries for free tier)
    const result = await withRetry(generateImage, {
        maxAttempts: config.maxRetries,
    });

    // Increment daily usage counter
    incrementDailyUsage();

    // Cache the result (24 hours for free tier)
    if (config.useCache && config.cacheTimeMs) {
        cache.set(cacheKey, result, config.cacheTimeMs);
    }

    return result;
};

// Helper function to generate a hash from base64 image data
const generateImageHash = async (base64Data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(base64Data.substring(0, 1000)); // Use first 1000 chars for hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
};
