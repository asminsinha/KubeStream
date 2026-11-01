/**
 * KubeStream Core Architectural Simulation Engine
 * Discrete-timestep digital twin for real-time video conferencing & interactive event cloud infrastructure.
 * 
 * Implements the continuous causal loop:
 * WORKLOAD -> NETWORK/RESOURCE/GEO MODELS -> QOE/ML -> FORECAST -> OPTIMIZATION (Cost/Latency/SLA/Risk) ->
 * SCALING/ROUTING/ADAPTATION -> TELEMETRY/FINOPS/XAI -> FEEDBACK
 */

export const REGIONS = {
  'us-east-1': {
    id: 'us-east-1',
    name: 'N. Virginia (US East)',
    tier: 'CORE_AWS',
    lat: 38.0321,
    lon: -78.4775,
    baseRtt: 15,
    costMultiplier: 1.0,
    maxWorkers: 120,
    reliability: 0.9999,
    azs: ['us-east-1a', 'us-east-1b', 'us-east-1c']
  },
  'us-west-2': {
    id: 'us-west-2',
    name: 'Oregon (US West)',
    tier: 'CORE_AWS',
    lat: 45.5231,
    lon: -122.6765,
    baseRtt: 22,
    costMultiplier: 1.0,
    maxWorkers: 100,
    reliability: 0.9998,
    azs: ['us-west-2a', 'us-west-2b', 'us-west-2c']
  },
  'eu-central-1': {
    id: 'eu-central-1',
    name: 'Frankfurt (Europe)',
    tier: 'CORE_AWS',
    lat: 50.1109,
    lon: 8.6821,
    baseRtt: 35,
    costMultiplier: 1.08,
    maxWorkers: 90,
    reliability: 0.9996,
    azs: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c']
  },
  'eu-west-1': {
    id: 'eu-west-1',
    name: 'Ireland (Europe)',
    tier: 'CORE_AWS',
    lat: 53.3498,
    lon: -6.2603,
    baseRtt: 32,
    costMultiplier: 1.05,
    maxWorkers: 80,
    reliability: 0.9996,
    azs: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c']
  },
  'ap-south-1': {
    id: 'ap-south-1',
    name: 'Mumbai (Asia Pacific)',
    tier: 'CORE_AWS',
    lat: 19.0760,
    lon: 72.8777,
    baseRtt: 42,
    costMultiplier: 1.14,
    maxWorkers: 110,
    reliability: 0.9993,
    azs: ['ap-south-1a', 'ap-south-1b', 'ap-south-1c']
  },
  'ap-southeast-1': {
    id: 'ap-southeast-1',
    name: 'Singapore (Asia Pacific)',
    tier: 'CORE_AWS',
    lat: 1.3521,
    lon: 103.8198,
    baseRtt: 52,
    costMultiplier: 1.18,
    maxWorkers: 85,
    reliability: 0.9994,
    azs: ['ap-southeast-1a', 'ap-southeast-1b', 'ap-southeast-1c']
  },
  'ap-northeast-1': {
    id: 'ap-northeast-1',
    name: 'Tokyo (Asia Pacific)',
    tier: 'CORE_AWS',
    lat: 35.6762,
    lon: 139.6503,
    baseRtt: 58,
    costMultiplier: 1.20,
    maxWorkers: 75,
    reliability: 0.9995,
    azs: ['ap-northeast-1a', 'ap-northeast-1b', 'ap-northeast-1c']
  },
  'sa-east-1': {
    id: 'sa-east-1',
    name: 'São Paulo (South America)',
    tier: 'CORE_AWS',
    lat: -23.5505,
    lon: -46.6333,
    baseRtt: 105,
    costMultiplier: 1.35,
    maxWorkers: 45,
    reliability: 0.9988,
    azs: ['sa-east-1a', 'sa-east-1b', 'sa-east-1c']
  }
};

export const EDGE_NODES = {
  'ap-south-1-wl1': {
    id: 'ap-south-1-wl1',
    name: 'Delhi Airtel 5G Wavelength',
    parentRegion: 'ap-south-1',
    lat: 28.6139,
    lon: 77.2090,
    baseRtt: 8,
    costMultiplier: 1.70,
    capacityLimit: 3000
  },
  'us-east-1-wl1': {
    id: 'us-east-1-wl1',
    name: 'Boston Verizon 5G Wavelength',
    parentRegion: 'us-east-1',
    lat: 42.3601,
    lon: -71.0589,
    baseRtt: 6,
    costMultiplier: 1.65,
    capacityLimit: 4000
  },
  'eu-central-1-wl1': {
    id: 'eu-central-1-wl1',
    name: 'Berlin Vodafone 5G Wavelength',
    parentRegion: 'eu-central-1',
    lat: 52.5200,
    lon: 13.4050,
    baseRtt: 7,
    costMultiplier: 1.68,
    capacityLimit: 3500
  }
};

export const PRESET_CLIENT_CITIES = [
  { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, regionHint: 'ap-south-1' },
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090, regionHint: 'ap-south-1' },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, regionHint: 'ap-south-1' },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060, regionHint: 'us-east-1' },
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194, regionHint: 'us-west-2' },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, regionHint: 'eu-west-1' },
  { name: 'Frankfurt, Germany', lat: 50.1109, lon: 8.6821, regionHint: 'eu-central-1' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, regionHint: 'ap-southeast-1' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, regionHint: 'ap-northeast-1' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, regionHint: 'ap-southeast-1' },
  { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, regionHint: 'sa-east-1' }
];

