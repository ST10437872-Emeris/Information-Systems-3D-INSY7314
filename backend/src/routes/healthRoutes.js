const express = require('express');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (_req, res) => {
  return successResponse(res, 200, 'HustleHub+ API is running.', {
    service: 'HustleHubPlus Backend API',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
