// client/src/components/dashboard/SecurityFeed.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Chip, Box, Typography } from '@mui/material';
import { Warning, Info, Error } from '@mui/icons-material';

const SecurityFeed = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Move sample data inside useEffect to avoid dependency issues
    const sampleEvents = [
      { id: 1, type: 'Motion Detected', location: 'Library - Floor 2', priority: 'Low', time: '5 min ago' },
      { id: 2, type: 'Unauthorized Access', location: 'Lab Building - Room 301', priority: 'High', time: '12 min ago' },
      { id: 3, type: 'Fire Alarm Test', location: 'Main Building', priority: 'Medium', time: '1 hour ago' },
      { id: 4, type: 'Motion Detected', location: 'Cafeteria', priority: 'Low', time: '2 hours ago' },
    ];

    setEvents(sampleEvents);
    
    // Simulate new security events
    const interval = setInterval(() => {
      const randomEvent = {
        id: Date.now(),
        type: ['Motion Detected', 'Door Access', 'Fire Alarm'][Math.floor(Math.random() * 3)],
        location: ['Library', 'Lab Building', 'Cafeteria', 'Main Hall'][Math.floor(Math.random() * 4)],
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        time: 'Just now'
      };
      
      setEvents(prev => [randomEvent, ...prev.slice(0, 4)]);
    }, 15000); // New event every 15 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array is now correct

  const getIcon = (priority) => {
    switch (priority) {
      case 'High': return <Error color="error" />;
      case 'Medium': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getChipColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
      <List dense>
        {events.map((event) => (
          <ListItem key={event.id} divider>
            <ListItemIcon>
              {getIcon(event.priority)}
            </ListItemIcon>
            <ListItemText
              primary={event.type}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.time}
                  </Typography>
                </Box>
              }
            />
            <Chip
              label={event.priority}
              color={getChipColor(event.priority)}
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SecurityFeed;