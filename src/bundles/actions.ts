export default async function () {
  const [{ ActionManager }, { ExecuteCodeAction }] = await Promise.all([
    import('@babylonjs/core/Actions/actionManager'),
    import('@babylonjs/core/Actions/directActions'),
  ]);
  return {
    ActionManager,
    ExecuteCodeAction,
  };
}
