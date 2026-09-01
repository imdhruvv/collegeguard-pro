// client/src/components/dashboard/UserList.js
import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Box, Typography, Chip } from '@mui/material';
import { Person, School, AdminPanelSettings } from '@mui/icons-material';

const UserList = () => {
  const [users] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Student', status: 'Online', lastActive: '2 min ago' },
    { id: 2, name: 'Dr. Bob Smith', role: 'Faculty', status: 'Online', lastActive: '5 min ago' },
    { id: 3, name: 'Charlie Brown', role: 'Student', status: 'Offline', lastActive: '1 hour ago' },
    { id: 4, name: 'Prof. Diana Lee', role: 'Faculty', status: 'Online', lastActive: '10 min ago' },
    { id: 5, name: 'Admin User', role: 'Admin', status: 'Online', lastActive: 'Just now' },
  ]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <AdminPanelSettings />;
      case 'Faculty': return <School />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#f44336';
      case 'Faculty': return '#2196f3';
      default: return '#4caf50';
    }
  };

  return (
    <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
      <List dense>
        {users.map((user) => (
          <ListItem key={user.id} divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getRoleColor(user.role) }}>
                {getRoleIcon(user.role)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last active: {user.lastActive}
                  </Typography>
                </Box>
              }
            />
            <Chip
              label={user.status}
              color={user.status === 'Online' ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;