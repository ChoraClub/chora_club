export function formatTimestampOrDate(timestamp: string | number) {
  const date = new Date(timestamp);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    // let hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const strTime = hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm;
    // return strTime;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    if (date.getFullYear() === today.getFullYear()) {
      const options: any = { day: "2-digit", month: "short" };
      return date.toLocaleDateString(undefined, options);
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
}
