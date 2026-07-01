/** CSS colors and gradients for judo belt tokens used in grade seeds. */
const JUDO_BELT_COLORS: Record<string, string> = {
  'judo-belt-white': '#f5f5f5',
  'judo-belt-yellow': '#f5d000',
  'judo-belt-orange': '#f57c00',
  'judo-belt-green': '#2e7d32',
  'judo-belt-blue': '#1565c0',
  'judo-belt-brown': '#5d4037',
  'judo-belt-black': '#000000',
  'judo-belt-red': '#c62828'
}

/** Two-tone belts: outer color – center color – outer color (e.g. white-yellow-white). */
const JUDO_BELT_BANDS: Record<string, readonly [string, string]> = {
  'judo-belt-white-yellow': ['#f5f5f5', '#f5d000'],
  'judo-belt-yellow-orange': ['#f5d000', '#f57c00'],
  'judo-belt-orange-green': ['#f57c00', '#2e7d32'],
  'judo-belt-green-blue': ['#2e7d32', '#1565c0'],
  'judo-belt-blue-brown': ['#1565c0', '#5d4037']
}

const JUDO_BELT_AVATAR_STRIPED =
  'repeating-linear-gradient(to bottom, #c62828 0 3px, #f5f5f5 3px 6px)'

/** Outer band size for three-stripe belts (center gets the remainder). */
const JUDO_BELT_BAND_OUTER_PERCENT = 20

function threeBandGradient(
  outerColor: string,
  centerColor: string,
  direction: 'to right' | 'to bottom'
): string {
  const outerEnd = JUDO_BELT_BAND_OUTER_PERCENT
  const centerEnd = 100 - JUDO_BELT_BAND_OUTER_PERCENT

  return `linear-gradient(${direction}, ${outerColor} 0 ${outerEnd}%, ${centerColor} ${outerEnd}% ${centerEnd}%, ${outerColor} ${centerEnd}% 100%)`
}

/**
 *
 */
export type JudoBeltAvatarFill =
  | { kind: 'empty' }
  | { kind: 'solid'; color: string }
  | { kind: 'banded'; outerColor: string; centerColor: string }
  | { kind: 'striped'; background: string }

/** Share of each outer band in three-stripe belt rendering (percent). */
export const judoBeltBandOuterPercent = JUDO_BELT_BAND_OUTER_PERCENT

/**
 * Resolves a persisted belt color token to a CSS color value.
 *
 * @param token - Belt color token from the grades table.
 * @returns Hex color for solid belt swatches.
 */
export function judoBeltCssColor(token: string | null | undefined): string {
  if (!token) {
    return '#e0e0e0'
  }

  return JUDO_BELT_COLORS[token] ?? '#e0e0e0'
}

/**
 * Builds inline styles for rendering a horizontal belt swatch from a token.
 *
 * @param token - Belt color token from the grades table.
 * @returns CSS properties for the swatch element.
 */
export function judoBeltSwatchStyle(token: string | null | undefined): Record<string, string> {
  if (!token) {
    return { backgroundColor: '#e0e0e0' }
  }

  const bands = JUDO_BELT_BANDS[token]

  if (bands) {
    return { background: threeBandGradient(bands[0], bands[1], 'to right') }
  }

  if (token === 'judo-belt-red-white') {
    return {
      background: 'repeating-linear-gradient(to right, #c62828 0 3px, #f5f5f5 3px 6px)'
    }
  }

  return { backgroundColor: JUDO_BELT_COLORS[token] ?? '#e0e0e0' }
}

/**
 * Resolves fill data for a circular belt avatar.
 *
 * @param token - Belt color token from the grades table.
 * @returns Structured fill for banded stripes, dan stripes, or solid color.
 */
export function resolveJudoBeltAvatarFill(token: string | null | undefined): JudoBeltAvatarFill {
  if (!token) {
    return { kind: 'empty' }
  }

  const bands = JUDO_BELT_BANDS[token]

  if (bands) {
    return {
      kind: 'banded',
      outerColor: bands[0],
      centerColor: bands[1]
    }
  }

  if (token === 'judo-belt-red-white') {
    return {
      kind: 'striped',
      background: JUDO_BELT_AVATAR_STRIPED
    }
  }

  return {
    kind: 'solid',
    color: JUDO_BELT_COLORS[token] ?? '#e0e0e0'
  }
}
