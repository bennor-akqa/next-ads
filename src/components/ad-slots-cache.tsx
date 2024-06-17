const adSlots = new Map<string, googletag.Slot>()

export const setAdSlot = adSlots.set.bind(adSlots)
export const deleteAdSlot = adSlots.delete.bind(adSlots)
export const getAdSlots = () => Array.from(adSlots.values())
