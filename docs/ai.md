# OpsIntel Business AI Copilot

The OpsIntel AI Copilot provides conversational operational intelligence with real database query synthesis and deterministic verification.

## Architecture

```mermaid
sequenceDiagram
    User->>Copilot: "What were our top 3 performing regions in Q3 and why?"
    Copilot->>IntentParser: Classify intent & extract temporal filters
    Copilot->>Database: Execute parameterized analytic query
    Copilot->>RAG: Retrieve relevant strategic initiatives & quarterly memos
    Copilot->>SynthesisEngine: Combine structured metrics + document context
    Copilot-->>User: Structured response with tables, insights & document citations
```

## Supported Reasoning Capabilities
1. **Financial Performance Summaries**: Inquiring about MRR, ARR, CAC, gross margin, regional variances.
2. **Predictive Interrogation**: Querying forecast trends, high-risk churn accounts, and upcoming inventory deficits.
3. **Root-Cause Analysis**: Cross-referencing operational dips with supply chain delivery delays and regional sales attrition.
4. **Actionable Recommendations**: Automatic generation of remediation playbooks based on indexed SOPs.
