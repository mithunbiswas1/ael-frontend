// src/dictionaries/index.js

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  bn: () => import("./bn.json").then((module) => module.default),
};

export const getDictionary = async (locale = "en") => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries.en();
};
