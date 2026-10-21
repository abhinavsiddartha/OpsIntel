# OpsIntel Machine Learning Systems

OpsIntel embeds 6 production-grade ML models and statistical inference engines:

## 1. Multi-Horizon Sales Forecasting Engine (`app/ml/sales_forecast.py`)
- **Methodology**: Combines trend-decomposition linear regression with 12-month seasonality index scaling.
- **Horizon**: Configurable from 30 to 180 days with daily or monthly resolution.
- **Confidence Intervals**: 95% parametric confidence bands calculated from historical variance:
  $$\hat{y}_t \pm 1.96 \cdot \sigma_{residuals} \cdot \sqrt{1 + \frac{t}{N}}$$
- **Outputs**: Baseline forecast, lower bound, upper bound, historical baseline, and trend velocity.

## 2. Customer Churn Prediction Engine (`app/ml/churn_prediction.py`)
- **Features**: Recency (days since last order), Frequency (order count), Monetary Value (LTV, AOV), Days as Customer.
- **Algorithm**: Logistic Regression / Gradient Boosting with MinMax feature scaling.
- **Explainability**: Calculates SHAP-like feature influence contributions (e.g., *Low recency contributed +42% to churn risk*).
- **Risk Categorization**: `LOW` (<0.35), `MEDIUM` (0.35-0.70), `HIGH` (>0.70).

## 3. Inventory Stockout & Replenishment (`app/ml/stockout_prediction.py`)
- **Methodology**: Poisson/Normal distribution demand velocity modeling combined with Wilson Economic Order Quantity (EOQ):
  $$EOQ = \sqrt{\frac{2 \cdot D \cdot S}{H}}$$
- **Lead-Time Buffer**: Safety stock calculated as:
  $$SS = Z_{\alpha} \cdot \sqrt{L \cdot \sigma_D^2 + D^2 \cdot \sigma_L^2}$$
- **Outputs**: Days until stockout, stockout probability at current lead-time, and suggested reorder batch size.

## 4. Target Attainment Monte Carlo Simulator (`app/ml/target_achievement.py`)
- **Iterations**: 1,000 independent path simulations.
- **Inputs**: Historical monthly variance, pipeline deal stage probabilities, rep tenure coefficient.
- **Outputs**: Attainment probability percentile ($P_{50}, P_{80}, P_{95}$), shortfall risk distribution, and confidence bounds.

## 5. Statistical & Unsupervised Anomaly Detection (`app/ml/anomaly_detection.py`)
- **Approach**: Hybrid multivariable Z-Score ($|Z| > 2.5$) and Isolation Forest contamination filter.
- **Monitored Streams**: Revenue spikes/drops, abnormal gross margin variances, sudden customer order pauses.

## 6. RFM Customer Segmentation Engine (`app/ml/customer_segmentation.py`)
- **Features**: Recency, Frequency, Monetary value normalized via standard scaling.
- **Algorithm**: K-Means clustering ($K=4$) mapped to interpretable personas:
  1. *High Value Champions*
  2. *Loyal Regulars*
  3. *Growth Potential*
  4. *At Risk / Inactive*
