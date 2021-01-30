// https://astexplorer.net/

export interface AST {
  program: { body: Array<object> };
}

export type ASTNode =
  | ExpressionStatement
  | CallExpression
  | MemberExpression
  | Identifier;

interface ExpressionStatement {
  type: 'ExpressionStatement';
  expression: CallExpression;
}

interface CallExpression {
  type: 'CallExpression';
  callee: Identifier | MemberExpression;
  arguments: Array<ASTNode>;
}

interface MemberExpression {
  type: 'MemberExpression';
  object: CallExpression;
  computed: boolean;
  property: Identifier;
}

interface Identifier {
  type: 'Identifier';
  name: string;
}

export const findSceneObjects = (ast: AST | null) => {
  if (!ast) return [];

  const sceneExpressions = ast.program.body.filter(
    (node: ASTNode) =>
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'MemberExpression' &&
      node.expression.callee.property.type === 'Identifier' &&
      (node.expression.callee.property.name === 'render' ||
        node.expression.callee.property.name === 'renderTo')
  ) as [ExpressionStatement];

  console.assert(sceneExpressions.length === 1);

  let sceneCall = sceneExpressions[0].expression.callee as MemberExpression;
  while (
    sceneCall.type === 'MemberExpression' &&
    sceneCall.object.callee.type !== 'Identifier'
  ) {
    sceneCall = sceneCall.object.callee;
  }

  return sceneCall.object.arguments;
};
