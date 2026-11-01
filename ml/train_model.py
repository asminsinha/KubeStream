import os
import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

# Mathematical QoE Model grounded in ITU-T P.1203 and WebRTC Telecom Standards
# Features:
# 0: rtt (ms) [10 - 800]
# 1: jitter (ms) [1 - 150]
# 2: packet_loss (fraction) [0.0 - 0.40]
# 3: bandwidth_mbps (Mbps) [0.2 - 25.0]
# 4: frame_rate (fps) [5 - 60]
# 5: cpu_contention (fraction) [0.1 - 1.0]
# 6: queue_delay (ms) [0 - 150]
# 7: bitrate_drop (fraction) [0.0 - 0.90]

FEATURE_NAMES = [
    'rtt',
    'jitter',
    'packet_loss',
    'bandwidth_mbps',
    'frame_rate',
    'cpu_contention',
    'queue_delay',
    'bitrate_drop'
]

def calculate_ground_truth_qoe(features):
    """
    Continuous ITU-T E-model inspired transmission quality equation.
    Maps impairments to Mean Opinion Score (MOS: 1.0 - 5.0) and QoE (0.00 - 1.00).
    """
    rtt, jitter, loss, bw, fps, cpu, queue, drop = features

    # 1. Delay Impairment Id (RTT + 2*jitter + queue delay)
    effective_one_way_delay = (rtt / 2.0) + (1.5 * jitter) + queue
    if effective_one_way_delay <= 150.0:
        delay_impairment = 0.024 * effective_one_way_delay
    else:
        delay_impairment = 3.6 + 0.11 * (effective_one_way_delay - 150.0)

    # 2. Equipment / Loss Impairment Ie (Packet loss + bitrate drop)
    loss_percent = loss * 100.0
    loss_impairment = 30.0 * np.log1p(1.5 * loss_percent) + (25.0 * drop)

    # 3. Bandwidth & FPS utility (Logarithmic saturation)
    bw_factor = min(1.0, np.log10(max(0.2, bw) + 1.0) / np.log10(10.0))
    fps_factor = min(1.0, fps / 30.0)

    # 4. Compute / SFU contention penalty
    cpu_penalty = max(0.0, (cpu - 0.70) * 45.0) if cpu > 0.70 else 0.0

    # Base R-factor (Max 94.0 in high-definition WebRTC)
    r_factor = 94.0 - delay_impairment - loss_impairment - cpu_penalty
    r_factor = r_factor * (0.65 + 0.25 * bw_factor + 0.10 * fps_factor)
    r_factor = np.clip(r_factor, 0.0, 100.0)

    # Convert R-factor to MOS (1.0 to 4.5)
    if r_factor < 0:
        mos = 1.0
    elif r_factor > 100:
        mos = 4.5
    else:
        mos = 1.0 + 0.035 * r_factor + r_factor * (r_factor - 60.0) * (100.0 - r_factor) * 7.0e-6

    # Normalized continuous QoE: 0.00 (unusable) to 1.00 (excellent)
    qoe = (mos - 1.0) / 3.5
    return float(np.clip(qoe, 0.0, 1.0))

