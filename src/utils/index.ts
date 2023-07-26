// eslint-disable-next-line import/prefer-default-export
import { formatDistance } from 'date-fns';

export function removeObjectWithId(arr: Array<any>, id: number): Array<any> {
  // Making a copy with the Array from() method
  const arrCopy = Array.from(arr);

  const objWithIdIndex = arrCopy.findIndex((obj) => obj.id === id);
  arrCopy.splice(objWithIdIndex, 1);
  return arrCopy;
}

export function formatHumanDate(date: string) {
  const songDate = new Date(date);
  return formatDistance(songDate, new Date(), { addSuffix: true });
}
