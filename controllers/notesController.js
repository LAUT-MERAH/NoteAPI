const db = require('../config/db');

exports.getAllNotes = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM notes LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    db.execute(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ status: 'error', error: err.message });
        }

        if (results.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No notes available.',
                data: [],
            });
        }

        const formattedResults = results.map(note => {
            const utcDate = new Date(`${note.datetime}Z`);
            const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); 
            const formattedDatetime = wibDate.toISOString().slice(0, 19).replace('T', ' ');

            return {
                ...note,
                datetime: formattedDatetime,
            };
        });

        res.status(200).json({
            status: 'success',
            message: 'Notes retrieved successfully.',
            data: formattedResults,
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

exports.getNoteById = (req, res) => {
    const noteId = req.params.id;
    console.log('Requested Note ID:', noteId); 

    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.execute(sql, [noteId], (err, results) => {
        if (err) {
            console.error('Error fetching note by ID:', err.message);
            return res.status(500).json({ status: 'error', message: 'Failed to fetch note.' });
        }

        console.log('Query Results:', results); 
        if (results.length === 0) {
            console.log('Note not found for ID:', noteId); 
            return res.status(404).json({ 
                status: 'error', 
                message: 'Note not found.' 
            });
        }

        const utcDate = new Date(`${results[0].datetime}Z`);
        const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
        const formattedDatetime = wibDate.toISOString().slice(0, 19).replace('T', ' ');

        const formattedResult = {
            ...results[0],
            datetime: formattedDatetime,
        };

        console.log('Note found:', formattedResult);
        res.status(200).json({
            status: 'success',
            message: 'Note retrieved successfully.',
            data: formattedResult,
        });
    });
};


exports.updateNote = (req, res) => {
    const noteId = req.params.id;
    const { title, note, datetime } = req.body; // Datetime provided by the user in WIB format
    const errors = [];

    // Validate required fields
    if (!title) errors.push('Title is required.');
    if (!note) errors.push('Note is required.');
    if (!datetime) errors.push('Datetime is required.');

    if (errors.length > 0) {
        return res.status(400).json({ 
            status: 'error', 
            message: errors 
        });
    }

    // Convert user-provided WIB datetime to UTC
    const wibDate = new Date(datetime); // Assumes datetime is in YYYY-MM-DD HH:mm:ss format
    if (isNaN(wibDate.getTime())) {
        console.error('Invalid datetime provided:', datetime);
        return res.status(400).json({
            status: 'error',
            message: 'Invalid datetime format. Use YYYY-MM-DD HH:mm:ss format.',
        });
    }
    const utcDate = new Date(wibDate.getTime() - 7 * 60 * 60 * 1000); // Subtract 7 hours for WIB to UTC
    const formattedDatetime = utcDate.toISOString().slice(0, 19).replace('T', ' ');

    const sql = 'UPDATE notes SET title = ?, note = ?, datetime = ? WHERE id = ?';
    db.execute(sql, [title, note, formattedDatetime, noteId], (err, result) => {
        if (err) {
            console.error('Error updating note:', err.message);
            return res.status(500).json({ status: 'error', message: 'Failed to update note.' });
        }

        if (result.affectedRows === 0) {
            console.log('Note not found for updating.');
            return res.status(404).json({ 
                status: 'error', 
                message: 'Note not found.' 
            });
        }

        console.log('Note updated successfully.');
        res.status(200).json({ 
            status: 'success', 
            message: 'Note updated successfully.',
            updated_at: formattedDatetime // Returning UTC format datetime
        });
    });
};


exports.deleteNote = (req, res) => {
    const noteId = req.params.id;
    const sql = 'DELETE FROM notes WHERE id = ?';
    
    db.execute(sql, [noteId], (err, result) => {
        if (err) {
            console.error('Error deleting note:', err.message);
            return res.status(500).json({ status: 'error', message: 'Failed to delete note.' });
        }

        if (result.affectedRows === 0) {
            console.log('Note not found for deletion.');
            return res.status(404).json({ 
                status: 'error', 
                message: 'Note not found.' 
            });
        }

        console.log('Note deleted successfully.');
        res.status(200).json({ 
            status: 'success', 
            message: 'Note deleted successfully.' 
        });
    });
};