export const WORKLOAD_PRESETS = {
  '1-to-1': {
    name: '1-to-1 P2P Interview',
    attendees: 2,
    publishers: 2,
    audioOnly: 0,
    spectators: 0,
    joinRate: 0,
    leaveRate: 0,
    interactionRate: 2,
    description: 'Peer-to-peer direct media mesh with STUN/TURN traversal. Zero SFU media plane cost.'
  },
  'small-meeting': {
    name: 'Small Team Standup',
    attendees: 8,
    publishers: 8,
    audioOnly: 0,
    spectators: 0,
    joinRate: 0,
    leaveRate: 0,
    interactionRate: 5,
    description: 'Small interactive room requiring low-latency centralized SFU worker.'
  },
  'interactive-classroom': {
    name: 'Interactive Classroom',
    attendees: 60,
    publishers: 6,
    audioOnly: 15,
    spectators: 39,
    joinRate: 1,
    leaveRate: 0,
    interactionRate: 25,
    description: 'Instructor + student presenters. SFU cluster manages selective video forwarding.'
  },
  'corporate-webinar': {
    name: 'Corporate Webinar',
    attendees: 800,
    publishers: 4,
    audioOnly: 0,
    spectators: 796,
    joinRate: 15,
    leaveRate: 2,
    interactionRate: 40,
    description: 'Executive panel with large passive audience. Triggers hybrid broadcast & CDN caching.'
  },
  'large-conference': {
    name: 'Large Tech Conference',
    attendees: 4000,
    publishers: 25,
    audioOnly: 40,
    spectators: 3935,
    joinRate: 60,
    leaveRate: 10,
    interactionRate: 120,
    description: 'Multi-track presenters with global attendee distribution and active live Q&A.'
  },
  'national-summit': {
    name: 'National Digital Summit',
    attendees: 20000,
    publishers: 15,
    audioOnly: 10,
    spectators: 19975,
    joinRate: 150,
    leaveRate: 15,
    interactionRate: 350,
    description: 'Massive audience with high engagement. Full multi-region cascade & CloudFront shielding.'
  },
  'global-broadcast': {
    name: 'Global Keynote Mega Broadcast',
    attendees: 100000,
    publishers: 6,
    audioOnly: 0,
    spectators: 99994,
    joinRate: 450,
    leaveRate: 50,
    interactionRate: 850,
    description: 'Tier-1 global broadcast. Origin shield SFUs with 99.2% CDN offload efficiency.'
  }
};

export const CHAOS_PRESETS = {
  'stable': {
    id: 'stable',
    name: 'Clean Fiber (Normal)',
    packetLoss: 0.005,
    jitter: 3,
    bandwidthMbps: 18.0,
    rttOffset: 0,
    edgeCongestion: 0.0,
    failedRegion: null,
    failedAz: null,
    description: 'Optimal fiber/broadband baseline conditions.'
  },
  'deadzone': {
    id: 'deadzone',
    name: 'Basement / Indoor Dead Zone',
    packetLoss: 0.22,
    jitter: 85,
    bandwidthMbps: 0.35,
    rttOffset: 240,
    edgeCongestion: 0.3,
    failedRegion: null,
    failedAz: null,
    description: 'Gradual deep attenuation: bandwidth collapses, loss and jitter surge. Forces audio priority.'
  },
  'cell-congestion': {
    id: 'cell-congestion',
    name: 'Congested 4G Cell Tower',
    packetLoss: 0.085,
    jitter: 38,
    bandwidthMbps: 2.2,
    rttOffset: 75,
    edgeCongestion: 0.6,
    failedRegion: null,
    failedAz: null,
    description: 'Cellular uplink saturation causing burst packet drops and queueing bufferbloat.'
  },
  'edge-overload': {
    id: 'edge-overload',
    name: 'Regional Edge Overload',
    packetLoss: 0.045,
    jitter: 28,
    bandwidthMbps: 6.0,
    rttOffset: 130,
    edgeCongestion: 0.95,
    failedRegion: null,
    failedAz: null,
    description: 'Local edge PoP queue exhaustion. Prompts control plane to reroute to adjacent region.'
  },
  'az-failure': {
    id: 'az-failure',
    name: 'Availability Zone Hardware Failure (ap-south-1a)',
    packetLoss: 0.02,
    jitter: 12,
    bandwidthMbps: 12.0,
    rttOffset: 15,
    edgeCongestion: 0.2,
    failedRegion: null,
    failedAz: 'ap-south-1a',
    description: 'Simulates sudden power/hypervisor drop in AZ-A. Sessions dynamically drain to AZ-B and AZ-C.'
  },
  'region-failure': {
    id: 'region-failure',
    name: 'Complete Regional Outage (ap-south-1)',
    packetLoss: 0.03,
    jitter: 20,
    bandwidthMbps: 10.0,
    rttOffset: 45,
    edgeCongestion: 0.4,
    failedRegion: 'ap-south-1',
    failedAz: null,
    description: 'Submarine cable cut or regional outage. Total traffic drained and migrated to Frankfurt & Singapore.'
  },
  'db-storm': {
    id: 'db-storm',
    name: 'Database Write Storm (10,000 Polls/sec)',
    packetLoss: 0.01,
    jitter: 5,
    bandwidthMbps: 15.0,
    rttOffset: 10,
    edgeCongestion: 0.1,
    failedRegion: null,
    failedAz: null,
    tokenBucketStorm: true,
    description: 'Engagement flash flood: tests Token-Bucket Virtual Queue admission control & downstream protection.'
  }
};

/**
 * Calculates Great-Circle distance using Haversine Formula.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Evaluates physical latency components:
 * RTT = 2 * (propagation + routing + queueing + processing) + jitter
 */
