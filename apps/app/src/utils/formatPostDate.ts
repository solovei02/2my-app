export function formatPostDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
