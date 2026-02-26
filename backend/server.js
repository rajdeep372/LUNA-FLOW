// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const axios = require('axios'); // Added axios for ML API communication

// const app = express();
// app.use(cors());
// app.use(express.json());

// // database connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // Database model (Schema)
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   name: String,
//   profile: {
//     age: { type: Number, default: 25 },
//     averageCycleLength: { type: Number, default: 28 },
//     location: { type: String, default: '' }
//   }
// });

// const logSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   startDate: String,
//   endDate: String,
//   duration: Number,
//   cycleLength: Number,
//   flowIntensity: String,
//   painLevel: String,
//   symptoms: [String],
//   isMissed: Boolean,
//   notes: String
// });

// const User = mongoose.model('User', userSchema);
// const PeriodLog = mongoose.model('PeriodLog', logSchema);

// // API routes

// // 1. Register
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     const newUser = new User({ email, password, name });
//     await newUser.save();
//     res.json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2. Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3. Fetch data
// app.get('/api/data/:userId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     const logs = await PeriodLog.find({ userId: req.params.userId }).sort({ startDate: -1 });
//     res.json({ profile: user.profile, logs });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 4. Adding logs
// app.post('/api/logs', async (req, res) => {
//   try {
//     const { userId, log, age } = req.body;
//     const newLog = new PeriodLog({ ...log, userId });
//     await newLog.save();

//     const logs = await PeriodLog.find({ userId, isMissed: false }).sort({ startDate: -1 });
//     let avgCycle = 28;
//     if (logs.length > 1) {
//        const totalDays = logs.reduce((acc, curr) => acc + (curr.cycleLength || 28), 0);
//        avgCycle = Math.round(totalDays / logs.length);
//     }

//     await User.findByIdAndUpdate(userId, { 
//       'profile.age': age,
//       'profile.averageCycleLength': avgCycle 
//     });

//     const allLogs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
//     res.json({ logs: allLogs, profile: { age, averageCycleLength: avgCycle } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 5. Profile Update
// app.put('/api/profile/:userId', async (req, res) => {
//   try {
//     const { profile } = req.body;
//     await User.findByIdAndUpdate(req.params.userId, { profile });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 6. Delete the log (DELETE)
// app.delete('/api/logs/:id', async (req, res) => {
//   try {
//     const { userId } = req.body;
//     await PeriodLog.findByIdAndDelete(req.params.id);

//     // Update the list again after deleting
//     const allLogs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
    
//     // Find the new average cycle
//     const validLogs = allLogs.filter(l => !l.isMissed);
//     let avgCycle = 28;
//     if (validLogs.length > 1) {
//        const totalDays = validLogs.reduce((acc, curr) => acc + (curr.cycleLength || 28), 0);
//        avgCycle = Math.round(totalDays / validLogs.length);
//     }
    
//    // Update user profile
//     await User.findByIdAndUpdate(userId, { 'profile.averageCycleLength': avgCycle });

//     res.json({ logs: allLogs, profile: { averageCycleLength: avgCycle } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 7. Reset all (RESET)
// app.delete('/api/reset/:userId', async (req, res) => {
//   try {
//     await PeriodLog.deleteMany({ userId: req.params.userId });
//     await User.findByIdAndUpdate(req.params.userId, { 
//       'profile.averageCycleLength': 28 
//     });
//     res.json({ success: true, message: "All records reset successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 8. ML Health Prediction Route
// app.post('/api/predict', async (req, res) => {
//   try {
//     const { age, cycleLength, duration, flowIntensity, painLevel, symptoms } = req.body;

//     // Map String values from MongoDB format to Numbers for the ML Model
//     const flowMap = { 'Light': 1, 'Normal': 2, 'Heavy': 3 };
//     const painMap = { 'Low': 1, 'Medium': 2, 'High': 3 };

//     const mappedFlow = flowMap[flowIntensity] || 2; 
//     const mappedPain = painMap[painLevel] || 2;     
//     const symptomCount = Array.isArray(symptoms) ? symptoms.length : 0;

//     // Send the mapped data to the Python FastAPI microservice
//     const pythonResponse = await axios.post('http://127.0.0.1:8000/predict_health_risk', {
//       age: age || 25,
//       menstrual_cycle_length: cycleLength || 28,
//       maternal_status: 0, 
//       period_duration: duration || 5,
//       blood_flow: mappedFlow,
//       pain_level: mappedPain,
//       symptom_count: symptomCount
//     });

//     // Send the ML prediction back to the React frontend
//     res.json({
//       success: true,
//       prediction: pythonResponse.data.predicted_condition,
//       warning: pythonResponse.data.warning
//     });
    
//   } catch (err) {
//     console.error("ML Service Error:", err.message);
//     res.status(500).json({ error: "Failed to communicate with the ML prediction service. Ensure Python API is running." });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Added axios for ML API communication

const app = express();
app.use(cors());
app.use(express.json());