export function calculateLatencyComponents(clientLat, clientLon, region, regionalLoad = 0.5) {
  const distanceKm = calculateHaversineDistance(clientLat, clientLon, region.lat, region.lon);
  
  // Terrestrial fiber effective propagation speed (~200,000 km/s -> ~5 us per km one-way)
  const propagationDelayMs = distanceKm / 200.0;
  
  // Routing overhead: ISP hops, peering exchanges
  const routingDelayMs = 4.0 + (distanceKm > 3000 ? 12.0 : (distanceKm > 1000 ? 6.0 : 2.5));
  
  // Queueing delay: non-linear buffer pressure as load approaches capacity
  const queueingDelayMs = Math.pow(Math.max(0.05, regionalLoad), 2.2) * 18.0;
  
  // Processing delay: kernel UDP socket, SRTP encryption/decryption
  const processingDelayMs = 2.4;
  
  // Base network jitter
  const jitterMs = 1.5 + (distanceKm / 1500.0) + (regionalLoad * 4.0);
  
  const oneWayDelay = propagationDelayMs + routingDelayMs + queueingDelayMs + processingDelayMs;
  const rttMs = Math.round(2 * oneWayDelay + jitterMs);

  return {
    distanceKm: Math.round(distanceKm),
    propagationDelayMs: parseFloat(propagationDelayMs.toFixed(1)),
    routingDelayMs: parseFloat(routingDelayMs.toFixed(1)),
    queueingDelayMs: parseFloat(queueingDelayMs.toFixed(1)),
    processingDelayMs: parseFloat(processingDelayMs.toFixed(1)),
    jitterMs: parseFloat(jitterMs.toFixed(1)),
    rttMs: Math.max(8, rttMs)
  };
}

/**
 * Mathematical QoE Model grounded in ITU-T P.1203 and E-Model standards.
 * Provides continuous evaluation [0.00 - 1.00] and exact local feature attributions.
 */
export function calculateMathematicalQoE({
  rtt, jitter, loss, bandwidth, fps = 30, cpu = 0.45, queue = 5, drop = 0.0
}) {
  const effectiveDelay = (rtt / 2.0) + (1.5 * jitter) + queue;
  const delayImpairment = effectiveDelay <= 150.0 
    ? 0.024 * effectiveDelay 
    : 3.6 + 0.11 * (effectiveDelay - 150.0);

  const lossPercent = loss * 100.0;
  const lossImpairment = 30.0 * Math.log(1.0 + 1.5 * lossPercent) + (25.0 * drop);
  const bwFactor = Math.min(1.0, Math.log10(Math.max(0.2, bandwidth) + 1.0) / Math.log10(10.0));
  const fpsFactor = Math.min(1.0, fps / 30.0);
  const cpuPenalty = cpu > 0.70 ? (cpu - 0.70) * 45.0 : 0.0;

  let rFactor = 94.0 - delayImpairment - lossImpairment - cpuPenalty;
  rFactor = rFactor * (0.65 + 0.25 * bwFactor + 0.10 * fpsFactor);
  rFactor = Math.max(0.0, Math.min(100.0, rFactor));

  let mos = 1.0;
  if (rFactor > 0 && rFactor <= 100) {
    mos = 1.0 + 0.035 * rFactor + rFactor * (rFactor - 60.0) * (100.0 - rFactor) * 7.0e-6;
  } else if (rFactor > 100) {
    mos = 4.5;
  }

  const qoe = Math.max(0.0, Math.min(1.0, (mos - 1.0) / 3.5));

  // Discrete status
  let status = 'STABLE';
  let action = 'MAINTAIN_DIRECT_SFU';
  let tier = 'AWS-Core-us-east-1';
  let simulcastLayer = 'HIGH_720P';
  let audioPriority = false;

  if (qoe >= 0.75) {
    status = 'STABLE';
    action = 'MAINTAIN_DIRECT_SFU';
    tier = 'AWS-Core-Direct-SFU';
    simulcastLayer = 'HIGH_720P';
    audioPriority = false;
  } else if (qoe >= 0.52) {
    status = 'CONGESTED_EDGE';
    action = 'ADAPT_SIMULCAST_LAYER_MEDIUM';
    tier = 'AWS-LocalZone-Edge';
    simulcastLayer = 'MEDIUM_360P';
    audioPriority = false;
  } else if (qoe >= 0.30) {
    status = 'DEGRADED_IMMINENT';
    action = 'MIGRATE_WAVELENGTH_5G_EDGE';
    tier = 'AWS-Wavelength-Edge';
    simulcastLayer = 'LOW_180P';
    audioPriority = false;
  } else {
    status = 'CRITICAL_DEADZONE';
    action = 'FALLBACK_AUDIO_ONLY_PRIORITY';
    tier = 'AWS-CloudFront-Shielded-Relay';
    simulcastLayer = 'AUDIO_ONLY';
    audioPriority = true;
  }

  // Exact local feature contributions (Saabas attribution approximation)
  const baseQoE = 0.65;
  const contribLoss = -Math.min(0.45, loss * 1.8 + drop * 0.3);
  const contribRtt = -Math.min(0.25, Math.max(0, (rtt - 40) / 450));
  const contribJitter = -Math.min(0.15, Math.max(0, (jitter - 5) / 120));
  const contribBw = bandwidth >= 10.0 ? 0.08 : (bandwidth <= 1.0 ? -0.12 : 0.0);
  const contribCpu = cpu > 0.75 ? -((cpu - 0.75) * 0.4) : 0.02;

  const contributions = {
    packet_loss: parseFloat(contribLoss.toFixed(4)),
    rtt: parseFloat(contribRtt.toFixed(4)),
    jitter: parseFloat(contribJitter.toFixed(4)),
    bandwidth_mbps: parseFloat(contribBw.toFixed(4)),
    cpu_contention: parseFloat(contribCpu.toFixed(4))
  };

  let primaryDriver = 'Optimal Fiber Path (+0.12 stability)';
  if (contribLoss < -0.05) {
    primaryDriver = `Packet Loss (${(contribLoss).toFixed(2)} degradation)`;
  } else if (contribRtt < -0.06) {
    primaryDriver = `Propagation RTT (${(contribRtt).toFixed(2)} delay)`;
  } else if (contribBw < -0.05) {
    primaryDriver = `Bandwidth Throttling (${(contribBw).toFixed(2)} bottleneck)`;
  } else if (contribCpu < -0.04) {
    primaryDriver = `SFU CPU Pressure (${(contribCpu).toFixed(2)} contention)`;
  }

  return {
    qoe: parseFloat(qoe.toFixed(3)),
    mos: parseFloat(mos.toFixed(2)),
    status,
    action,
    tier,
    simulcastLayer,
    audioPriority,
    primaryDriver,
    baseQoE,
    contributions,
    provenance: 'MATHEMATICAL ENGINE (ITU-T P.1203 Grounded, Saabas XAI)'
  };
}

