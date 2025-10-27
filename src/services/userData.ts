import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from './firebase';

interface GenerationSavePayload {
  prompt: string;
  generatedImageBase64: string;
  generatedImageMimeType?: string;
  originalImageDataUrl?: string | null;
  originalImageMimeType?: string | null;
}

const buildDataUrl = (base64: string, mimeType = 'image/jpeg') =>
  `data:${mimeType};base64,${base64}`;

const getGenerationId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const saveGeneration = async (
  userId: string,
  payload: GenerationSavePayload
): Promise<void> => {
  const generationId = getGenerationId();
  const generatedDataUrl = buildDataUrl(
    payload.generatedImageBase64,
    payload.generatedImageMimeType
  );

  const generatedRef = ref(
    storage,
    `users/${userId}/generations/${generationId}/generated`
  );

  await uploadString(generatedRef, generatedDataUrl, 'data_url');
  const generatedImageUrl = await getDownloadURL(generatedRef);

  let originalImageUrl: string | null = null;
  if (payload.originalImageDataUrl) {
    const originalRef = ref(
      storage,
      `users/${userId}/generations/${generationId}/original`
    );
    await uploadString(originalRef, payload.originalImageDataUrl, 'data_url');
    originalImageUrl = await getDownloadURL(originalRef);
  }

  await addDoc(collection(db, 'users', userId, 'generations'), {
    generationId,
    prompt: payload.prompt,
    generatedImageUrl,
    originalImageUrl,
    createdAt: serverTimestamp(),
  });
};
