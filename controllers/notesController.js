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




