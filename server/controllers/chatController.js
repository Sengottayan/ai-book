import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Book from '../models/Book.js';

// @desc    Handle chat request and forward to n8n or handle locally
// @route   POST /api/chat
// @access  Private
const handleChat = asyncHandler(async (req, res) => {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
        res.status(400);
        throw new Error('Please provide chatId and message');
    }

    // Local Search Logic
    const searchRegex = /(?:search|find|looking for|show me)\s+(?:book|books)?\s*(.+)/i;
    const match = message.match(searchRegex);

    if (match && match[1]) {
        const query = match[1].trim();
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ]
        }).limit(3);

        if (books.length > 0) {
            const results = books.map(b => `• **${b.title}**: [View Book](/book/${b._id})`).join('\n');
            res.json({
                text: `Here are some books I found for "${query}":\n\n${results}`
            });
            return;
        } else {
            // If no books found locally, maybe let n8n handle it or just say generic
            // keeping n8n fallback might be better if n8n has broader knowledge
        }
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
