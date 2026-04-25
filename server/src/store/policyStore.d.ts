import { Policy } from '../engine/policyEvaluator';
declare class PolicyStore {
    private policies;
    getAll(): Policy[];
    getById(id: string): Policy | undefined;
    add(policy: Policy): void;
    update(id: string, updatedPolicy: Policy): void;
    delete(id: string): void;
}
export declare const policyStore: PolicyStore;
export {};
//# sourceMappingURL=policyStore.d.ts.map