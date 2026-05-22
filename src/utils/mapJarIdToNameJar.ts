export function mapJarIdToNameJar(params: {
  jarId?: string;
  jars: { id: string; name: string }[];
}) {
  const { jarId, jars } = params;
  if (!jarId) return null;
  const jar = jars.find((j) => j.id === jarId);
  return jar ? jar.name : null;
}
