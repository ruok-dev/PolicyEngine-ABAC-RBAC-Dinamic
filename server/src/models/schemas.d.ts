import { z } from 'zod';
export declare const RuleSchema: z.ZodObject<{
    attribute: z.ZodString;
    operator: z.ZodEnum<{
        equals: "equals";
        not_equals: "not_equals";
        greater_than: "greater_than";
        less_than: "less_than";
        in: "in";
        not_in: "not_in";
        contains: "contains";
        between: "between";
    }>;
    value: z.ZodAny;
}, z.core.$strip>;
export declare const PolicySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    effect: z.ZodEnum<{
        allow: "allow";
        deny: "deny";
    }>;
    action: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
    resource: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
    rules: z.ZodArray<z.ZodObject<{
        attribute: z.ZodString;
        operator: z.ZodEnum<{
            equals: "equals";
            not_equals: "not_equals";
            greater_than: "greater_than";
            less_than: "less_than";
            in: "in";
            not_in: "not_in";
            contains: "contains";
            between: "between";
        }>;
        value: z.ZodAny;
    }, z.core.$strip>>;
    priority: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const EvaluationRequestSchema: z.ZodObject<{
    user: z.ZodRecord<z.ZodAny, z.core.SomeType>;
    resource: z.ZodRecord<z.ZodAny, z.core.SomeType>;
    action: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map