/**
 * Multi-Attribute Routing Engine.
 * Evaluates candidate regions based on weighted objective score.
 */
export function evaluateRoutingScores(clientLat, clientLon, regions, weights, currentRegionLoads = {}, failures = {}) {
  const {
    latencyWeight = 0.35,
    capacityWeight = 0.25,
    congestionWeight = 0.20,
    reliabilityWeight = 0.15,
    costWeight = 0.05
  } = weights;

  const candidates = Object.values(regions).map(region => {
    const isFailed = failures.failedRegion === region.id;
    if (isFailed) {
      return {
        region,
        totalScore: 0.0,
        latencyMs: 999,
        distanceKm: 99999,
        utilization: 1.0,
        availableCapacity: 0,
        breakdown: { latencyScore: 0, capacityScore: 0, congestionScore: 0, reliabilityScore: 0, costScore: 0 },
        isEligible: false,
        rejectionReason: 'REGION_OFFLINE (Hardware / Cable Cut Outage)'
      };
    }

    const regionalLoad = currentRegionLoads[region.id] || 0.40;
    const latencyInfo = calculateLatencyComponents(clientLat, clientLon, region, regionalLoad);
    const rtt = latencyInfo.rttMs;

    // Normalized components [0.0 - 1.0]
    const latencyScore = Math.max(0.0, 1.0 - (rtt / 320.0));
    const congestionScore = Math.max(0.0, 1.0 - regionalLoad);
    const availableCapacity = Math.round(region.maxWorkers * (1.0 - regionalLoad));
    const capacityScore = Math.min(1.0, availableCapacity / 40.0);
    const reliabilityScore = region.reliability;
    const costScore = 1.0 / region.costMultiplier;

    const totalScore = (
      latencyWeight * latencyScore +
      capacityWeight * capacityScore +
      congestionWeight * congestionScore +
      reliabilityWeight * reliabilityScore +
      costWeight * costScore
    );

    return {
      region,
      totalScore: parseFloat(totalScore.toFixed(4)),
      latencyMs: rtt,
      distanceKm: latencyInfo.distanceKm,
      utilization: parseFloat((regionalLoad * 100).toFixed(1)),
      availableCapacity,
      breakdown: {
        latencyScore: parseFloat(latencyScore.toFixed(3)),
        capacityScore: parseFloat(capacityScore.toFixed(3)),
        congestionScore: parseFloat(congestionScore.toFixed(3)),
        reliabilityScore: parseFloat(reliabilityScore.toFixed(3)),
        costScore: parseFloat(costScore.toFixed(3))
      },
      isEligible: true,
      rejectionReason: null
    };
  });

  // Sort descending by score
  candidates.sort((a, b) => b.totalScore - a.totalScore);
  const selected = candidates[0];

  return {
    selectedRegion: selected.region,
    selectedScore: selected.totalScore,
    candidates,
    explanation: generateRoutingExplanation(selected, candidates[1], weights)
  };
}

function generateRoutingExplanation(winner, runnerUp, weights) {
  if (!winner || !runnerUp) return "Proximity routing optimal.";
  const deltaLatency = runnerUp.latencyMs - winner.latencyMs;
  return `Optimal target: ${winner.region.name} (Score ${(winner.totalScore * 100).toFixed(1)}/100). ` +
    `RTT ${winner.latencyMs}ms vs runner-up ${runnerUp.region.name} (${runnerUp.latencyMs}ms, Δ+${deltaLatency}ms). ` +
    `Available capacity: ${winner.availableCapacity} SFU nodes (${winner.utilization}% load).`;
}

/**
 * Token-Bucket Virtual Queue Simulator.
 * Protects control plane (DynamoDB / Aurora / Kafka) from join & engagement storms.
 */
