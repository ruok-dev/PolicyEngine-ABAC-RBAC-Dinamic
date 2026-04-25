"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEvaluator = void 0;
class PolicyEvaluator {
    evaluate(policies, context) {
        // Sort policies by priority (higher priority first)
        const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);
        const matches = [];
        for (const policy of sortedPolicies) {
            if (this.isPolicyMatch(policy, context)) {
                matches.push(policy);
                // If a "deny" policy matches, we stop and deny immediately (Deny-Override pattern)
                if (policy.effect === 'deny') {
                    return {
                        allowed: false,
                        reason: `Denied by policy: ${policy.name}`,
                        matchedPolicies: [policy.id]
                    };
                }
            }
        }
        if (matches.length > 0) {
            return {
                allowed: true,
                reason: `Allowed by ${matches.length} matching policies`,
                matchedPolicies: matches.map(p => p.id)
            };
        }
        return {
            allowed: false,
            reason: 'No matching policies found (Default Deny)',
            matchedPolicies: []
        };
    }
    isPolicyMatch(policy, context) {
        // Check Action
        if (!this.matchValue(policy.action, context.action))
            return false;
        // Check Resource (using a simple string match or wildcard)
        if (!this.matchValue(policy.resource, context.resource.id))
            return false;
        // Check all rules (AND logic for rules within a policy)
        return policy.rules.every(rule => this.evaluateRule(rule, context));
    }
    matchValue(pattern, value) {
        if (Array.isArray(pattern)) {
            return pattern.some(p => this.compareStrings(p, value));
        }
        return this.compareStrings(pattern, value);
    }
    compareStrings(pattern, value) {
        if (pattern === '*')
            return true;
        return pattern === value;
    }
    evaluateRule(rule, context) {
        const attributeValue = this.getAttributeValue(context, rule.attribute);
        switch (rule.operator) {
            case 'equals':
                return attributeValue === rule.value;
            case 'not_equals':
                return attributeValue !== rule.value;
            case 'greater_than':
                return attributeValue > rule.value;
            case 'less_than':
                return attributeValue < rule.value;
            case 'in':
                return Array.isArray(rule.value) && rule.value.includes(attributeValue);
            case 'not_in':
                return Array.isArray(rule.value) && !rule.value.includes(attributeValue);
            case 'contains':
                return Array.isArray(attributeValue) && attributeValue.includes(rule.value);
            case 'between':
                if (Array.isArray(rule.value) && rule.value.length === 2) {
                    return attributeValue >= rule.value[0] && attributeValue <= rule.value[1];
                }
                return false;
            default:
                return false;
        }
    }
    getAttributeValue(context, path) {
        const parts = path.split('.');
        let current = context;
        for (const part of parts) {
            if (current === undefined || current === null)
                return undefined;
            current = current[part];
        }
        return current;
    }
}
exports.PolicyEvaluator = PolicyEvaluator;
//# sourceMappingURL=policyEvaluator.js.map