// https://astexplorer.net/

// https://cancerberosgx.github.io/demos/cannabis/typescript-ast-query-editor/

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

export const findSceneExpression = (ast: AST): ExpressionStatement | null => {
  const sceneExpressions = ast.program.body.filter(
    (node: ASTNode) =>
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'MemberExpression' &&
      node.expression.callee.property.type === 'Identifier' &&
      (node.expression.callee.property.name === 'render' ||
        node.expression.callee.property.name === 'renderTo')
  ) as [ExpressionStatement];

  if (sceneExpressions.length === 1) {
    return sceneExpressions[0];
  }
  return null;
};

export const findSceneObjects = (ast: AST | null) => {
  if (!ast) {
    return [];
  }

  const sceneExpression = findSceneExpression(ast);

  let sceneCall = sceneExpression.expression.callee as MemberExpression;
  while (
    sceneCall.type === 'MemberExpression' &&
    sceneCall.object.callee.type !== 'Identifier'
  ) {
    sceneCall = sceneCall.object.callee;
  }

  return sceneCall.object.arguments;
};

export const astId = (node: ASTNode): string => {
  return '';
};

// TODO: remove
Object.assign(window, { findSceneExpression, findSceneObjects, astId });
