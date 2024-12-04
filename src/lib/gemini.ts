import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCnraivAcPqcY2T5HVF3d44XTwbQATM7nk');

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });