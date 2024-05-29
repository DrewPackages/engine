export function runInFunction<T>(context: any, code: string): T {
  const f = new Function(code);

  return f.call(context);
}
