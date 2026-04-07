/**
 * CAREER RECOMMENDATION SYSTEM - BACKEND SERVER
 * Complete Express.js server with dataset processing and API endpoints
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const InferenceEngine = require('./inferenceEngine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for recommendations history
const recommendationsHistory = [];
let datasetStats = null;

/**
 * Load and process dataset on server startup
 */
function loadDatasetStats() {
  const stats = {
    totalStudents: 0,
    careerDistribution: {},
    avgCGPAByCareer: {},
    avgSkillsByCareer: {},
    loaded: false
  };

  const datasetPath = path.join(__dirname, 'dataset', 'roo_data.csv');
  
  if (!fs.existsSync(datasetPath)) {
    console.warn('⚠️  Dataset not found. Using sample data for demo.');
    return stats;
  }

  return new Promise((resolve) => {
    const students = [];
    
    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        students.push(row);
        stats.totalStudents++;
      })
      .on('end', () => {
        console.log(`✓ Loaded ${stats.totalStudents} students from dataset`);
        
        // Calculate statistics
        stats.loaded = true;
        stats.students = students;
        
        resolve(stats);
      })
      .on('error', (error) => {
        console.error('Error loading dataset:', error);
        resolve(stats);
      });
  });
}

/**
 * API ENDPOINTS
 */

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    datasetLoaded: datasetStats?.loaded || false,
    studentsInDataset: datasetStats?.totalStudents || 0
  });
});

// Get dataset statistics
app.get('/api/dataset-stats', (req, res) => {
  if (!datasetStats || !datasetStats.loaded) {
    return res.json({
      loaded: false,
      message: 'Dataset not loaded. Using default knowledge base.'
    });
  }

  res.json({
    loaded: true,
    totalStudents: datasetStats.totalStudents,
    careerDistribution: datasetStats.careerDistribution,
    avgCGPAByCareer: datasetStats.avgCGPAByCareer
  });
});

// Main recommendation endpoint
app.post('/api/recommend', (req, res) => {
  try {
    const studentProfile = req.body;
    
    // Validate input
    if (!studentProfile || !studentProfile.profile || !studentProfile.skills) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Student profile must include profile, skills, interests, personality, achievements, and constraints'
      });
    }

    // Run inference engine
    const engine = new InferenceEngine();
    const result = engine.run(studentProfile);

    // Store in history
    const recommendation = {
      id: `REC_${Date.now()}`,
      timestamp: new Date().toISOString(),
      studentProfile: {
        cgpa: studentProfile.profile.cgpa,
        branch: studentProfile.profile.branch
      },
      topRecommendation: result.recommendations[0]?.name || 'None',
      confidence: result.recommendations[0]?.confidencePercentage || 'N/A',
      allRecommendations: result.recommendations.length
    };
    
    recommendationsHistory.unshift(recommendation);
    
    // Keep only last 100 recommendations
    if (recommendationsHistory.length > 100) {
      recommendationsHistory.pop();
    }

    // Return result
    res.json({
      success: true,
      result: result,
      recommendationId: recommendation.id
    });

  } catch (error) {
    console.error('Error in recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get recommendations history
app.get('/api/history', (req, res) => {
  res.json({
    total: recommendationsHistory.length,
    recommendations: recommendationsHistory.slice(0, 20) // Last 20
  });
});

// Get specific recommendation by ID
app.get('/api/recommendation/:id', (req, res) => {
  const rec = recommendationsHistory.find(r => r.id === req.params.id);
  
  if (!rec) {
    return res.status(404).json({
      error: 'Not found',
      message: 'Recommendation not found'
    });
  }
  
  res.json(rec);
});

// Batch processing endpoint (for dataset validation)
app.post('/api/batch-process', async (req, res) => {
  try {
    const { students } = req.body;
    
    if (!Array.isArray(students)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Expected array of student profiles'
      });
    }

    const results = [];
    const engine = new InferenceEngine();

    for (const student of students) {
      const result = engine.run(student);
      results.push({
        student: student.profile,
        topRecommendation: result.recommendations[0]?.name,
        confidence: result.recommendations[0]?.finalCF
      });
    }

    res.json({
      success: true,
      processed: results.length,
      results: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  if (recommendationsHistory.length === 0) {
    return res.json({
      totalRecommendations: 0,
      careerDistribution: {},
      avgConfidence: 0
    });
  }

  // Calculate analytics
  const careerCounts = {};
  let totalConfidence = 0;
  let confidenceCount = 0;

  recommendationsHistory.forEach(rec => {
    // Count career distribution
    const career = rec.topRecommendation;
    careerCounts[career] = (careerCounts[career] || 0) + 1;

    // Sum confidence scores
    if (rec.confidence && rec.confidence !== 'N/A') {
      const conf = parseFloat(rec.confidence.replace('%', ''));
      if (!isNaN(conf)) {
        totalConfidence += conf;
        confidenceCount++;
      }
    }
  });

  const avgConfidence = confidenceCount > 0 
    ? (totalConfidence / confidenceCount).toFixed(1) 
    : 0;

  res.json({
    totalRecommendations: recommendationsHistory.length,
    careerDistribution: careerCounts,
    avgConfidence: `${avgConfidence}%`,
    last24Hours: recommendationsHistory.filter(r => {
      const recTime = new Date(r.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return recTime > dayAgo;
    }).length
  });
});

// Clear history (for testing)
app.delete('/api/history', (req, res) => {
  const count = recommendationsHistory.length;
  recommendationsHistory.length = 0;
  
  res.json({
    success: true,
    message: `Cleared ${count} recommendations from history`
  });
});

/**
 * Server initialization
 */
async function startServer() {
  console.log('🚀 Starting Career Recommendation System Server...\n');
  
  // Load dataset statistics
  console.log('📊 Loading dataset statistics...');
  datasetStats = await loadDatasetStats();
  
  if (datasetStats.loaded) {
    console.log(`✓ Dataset loaded: ${datasetStats.totalStudents} students`);
  } else {
    console.log('ℹ️  Running without dataset (using default knowledge base)');
  }

  // Start server
  app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║   CAREER RECOMMENDATION SYSTEM - SERVER RUNNING          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`\n🌐 Server: http://localhost:${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`\n📚 Available Endpoints:`);
    console.log(`   GET  /api/health           - Health check`);
    console.log(`   GET  /api/dataset-stats    - Dataset statistics`);
    console.log(`   POST /api/recommend        - Get career recommendations`);
    console.log(`   GET  /api/history          - Recommendation history`);
    console.log(`   GET  /api/analytics        - System analytics`);
    console.log(`\n✨ Frontend: Open http://localhost:${PORT} in your browser\n`);
  });
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Start the server
startServer();

module.exports = app;