export const findContainer = (id, items) => {
  if (id in items) {
    return id;
  }

  return Object.keys(items).find((key) => items[key].includes(id));
};
