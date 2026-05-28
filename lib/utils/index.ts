/**
 * cn — minimal className combiner.
 * Joins truthy class fragments with a space. Keeps deps zero;
 * can be upgraded to clsx + tailwind-merge later if conflict-resolution is needed.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
