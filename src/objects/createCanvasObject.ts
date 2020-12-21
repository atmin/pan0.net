import type { CanvasObject, CreateShape } from '../types';

export function createCanvasObject<
  TOperators = {
    [operator: string]: (
      arg?: string | boolean | number | [number, number, number]
    ) => CanvasObject;
  }
>({ createShape, ...operators }: { createShape: CreateShape } & TOperators) {
  return {
    options: {},
    operations: [],
    createShape,

    appendTo(ctx: CanvasRenderingContext2D) {
      const self = this as CanvasObject;
      self.operations.reduce((result, operation) => {
        switch (operation) {
          default:
            return result;
        }
      }, self.createShape(self.options, ctx));
    },
  };
}
