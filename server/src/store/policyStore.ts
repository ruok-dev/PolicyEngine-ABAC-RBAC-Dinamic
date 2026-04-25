
import { Policy } from '../engine/policyEvaluator';

// Initial dummy policies to demonstrate the power of the engine
const initialPolicies: Policy[] = [
  {
    id: 'p-admin-all',
    name: 'Admin Global Access',
    description: 'Allows full access to admins across all resources',
    effect: 'allow',
    action: '*',
    resource: '*',
    priority: 10,
    rules: [
      { attribute: 'user.role', operator: 'equals', value: 'admin' }
    ]
  },
  {
    id: 'p-office-hours',
    name: 'Standard User Office Hours',
    description: 'Allows users to read resources only during business hours',
    effect: 'allow',
    action: 'read',
    resource: '*',
    priority: 5,
    rules: [
      { attribute: 'env.time', operator: 'between', value: ['08:00', '18:00'] },
      { attribute: 'env.ip', operator: 'in', value: ['127.0.0.1', '::1', '192.168.1.1'] }
    ]
  },
  {
    id: 'p-deny-external',
    name: 'Deny External Access to Sensitive',
    description: 'Deny access to sensitive data if not on local network',
    effect: 'deny',
    action: '*',
    resource: 'sensitive_data',
    priority: 20,
    rules: [
      { attribute: 'env.ip', operator: 'not_in', value: ['127.0.0.1', '::1'] }
    ]
  }
];

class PolicyStore {
  private policies: Policy[] = initialPolicies;

  getAll(): Policy[] {
    return this.policies;
  }

  getById(id: string): Policy | undefined {
    return this.policies.find(p => p.id === id);
  }

  add(policy: Policy): void {
    this.policies.push(policy);
  }

  update(id: string, updatedPolicy: Policy): void {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.policies[index] = updatedPolicy;
    }
  }

  delete(id: string): void {
    this.policies = this.policies.filter(p => p.id !== id);
  }
}

export const policyStore = new PolicyStore();
