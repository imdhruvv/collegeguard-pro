// client/src/components/dashboard/WellnessSurveyForm.js
import React, { useState } from 'react';
import { Box, Typography, Rating, TextField, Button, Alert } from '@mui/material';
import { useNotifier } from '../layout/Notifier';

const WellnessSurveyForm = () => {
  const [moodRating, setMoodRating] = useState(3);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const notify = useNotifier();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      notify('Wellness survey submitted successfully!', 'success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setMoodRating(3);
        setComments('');
      }, 3000);
    }, 500);
  };

  if (submitted) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Thank you for your submission! Your wellness data helps us improve campus life.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        How are you feeling today?
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography component="legend">Mood Rating</Typography>
        <Rating
          value={moodRating}
          onChange={(event, newValue) => setMoodRating(newValue)}
          size="large"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          1 = Very Poor, 5 = Excellent
        </Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Comments (Optional)"
        placeholder="Share any thoughts about your well-being or campus life..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!moodRating}
      >
        Submit Survey
      </Button>
    </Box>
  );
};

export default WellnessSurveyForm;