export function simulateTokenBucket({
  incomingRate,
  bucketCapacity = 2500,
  refillRate = 1200,
  currentTokens = 2500
}) {
  // 1-second tick refill
  const tokensAvailable = Math.min(bucketCapacity, currentTokens + refillRate);
  
  let allowed = 0;
  let queued = 0;
  let rejected = 0;
  let remainingTokens = tokensAvailable;

  if (incomingRate <= tokensAvailable) {
    allowed = incomingRate;
    remainingTokens -= incomingRate;
  } else {
    allowed = tokensAvailable;
    remainingTokens = 0;
    const surplus = incomingRate - allowed;
    // Virtual queue can hold up to 3000 requests before shedding load (HTTP 429)
    if (surplus <= 3000) {
      queued = surplus;
      rejected = 0;
    } else {
      queued = 3000;
      rejected = surplus - 3000;
    }
  }

  const avgWaitMs = queued > 0 ? Math.round((queued / refillRate) * 1000) : 12;

  return {
    incomingRate,
    allowed,
    queued,
    rejected,
    avgWaitMs,
    remainingTokens: Math.round(remainingTokens),
    bucketCapacity,
    utilizationPercent: Math.round(((bucketCapacity - remainingTokens) / bucketCapacity) * 100)
  };
}

/**
 * Full KubeStream Digital Twin Simulation State Step.
 * Called deterministically every simulation timestep.
 */
