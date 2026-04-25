"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationRequestSchema = exports.PolicySchema = exports.RuleSchema = void 0;
const zod_1 = require("zod");
exports.RuleSchema = zod_1.z.object({
    attribute: zod_1.z.string(),
    operator: zod_1.z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'in', 'not_in', 'contains', 'between']),
    value: zod_1.z.any(),
});
exports.PolicySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    effect: zod_1.z.enum(['allow', 'deny']),
    action: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    resource: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    rules: zod_1.z.array(exports.RuleSchema),
    priority: zod_1.z.number().default(0),
});
exports.EvaluationRequestSchema = zod_1.z.object({
    user: zod_1.z.record(zod_1.z.any()),
    resource: zod_1.z.record(zod_1.z.any()),
    action: zod_1.z.string(),
});
//# sourceMappingURL=schemas.js.map