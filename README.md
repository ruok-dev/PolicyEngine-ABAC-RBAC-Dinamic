# PolicyEngine (Dynamic ABAC & RBAC)

A high-performance, context-aware authorization system designed for modern security requirements. This project demonstrates how to implement **Attribute-Based Access Control (ABAC)** and **Role-Based Access Control (RBAC)** using a dynamic policy engine.

## 🛡️ Security Philosophy
Most traditional systems rely on static checks like `if (user.isAdmin)`. PolicyEngine moves beyond this by evaluating **Context**.
- **User Attributes**: Role, Department, Clearances, Seniority.
- **Resource Attributes**: Type, Sensitivity, Ownership.
- **Environment Context**: Current Time, IP Address, Device Type, Geographical Location.

## ✨ Key Features
- **Dynamic Policy Evaluation**: Change rules in real-time without redeploying the application.
- **Hybrid Model**: Seamlessly combine RBAC (roles) with ABAC (attributes).
- **Deny-Override Pattern**: Higher priority "deny" rules always take precedence, ensuring maximum safety.
- **Context Awareness**: Automatically injects environmental data (IP, Time) into every evaluation request.
- **Premium Dashboard**: A sleek, dark-themed UI built with React, Framer Motion, and Glassmorphism.

## 🚀 Tech Stack
- **Backend**: Node.js, TypeScript, Express, Zod (Validation).
- **Frontend**: React (Vite), Framer Motion, Lucide Icons, Vanilla CSS.
- **Security**: Helmet, CORS, Input Sanitization.

## 🛠️ Getting Started

### 1. Backend
```bash
cd server
npm install
npm run dev # requires ts-node
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## 📖 Example Policy
```json
{
  "name": "Secure Financial Access",
  "effect": "allow",
  "action": "read",
  "resource": "financial_report",
  "rules": [
    { "attribute": "user.role", "operator": "equals", "value": "auditor" },
    { "attribute": "env.ip", "operator": "in", "value": ["127.0.0.1", "10.0.0.1"] },
    { "attribute": "env.time", "operator": "between", "value": ["08:00", "18:00"] }
  ]
}
```

## 🔒 Sensitive Data Protection
This project uses `.env` files for configuration. Ensure you never commit sensitive keys or credentials to the repository. A `.gitignore` is provided to protect your data.
