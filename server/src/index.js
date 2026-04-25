"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const policyEvaluator_1 = require("./engine/policyEvaluator");
const policyStore_1 = require("./store/policyStore");
const schemas_1 = require("./models/schemas");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const evaluator = new policyEvaluator_1.PolicyEvaluator();
// Middleware to enrich context with environmental data
const contextMiddleware = (req, res, next) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    req.envContext = {
        time: currentTime,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
    };
    next();
};
// --- API Routes ---
// 1. Evaluate Permission
app.post('/api/evaluate', contextMiddleware, (req, res) => {
    try {
        const body = schemas_1.EvaluationRequestSchema.parse(req.body);
        const context = {
            user: body.user,
            resource: body.resource,
            action: body.action,
            env: req.envContext
        };
        const result = evaluator.evaluate(policyStore_1.policyStore.getAll(), context);
        res.json({
            ...result,
            context // Returning context for transparency in the demo
        });
    }
    catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});
// 2. Policy Management
app.get('/api/policies', (req, res) => {
    res.json(policyStore_1.policyStore.getAll());
});
app.post('/api/policies', (req, res) => {
    try {
        const policy = schemas_1.PolicySchema.parse(req.body);
        policyStore_1.policyStore.add(policy);
        res.status(201).json(policy);
    }
    catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});
app.delete('/api/policies/:id', (req, res) => {
    policyStore_1.policyStore.delete(req.params.id);
    res.status(204).send();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'up', engine: 'PolicyEngine v1.0' });
});
app.listen(port, () => {
    console.log(`[PolicyEngine] Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map