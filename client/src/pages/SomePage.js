import React from 'react';
import DemoPlaceholder from './DemoPlaceholder';

const SomePage = () => (
  <DemoPlaceholder
    title="Some Feature"
    message="Unable to fetch data. Database connection pending or not configured."
    detail="(This is a demo page. Feature will be available once the database is connected.)"
  />
);

export default SomePage;