/**
 * AI Room Design Service - Secure Backend Implementation
 *
 * This service uses Firebase Functions to securely call AI APIs from the backend.
 * API keys are never exposed to the client, and rate limiting is enforced server-side.
 */
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';
import { withRetry, APIError, cache, createCacheKey } from '../utils/apiUtils';

// Initialize Firebase Functions
const functions = getFunctions(app);

// Callable functions
const generateRoomDesignFunction = httpsCallable(functions, 'generateRoomDesign');
const getUserUsageStatsFunction = httpsCallable(functions, 'getUserUsageStats');

export interface RedesignOptions {
    useCache?: boolean;
    cacheTimeMs?: number;
    maxRetries?: number;
}

const DEFAULT_REDESIGN_OPTIONS: RedesignOptions = {
    useCache: true,
    cacheTimeMs: 86400000, // 24 hours
    maxRetries: 2,
};

/**
 * Get user's current usage statistics from the backend
 */
export const getUserUsageStats = async (): Promise<{
    count: number;
    limit: number;
    resetAt: number;
}> => {
    try {
        const result = await getUserUsageStatsFunction();
        return result.data as { count: number; limit: number; resetAt: number };
    } catch (error) {
        // Return default stats on error
        return {
            count: 0,
            limit: 10,
            resetAt: Date.now() + (24 * 60 * 60 * 1000),
        };
    }
};

/**
 * Generate a simple hash of the image data for caching purposes
 */
const generateImageHash = async (base64Data: string): Promise<string> => {
    // Use first 100 chars of base64 for a quick hash
    return base64Data.substring(0, 100);
};

/**
 * Redesign a room using AI - calls Firebase Function securely
 *
 * @param base64ImageData - Base64 encoded image data (without data URL prefix)
 * @param mimeType - MIME type of the image (e.g., 'image/jpeg')
 * @param prompt - User's design prompt
 * @param options - Optional configuration
 * @returns Base64 encoded image data of the generated design
 */
export const redesignRoom = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string,
    options: RedesignOptions = {}
): Promise<string> => {
    const config = { ...DEFAULT_REDESIGN_OPTIONS, ...options };

    // Create cache key based on image hash and prompt
    const imageHash = await generateImageHash(base64ImageData);
    const cacheKey = createCacheKey('room-redesign', imageHash, btoa(prompt).substring(0, 20));

    // Check cache first
    if (config.useCache) {
        const cachedResult = cache.get(cacheKey) as string | null;
        if (cachedResult) {
            return cachedResult;
        }
    }

    // Call Firebase Function to generate design
    const generateDesign = async (): Promise<string> => {
        try {
            const imageDataUrl = `data:${mimeType};base64,${base64ImageData}`;

            const result = await generateRoomDesignFunction({
                prompt: prompt,
                imageDataUrl: imageDataUrl,
            });

            const data = result.data as { success: boolean; suggestions: string; timestamp: number };

            if (!data.success || !data.suggestions) {
                throw new APIError(
                    'Failed to generate design suggestions',
                    500,
                    'GENERATION_FAILED',
                    true
                );
            }

            // Convert text suggestions to a visual representation
            // Note: This is still a placeholder until we integrate actual image generation
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Create gradient background
                const gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 800, 600);

                // Add title
                ctx.fillStyle = 'white';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('AI Design Suggestions', 400, 50);

                // Add suggestions text
                ctx.font = '16px Arial';
                ctx.textAlign = 'left';
                const words = data.suggestions.split(' ');
                let line = '';
                let y = 100;
                const maxWidth = 700;
                const lineHeight = 25;

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && line !== '') {
                        ctx.fillText(line, 50, y);
                        line = word + ' ';
                        y += lineHeight;
                        if (y > 550) break;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, 50, y);

                // Convert to base64
                const imageData = canvas.toDataURL('image/png').split(',')[1];
                return imageData;
            }

            throw new APIError(
                'Failed to create design visualization',
                500,
                'CANVAS_ERROR',
                true
            );

        } catch (error: any) {
            // Handle Firebase Functions errors
            if (error.code === 'functions/unauthenticated') {
                throw new APIError(
                    'Please sign in to generate designs',
                    401,
                    'UNAUTHENTICATED',
                    false
                );
            }

            if (error.code === 'functions/resource-exhausted') {
                throw new APIError(
                    'Daily generation limit reached. Please try again tomorrow.',
                    429,
                    'QUOTA_EXCEEDED',
                    false
                );
            }

            if (error.code === 'functions/invalid-argument') {
                throw new APIError(
                    'Invalid input provided. Please check your image and prompt.',
                    400,
                    'INVALID_INPUT',
                    false
                );
            }

            if (error instanceof APIError) {
                throw error;
            }

            throw new APIError(
                'An unexpected error occurred while generating the design',
                500,
                'UNKNOWN_ERROR',
                true
            );
        }
    };

    // Execute with retry logic
    const result = await withRetry(generateDesign, {
        maxAttempts: config.maxRetries,
    });

    // Cache the result
    if (config.useCache && config.cacheTimeMs) {
        cache.set(cacheKey, result, config.cacheTimeMs);
    }

    return result;
};
