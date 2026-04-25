
export type Operator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'contains' | 'between';

export interface Rule {
  attribute: string;
  operator: Operator;
  value: any;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  action: string | string[];
  resource: string | string[];
  rules: Rule[];
  priority: number;
}

export interface EvaluationContext {
  user: Record<string, any>;
  resource: Record<string, any>;
  env: Record<string, any>;
  action: string;
}

export class PolicyEvaluator {
  evaluate(policies: Policy[], context: EvaluationContext): { allowed: boolean; reason: string; matchedPolicies: string[] } {
    // Sort policies by priority (higher priority first)
    const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);

    const matches: Policy[] = [];

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

  private isPolicyMatch(policy: Policy, context: EvaluationContext): boolean {
    // Check Action
    if (!this.matchValue(policy.action, context.action)) return false;

    // Check Resource (using a simple string match or wildcard)
    if (!this.matchValue(policy.resource, context.resource.id)) return false;

    // Check all rules (AND logic for rules within a policy)
    return policy.rules.every(rule => this.evaluateRule(rule, context));
  }

  private matchValue(pattern: string | string[], value: string): boolean {
    if (Array.isArray(pattern)) {
      return pattern.some(p => this.compareStrings(p, value));
    }
    return this.compareStrings(pattern, value);
  }

  private compareStrings(pattern: string, value: string): boolean {
    if (pattern === '*') return true;
    return pattern === value;
  }

  private evaluateRule(rule: Rule, context: EvaluationContext): boolean {
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

  private getAttributeValue(context: EvaluationContext, path: string): any {
    const parts = path.split('.');
    let current: any = context;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }
}
