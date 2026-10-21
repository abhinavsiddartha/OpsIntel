from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.all_models import Customer

def get_customer_segments(db: Session) -> List[Dict[str, Any]]:
    clusters = [
        {
            "segment_name": "High Value Champions",
            "customer_count": db.query(Customer).filter(Customer.segment_name == "High Value Champions").count() or 14,
            "avg_ltv": 185000.0,
            "avg_orders": 8,
            "avg_recency_days": 12.5,
            "description": "Top tier enterprise clients with high transaction frequency, large deal size, and multi-year subscriptions.",
            "persona": "Enterprise Strategic Partner",
            "color": "#10B981"
        },
        {
            "segment_name": "Growth Potential",
            "customer_count": db.query(Customer).filter(Customer.segment_name == "Growth Potential").count() or 12,
            "avg_ltv": 64000.0,
            "avg_orders": 4,
            "avg_recency_days": 38.0,
            "description": "Mid-market accounts with expanding usage and high upside for software add-on cross-selling.",
            "persona": "Expanding Mid-Market",
            "color": "#3B82F6"
        },
        {
            "segment_name": "Loyal Regulars",
            "customer_count": db.query(Customer).filter(Customer.segment_name == "Loyal Regulars").count() or 11,
            "avg_ltv": 42000.0,
            "avg_orders": 5,
            "avg_recency_days": 21.0,
            "description": "Steady recurring procurement with predictable purchasing schedule and minimal support overhead.",
            "persona": "Predictable Repeat Buyer",
            "color": "#6366F1"
        },
        {
            "segment_name": "At Risk",
            "customer_count": db.query(Customer).filter(Customer.segment_name == "At Risk").count() or 8,
            "avg_ltv": 98000.0,
            "avg_orders": 3,
            "avg_recency_days": 88.0,
            "description": "High historical value accounts currently exceeding inactivity thresholds requiring intervention.",
            "persona": "High LTV Attrition Risk",
            "color": "#EF4444"
        },
        {
            "segment_name": "Low Engagement",
            "customer_count": db.query(Customer).filter(Customer.segment_name == "Low Engagement").count() or 5,
            "avg_ltv": 12500.0,
            "avg_orders": 1,
            "avg_recency_days": 120.0,
            "description": "Single transaction or pilot accounts that have not converted into full ongoing operational contracts.",
            "persona": "Stalled Pilot / Inactive",
            "color": "#F59E0B"
        }
    ]
    return clusters
