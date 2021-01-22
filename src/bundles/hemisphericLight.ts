export default async function () {
  const { HemisphericLight } = await import(
    '@babylonjs/core/Lights/hemisphericLight'
  );
  return { HemisphericLight };
}
