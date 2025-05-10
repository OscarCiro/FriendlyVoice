// GenerateVoiceAvatar flow to create a voice avatar based on user's voice sample.
// It takes voice data URI as input and returns an image data URI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVoiceAvatarInputSchema = z.object({
  voiceDataUri: z
    .string()
    .describe(
      'A voice recording of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type GenerateVoiceAvatarInput = z.infer<typeof GenerateVoiceAvatarInputSchema>;

const GenerateVoiceAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar image as a data URI.'),
});
export type GenerateVoiceAvatarOutput = z.infer<typeof GenerateVoiceAvatarOutputSchema>;

export async function generateVoiceAvatar(
  input: GenerateVoiceAvatarInput
): Promise<GenerateVoiceAvatarOutput> {
  return generateVoiceAvatarFlow(input);
}

const generateVoiceAvatarPrompt = ai.definePrompt({
  name: 'generateVoiceAvatarPrompt',
  input: {schema: GenerateVoiceAvatarInputSchema},
  output: {schema: GenerateVoiceAvatarOutputSchema},
  prompt: `You are an AI avatar generator. You will receive a voice sample from the user, and based on this voice sample, you will generate a unique avatar to represent them. The avatar should be abstract and visually appealing.  The output should be a data URI representing the image. Use teal (#008080) and blue colors in the avatar.

Voice Sample: {{media url=voiceDataUri}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateVoiceAvatarFlow = ai.defineFlow(
  {
    name: 'generateVoiceAvatarFlow',
    inputSchema: GenerateVoiceAvatarInputSchema,
    outputSchema: GenerateVoiceAvatarOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: [
        {media: {url: input.voiceDataUri}},
        {
          text:
            'Generate a unique, abstract and visually appealing avatar representing this voice. Use teal (#008080) and blue colors in the avatar.',
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {avatarDataUri: media.url!};
  }
);
