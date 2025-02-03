/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeUndefinedProps = (
  obj: Record<string, any>,
): Record<string, any> => {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  )
}