// database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Database model (Schema)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  profile: {
    age: { type: Number, default: 25 },
    averageCycleLength: { type: Number, default: 28 },
    location: { type: String, default: '' }
  }
});

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: String,
  endDate: String,
  duration: Number,
  cycleLength: Number,
  flowIntensity: String,
  painLevel: String,
  symptoms: [String],
  isMissed: Boolean,
  notes: String
});

// --- NEW: Analysis Save Schema (আগের কোনো স্কিমা চেঞ্জ করা হয়নি) ---
const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  geminiAnalysis: Object, // For storing the full Gemini result
  mlPrediction: Object    // For storing the ML prediction result
});

const User = mongoose.model('User', userSchema);
const PeriodLog = mongoose.model('PeriodLog', logSchema);
const SavedAnalysis = mongoose.model('SavedAnalysis', analysisSchema); // NEW

// API routes

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password, name });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Fetch data
app.get('/api/data/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const logs = await PeriodLog.find({ userId: req.params.userId }).sort({ startDate: -1 });
    res.json({ profile: user.profile, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Adding logs
app.post('/api/logs', async (req, res) => {
  try {
    const { userId, log, age } = req.body;
    const newLog = new PeriodLog({ ...log, userId });
    await newLog.save();

    const logs = await PeriodLog.find({ userId, isMissed: false }).sort({ startDate: -1 });
    let avgCycle = 28;
    if (logs.length > 1) {
       const totalDays = logs.reduce((acc, curr) => acc + (curr.cycleLength || 28), 0);
       avgCycle = Math.round(totalDays / logs.length);
    }

    await User.findByIdAndUpdate(userId, { 
      'profile.age': age,
      'profile.averageCycleLength': avgCycle 
    });

    const allLogs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
    res.json({ logs: allLogs, profile: { age, averageCycleLength: avgCycle } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Profile Update
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { profile } = req.body;
    await User.findByIdAndUpdate(req.params.userId, { profile });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Delete the log (DELETE)
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    await PeriodLog.findByIdAndDelete(req.params.id);

    // Update the list again after deleting
    const allLogs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
    
    // Find the new average cycle
    const validLogs = allLogs.filter(l => !l.isMissed);
    let avgCycle = 28;
    if (validLogs.length > 1) {
       const totalDays = validLogs.reduce((acc, curr) => acc + (curr.cycleLength || 28), 0);
       avgCycle = Math.round(totalDays / validLogs.length);
    }
    
   // Update user profile
    await User.findByIdAndUpdate(userId, { 'profile.averageCycleLength': avgCycle });

    res.json({ logs: allLogs, profile: { averageCycleLength: avgCycle } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Reset all (RESET)
app.delete('/api/reset/:userId', async (req, res) => {
  try {
    await PeriodLog.deleteMany({ userId: req.params.userId });
    await User.findByIdAndUpdate(req.params.userId, { 
      'profile.averageCycleLength': 28 
    });
    res.json({ success: true, message: "All records reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. ML Health Prediction Route
app.post('/api/predict', async (req, res) => {
  try {
    const { age, cycleLength, duration, flowIntensity, painLevel, symptoms } = req.body;

    // Map String values from MongoDB format to Numbers for the ML Model
    const flowMap = { 'Light': 1, 'Normal': 2, 'Heavy': 3 };
    const painMap = { 'Low': 1, 'Medium': 2, 'High': 3 };

    const mappedFlow = flowMap[flowIntensity] || 2; 
    const mappedPain = painMap[painLevel] || 2;     
    const symptomCount = Array.isArray(symptoms) ? symptoms.length : 0;

    // Send the mapped data to the Python FastAPI microservice
    const pythonResponse = await axios.post('http://127.0.0.1:8000/predict_health_risk', {
      age: age || 25,
      menstrual_cycle_length: cycleLength || 28,
      maternal_status: 0, 
      period_duration: duration || 5,
      blood_flow: mappedFlow,
      pain_level: mappedPain,
      symptom_count: symptomCount
    });

    // Send the ML prediction back to the React frontend
    res.json({
      success: true,
      prediction: pythonResponse.data.predicted_condition,
      warning: pythonResponse.data.warning
    });
    
  } catch (err) {
    console.error("ML Service Error:", err.message);
    res.status(500).json({ error: "Failed to communicate with the ML prediction service. Ensure Python API is running." });
  }
});

// --- NEW: 9. Route to Save Analysis Results ---
app.post('/api/analysis/save', async (req, res) => {
  try {
    const { userId, geminiAnalysis, mlPrediction } = req.body;
    const newAnalysis = new SavedAnalysis({ userId, geminiAnalysis, mlPrediction });
    await newAnalysis.save();
    res.json({ success: true, message: "Analysis saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: 10. Route to Fetch Saved Analyses for Dashboard ---
app.get('/api/analysis/:userId', async (req, res) => {
  try {
    const analyses = await SavedAnalysis.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));