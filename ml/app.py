import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained bundle using robust path relative to current script directory
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'qoe_model.pkl')
with open(MODEL_PATH, 'rb') as f:
    bundle = pickle.load(f)

regressor = bundle['regressor']
classifier = bundle['classifier']
feature_names = bundle['feature_names']
base_qoe = bundle['base_qoe']

def explain_prediction_saabas(estimator_list, x_sample):
    """
    Exact Saabas tree path decomposition across all trees in the forest.
    Calculates the exact feature contributions that transform the root node mean
    to the final ensemble prediction:
    f(x) = E[Y] + sum_i contribution_i
    """
    n_features = len(feature_names)
    total_contributions = np.zeros(n_features)
    n_trees = len(estimator_list)
    root_value_sum = 0.0

    for dt in estimator_list:
        tree = dt.tree_
        node_indicator = dt.decision_path(x_sample)
        node_index = node_indicator.indices
        values = tree.value[:, 0, 0]
        features = tree.feature

        root_value_sum += values[0]
        for i in range(len(node_index) - 1):
            curr_node = node_index[i]
            next_node = node_index[i + 1]
            feat_idx = features[curr_node]
            if feat_idx >= 0:
                diff = values[next_node] - values[curr_node]
                total_contributions[feat_idx] += diff

    avg_contributions = total_contributions / n_trees
    avg_root = root_value_sum / n_trees
    return avg_root, avg_contributions

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model": "RandomForestRegressor+Classifier (8 Features, ITU-T P.1203 Grounded)",
        "features": feature_names,
        "base_qoe": base_qoe
    })

@app.route('/predict-qoe', methods=['POST'])
def predict_qoe():
    data = request.json or {}

    # Extract 8 features with robust defaults
    rtt = float(data.get('rtt', 35.0))
    jitter = float(data.get('jitter', 3.0))
    packet_loss = float(data.get('loss', data.get('packet_loss', 0.008)))
    bandwidth_mbps = float(data.get('bandwidth_mbps', data.get('bandwidth', 12.0)))
    frame_rate = float(data.get('frame_rate', data.get('fps', 30.0)))
    cpu_contention = float(data.get('cpu_contention', data.get('cpu_load', 35.0) / 100.0))
    queue_delay = float(data.get('queue_delay', 4.0))
    bitrate_drop = float(data.get('bitrate_drop', data.get('drop', 0.0)))

    x_sample = np.array([[
        rtt, jitter, packet_loss, bandwidth_mbps,
        frame_rate, cpu_contention, queue_delay, bitrate_drop
    ]])

    # 1. Regress continuous QoE [0.0 - 1.0]
    qoe_predicted = float(np.clip(regressor.predict(x_sample)[0], 0.0, 1.0))

    # 2. Classify state
    state_idx = int(classifier.predict(x_sample)[0])
    probabilities = classifier.predict_proba(x_sample)[0].tolist()

    # 3. Exact Saabas Local Feature Contributions
    root_val, contributions = explain_prediction_saabas(regressor.estimators_, x_sample)

    contrib_map = {}
    for name, val in zip(feature_names, contributions):
        contrib_map[name] = float(round(val, 4))

    # Find dominant negative and positive drivers
    sorted_contribs = sorted(contrib_map.items(), key=lambda x: x[1])
    most_degrading = sorted_contribs[0] # lowest (most negative)
    most_improving = sorted_contribs[-1] # highest (most positive)

    if most_degrading[1] < -0.02:
        primary_driver = f"{most_degrading[0].replace('_', ' ').title()} ({most_degrading[1]:+.2f} degradation)"
    else:
        primary_driver = f"{most_improving[0].replace('_', ' ').title()} ({most_improving[1]:+.2f} stability)"

    # Actionable Control Plane Orchestration Mapping
    status_catalog = {
        0: {
            "status": "STABLE",
            "action": "MAINTAIN_DIRECT_SFU",
            "tier": "AWS-Core-us-east-1",
            "simulcast_layer": "HIGH_720P",
            "audio_priority": False,
            "explanation": "Network conditions optimal. Direct SFU relay with full HD simulcast enabled."
        },
        1: {
            "status": "CONGESTED_EDGE",
            "action": "ADAPT_SIMULCAST_LAYER_MEDIUM",
            "tier": "AWS-LocalZone-Edge",
            "simulcast_layer": "MEDIUM_360P",
            "audio_priority": False,
            "explanation": "Regional edge buffer pressure detected. Throttling outbound layer to 360p."
        },
        2: {
            "status": "DEGRADED_IMMINENT",
            "action": "MIGRATE_WAVELENGTH_5G_EDGE",
            "tier": "AWS-Wavelength-Edge",
            "simulcast_layer": "LOW_180P",
            "audio_priority": False,
            "explanation": "Elevated packet loss and jitter. Rerouting via Verizon/AWS 5G Wavelength edge."
        },
        3: {
            "status": "CRITICAL_DEADZONE",
            "action": "FALLBACK_AUDIO_ONLY_PRIORITY",
            "tier": "AWS-CloudFront-Shielded-Relay",
            "simulcast_layer": "AUDIO_ONLY",
            "audio_priority": True,
            "explanation": "Severe transport impairment. Suppressing video streams to preserve speech comprehensibility."
        }
    }

    decision = status_catalog.get(state_idx, status_catalog[0])

    response = {
        "qoe": float(round(qoe_predicted, 3)),
        "status": decision["status"],
        "action": decision["action"],
        "tier": decision["tier"],
        "simulcast_layer": decision["simulcast_layer"],
        "audio_priority": decision["audio_priority"],
        "explanation": decision["explanation"],
        "primary_driver": primary_driver,
        "base_qoe": float(round(root_val, 3)),
        "contributions": contrib_map,
        "probabilities": [float(round(p, 3)) for p in probabilities],
        "provenance": "PREDICTED - Trained Random Forest (ITU-T P.1203 Grounded, Saabas XAI)"
    }
    return jsonify(response)

if __name__ == '__main__':
    print("[INFO] Starting KubeStream Micro-ML Decision Engine on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)