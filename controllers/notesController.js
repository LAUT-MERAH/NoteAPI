const db = require('../config/db');

exports.getAllNotes = (req, res) => {
    console.log('Fetching all notes...');
    
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM notes LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    db.execute(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ status: 'error', error: err.message });
        }
        
        if (results.length === 0) {
            console.log('No notes found.');
            return res.status(200).json({ 
                status: 'success', 
                message: 'No notes available.',
                data: [] 
            });
        }

        console.log('Notes found:', results);
        res.status(200).json({ 
            status: 'success',
            message: 'Notes retrieved successfully.',
            data: results 
        });
    });
};

exports.createNote = (req, res) => {
    const { title, note } = req.body;
    const errors = [];

    if (!title) errors.push('Title is required.');
    if (!note) errors.push('Note is required.');

    if (errors.length > 0) {
        return res.status(400).json({ 
            status: 'error', 
            message: errors 
        });
    }

    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    db.execute(sql, [title, datetime, note], (err, result) => {
        if (err) {
            console.error('Error inserting note:', err.message);
            return res.status(500).json({ status: 'error', message: 'Failed to create note.' });
        }
        console.log('Note created successfully, ID:', result.insertId);
        res.status(201).json({ 
            status: 'success', 
            message: 'Note created successfully', 
            id: result.insertId 
        });
    });
};
