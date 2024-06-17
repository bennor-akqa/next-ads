import { CSSProperties } from 'react'

const AD_SLOT_SIZES = {
  '300x50': [300, 50],
  '320x50': [320, 50],
  '300x250': [300, 250],
  '728x90': [728, 90],
  '970x250': [970, 250],
  '320x420': [320, 420],
  '300x600': [300, 600],
  fluid: 'fluid',
  responsiveExample: [
    [
      [1024, 768],
      [
        [970, 250],
        [728, 90],
      ],
    ],
    [[640, 480], [[300, 250]]],
    [[0, 0], []],
  ],
} as const satisfies Record<string, googletag.GeneralSize | googletag.SizeMappingArray>

export type AdSlotSize = keyof typeof AD_SLOT_SIZES

const AD_SLOT_STYLES = Object.fromEntries(
  Object.entries(AD_SLOT_SIZES).map(([key, value]) => {
    if (isSizeMapping(value)) {
      const sizes = extractSizes(value)
      const [minWidth, minHeight] = sizes.sort((a, b) => a[1] - b[1])[0]
      return [key, { minWidth: `${minWidth}px`, minHeight: `${minHeight}px` }]
    }
    if (value === 'fluid') return [key, { minWidth: '50%', minHeight: '50px' }]

    const [width, height] = value
    return [key, { minWidth: `${width}px`, minHeight: `${height}px` }]
  }),
) as Record<AdSlotSize, CSSProperties | undefined>

function isSizeMapping(value: unknown): value is googletag.SizeMappingArray {
  return Array.isArray(value) && Array.isArray(value[0])
}

function extractSizes(mappings: googletag.SizeMappingArray) {
  return mappings.flatMap((mapping) => mapping[1] as googletag.SingleSizeArray[])
}

export interface AdSlotSizeInfo {
  size: googletag.GeneralSize
  sizeMapping?: googletag.SizeMappingArray
}

export function getAdSlotSize(size: AdSlotSize): AdSlotSizeInfo {
  const sizeOrSizeMapping = AD_SLOT_SIZES[size]
  if (isSizeMapping(sizeOrSizeMapping)) {
    const sizes = extractSizes(sizeOrSizeMapping) as googletag.MultiSize
    return { size: sizes, sizeMapping: sizeOrSizeMapping }
  }
  return { size: sizeOrSizeMapping }
}

export function getAdSlotStyle(size: AdSlotSize): CSSProperties | undefined {
  return AD_SLOT_STYLES[size]
}