def generate_synthetic_dataset(n_samples=4000, seed=42):
    np.random.seed(seed)
    
    # 4 Regimes:
    # 1. Fiber / Stable connection (40%)
    # 2. Wireless / Moderate jitter (30%)
    # 3. Congested / High load (20%)
    # 4. Critical Deadzone / Severe impairment (10%)
    
    n_stable = int(n_samples * 0.40)
    n_wireless = int(n_samples * 0.30)
    n_congested = int(n_samples * 0.20)
    n_deadzone = n_samples - (n_stable + n_wireless + n_congested)

    # 1. Stable
    rtt_1 = np.random.uniform(10, 60, n_stable)
    jitter_1 = np.random.uniform(1, 8, n_stable)
    loss_1 = np.random.uniform(0.0, 0.015, n_stable)
    bw_1 = np.random.uniform(8.0, 25.0, n_stable)
    fps_1 = np.random.choice([30, 60], n_stable)
    cpu_1 = np.random.uniform(0.15, 0.60, n_stable)
    queue_1 = np.random.uniform(0, 15, n_stable)
    drop_1 = np.random.uniform(0.0, 0.05, n_stable)

    # 2. Wireless / 4G / 5G Edge
    rtt_2 = np.random.uniform(40, 140, n_wireless)
    jitter_2 = np.random.uniform(8, 30, n_wireless)
    loss_2 = np.random.uniform(0.015, 0.06, n_wireless)
    bw_2 = np.random.uniform(2.5, 10.0, n_wireless)
    fps_2 = np.random.choice([24, 30], n_wireless)
    cpu_2 = np.random.uniform(0.30, 0.75, n_wireless)
    queue_2 = np.random.uniform(10, 45, n_wireless)
    drop_2 = np.random.uniform(0.05, 0.20, n_wireless)

    # 3. Congested Regional
    rtt_3 = np.random.uniform(140, 260, n_congested)
    jitter_3 = np.random.uniform(25, 75, n_congested)
    loss_3 = np.random.uniform(0.06, 0.16, n_congested)
    bw_3 = np.random.uniform(0.8, 3.5, n_congested)
    fps_3 = np.random.choice([15, 20, 24], n_congested)
    cpu_3 = np.random.uniform(0.70, 0.95, n_congested)
    queue_3 = np.random.uniform(40, 95, n_congested)
    drop_3 = np.random.uniform(0.20, 0.50, n_congested)

    # 4. Deadzone
    rtt_4 = np.random.uniform(250, 750, n_deadzone)
    jitter_4 = np.random.uniform(60, 160, n_deadzone)
    loss_4 = np.random.uniform(0.15, 0.45, n_deadzone)
    bw_4 = np.random.uniform(0.15, 0.8, n_deadzone)
    fps_4 = np.random.choice([5, 10, 15], n_deadzone)
    cpu_4 = np.random.uniform(0.85, 0.99, n_deadzone)
    queue_4 = np.random.uniform(80, 160, n_deadzone)
    drop_4 = np.random.uniform(0.45, 0.90, n_deadzone)

    X = np.column_stack([
        np.concatenate([rtt_1, rtt_2, rtt_3, rtt_4]),
        np.concatenate([jitter_1, jitter_2, jitter_3, jitter_4]),
        np.concatenate([loss_1, loss_2, loss_3, loss_4]),
        np.concatenate([bw_1, bw_2, bw_3, bw_4]),
        np.concatenate([fps_1, fps_2, fps_3, fps_4]),
        np.concatenate([cpu_1, cpu_2, cpu_3, cpu_4]),
        np.concatenate([queue_1, queue_2, queue_3, queue_4]),
        np.concatenate([drop_1, drop_2, drop_3, drop_4])
    ])

    # Calculate ground-truth QoE via mathematical network physics
    y_qoe = np.array([calculate_ground_truth_qoe(sample) for sample in X])

    # Discretize into 4 operational states:
    # 0: STABLE (QoE >= 0.75)
    # 1: CONGESTED_EDGE (0.50 <= QoE < 0.75)
    # 2: DEGRADED_IMMINENT (0.30 <= QoE < 0.50)
    # 3: CRITICAL_DEADZONE (QoE < 0.30)
    y_state = np.zeros(len(y_qoe), dtype=int)
    y_state[(y_qoe < 0.75) & (y_qoe >= 0.50)] = 1
    y_state[(y_qoe < 0.50) & (y_qoe >= 0.30)] = 2
    y_state[y_qoe < 0.30] = 3

    return X, y_qoe, y_state

def main():
    print("[INFO] Generating telecommunications-grounded dataset based on ITU-T P.1203...")
    X, y_qoe, y_state = generate_synthetic_dataset(n_samples=5000)

    print(f"[INFO] Training Random Forest Regressor & Classifier on {len(X)} samples with 8 features...")
    regressor = RandomForestRegressor(n_estimators=30, max_depth=8, random_state=42)
    regressor.fit(X, y_qoe)

    classifier = RandomForestClassifier(n_estimators=30, max_depth=8, random_state=42)
    classifier.fit(X, y_state)

    r2 = regressor.score(X, y_qoe)
    acc = classifier.score(X, y_state)
    print(f"[OK] Regressor R^2: {r2:.4f}, Classifier Accuracy: {acc:.4f}")

    # Compute baseline root expected value
    base_qoe = float(np.mean(y_qoe))

    bundle = {
        'regressor': regressor,
        'classifier': classifier,
        'feature_names': FEATURE_NAMES,
        'base_qoe': base_qoe,
        'n_samples': len(X)
    }

    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'qoe_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(bundle, f)

    print("[SUCCESS] Model bundle saved successfully to 'qoe_model.pkl'!")

if __name__ == '__main__':
    main()