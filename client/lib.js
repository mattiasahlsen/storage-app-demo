const addZero = n => n < 10 ? '0' + n : n
export const toTimeString = time =>
  (`${addZero(time.getHours())}:${addZero(time.getMinutes())}`)