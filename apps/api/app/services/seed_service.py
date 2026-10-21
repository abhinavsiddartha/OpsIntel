import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import Base, engine
from app.core.security import get_password_hash
from app.models.all_models import (
    User, UserRole, Region, Employee, Category, Product, Customer,
    Order, OrderItem, OrderStatus, Inventory, InventoryMovement, MovementType,
    Target, MLModel, ModelStatus, Anomaly, RiskLevel, Notification,
    NotificationSeverity, AuditLog, Document, DocumentChunk, AIConversation, AIMessage
)

def seed_database(db: Session, force_reset: bool = False):
    if not force_reset and db.query(User).count() > 0:
        return {"status": "already_seeded", "message": "Database already contains seed data"}
    
    if force_reset:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    random.seed(42)
    now = datetime.utcnow()
    
    # 1. Users
    users_data = [
        {"email": "admin@opsintel.com", "full_name": "Sarah Connor (Admin)", "role": UserRole.ADMIN, "password": "AdminPassword123!"},
        {"email": "manager@opsintel.com", "full_name": "Marcus Vance (Operations VP)", "role": UserRole.MANAGER, "password": "ManagerPassword123!"},
        {"email": "analyst@opsintel.com", "full_name": "Elena Rostova (Lead Data Analyst)", "role": UserRole.ANALYST, "password": "AnalystPassword123!"},
        {"email": "sales@opsintel.com", "full_name": "David Miller (Enterprise AE)", "role": UserRole.SALES_EXECUTIVE, "password": "SalesPassword123!"},
    ]
    user_objs = []
    for u in users_data:
        user = User(
            email=u["email"], full_name=u["full_name"], role=u["role"],
            hashed_password=get_password_hash(u["password"]), is_active=True,
            created_at=now - timedelta(days=120)
        )
        db.add(user)
        user_objs.append(user)
    db.commit()
    
    # 2. Regions
    regions_data = [
        {"name": "North America - East", "code": "NA-EAST", "manager": "Marcus Vance", "target": 1200000.0},
        {"name": "North America - West", "code": "NA-WEST", "manager": "Chloe Zhao", "target": 1400000.0},
        {"name": "EMEA Central", "code": "EMEA-C", "manager": "Klaus Fischer", "target": 950000.0},
        {"name": "APAC Emerging", "code": "APAC-E", "manager": "Rajesh Sharma", "target": 850000.0},
    ]
    region_objs = []
    for r in regions_data:
        reg = Region(name=r["name"], code=r["code"], manager_name=r["manager"], target_revenue=r["target"])
        db.add(reg)
        region_objs.append(reg)
    db.commit()
    
    # 3. Employees
    employees_data = [
        ("David Miller", "david.miller@opsintel.com", "Senior Enterprise AE", 0, 180000.0, 92.5),
        ("Chloe Zhao", "chloe.zhao@opsintel.com", "Regional Sales Director", 1, 240000.0, 96.0),
        ("Klaus Fischer", "klaus.fischer@opsintel.com", "Enterprise Account Lead", 2, 160000.0, 88.0),
        ("Rajesh Sharma", "rajesh.sharma@opsintel.com", "Strategic Accounts Manager", 3, 150000.0, 91.0),
        ("Jessica Taylor", "jessica.taylor@opsintel.com", "Mid-Market AE", 0, 120000.0, 84.0),
        ("Anthony Harris", "anthony.harris@opsintel.com", "Enterprise AE", 1, 190000.0, 89.5),
        ("Sophie Dubois", "sophie.dubois@opsintel.com", "Commercial AE", 2, 110000.0, 79.0),
        ("Liam Nguyen", "liam.nguyen@opsintel.com", "Solutions Consultant", 3, 130000.0, 93.0),
    ]
    employee_objs = []
    for name, email, title, r_idx, target, score in employees_data:
        emp = Employee(
            name=name, email=email, role_title=title,
            region_id=region_objs[r_idx].id, monthly_target=target,
            current_revenue=0.0, performance_score=score, is_active=True
        )
        db.add(emp)
        employee_objs.append(emp)
    db.commit()
    
    # 4. Categories & Products
    categories_data = [
        ("Enterprise Compute & AI Servers", "High-density rack servers and AI accelerators for enterprise infrastructure"),
        ("Cloud Software & SaaS Licenses", "Annual and multi-year cloud management, security, and analytics licenses"),
        ("Network & Cybersecurity Appliances", "Next-gen zero-trust firewalls, switches, and load balancers"),
        ("Developer Platforms & Tooling", "CI/CD orchestration, telemetry platforms, and database tool suites"),
        ("Operations & Industrial IoT", "Edge telemetry gateways, industrial sensors, and monitoring nodes")
    ]
    category_objs = []
    for name, desc in categories_data:
        cat = Category(name=name, description=desc)
        db.add(cat)
        category_objs.append(cat)
    db.commit()
    
    products_data = [
        ("Titan-9000 AI Rack Server", "SKU-SVR-9001", 0, 24500.0, 16800.0, 18, 10, 5, 14),
        ("Nexus-4000 Edge Compute Node", "SKU-SVR-4002", 0, 8900.0, 5800.0, 42, 15, 8, 10),
        ("HyperScale Storage Array 200TB", "SKU-STR-2001", 0, 14200.0, 9500.0, 24, 8, 4, 12),
        ("Apex GPU Accelerator Pod", "SKU-GPU-008", 0, 32000.0, 22000.0, 6, 8, 4, 21),
        ("Quantum-Core Blade Server", "SKU-SVR-1005", 0, 12500.0, 8400.0, 35, 12, 6, 7),
        ("OpsIntel Enterprise Platform", "SKU-SFT-ENT-1Y", 1, 48000.0, 4800.0, 999, 50, 20, 1),
        ("OpsIntel AI Decision Core Add-on", "SKU-SFT-AI-1Y", 1, 18500.0, 1800.0, 999, 50, 20, 1),
        ("Cloud Orchestrator Multi-Region", "SKU-SFT-CLD-1Y", 1, 28000.0, 3200.0, 999, 50, 20, 1),
        ("ZeroTrust Identity Governance", "SKU-SFT-SEC-1Y", 1, 15000.0, 1500.0, 999, 50, 20, 1),
        ("DataOps Real-time Streaming", "SKU-SFT-DAT-1Y", 1, 9800.0, 1200.0, 999, 50, 20, 1),
        ("Sentinel-X Next-Gen Firewall 100G", "SKU-NET-FW-100G", 2, 19500.0, 13000.0, 14, 10, 5, 15),
        ("CoreStream 400G Spine Switch", "SKU-NET-SW-400G", 2, 26000.0, 18500.0, 9, 12, 6, 18),
        ("SecureMesh VPN Gateway Appliance", "SKU-NET-VPN-500", 2, 6400.0, 4100.0, 55, 15, 8, 7),
        ("ThreatShield Hardware Security Module", "SKU-NET-HSM-20", 2, 11200.0, 7500.0, 28, 10, 5, 10),
        ("FiberLink High-Density Transceiver", "SKU-NET-TRX-10", 2, 850.0, 420.0, 240, 50, 25, 5),
        ("DevVelocity Enterprise Workflow", "SKU-DEV-VEL-ENT", 3, 22000.0, 2500.0, 999, 50, 20, 1),
        ("Automated CI/CD Hardware Runner", "SKU-DEV-RNR-04", 3, 4500.0, 2900.0, 38, 12, 6, 7),
        ("TelemetryHub Distributed Tracing", "SKU-DEV-TEL-10", 3, 7200.0, 4800.0, 31, 10, 5, 8),
        ("CodeGuard SAST/DAST Appliance", "SKU-DEV-SAS-01", 3, 16500.0, 11000.0, 12, 8, 4, 14),
        ("Industrial Edge Telemetry Node", "SKU-IOT-EDG-5G", 4, 3400.0, 2100.0, 75, 25, 12, 10),
        ("Vibration & Thermal Sensor Array", "SKU-IOT-SEN-10", 4, 1800.0, 950.0, 120, 30, 15, 6),
        ("Smart Gateway Power Unit", "SKU-IOT-PDU-48", 4, 2900.0, 1800.0, 40, 15, 8, 9),
        ("Ruggedized Field Telemetry Hub", "SKU-IOT-RUG-02", 4, 5200.0, 3300.0, 4, 10, 5, 16),
    ]
    product_objs = []
    for name, sku, cat_idx, price, cost, stock, reorder, safety, lead in products_data:
        prod = Product(
            name=name, sku=sku, category_id=category_objs[cat_idx].id,
            unit_price=price, cost_price=cost, stock_quantity=stock,
            reorder_point=reorder, safety_stock=safety, lead_time_days=lead,
            created_at=now - timedelta(days=180)
        )
        db.add(prod)
        product_objs.append(prod)
    db.commit()
    
    # 5. Inventory items & movements
    for prod in product_objs:
        demand = round(random.uniform(0.4, 2.2), 2)
        if "SFT" in prod.sku or "DEV-VEL" in prod.sku:
            days_left = 999.0
            risk = RiskLevel.LOW
            reorder_qty = 0
        else:
            days_left = round(prod.stock_quantity / max(demand, 0.1), 1)
            if days_left <= prod.lead_time_days:
                risk = RiskLevel.CRITICAL
                reorder_qty = int((prod.lead_time_days * demand * 2) + prod.safety_stock)
            elif days_left <= (prod.lead_time_days + 5):
                risk = RiskLevel.HIGH
                reorder_qty = int((prod.lead_time_days * demand * 1.5) + prod.safety_stock)
            elif days_left <= (prod.lead_time_days + 15):
                risk = RiskLevel.MEDIUM
                reorder_qty = int(prod.safety_stock * 2)
            else:
                risk = RiskLevel.LOW
                reorder_qty = 0
                
        inv = Inventory(
            product_id=prod.id,
            current_stock=prod.stock_quantity,
            reserved_stock=int(prod.stock_quantity * 0.15) if prod.stock_quantity < 500 else 0,
            available_stock=int(prod.stock_quantity * 0.85) if prod.stock_quantity < 500 else 999,
            daily_demand_rate=demand,
            days_until_stockout=days_left,
            stockout_risk=risk,
            recommended_reorder_qty=reorder_qty,
            last_restocked_at=now - timedelta(days=random.randint(5, 45))
        )
        db.add(inv)
        
        for m in range(random.randint(2, 4)):
            m_type = random.choice([MovementType.INBOUND, MovementType.OUTBOUND, MovementType.ADJUSTMENT])
            m_qty = random.randint(5, 25) if m_type != MovementType.ADJUSTMENT else random.randint(1, 4)
            movement = InventoryMovement(
                product_id=prod.id,
                movement_type=m_type,
                quantity=m_qty,
                reason=f"Standard logistics {m_type.value} dispatch",
                reference_id=f"LOG-{random.randint(10000, 99999)}",
                created_at=now - timedelta(days=random.randint(1, 60))
            )
            db.add(movement)
    db.commit()
    
    # 6. Customers
    prefixes = ["Apex", "Vanguard", "Quantum", "CyberNet", "GlobalScale", "OmniTech", "Aegis", "Horizon", "Strata", "Synapse", "Pulse", "Terra", "Nova", "Pinnacle", "Aero", "BioCore", "Delta", "Echo", "Vertex", "Meridian"]
    suffixes = ["Systems", "Networks", "Enterprises", "Logistics", "Technologies", "Dynamics", "Industries", "Holdings", "Robotics", "Analytics"]
    customer_objs = []
    for i in range(50):
        c_name = f"{random.choice(prefixes)} {random.choice(suffixes)}"
        code = f"CUST-{1000 + i}"
        email = f"procurement-{1000 + i}@{c_name.lower().replace(' ', '')}.com"
        reg_id = random.choice(region_objs).id
        
        churn_rnd = random.random()
        if churn_rnd > 0.85:
            churn_risk = round(random.uniform(0.72, 0.94), 2)
            risk_lvl = RiskLevel.HIGH
            segment = "At Risk"
            days_ago = random.randint(75, 140)
        elif churn_rnd > 0.60:
            churn_risk = round(random.uniform(0.40, 0.68), 2)
            risk_lvl = RiskLevel.MEDIUM
            segment = "Growth Potential"
            days_ago = random.randint(30, 74)
        else:
            churn_risk = round(random.uniform(0.05, 0.35), 2)
            risk_lvl = RiskLevel.LOW
            segment = "High Value Champions" if random.random() > 0.5 else "Loyal Regulars"
            days_ago = random.randint(2, 29)
            
        cust = Customer(
            customer_code=code, name=c_name, company=c_name, email=email,
            region_id=reg_id, lifetime_value=0.0, total_orders=0,
            avg_order_value=0.0, last_order_date=now - timedelta(days=days_ago),
            churn_risk_score=churn_risk, churn_risk_level=risk_lvl,
            segment_name=segment, created_at=now - timedelta(days=random.randint(180, 500))
        )
        db.add(cust)
        customer_objs.append(cust)
    db.commit()
    
    # 7. Orders
    order_counter = 10000
    order_objs = []
    for month_offset in range(12, -1, -1):
        m_count = int(22 + (12 - month_offset) * 1.5 + random.randint(-3, 4))
        for _ in range(m_count):
            order_counter += 1
            day = random.randint(1, 28)
            order_dt = now - timedelta(days=month_offset * 30 + (28 - day), hours=random.randint(1, 20), minutes=random.randint(0, 50))
            cust = random.choice(customer_objs)
            emp = random.choice(employee_objs)
            reg = db.query(Region).filter(Region.id == cust.region_id).first() or random.choice(region_objs)
            
            selected_products = random.sample(product_objs, random.choices([1, 2, 3], weights=[0.55, 0.35, 0.10])[0])
            total_amt = 0.0
            items_to_add = []
            
            for prod in selected_products:
                qty = random.choices([1, 2, 4], weights=[0.7, 0.2, 0.1])[0]
                line_total = prod.unit_price * qty
                total_amt += line_total
                items_to_add.append((prod, qty, prod.unit_price, line_total))
                
            discount_pct = random.choices([0.0, 0.05, 0.10, 0.45], weights=[0.70, 0.20, 0.08, 0.02])[0]
            discount_val = round(total_amt * discount_pct, 2)
            net_total = round(total_amt - discount_val, 2)
            
            order = Order(
                order_number=f"ORD-{order_counter}", customer_id=cust.id,
                employee_id=emp.id, region_id=reg.id, total_amount=net_total,
                discount_amount=discount_val, tax_amount=round(net_total * 0.08, 2),
                status=OrderStatus.COMPLETED if (now - order_dt).days > 3 else OrderStatus.PROCESSING,
                order_date=order_dt, created_at=order_dt
            )
            db.add(order)
            db.flush()
            
            for prod, qty, unit_p, line_p in items_to_add:
                item = OrderItem(order_id=order.id, product_id=prod.id, quantity=qty, unit_price=unit_p, total_price=line_p)
                db.add(item)
            order_objs.append(order)
    db.commit()
    
    # 8. Update aggregations
    for cust in customer_objs:
        c_orders = db.query(Order).filter(Order.customer_id == cust.id).all()
        if c_orders:
            cust.total_orders = len(c_orders)
            cust.lifetime_value = round(sum(o.total_amount for o in c_orders), 2)
            cust.avg_order_value = round(cust.lifetime_value / max(cust.total_orders, 1), 2)
            cust.last_order_date = max(o.order_date for o in c_orders)
            
    for emp in employee_objs:
        e_orders = db.query(Order).filter(Order.employee_id == emp.id, Order.order_date >= (now - timedelta(days=30))).all()
        emp.current_revenue = round(sum(o.total_amount for o in e_orders), 2)
    db.commit()
    
    # 9. Targets
    targets_data = [
        ("Q1 2026 Global Revenue Target", "2026-Q1", "company", None, 4500000.0, 4120000.0, 91.5, 96.2, RiskLevel.LOW),
        ("NA-East Regional Target Q1", "2026-Q1", "region", region_objs[0].id, 1200000.0, 1180000.0, 98.3, 102.0, RiskLevel.LOW),
        ("NA-West Regional Target Q1", "2026-Q1", "region", region_objs[1].id, 1400000.0, 1220000.0, 87.1, 91.4, RiskLevel.MEDIUM),
        ("EMEA Central Regional Target Q1", "2026-Q1", "region", region_objs[2].id, 950000.0, 780000.0, 82.1, 85.5, RiskLevel.HIGH),
        ("APAC Emerging Regional Target Q1", "2026-Q1", "region", region_objs[3].id, 850000.0, 940000.0, 110.5, 114.0, RiskLevel.LOW),
        ("Enterprise Compute Product Quota", "2026-Q1", "category", category_objs[0].id, 1800000.0, 1690000.0, 93.8, 97.5, RiskLevel.LOW),
    ]
    for title, period, e_type, e_id, t_val, a_val, ach_rate, pred_ach, risk in targets_data:
        t = Target(title=title, period=period, entity_type=e_type, entity_id=e_id, target_value=t_val, actual_value=a_val, achievement_rate=ach_rate, predicted_achievement=pred_ach, risk_level=risk)
        db.add(t)
    db.commit()
    
    # 10. ML Models
    models_registry_data = [
        ("Sales Demand Forecaster", "v2.4.0", "forecasting", "Multi-Horizon Ridge & Seasonal Trend Decomposition", ModelStatus.PRODUCTION,
         {"MAE": 1420.50, "RMSE": 1945.20, "MAPE": "4.12%", "R2_Score": 0.942},
         {"horizons": [7, 30, 90], "seasonality_mode": "additive", "confidence_interval": 0.95}),
        ("Customer Churn Risk Classifier", "v1.8.2", "classification", "Gradient Boosting & Logistic Regression", ModelStatus.PRODUCTION,
         {"ROC_AUC": 0.918, "F1_Score": 0.884, "Precision": 0.892, "Recall": 0.876},
         {"features": ["recency_days", "order_frequency", "monetary_ltv", "aov_decay"], "threshold": 0.65}),
        ("Inventory Stockout & Safety Model", "v3.1.0", "forecasting", "Poisson Demand Velocity & Dynamic EOQ", ModelStatus.PRODUCTION,
         {"Service_Level": "98.5%", "Stockout_Precision": 0.94, "LeadTime_Variance": "99.1%"},
         {"confidence_band": 0.98, "demand_smoothing_window": 30}),
        ("Target Achievement Projection", "v1.5.0", "simulation", "Bayesian Linear & Monte Carlo (1000 iters)", ModelStatus.PRODUCTION,
         {"Mean_Projection_Error": "3.4%", "Convergence_Rate": "99.8%"},
         {"iterations": 1000, "prior_weight": 0.35}),
        ("Multi-Signal Anomaly Detector", "v2.0.1", "anomaly", "Isolation Forest & Multivariate Z-Score", ModelStatus.PRODUCTION,
         {"Contamination": 0.03, "Outlier_Sensitivity": "High", "False_Positive_Rate": "1.2%"},
         {"contamination_rate": 0.03, "n_estimators": 150}),
        ("Customer RFM Clustering Engine", "v2.2.0", "clustering", "K-Means with RFM Feature Scaler", ModelStatus.PRODUCTION,
         {"Silhouette_Score": 0.684, "Davies_Bouldin": 0.521, "Optimal_K": 5},
         {"k_clusters": 5, "init_method": "k-means++", "max_iter": 300})
    ]
    for name, ver, m_type, algo, status, metrics, params in models_registry_data:
        ml_m = MLModel(name=name, version=ver, model_type=m_type, algorithm=algo, status=status, metrics=metrics, hyperparameters=params, last_trained_at=now - timedelta(days=3))
        db.add(ml_m)
    db.commit()
    
    # 11. Anomalies
    anomalies_data = [
        ("order", 10142, "ORD-10142", 0.94, RiskLevel.HIGH, "Abnormal discount applied (45% vs baseline 6.2%) resulting in negative margin on enterprise bundle.", 24500.0, 48000.0),
        ("inventory", product_objs[3].id, "SKU-GPU-008", 0.88, RiskLevel.CRITICAL, "Apex GPU Pod inventory depleted 75% faster than 60-day historical mean burn rate.", 6.0, 24.0),
        ("order", 10291, "ORD-10291", 0.82, RiskLevel.MEDIUM, "Unusual order size (15 units of Sentinel-X) exceeding 3-sigma single customer quota.", 195000.0, 39000.0),
        ("customer", customer_objs[4].id, "CUST-1004", 0.89, RiskLevel.HIGH, "Enterprise client with $240k LTV experienced 90-day inactivity following 4 consecutive quarterly renewals.", 0.0, 45000.0),
        ("inventory", product_objs[22].id, "SKU-IOT-RUG-02", 0.91, RiskLevel.CRITICAL, "Ruggedized Field Hub reached 4 units remaining against a 16-day supplier replenishment cycle.", 4.0, 25.0)
    ]
    for e_type, e_id, ref, score, sev, reason, obs, exp in anomalies_data:
        ano = Anomaly(entity_type=e_type, entity_id=e_id, reference_code=ref, anomaly_score=score, severity=sev, reason=reason, observed_value=obs, expected_value=exp, status="detected")
        db.add(ano)
    db.commit()
    
    # 12. Notifications
    notifications_data = [
        ("Critical Inventory Risk: Apex GPU Pod", "Apex GPU Accelerator Pod (SKU-GPU-008) has 6 units left with 21-day supplier lead time.", NotificationSeverity.CRITICAL, "stockout", "/inventory"),
        ("Elevated Churn Risk Alert", "3 high-value enterprise accounts in NA-West show churn probability > 75%.", NotificationSeverity.WARNING, "churn", "/customers"),
        ("High-Margin Anomaly Detected", "Order #ORD-10142 triggered an anomaly flag due to a 45% manual discount override.", NotificationSeverity.WARNING, "anomaly", "/sales"),
        ("Monthly Target Surpassed: APAC", "APAC Emerging exceeded monthly target quota by 14.2% ahead of schedule.", NotificationSeverity.SUCCESS, "target", "/targets"),
        ("ML Model Retraining Completed", "Sales Forecaster model v2.4.0 successfully retrained with updated Q1 data.", NotificationSeverity.INFO, "system", "/intelligence"),
    ]
    for title, msg, sev, cat, link in notifications_data:
        notif = Notification(title=title, message=msg, severity=sev, category=cat, link=link, is_read=False)
        db.add(notif)
    db.commit()
    
    # 13. Audit Logs
    audit_data = [
        ("admin@opsintel.com", "USER_LOGIN", "user", "1", "Successful authentication via JWT session", "192.168.1.10"),
        ("manager@opsintel.com", "TARGET_UPDATE", "target", "2", "Modified NA-East quarterly target threshold to $1.2M", "192.168.1.15"),
        ("analyst@opsintel.com", "MODEL_INFERENCE_RUN", "ml_model", "1", "Executed 90-day multi-horizon sales forecast batch job", "192.168.1.22"),
        ("admin@opsintel.com", "ROLE_ASSIGNMENT", "user", "4", "Assigned SALES_EXECUTIVE role to David Miller", "192.168.1.10"),
        ("manager@opsintel.com", "DOCUMENT_UPLOAD", "document", "1", "Uploaded OpsIntel Operating Manual 2026 into RAG knowledge base", "192.168.1.15"),
    ]
    for email, action, e_type, e_id, details, ip in audit_data:
        log = AuditLog(user_email=email, action=action, entity_type=e_type, entity_id=e_id, details=details, ip_address=ip)
        db.add(log)
    db.commit()
    
    # 14. Documents for RAG
    documents_seed = [
        {
            "title": "OpsIntel Operations & Supply Chain Manual 2026",
            "filename": "OpsIntel_Operations_Manual_2026.txt",
            "category": "Operations",
            "content": "OpsIntel Supply Chain & Inventory Protocol: 1. Inventory Reorder Triggers: When available stock drops below the defined reorder point (Lead Time Demand + Safety Stock), the inventory service raises an automated procurement requisition. 2. Safety Stock Formula: Safety Stock = (Max Daily Usage * Max Lead Time) - (Average Daily Usage * Average Lead Time). 3. Critical Lead Time Items: High-density compute components such as Titan-9000 and Apex GPU Pods have a supplier turnaround time of 14 to 21 days. Buffer stock must never fall below 15% of monthly consumption. 4. Emergency Expedited Shipping: Expedited dispatch from secondary distributors in EMEA can reduce lead times by 60% with a 12% surcharge."
        },
        {
            "title": "Enterprise Sales Quotas & Discount Governance Policy",
            "filename": "Sales_Governance_Policy.txt",
            "category": "Sales",
            "content": "OpsIntel Sales Governance & Pricing Matrix: 1. Standard Discount Thresholds: Sales Executives can authorize discounts up to 10% on Enterprise Software and Compute bundles. 2. Manager Approval Required: Discounts between 11% and 20% require written approval from the Regional Sales Director. 3. VP Operations Approval: Any discount exceeding 20% requires formal sign-off from the Operations VP and automated anomaly review. 4. Annual Contract Rebates: Customers committing to multi-year SaaS platform terms are eligible for an additional 5% platform credit applied to hardware compute accessories."
        },
        {
            "title": "Customer Retention & Churn Mitigation Playbook",
            "filename": "Customer_Retention_Playbook.txt",
            "category": "Customer Success",
            "content": "Customer Churn Early Warning System: 1. High-Risk Indicators: A customer is classified as High Risk if days since last order exceeds 75 days, average monthly transaction volume declines by >35%, or support escalation velocity increases. 2. Intervention Protocol: For High Value Champions entering the At Risk segment (LTV > $100k), the assigned Account Executive must schedule an executive business review within 5 business days. 3. Special Retention Incentives: Authorized retention bundles include 3 months complimentary AI Decision Core add-on access or a 15% renewal discount on cloud licenses."
        },
        {
            "title": "Q1 2026 Executive Business Review & Strategic Priorities",
            "filename": "Q1_2026_Executive_Review.txt",
            "category": "Executive",
            "content": "Executive Review & Quarterly Focus Areas: 1. Revenue Trajectory: Total company revenue is pacing at $4.12M against the $4.50M quarterly goal (91.5% target achievement rate). 2. Regional Highlights: APAC Emerging is the fastest-growing territory (+14.2% over target), whereas EMEA Central requires pipeline acceleration. 3. Top Operational Risk: Component lead times on GPU accelerators and server blades are constraining fulfillment in the North America West region. 4. Key Action Items: Reallocate 30% of incoming compute inventory to West coast enterprise accounts; execute targeted outreach for 5 accounts flagged by the churn prediction engine."
        }
    ]
    
    for doc_info in documents_seed:
        doc = Document(
            title=doc_info["title"], filename=doc_info["filename"], file_type="txt",
            file_size=len(doc_info["content"].encode("utf-8")), chunk_count=0,
            category=doc_info["category"], created_at=now - timedelta(days=15)
        )
        db.add(doc)
        db.flush()
        
        raw_chunks = [c.strip() for c in doc_info["content"].split(". ") if len(c.strip()) > 15]
        doc.chunk_count = len(raw_chunks)
        for idx, chunk_txt in enumerate(raw_chunks):
            chunk = DocumentChunk(
                document_id=doc.id, chunk_index=idx, content=chunk_txt,
                metadata_info={"source": doc.filename, "category": doc.category, "chunk_id": idx}
            )
            db.add(chunk)
    db.commit()
    
    # 15. AI Conversation
    convo = AIConversation(title="Executive Performance & Risk Analysis", user_id=user_objs[0].id, created_at=now - timedelta(hours=3))
    db.add(convo)
    db.flush()
    
    msg_user = AIMessage(conversation_id=convo.id, role="user", content="What are the biggest operational risks currently impacting revenue this quarter?", created_at=now - timedelta(hours=3))
    db.add(msg_user)
    
    msg_ai = AIMessage(
        conversation_id=convo.id, role="assistant",
        content="Based on real-time operational metrics across sales, supply chain, and customer telemetry, here are the top 3 high-impact risks for Q1 2026:",
        metrics_data=[
            {"label": "Current Q1 Revenue", "value": "$4,120,000", "status": "91.5% of Target"},
            {"label": "Stockout Constrained Revenue", "value": "$184,000", "status": "Critical"},
            {"label": "Accounts in High Churn Band", "value": "7 Accounts ($320k LTV)", "status": "High Risk"}
        ],
        recommendations=[
            "Expedite purchase orders for Apex GPU Pods (SKU-GPU-008) - current inventory has only 6 days buffer against a 21-day supplier lead time.",
            "Deploy executive retention outreach for the 7 high-risk enterprise accounts in NA-West to protect recurring renewals.",
            "Audit Order #ORD-10142 and enforce discount governance rules on manual margin overrides exceeding 20%."
        ],
        citations=[
            {"document": "Q1_2026_Executive_Review.txt", "section": "Top Operational Risk"},
            {"document": "OpsIntel_Operations_Manual_2026.txt", "section": "Critical Lead Time Items"}
        ],
        created_at=now - timedelta(hours=2, minutes=58)
    )
    db.add(msg_ai)
    db.commit()
    return {"status": "success", "message": "Database populated with enterprise dataset."}
