export function convertDurationTimeString(duration: number){
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60

  const timeString = [hours, minutes, seconds]
  .map( item => String(item).padStart(2, "0"))
  .join(":")

  return timeString
}