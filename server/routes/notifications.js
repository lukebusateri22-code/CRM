const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user_id]
    );
    
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array instead of error for better UX
    res.json([]);
  }
});

// Get unread count
router.get('/unread', async (req, res) => {
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = $1 AND read = false`,
      [user_id]
    );
    
    res.json({ count: parseInt(result.rows[0]?.count || 0) });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    // Return 0 instead of error
    res.json({ count: 0 });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET read = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.put('/mark-all-read', async (req, res) => {
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    await pool.query(
      `UPDATE notifications 
       SET read = true, updated_at = NOW()
       WHERE user_id = $1 AND read = false`,
      [user_id]
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

module.exports = router;
