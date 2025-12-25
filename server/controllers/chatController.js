import asyncHandler from 'express-async-handler';
import axios from 'axios';

// @desc    Handle chat request and forward to n8n
// @route   POST /api/chat
// @access  Private
const handleChat = asyncHandler(async (req, res) => {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
        res.status(400);
        throw new Error('Please provide chatId and message');
    }

    const payload = {
        chatId,
        userId: req.user._id,
        message
    };

    try {
        const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://sengon8n.app.n8n.cloud/webhook/ai-book';
        const n8nResponse = await axios.post(
            webhookUrl,
            payload
        );

        res.json(n8nResponse.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('n8n Error Data:', error.response.data);
            console.error('n8n Error Status:', error.response.status);
        } else {
            console.error('Error forwarding to n8n:', error.message);
        }
        res.status(502);
        throw new Error('Failed to communicate with AI service: ' + (error.response?.data?.message || error.message));
    }
});

export { handleChat };