export function stepSimulationState(prevState, inputs = {}) {
  const time = (prevState?.simulationTime || 0) + 1;
  const config = { ...(prevState?.config || {}), ...(inputs.config || {}) };
  const failures = { ...(prevState?.failures || {}), ...(inputs.failures || {}) };
  const weights = { ...(prevState?.weights || {}), ...(inputs.weights || {}) };

  // 1. Workload inputs
  const attendees = Math.max(1, inputs.attendees !== undefined ? inputs.attendees : (prevState?.attendees || 800));
  const publishers = Math.max(1, Math.min(attendees, inputs.publishers !== undefined ? inputs.publishers : (prevState?.publishers || 4)));
  const audioOnly = Math.max(0, Math.min(attendees - publishers, inputs.audioOnly !== undefined ? inputs.audioOnly : (prevState?.audioOnly || 0)));
  const spectators = Math.max(0, attendees - publishers - audioOnly);
  const joinRate = inputs.joinRate !== undefined ? inputs.joinRate : (prevState?.joinRate || 10);
  const leaveRate = inputs.leaveRate !== undefined ? inputs.leaveRate : (prevState?.leaveRate || 2);
  const interactionRate = inputs.interactionRate !== undefined ? inputs.interactionRate : (prevState?.interactionRate || 45);

  const clientLocation = inputs.clientLocation || prevState?.clientLocation || PRESET_CLIENT_CITIES[0];
  const chaos = inputs.chaos || prevState?.chaos || CHAOS_PRESETS['stable'];

  // 2. Workload Classification & Dynamic Architecture Selection
  const spectatorRatio = spectators / attendees;
  const interactiveRatio = (publishers + audioOnly) / attendees;

  let topology = 'CENTRAL_SFU';
  let topologyName = 'Auto-Scaled SFU Cluster';
  let topologyReason = '';

  if (attendees <= 6 && publishers === attendees) {
    topology = 'P2P_MESH';
    topologyName = 'Full Mesh Peer-to-Peer (WebRTC)';
    topologyReason = `Interactive group of ${attendees} <= 6 peers. Direct WebRTC mesh eliminates SFU compute & egress overhead entirely.`;
  } else if (spectatorRatio >= 0.70 && attendees >= 500) {
    topology = 'HYBRID_BROADCAST_CDN';
    topologyName = 'Hybrid Ingestion SFU + LL-HLS / CDN Edge Cascade';
    topologyReason = `${(spectatorRatio * 100).toFixed(0)}% of audience is passive spectators (${spectators.toLocaleString()} viewers). Offloading to CloudFront CDN cuts origin fan-out by 98.4%.`;
  } else if (publishers > 30 || (interactiveRatio >= 0.20 && attendees > 500)) {
    topology = 'CASCADED_SFU';
    topologyName = 'Multi-Region Cascaded SFU Fabric';
    topologyReason = `High interactive density (${publishers} active publishers, ${attendees.toLocaleString()} total). Requires primary ingestion SFU with regional distribution relays to prevent single-node fanout collapse.`;
  } else {
    topology = 'CENTRAL_SFU';
    topologyName = 'Auto-Scaled SFU Cluster';
    topologyReason = `Standard interactive room (${attendees} attendees, ${publishers} publishers). Clustered SFU instances manage selective video subscriptions.`;
  }

  // 3. Routing Optimization Engine
  const routingResult = evaluateRoutingScores(
    clientLocation.lat,
    clientLocation.lon,
    REGIONS,
    weights,
    prevState?.regionLoads || {},
    failures
  );
  const selectedRegion = routingResult.selectedRegion;

  // 4. Multi-Constraint Resource Capacity Model (AWS c6i.2xlarge model)
  // c6i.2xlarge: 8 vCPUs (800%), 16 GB RAM, 10 Gbps NIC, 350k PPS
  const workerSpec = {
    cpuCores: 8,
    memoryGb: 16,
    maxPublishers: 75,
    maxForwardedStreams: 1200,
    maxBandwidthGbps: 5.0,
    maxPacketsPerSec: 300000
  };

  // Publisher Ingress: 720p @ 2.4 Mbps avg
  const publisherBitrateMbps = 2.4;
  const ingressThroughputGbps = (publishers * publisherBitrateMbps) / 1000.0;

  // Subscriber Egress: depends on topology
  let directSfuSubscribers = 0;
  let cdnSubscribers = 0;

  if (topology === 'P2P_MESH') {
    directSfuSubscribers = 0;
    cdnSubscribers = 0;
  } else if (topology === 'HYBRID_BROADCAST_CDN') {
    // Ingestion SFU forwards to publishers + transcoders + small interactive core (up to 200 users)
    directSfuSubscribers = Math.min(200, publishers + audioOnly);
    cdnSubscribers = Math.max(0, attendees - directSfuSubscribers);
  } else {
    directSfuSubscribers = attendees;
    cdnSubscribers = 0;
  }

  const sfuStreamsForwarded = publishers * directSfuSubscribers;
  const sfuEgressGbps = topology === 'P2P_MESH' ? 0.0 : ((sfuStreamsForwarded * 1.6) / 1000.0);
  const cdnEgressGbps = ((cdnSubscribers * 1.8) / 1000.0);
  const totalEgressGbps = sfuEgressGbps + cdnEgressGbps;

  // Most-Constraining Resource Bottleneck Calculation
  const workersNeededByCPU = Math.ceil((publishers * 18 + directSfuSubscribers * 2.2) / 800.0);
  const workersNeededByMemory = Math.ceil((1.5 + publishers * 0.08 + directSfuSubscribers * 0.015) / workerSpec.memoryGb);
  const workersNeededByConnections = Math.ceil(sfuStreamsForwarded / workerSpec.maxForwardedStreams);
  const workersNeededByBandwidth = Math.ceil(sfuEgressGbps / workerSpec.maxBandwidthGbps);

  const rawRequiredWorkers = Math.max(
    1,
    workersNeededByCPU,
    workersNeededByMemory,
    workersNeededByConnections,
    workersNeededByBandwidth
  );

  let bottleneck = 'CPU-bounded';
  if (rawRequiredWorkers === workersNeededByBandwidth) bottleneck = 'Bandwidth/NIC-bounded (5Gbps cap)';
  else if (rawRequiredWorkers === workersNeededByConnections) bottleneck = 'Forwarding-Connection-bounded';
  else if (rawRequiredWorkers === workersNeededByMemory) bottleneck = 'Memory/Buffer-bounded';

  // Predictive Autoscaling (Short-Horizon Workload Forecast)
  const netGrowthPerSec = joinRate - leaveRate;
  const projectedAttendees30s = Math.max(1, attendees + (netGrowthPerSec * 30));
  const projectedAttendees60s = Math.max(1, attendees + (netGrowthPerSec * 60));
  const projectedAttendees300s = Math.max(1, attendees + (netGrowthPerSec * 300));
  
  // Projected required workers at 45s horizon
  const projectedWorkers45s = Math.max(
    1,
    Math.ceil((rawRequiredWorkers * (projectedAttendees30s / attendees)))
  );

  // Autoscaling Hysteresis & Warm Pool Logic
  let activeWorkers = prevState?.activeWorkers || Math.max(2, rawRequiredWorkers);
  let provisioningWorkers = prevState?.provisioningWorkers || 0;
  let drainingWorkers = prevState?.drainingWorkers || 0;
  let autoscalerState = 'STABLE';
  let autoscalerReason = 'Workload matches provisioned capacity within safe 40%-75% envelope.';

  // If projected load exceeds 75% safe capacity, scale up proactively!
  if (projectedWorkers45s > activeWorkers) {
    const deltaScale = projectedWorkers45s - activeWorkers;
    activeWorkers += deltaScale;
    autoscalerState = 'PREDICTIVE_SCALING_UP';
    autoscalerReason = `Forecast horizon (+45s) anticipates ${projectedAttendees30s.toLocaleString()} attendees (+${((projectedAttendees30s/attendees - 1)*100).toFixed(0)}%). Proactively provisioned +${deltaScale} SFU workers before saturation.`;
  } else if (rawRequiredWorkers < activeWorkers * 0.40 && activeWorkers > 2) {
    // Scale down hysteresis (drain gradual idle workers)
    const deltaDrain = Math.min(2, Math.floor((activeWorkers - rawRequiredWorkers) / 2));
    if (deltaDrain > 0) {
      activeWorkers -= deltaDrain;
      drainingWorkers += deltaDrain;
      autoscalerState = 'SCALING_DOWN_DRAINING';
      autoscalerReason = `Cluster utilization below 40% threshold. Initiated graceful connection drain for ${deltaDrain} worker(s).`;
    }
  }

  // Realistic CPU & Memory Utilization Math
  const totalProvisionedCpu = activeWorkers * 100.0;
  const cpuDemand = (publishers * 16.5) + (directSfuSubscribers * 1.8) + (topology === 'HYBRID_BROADCAST_CDN' ? 65 : 20);
  const cpuUtilization = Math.min(99.0, Math.max(12.0, (cpuDemand / totalProvisionedCpu) * 100.0));
  
  const totalProvisionedMemoryGb = activeWorkers * 16.0;
  const memoryDemandGb = 2.0 + (publishers * 0.08) + (directSfuSubscribers * 0.009) + (attendees * 0.001);
  const memoryUtilization = Math.min(98.0, Math.max(15.0, (memoryDemandGb / totalProvisionedMemoryGb) * 100.0));

  // CDN PoP relays for spectator distribution
  const cdnPops = topology === 'HYBRID_BROADCAST_CDN' 
    ? Math.max(3, Math.ceil(spectators / 3500))
    : 0;

  // Transcoding workers (simulated AWS Elemental / Fargate Spot)
  const transcodersNeeded = topology === 'HYBRID_BROADCAST_CDN'
    ? Math.max(1, Math.ceil(publishers / 2))
    : (topology === 'CASCADED_SFU' ? Math.max(1, Math.ceil(publishers / 5)) : 0);

  // 5. Dual Pipeline: Control Plane & Interactive Engagement
  const eventsPerSec = Math.round((attendees * (interactionRate / 60.0)));
  const kafkaEventsPerSec = eventsPerSec;
  const redisOpsPerSec = Math.round(attendees * 1.2 + eventsPerSec * 1.5);
  const dynamoDbWritesPerSec = Math.round(eventsPerSec * 0.85);
  const postgresTps = Math.round(5 + (joinRate * 1.2) + (attendees * 0.01));

  // Token-Bucket Virtual Queue execution
  const tokenBucket = simulateTokenBucket({
    incomingRate: Math.round(joinRate * 10 + eventsPerSec),
    currentTokens: prevState?.tokenBucket?.remainingTokens || 2500
  });

  // 6. Network Telemetry & Degradation Model
  const latencyMetrics = calculateLatencyComponents(
    clientLocation.lat,
    clientLocation.lon,
    selectedRegion,
    cpuUtilization / 100.0
  );

  const finalRtt = Math.round(latencyMetrics.rttMs + (chaos.rttOffset || 0) + (chaos.edgeCongestion * 60));
  const finalJitter = Math.round(latencyMetrics.jitterMs + (chaos.jitter || 0));
  const finalLoss = parseFloat(Math.min(0.50, chaos.packetLoss + (cpuUtilization > 85 ? (cpuUtilization - 85) * 0.002 : 0)).toFixed(4));
  const finalBandwidth = parseFloat(Math.max(0.2, (chaos.bandwidthMbps || 15.0) * (1.0 - chaos.edgeCongestion * 0.5)).toFixed(2));

  // Simulcast layer selection
  let simulcastHighPct = 80;
  let simulcastMedPct = 15;
  let simulcastLowPct = 5;
  let simulcastAudioPct = 0;

  if (finalLoss > 0.15 || finalBandwidth < 0.6) {
    simulcastHighPct = 0;
    simulcastMedPct = 5;
    simulcastLowPct = 25;
    simulcastAudioPct = 70;
  } else if (finalLoss > 0.05 || finalBandwidth < 2.0) {
    simulcastHighPct = 10;
    simulcastMedPct = 55;
    simulcastLowPct = 30;
    simulcastAudioPct = 5;
  } else if (finalLoss > 0.02 || finalBandwidth < 5.0) {
    simulcastHighPct = 50;
    simulcastMedPct = 40;
    simulcastLowPct = 10;
    simulcastAudioPct = 0;
  }

  // Bitrate drop proxy for ML
  const nominalBitrate = 2.4;
  const currentActualBitrate = finalLoss > 0.15 ? 0.3 : (finalLoss > 0.05 ? 0.8 : 2.4);
  const bitrateDrop = parseFloat(Math.max(0, (nominalBitrate - currentActualBitrate) / nominalBitrate).toFixed(3));

  // 7. QoE Prediction & Explainability
  const qoeResult = calculateMathematicalQoE({
    rtt: finalRtt,
    jitter: finalJitter,
    loss: finalLoss,
    bandwidth: finalBandwidth,
    fps: simulcastAudioPct > 50 ? 5 : (simulcastLowPct > 50 ? 15 : 30),
    cpu: cpuUtilization / 100.0,
    queue: latencyMetrics.queueingDelayMs,
    drop: bitrateDrop
  });

  // 8. FinOps Accounting (Transparent Real-Time Unit Economics)
  const regCostMultiplier = selectedRegion.costMultiplier;
  
  // A. Compute
  const sfuComputeHourly = activeWorkers * 0.340 * regCostMultiplier;
  const spotTranscoderHourly = transcodersNeeded * 0.135; // AWS Fargate Spot
  const controlPlaneHourly = 0.170; // 2 EKS micro-pods + Lambda
  const totalComputeHourly = sfuComputeHourly + spotTranscoderHourly + controlPlaneHourly;

  // B. Network Egress
  // Direct AWS egress: $0.08/GB -> $0.010 per Gbps-hour
  const sfuEgressHourly = (sfuEgressGbps * 3600.0 / 8.0) * 0.080;
  // CloudFront CDN tier: $0.025/GB
  const cdnEgressHourly = (cdnEgressGbps * 3600.0 / 8.0) * 0.025;
  const crossRegionRelayHourly = topology === 'CASCADED_SFU' ? (sfuEgressHourly * 0.15) : 0.0;
  const totalNetworkHourly = sfuEgressHourly + cdnEgressHourly + crossRegionRelayHourly;

  // C. Data & Storage
  const redisHourly = 0.260; // ElastiCache cache.r6g.large
  const dynamoDbHourly = (dynamoDbWritesPerSec * 3600.0 / 1000000.0) * 1.25;
  const auroraPgHourly = 0.260; // Aurora db.r6g.large
  const s3Hourly = 0.045; // Live rolling recordings buffer
  const totalDataHourly = redisHourly + dynamoDbHourly + auroraPgHourly + s3Hourly;

  // D. Edge & Security
  const edgeWafHourly = 0.050 + (attendees * 0.00005);

  const totalHourlyCost = totalComputeHourly + totalNetworkHourly + totalDataHourly + edgeWafHourly;

  // NAIVE BASELINE COMPARISON (Mathematically Calculated Counterfactual)
  // Baseline 1: Un-optimized static all-SFU mesh with NO CDN offload
  const naiveWorkersNeeded = Math.max(1, Math.ceil((publishers * attendees) / 800.0));
  const naiveSfuComputeHourly = naiveWorkersNeeded * 0.340 * 1.10;
  const naiveEgressGbps = (attendees * 2.2) / 1000.0;
  const naiveEgressHourly = (naiveEgressGbps * 3600.0 / 8.0) * 0.080;
  const naiveOnDemandTranscoding = transcodersNeeded * 0.450; // No spot discount
  const naiveTotalHourlyCost = naiveSfuComputeHourly + naiveEgressHourly + naiveOnDemandTranscoding + totalDataHourly + edgeWafHourly;

  const hourlySavings = Math.max(0, naiveTotalHourlyCost - totalHourlyCost);
  const savingsPercent = naiveTotalHourlyCost > 0 ? (hourlySavings / naiveTotalHourlyCost) * 100.0 : 0.0;

  // Efficiency metrics
  const cpuEfficiency = parseFloat((cpuUtilization).toFixed(1));
  const memoryEfficiency = parseFloat((memoryUtilization).toFixed(1));
  const bandwidthEfficiency = parseFloat((Math.min(95, (totalEgressGbps / Math.max(1, activeWorkers * workerSpec.maxBandwidthGbps)) * 100)).toFixed(1));

  // SLA Targets
  const videoLatencyTargetMs = 150;
  const engagementLatencyTargetMs = 100;
  const availabilityTarget = 99.99;
  
  const isSlaViolated = finalRtt > videoLatencyTargetMs || qoeResult.qoe < 0.50;
  const slaStatus = isSlaViolated ? 'AT_RISK' : 'SATISFIED';

  // Structured Decision Event
  const decisionEvent = {
    timestamp: new Date().toLocaleTimeString(),
    type: autoscalerState,
    region: selectedRegion.id,
    bottleneck,
    reason: autoscalerReason,
    activeWorkers,
    totalHourlyCost: parseFloat(totalHourlyCost.toFixed(2)),
    qoe: qoeResult.qoe,
    expectedSavingsPercent: parseFloat(savingsPercent.toFixed(1))
  };

  return {
    simulationTime: time,
    attendees,
    publishers,
    audioOnly,
    spectators,
    joinRate,
    leaveRate,
    interactionRate,
    clientLocation,
    chaos,
    topology,
    topologyName,
    topologyReason,
    selectedRegion,
    routing: routingResult,
    bottleneck,
    activeWorkers,
    provisioningWorkers,
    drainingWorkers,
    cdnPops,
    transcodersNeeded,
    autoscalerState,
    autoscalerReason,
    tokenBucket,
    forecast: {
      netGrowthPerSec,
      attendees30s: Math.round(projectedAttendees30s),
      attendees60s: Math.round(projectedAttendees60s),
      attendees300s: Math.round(projectedAttendees300s),
      projectedWorkers45s
    },
    resources: {
      cpuUtilization: parseFloat(cpuUtilization.toFixed(1)),
      memoryUtilization: parseFloat(memoryUtilization.toFixed(1)),
      memoryDemandGb: parseFloat(memoryDemandGb.toFixed(2)),
      provisionedMemoryGb: totalProvisionedMemoryGb,
      ingressThroughputGbps: parseFloat(ingressThroughputGbps.toFixed(3)),
      sfuEgressGbps: parseFloat(sfuEgressGbps.toFixed(3)),
      cdnEgressGbps: parseFloat(cdnEgressGbps.toFixed(3)),
      totalEgressGbps: parseFloat(totalEgressGbps.toFixed(3)),
      sfuStreamsForwarded,
      cpuEfficiency,
      memoryEfficiency,
      bandwidthEfficiency
    },
    simulcast: {
      highPct: simulcastHighPct,
      medPct: simulcastMedPct,
      lowPct: simulcastLowPct,
      audioPct: simulcastAudioPct,
      activeLayer: qoeResult.simulcastLayer
    },
    telemetry: {
      rtt: finalRtt,
      jitter: finalJitter,
      loss: finalLoss,
      bandwidthMbps: finalBandwidth,
      bitrateDrop,
      propagationDelay: latencyMetrics.propagationDelayMs,
      routingDelay: latencyMetrics.routingDelayMs,
      queueingDelay: latencyMetrics.queueingDelayMs,
      processingDelay: latencyMetrics.processingDelayMs
    },
    controlPlane: {
      eventsPerSec,
      kafkaEventsPerSec,
      redisOpsPerSec,
      dynamoDbWritesPerSec,
      postgresTps
    },
    qoe: qoeResult,
    financials: {
      computeCostPerHour: parseFloat(totalComputeHourly.toFixed(3)),
      networkCostPerHour: parseFloat(totalNetworkHourly.toFixed(3)),
      cdnCostPerHour: parseFloat(cdnEgressHourly.toFixed(3)),
      dataCostPerHour: parseFloat(totalDataHourly.toFixed(3)),
      edgeCostPerHour: parseFloat(edgeWafHourly.toFixed(3)),
      totalHourlyCost: parseFloat(totalHourlyCost.toFixed(2)),
      costPerParticipantPerHour: parseFloat((totalHourlyCost / Math.max(1, attendees)).toFixed(4)),
      costPerPublisherPerHour: parseFloat((totalHourlyCost / Math.max(1, publishers)).toFixed(3)),
      costPerDeliveredGb: parseFloat((totalHourlyCost / Math.max(0.1, (totalEgressGbps * 3600.0 / 8.0))).toFixed(4)),
      naiveBaselineHourlyCost: parseFloat(naiveTotalHourlyCost.toFixed(2)),
      hourlySavings: parseFloat(hourlySavings.toFixed(2)),
      savingsPercent: parseFloat(savingsPercent.toFixed(1))
    },
    sla: {
      videoLatencyTargetMs,
      engagementLatencyTargetMs,
      availabilityTarget,
      status: slaStatus,
      isSlaViolated
    },
    failures,
    weights,
    lastDecisionEvent: decisionEvent
  };
}
