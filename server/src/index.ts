
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PolicyEvaluator, EvaluationContext } from './engine/policyEvaluator';
import { policyStore } from './store/policyStore';
import { auditStore } from './store/auditStore';
import { EvaluationRequestSchema, PolicySchema } from './models/schemas';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Strict Rate Limiting: Max 20 requests per minute to evaluation API
const evalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Security throttling active.' }
});

const evaluator = new PolicyEvaluator();

// Middleware to enrich context with environmental data
const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  (req as any).envContext = {
    time: currentTime,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
  };
  next();
};

// --- API Routes ---

// 1. Evaluate Permission
app.post('/api/evaluate', evalLimiter, contextMiddleware, (req: Request, res: Response) => {
  try {
    const body = EvaluationRequestSchema.parse(req.body);
    
    // HONEYPOT DETECTION: Attempting to access classified system assets
    const isHoneytoken = body.resource.id === 'classified_vault' || body.resource.id === 'system_root';
    
    const context: EvaluationContext = {
      user: body.user,
      resource: body.resource,
      action: body.action,
      env: (req as any).envContext
    };

    const result = evaluator.evaluate(policyStore.getAll(), context);
    
    // Log the decision with advanced security metadata
    auditStore.add({
      user: body.user.id || body.user.role || 'unknown',
      action: body.action,
      resource: body.resource.id || 'unknown',
      effect: isHoneytoken ? 'deny' : (result.allowed ? 'allow' : 'deny'),
      reason: isHoneytoken ? 'CRITICAL: Honeytoken Triggered - Intrusion Detected' : result.reason,
      context: context,
      severity: isHoneytoken ? 'critical' : (result.allowed ? 'info' : 'warning'),
      isAlert: isHoneytoken
    });
    
    res.json({
      ...result,
      allowed: isHoneytoken ? false : result.allowed, // Always deny honeytokens
      isHoneytoken,
      context
    });
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

// 2. Policy Management
app.get('/api/policies', (req, res) => {
  res.json(policyStore.getAll());
});

app.post('/api/policies', (req, res) => {
  try {
    const policy = PolicySchema.parse(req.body);
    policyStore.add(policy);
    res.status(201).json(policy);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.delete('/api/policies/:id', (req, res) => {
  policyStore.delete(req.params.id);
  res.status(204).send();
});

// 3. Audit Logs
app.get('/api/logs', (req, res) => {
  res.json(auditStore.getAll());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'up', engine: 'PolicyEngine v1.0' });
});

app.listen(port, () => {
  console.log(`[PolicyEngine] Server running at http://localhost:${port}`);
});
