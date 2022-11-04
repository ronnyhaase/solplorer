const AVG_SLOTTIME = 550

const normalizeEpoch = (rawEpochInfo) => ({
  currentEpoch: rawEpochInfo.epoch,
  nextEpoch: rawEpochInfo.epoch + 1,
  slotCurrent: rawEpochInfo.slotIndex,
  slotTarget: rawEpochInfo.slotsInEpoch,
  slotRangeStart: rawEpochInfo.absoluteSlot - rawEpochInfo.slotIndex,
  slotRangeEnd: rawEpochInfo.absoluteSlot - rawEpochInfo.slotIndex + rawEpochInfo.slotsInEpoch,
  epochETA:
    (rawEpochInfo.slotsInEpoch - rawEpochInfo.slotIndex) * AVG_SLOTTIME,
  epochProgress: Math.round(
    (rawEpochInfo.slotIndex / rawEpochInfo.slotsInEpoch) * 100,
  ),
})

module.exports = {
  normalizeEpoch,
}
