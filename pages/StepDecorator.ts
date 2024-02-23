import { test } from "@playwright/test";

export function step<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Promise<Return>
  >,
) {
  async function replacementMethod(this: This, ...args: Args): Promise<Return> {
    const name = `${this.constructor.name}.${context.name as string}(${args.map((a) => JSON.stringify(a)).join(",")})`;

    return test.step(name, async () => target.call(this, ...args));
  }

  return replacementMethod;
}
