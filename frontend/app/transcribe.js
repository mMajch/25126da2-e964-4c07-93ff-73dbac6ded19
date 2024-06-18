import { AssemblyAI } from 'assemblyai';

const assemblyApiKey = "df0ffa09c65147adb784ba334d2b34f0";
const client = new AssemblyAI({
    apiKey: "df0ffa09c65147adb784ba334d2b34f0"
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { audioUrl } = req.body;

            const transcript = await client.transcripts.submit({
                audio_url: audioUrl,
            });

            res.status(200).json({ transcriptId: transcript.id });
        } catch (error) {
            console.error('Error transcribing audio:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}