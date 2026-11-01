
# KubeStream

### Intelligent Scalable Web Infrastructure for Real-Time Video & Interactive Events

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-WebRTC%20%2F%20SFU%20%2F%20CDN-06b6d4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ML-Random%20Forest%20%2B%20XAI-818cf8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FinOps-Dynamic%20Cost%20Optimization-10b981?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Simulation-Digital%20Twin-f59e0b?style=for-the-badge" />
</p>

KubeStream is an intelligent infrastructure simulation and orchestration platform designed to model how large-scale real-time video conferencing and interactive event systems provision, route, and optimize cloud resources under changing workloads.

Rather than functioning as another video conferencing application, KubeStream focuses on the infrastructure operating underneath such platforms: media distribution, architectural switching, regional routing, predictive scaling, Quality of Experience (QoE), explainable machine learning, and cloud cost optimization.

The platform combines a browser-based WebRTC workload with a discrete-timestep infrastructure digital twin, allowing users to experiment with infrastructure decisions through an interactive dashboard.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement](#2-problem-statement)
- [3. Key Features and Contributions](#3-key-features-and-contributions)
- [4. System Architecture](#4-system-architecture)
- [5. Architectural Modes](#5-architectural-modes)
- [6. Mathematical Models](#6-mathematical-models)
- [7. Machine Learning and Explainable AI](#7-machine-learning-and-explainable-ai)
- [8. FinOps and Cost Optimization](#8-finops-and-cost-optimization)
- [9. Technology Stack](#9-technology-stack)
- [10. AWS Production Architecture Mapping](#10-aws-production-architecture-mapping)
- [11. Simulation Boundaries](#11-simulation-boundaries)
- [12. Installation and Setup](#12-installation-and-setup)
- [13. Running the Application](#13-running-the-application)
- [14. Automated Live Demonstration](#14-automated-live-demonstration)
- [15. Project Structure](#15-project-structure)
- [16. Limitations and Future Scope](#16-limitations-and-future-scope)
- [17. Contributors](#17-contributors)

---

## 1. Project Overview

Real-time video infrastructure behaves differently from conventional web applications.

A traditional web service can often scale using request rates and CPU utilization. Video conferencing platforms must additionally account for:

- Number of active publishers and viewers.
- WebRTC media distribution overhead.
- Network latency, jitter, and packet loss.
- Regional infrastructure capacity.
- Video quality and bitrate adaptation.
- Signalling and interactive event traffic.
- Infrastructure cost and resource utilization.

KubeStream models these interacting factors through an intelligent control plane.

The platform evaluates workload and network conditions to determine:

1. Which media distribution architecture should be used.
2. How many infrastructure workers are required.
3. Which regional edge location is most suitable.
4. Whether network conditions require video quality adaptation.
5. How infrastructure decisions affect QoE and operating costs.

The result is an interactive digital twin demonstrating how scalable real-time video infrastructure could respond to changing operating conditions.

## 2. Problem Statement

### The Elastic Real-Time Video Infrastructure Dilemma

Real-time video platforms face two competing infrastructure problems.

**Underutilization during low traffic**

- Provisioned SFU instances remain underutilized.
- Transcoding resources consume unnecessary capacity.
- Infrastructure remains active despite low demand.
- Static provisioning increases operational expenditure.

**Infrastructure pressure during extreme traffic**

- Signalling servers experience connection bottlenecks.
- Peer-to-peer media fan-out grows quadratically.
- SFU clusters experience increasing CPU and bandwidth demand.
- Network congestion degrades video quality.
- Interactive event traffic can overwhelm backend services.
- Aggressive scale-to-zero policies can introduce cold-start delays.

### Optimization Objective

The infrastructure optimization objective is to minimize total operating cost while maintaining service quality and respecting infrastructure constraints.

Subject to:

$$
QoE \geq QoE_{\text{target}}
$$

$$
RTT \leq RTT_{\text{SLA}}
$$

$$
ResourceDemand \leq SafeCapacity
$$

Where:

- $C_{\text{total}}$ represents infrastructure cost.
- $P_{\text{latency}}$ represents latency penalties.
- $P_{\text{QoE}}$ represents quality degradation penalties.
- $P_{\text{SLA}}$ represents service-level risk.
- $\lambda_1, \lambda_2, \lambda_3$ represent optimization weights.

The objective is to maintain acceptable service quality while reducing unnecessary infrastructure expenditure.


## 3. Key Features and Contributions

### 3.1 Workload-Aware Architectural Switching

Dynamically evaluates workload composition and selects between four media distribution architectures:

- P2P Mesh
- Central SFU
- Cascaded SFU
- Hybrid Broadcast with CDN

### 3.2 Multi-Attribute Regional Routing

Evaluates regional infrastructure using multiple parameters instead of relying exclusively on geographical proximity.

The routing model considers:

- Network latency.
- Available capacity.
- Congestion.
- Reliability.
- Estimated infrastructure cost.

### 3.3 Predictive Workload Scaling

Uses arrival and departure rates to estimate upcoming workload:

\[
v = JoinRate - LeaveRate
\]

The system evaluates projected demand across multiple future time horizons and models proactive worker provisioning, scale-down thresholds, and cooldown periods.

### 3.4 Machine Learning-Based QoE Prediction

Uses a Random Forest model to estimate video Quality of Experience from network and system telemetry.

The model incorporates eight input features:

- RTT
- Jitter
- Packet Loss
- Bandwidth
- Frame Rate
- CPU Contention
- Queue Delay
- Bitrate Drop

### 3.5 Explainable AI

Implements Saabas-style tree-path feature attribution to explain the contribution of individual input features to model predictions.

This provides visibility into why a particular QoE prediction or infrastructure response was produced.

### 3.6 FinOps and Infrastructure Cost Analysis

Compares a dynamically optimized infrastructure configuration against a counterfactual static provisioning baseline.

The simulation evaluates the financial effects of:

- Predictive resource provisioning.
- CDN-based spectator distribution.
- Spot transcoding assumptions.
- Infrastructure consolidation.
- Connection draining.

### 3.7 Interactive Infrastructure Simulation

Provides an interactive dashboard for experimenting with:

- Different workload sizes.
- Network degradation.
- Regional congestion.
- Infrastructure failures.
- Architectural transitions.
- Scaling behaviour.
- Cost and QoE changes.

## 4. System Architecture

KubeStream follows a decoupled architecture consisting of a browser-based WebRTC workload, a Node.js simulation and control plane, and a Python-based machine learning service.

### High-Level Architecture

```text
                 KUBESTREAM SYSTEM ARCHITECTURE

                 ┌──────────────────────────┐
                 │     React Web Client     │
                 │                          │
                 │  WebRTC + Dashboard UI   │
                 └────────────┬─────────────┘
                              │
                    WebRTC Telemetry
                       getStats()
                              │
                              ▼
                 ┌──────────────────────────┐
                 │   Node.js Control Plane │
                 │                          │
                 │  Workload Analysis      │
                 │  Architecture Selection │
                 │  Predictive Scaling     │
                 │  Regional Routing       │
                 │  Infrastructure Model   │
                 │  FinOps Calculation     │
                 └────────────┬─────────────┘
                              │
                   ML Inference Requests
                              │
                              ▼
                 ┌──────────────────────────┐
                 │    Python Flask ML API  │
                 │                          │
                 │  Random Forest Model    │
                 │  QoE Prediction         │
                 │  Feature Attribution    │
                 └──────────────────────────┘
```

### Media Plane

The media plane represents the real-time video transport layer.

Its modeled responsibilities include:

- RTP/SRTP media packet delivery.
- WebRTC connectivity.
- Simulcast quality adaptation.
- SFU ingestion and distribution.
- CDN-assisted spectator delivery.

### Control Plane

The control plane coordinates infrastructure decisions.

Its modeled responsibilities include:

- Workload analysis.
- Architectural mode selection.
- Regional routing.
- Predictive scaling.
- Admission control.
- Infrastructure cost evaluation.

### Why Decoupling Matters

Media traffic and interactive application traffic have different operating requirements.

Media delivery prioritizes timeliness and low latency, while control-plane operations generally require reliable message delivery and processing.

Separating these responsibilities helps prevent spikes in interactive application traffic from directly interfering with the media delivery model.

## 5. Architectural Modes

KubeStream evaluates four architectural configurations.

| Mode | Architecture | Intended Workload |
|---|---|---|
| 1 | P2P Mesh | Small, highly interactive groups |
| 2 | Central SFU Cluster | Interactive meetings |
| 3 | Cascaded SFU Fabric | Multi-publisher conferences |
| 4 | Hybrid Broadcast with CDN | Large spectator-heavy events |

The architecture selector evaluates workload composition, including participant count, publisher count, spectator ratio, and latency requirements.

### Mode 1 — P2P Mesh

Direct peer-to-peer media connections for small interactive groups.

### Mode 2 — Central SFU Cluster

A central Selective Forwarding Unit distributes media streams between participants without requiring every participant to transmit directly to every other participant.

### Mode 3 — Cascaded SFU Fabric

Multiple interconnected SFU instances distribute media across larger conferences and regional infrastructure.

### Mode 4 — Hybrid Broadcast with CDN

SFU-based ingestion and transcoding are combined with CDN-assisted delivery for large spectator audiences.

## 6. Mathematical Models

KubeStream uses several mathematical models to represent infrastructure behaviour.

### 6.1 Haversine Distance

The geographical distance between a client and a candidate infrastructure region is estimated using the Haversine formula.

**a = sin²(Δlat / 2) + cos(lat₁) × cos(lat₂) × sin²(Δlon / 2)**

**c = 2 × arctan(√a / √(1 − a))**

**d = R_earth × c**

Where the Earth's approximate radius is:

**R_earth = 6371 km**

### 6.2 Regional Routing Score

Regional selection considers several normalized attributes:

**Score(r) = w₁ × S_latency + w₂ × S_capacity + w₃ × S_congestion + w₄ × S_reliability + w₅ × S_cost**

The selected region is determined by comparing calculated regional scores according to the routing objective.

### 6.3 Infrastructure Capacity

Worker requirements are modeled using a resource bottleneck approach:

$$
RequiredWorkers = \max
\left(
\frac{CPU_{\text{demand}}}{CPU_{\text{capacity}}},
\frac{Memory_{\text{demand}}}{Memory_{\text{capacity}}},
\frac{Connections_{\text{demand}}}{Connection_{\text{capacity}}},
\frac{Bandwidth_{\text{demand}}}{Bandwidth_{\text{capacity}}}
\right)
$$

This represents the principle that the most constrained resource can determine the required infrastructure capacity.

### 6.4 QoE Transmission Rating

The simulation uses a transmission rating formulation based on network degradation factors:

$$
R = 94 - I_d - I_e - I_{\text{cpu}}
$$

Where:

- $I_d$ represents delay-related impairment.
- $I_e$ represents packet-loss and encoding-related impairment.
- $I_{\text{cpu}}$ represents CPU contention impairment.

The model converts the rating into a normalized QoE score.

**Note:** This is a project-level QoE modeling formulation inspired by telecommunications rating concepts, not a claim of implementing the complete ITU-T P.1203 standard.

## 7. Machine Learning and Explainable AI

### Model Specification

| Component | Configuration |
|---|---|
| Model | Random Forest |
| Task | QoE prediction and classification |
| Regressor | 30 estimators |
| Maximum Tree Depth | 8 |
| Training Samples | 5,000 |
| Input Features | 8 |
| ML Service | Python Flask |

The model is trained using generated telecommunications-oriented samples.

### Input Features

| Feature | Description |
|---|---|
| RTT | Round-trip network latency |
| Jitter | Variation in packet arrival time |
| Packet Loss | Percentage of lost packets |
| Bandwidth | Available network bandwidth |
| Frame Rate | Video frames delivered per second |
| CPU Contention | Processor resource pressure |
| Queue Delay | Estimated packet queueing delay |
| Bitrate Drop | Reduction in video bitrate |

### Saabas Feature Attribution

KubeStream uses tree-path feature contributions to explain individual predictions.

The prediction can be represented as:

$$
f(x) = E[Y] + \sum_{i=1}^{M} \phi_i(x)
$$

Where:

- $E[Y]$ is the expected baseline prediction.
- $\phi_i(x)$ represents the contribution associated with feature $i$.
- $M$ is the number of input features.

These contributions help identify which network or system conditions influenced a prediction.

### Infrastructure Response Examples

| Network Condition | Example Response |
|---|---|
| Stable | Maintain direct SFU operation |
| Congested Edge | Adapt simulcast quality |
| Degraded Network | Consider regional migration |
| Critical Conditions | Prioritize audio delivery |

The dashboard exposes these decisions through the XAI interface.

## 8. FinOps and Cost Optimization

KubeStream incorporates a modeled AWS-oriented cost analysis framework.

### Infrastructure Cost Categories

| Resource | Modeled Cost |
|---|---:|
| SFU Workers | $0.340/hour |
| Transcoders | $0.135/hour |
| Direct AWS Egress | $0.080/GB |
| CloudFront CDN Egress | $0.025/GB |
| ElastiCache Redis | $0.260/hour |
| DynamoDB Writes | $1.25/1M writes |
| Aurora PostgreSQL | $0.260/hour |

These are configurable modeling assumptions, not live AWS billing measurements or guaranteed current AWS prices.

### Counterfactual Comparison

KubeStream compares two infrastructure approaches.

**Static Baseline**

- Provisioned for peak workload.
- Limited workload-aware resource consolidation.
- Direct SFU fan-out assumptions.
- Conventional on-demand transcoding assumptions.

**Optimized Configuration**

- Predictive worker provisioning.
- CDN-assisted spectator delivery.
- Spot transcoding assumptions.
- Connection draining.
- Dynamic infrastructure consolidation.

### Unit Economics

**Cost per participant-hour:**

$$
C_{\text{participant-hour}} =
\frac{TotalHourlyCost}{ActiveParticipants}
$$

**Cost per delivered GB:**

$$
C_{\text{GB}} =
\frac{TotalHourlyCost}{DeliveredGBPerHour}
$$

The dashboard presents the modeled cost differences between the baseline and optimized configurations.

## 9. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| Real-Time Communication | WebRTC, Socket.IO |
| Machine Learning | Python, Scikit-learn |
| ML API | Flask |
| Explainable AI | Saabas-style tree-path attribution |
| Infrastructure Modeling | Digital Twin Simulation |
| Cloud Architecture Reference | AWS EKS, ECS, CloudFront, MSK, Redis, DynamoDB, Aurora |
| Development Tools | VS Code, Git, npm, Python |

## 10. AWS Production Architecture Mapping

The following table maps the simulated architecture to potential AWS production services.

| System Tier | Architectural Role | AWS Service |
|---|---|---|
| Media Plane | SFU Workers | Amazon EKS |
| Media Plane | CDN Distribution | Amazon CloudFront |
| Media Plane | Video Transcoding | AWS Fargate |
| Control Plane | Signalling Services | Amazon ECS / EKS |
| Control Plane | Event Streaming | Amazon MSK |
| Data Plane | Ephemeral State | Amazon ElastiCache |
| Data Plane | Interactive Polls | Amazon DynamoDB |
| Data Plane | Accounts and Billing | Amazon Aurora PostgreSQL |
| Security | Admission and DDoS Protection | AWS WAF and AWS Shield |

These integrations describe a potential production deployment architecture. The current implementation models these infrastructure components rather than provisioning actual AWS resources.

## 11. Simulation Boundaries

KubeStream distinguishes between real application behaviour and simulated infrastructure behaviour.

| Component | Execution Type | Description |
|---|---|---|
| Browser WebRTC | Real | Browser-based WebRTC telemetry using `RTCPeerConnection.getStats()` |
| Regional Infrastructure | Simulated | Discrete-timestep digital twin of regional infrastructure |
| Infrastructure Billing | Modelled | Cost calculations using configurable AWS-oriented rate assumptions |
| QoE Prediction | ML Inference | Random Forest prediction through the Python Flask service |
| Infrastructure Scaling | Simulated | Workload-driven worker provisioning and consolidation |
| Regional Routing | Simulated | Multi-attribute region selection |

**Important:** KubeStream is currently a local infrastructure digital twin. It does not provision real Kubernetes clusters, deploy production SFU instances, or execute live AWS autoscaling operations.

The browser-based WebRTC component provides real client-side telemetry, while infrastructure decisions are evaluated by the simulation engine.

## 12. Installation and Setup

### Prerequisites

Install the following software before running KubeStream.

| Requirement | Recommended Version |
|---|---|
| Node.js | v18 or later |
| npm | Included with Node.js |
| Python | 3.10 or later |
| Git | Latest stable version |
| Web Browser | Recent Chrome, Edge, or Firefox |

Check your installed versions:

```bash
node --version
npm --version
python --version
git --version
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/asminsinha/KubeStream.git
```

Navigate into the project:

```bash
cd KubeStream
```

### Step 2: Install Node.js Dependencies

Install the server dependencies:

```bash
cd server
npm install
```

Install the frontend dependencies:

```bash
cd ../client
npm install
```

Return to the project root:

```bash
cd ..
```

### Step 3: Set Up the Python Environment

Create a virtual environment:

```bash
python -m venv ml/venv
```

Activate it on Windows PowerShell:

```powershell
.\ml\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the Command Prompt activation script instead:

```cmd
ml\venv\Scripts\activate.bat
```

Install Python dependencies:

```bash
python -m pip install -r requirements.txt
```

### Step 4: Verify the Project Files

Ensure the following important files exist:

```text
KubeStream/
│
├── client/
│   ├── package.json
│   └── src/
│
├── server/
│   ├── package.json
│   └── index.js
│
├── ml/
│   ├── app.py
│   ├── train_model.py
│   └── qoe_model.pkl
│
├── package.json
└── requirements.txt
```

The trained model file `ml/qoe_model.pkl` is included in the repository.

## 13. Running the Application

KubeStream consists of three independently running services.

Open **three separate terminals** in the project root directory.

### Terminal 1 — Python ML Service

Activate the virtual environment:

```powershell
.\ml\venv\Scripts\Activate.ps1
```

Start the ML service:

```bash
npm run dev:ml
```

Expected service port:

```text
http://localhost:5001
```

### Terminal 2 — Node.js Control Plane

From the project root:

```bash
npm run dev:server
```

Expected service port:

```text
http://localhost:4000
```

### Terminal 3 — React Frontend

From the project root:

```bash
npm run dev:client
```

Expected frontend address:

```text
http://localhost:5173
```

### Access the Dashboard

Open the following URL in your browser:

**http://localhost:5173**

Keep all three terminals running while using the application.

### Troubleshooting

**Port already in use**

Stop the process occupying the required port or configure an available port in the corresponding service.

**Missing Node.js dependencies**

Run the following command inside the relevant `server/` or `client/` directory:

```bash
npm install
```

**Python module not found**

Activate the virtual environment and run:

```bash
python -m pip install -r requirements.txt
```

**ML model not found**

Verify that the following file exists:

```text
ml/qoe_model.pkl
```

## 14. Automated Live Demonstration

KubeStream includes a 10-stage automated demonstration accessible through the **RUN LIVE DEMO** control in the dashboard.

| Stage | Scenario | Demonstration |
|---|---|---|
| 1 | Small Student Webinar | Low-demand infrastructure configuration |
| 2 | Interactive Growth | SFU capacity expansion |
| 3 | National Summit | Hybrid Broadcast and CDN transition |
| 4 | Regional Congestion | Multi-attribute regional routing |
| 5 | Client Dead Zone | Audio-priority degradation response |
| 6 | Predictive Join Storm | Proactive worker provisioning |
| 7 | Availability Zone Failure | Simulated multi-AZ traffic redistribution |
| 8 | Poll Flood | Token-bucket admission control |
| 9 | Audience Departure | Connection draining and scale-down hysteresis |
| 10 | Resource Consolidation | Infrastructure cost comparison |

The demonstration provides a visual narrative of workload changes, architectural transitions, network degradation, and infrastructure optimization.

## 15. Project Structure

```text
KubeStream/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ArchitectureGuide.jsx
│   │   │   ├── ChaosResilienceLab.jsx
│   │   │   ├── ExperimentLab.jsx
│   │   │   ├── FinOpsCenter.jsx
│   │   │   ├── GlobalEdgeOrchestrator.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InfrastructureLab.jsx
│   │   │   ├── LiveDemoController.jsx
│   │   │   ├── LiveVideoLab.jsx
│   │   │   ├── OverviewDashboard.jsx
│   │   │   ├── SystemAuditLog.jsx
│   │   │   └── XaiDecisionCenter.jsx
│   │   │
│   │   ├── services/
│   │   │   └── simulationEngine.js
│   │   │
│   │   ├── utils/
│   │   │   └── webrtcHelper.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── index.js
│   ├── simulationEngine.js
│   └── package.json
│
├── ml/
│   ├── app.py
│   ├── train_model.py
│   └── qoe_model.pkl
│
├── package.json
├── requirements.txt
├── .gitignore
└── README.md
```

## 16. Limitations and Future Scope

### Current Limitations

- Regional infrastructure is represented through a mathematical digital twin rather than deployed cloud resources.
- AWS costs are calculated using configurable modeling assumptions rather than live billing APIs.
- Kubernetes orchestration is represented through simulated scaling decisions.
- WebRTC telemetry is collected from the browser, but the infrastructure simulation does not constitute a production-grade distributed SFU deployment.
- QoE predictions depend on the trained model and its generated training data.

### Future Scope

Potential extensions include:

1. Deploying actual SFU workers through Kubernetes and Amazon EKS.
2. Integrating Terraform or AWS CDK for infrastructure provisioning.
3. Connecting CloudWatch metrics to the control plane.
4. Implementing Prometheus-based autoscaling with KEDA.
5. Integrating production WebRTC infrastructure such as Mediasoup or Janus.
6. Training and validating QoE models using real-world telecommunications datasets.
7. Extending regional routing using live network measurements.

## 17. Contributors

### Asmin Sinha

**Project Developer**

B.Tech — Computer Science and Engineering (AI & ML)  
Vellore Institute of Technology, Vellore

GitHub: [@asminsinha](https://github.com/asminsinha)

### Toulik Talukder

**Project Developer**

B.Tech — Computer Science and Engineering  
Vellore Institute of Technology, Vellore

---

<p align="center">
  <b>KubeStream</b><br>
  Intelligent Scalable Web Infrastructure for Real-Time Video & Interactive Events
  <br><br>
  Developed by <b>Asmin Sinha</b> and <b>Toulik Talukder</b>
</p>
