import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { stepSimulationState, REGIONS, CHAOS_PRESETS, PRESET_CLIENT_CITIES } from './simulationEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Central Digital Twin State
let currentInputs = {
  attendees: 1200,
  publishers: 6,
  audioOnly: 20,
  spectators: 1174,
  joinRate: 15,
  leaveRate: 2,
  interactionRate: 45,
  clientLocation: PRESET_CLIENT_CITIES[0],
  chaos: CHAOS_PRESETS['stable'],
  failures: {
    failedRegion: null,
    failedAz: null
  },
  weights: {
    latencyWeight: 0.35,
    capacityWeight: 0.25,
    congestionWeight: 0.20,
    reliabilityWeight: 0.15,
    costWeight: 0.05
  }
};

let simState = stepSimulationState(null, currentInputs);

function tick() {
  simState = stepSimulationState(simState, currentInputs);
  io.emit('state_update', simState);
}

// REST Endpoints
app.get('/api/state', (req, res) => {
  res.json(simState);
});

app.post('/api/inputs', (req, res) => {
  currentInputs = { ...currentInputs, ...req.body };
  simState = stepSimulationState(simState, currentInputs);
  io.emit('state_update', simState);
  res.json({ status: 'ok', state: simState });
});

app.post('/api/chaos', (req, res) => {
  const chaosPreset = req.body;
  currentInputs.chaos = chaosPreset;
  if (chaosPreset.failedRegion !== undefined) {
    currentInputs.failures.failedRegion = chaosPreset.failedRegion;
  }
  if (chaosPreset.failedAz !== undefined) {
    currentInputs.failures.failedAz = chaosPreset.failedAz;
  }
  simState = stepSimulationState(simState, currentInputs);
  io.emit('state_update', simState);
  res.json({ status: 'ok', state: simState });
});

// Socket.IO real-time channels
io.on('connection', (socket) => {
  socket.emit('state_update', simState);

  socket.on('update_input', (data) => {
    currentInputs = { ...currentInputs, ...data };
    simState = stepSimulationState(simState, currentInputs);
    io.emit('state_update', simState);
  });

  socket.on('inject_chaos', (chaosData) => {
    currentInputs.chaos = { ...currentInputs.chaos, ...chaosData };
    if (chaosData.failedRegion !== undefined) {
      currentInputs.failures.failedRegion = chaosData.failedRegion;
    }
    if (chaosData.failedAz !== undefined) {
      currentInputs.failures.failedAz = chaosData.failedAz;
    }
    simState = stepSimulationState(simState, currentInputs);
    io.emit('state_update', simState);
  });
});

// 1-second discrete simulation tick
setInterval(tick, 1000);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`[OK] KubeStream Control Plane server live on http://localhost:${PORT}`);
});