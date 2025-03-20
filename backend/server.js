const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require('http');
// const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: ["http://localhost:5173", "http://localhost:3001"], // Vite's default port
//         methods: ["GET", "POST"]
//     }
// });

// Middleware
app.use(cors());
app.use(express.json({ }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}


// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        console.log({file});
        
        const ext = file && file.originalname ? path.extname(file.originalname) : '.png';
        cb(null, `screenshot-${Date.now()}${ext}`);
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Store feedback items
let feedbackItems = [];

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.type || 'Internal server error',
        message: err.message || 'An unexpected error occurred'
    });
};

// Custom error class
class APIError extends Error {
    constructor(message, status = 500, type = 'Internal server error') {
        super(message);
        this.status = status;
        this.type = type;
    }
}

// Routes
const validateFeedback = (data) => {
    const MAX_TITLE_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 1000;

    const errors = [];
    
    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    } else if (data.title.length > MAX_TITLE_LENGTH) {
        errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`);
    }

    if (!data.url) {
        errors.push('URL is required');
    }

    return errors;
};

app.post('/api/feedback', upload.single('screenshot'), (req, res, next) => {
    try {
        const { title, description, url, timestamp } = req.body;
        const screenshot = req.file ? req.file.filename : null;

        // Validate input
        const validationErrors = validateFeedback({ title, description, url });
        if (validationErrors.length > 0) {
            throw new APIError('Validation failed', 400, 'Invalid input');
        }

        const feedbackItem = {
        lastUpdated: new Date().toISOString(),
        id: Date.now(),
        title,
        description,
        url,
        screenshot,
        timestamp: timestamp || new Date().toISOString(),
        status: 'open'
    };

        feedbackItems.push(feedbackItem);
        // io.emit('newFeedback', feedbackItem);
        res.status(201).json(feedbackItem);
    } catch (error) {
        console.error('Error processing feedback:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process feedback'
        });
    }
});

// Helper function to sort feedback items
const sortFeedbackItems = (items, sortBy = 'timestamp', order = 'desc') => {
    return [...items].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (order === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
        }
    });
};

// Helper function to filter feedback items
const filterFeedbackItems = (items, filters) => {
    return items.filter(item => {
        let matches = true;

        if (filters.status && item.status !== filters.status) {
            matches = false;
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesTitle = item.title.toLowerCase().includes(searchTerm);
            const matchesDescription = item.description.toLowerCase().includes(searchTerm);
            if (!matchesTitle && !matchesDescription) {
                matches = false;
            }
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            const itemDate = new Date(item.timestamp);
            if (itemDate < startDate) {
                matches = false;
            }
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            const itemDate = new Date(item.timestamp);
            if (itemDate > endDate) {
                matches = false;
            }
        }

        return matches;
    });
};

app.get('/api/feedback', (req, res, next) => {
    try {
        const {
            sortBy = 'timestamp',
            order = 'desc',
            status,
            search,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        // Apply filters
        let filteredItems = filterFeedbackItems(feedbackItems, {
            status,
            search,
            startDate,
            endDate
        });

        // Apply sorting
        filteredItems = sortFeedbackItems(filteredItems, sortBy, order);

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        res.json({
            items: paginatedItems,
            total: filteredItems.length,
            page: parseInt(page),
            totalPages: Math.ceil(filteredItems.length / limit)
        });
    } catch (error) {
        next(error);
    }
});

// Update feedback status
// Delete feedback
app.delete('/api/feedback/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const index = feedbackItems.findIndex(item => item.id === parseInt(id));

        if (index === -1) {
            throw new APIError('Feedback item not found', 404, 'Not found');
        }

        // Remove the item
        const [deletedItem] = feedbackItems.splice(index, 1);

        // If there was a screenshot, delete it
        if (deletedItem.screenshot) {
            const fs = require('fs');
            const screenshotPath = path.join(__dirname, 'uploads', deletedItem.screenshot);
            
            fs.unlink(screenshotPath, (err) => {
                if (err) {
                    console.error('Error deleting screenshot:', err);
                }
            });
        }

        // Notify clients about the deletion
        // io.emit('feedbackDeleted', { id: parseInt(id) });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

app.patch('/api/feedback/:id/status', (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            throw new APIError(`Status must be one of: ${validStatuses.join(', ')}`, 400, 'Invalid status');
        }

        // Find and update the feedback item
        const feedbackItem = feedbackItems.find(item => item.id === parseInt(id));
        if (!feedbackItem) {
            throw new APIError('Feedback item not found', 404, 'Not found');
        }

        // Update status and add timestamp
        feedbackItem.status = status;
        feedbackItem.lastUpdated = new Date().toISOString();

        // Notify clients about the update
        // io.emit('feedbackUpdated', feedbackItem);

        res.json(feedbackItem);
    } catch (error) {
        next(error);
    }
});

// Socket connection handling
// io.on('connection', (socket) => {
//     console.log('Client connected');
    
//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// Apply error handling middleware last
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
