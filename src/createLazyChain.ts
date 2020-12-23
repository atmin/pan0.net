// export function createLazyChain<T extends object>({
//   fetchDependencies,
//   props,
// }: {
//   fetchDependencies: () => Promise<object>;
//   props: Array<keyof T>;
// }): { evaluate: (dependencies: object) => void } & {
//   [key in keyof T]: string;
// } {
//   // Stack chain method calls
//   const stack = [];

//   const result = props.reduce((result, prop) => {
//     result[prop as string] = function (...args) {
//       stack.unshift([prop, args]);
//       return this;
//     };
//     return result;
//   }, {});

//   return result as { [key in keyof T]: string };
// }
