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
export declare class PolicyEvaluator {
    evaluate(policies: Policy[], context: EvaluationContext): {
        allowed: boolean;
        reason: string;
        matchedPolicies: string[];
    };
    private isPolicyMatch;
    private matchValue;
    private compareStrings;
    private evaluateRule;
    private getAttributeValue;
}
//# sourceMappingURL=policyEvaluator.d.ts.map