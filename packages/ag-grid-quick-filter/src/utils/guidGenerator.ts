export const generateGuid = (): string => {
  const ch4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${ch4()}${ch4()}-${ch4()}-${ch4()}-${ch4()}-${ch4()}${ch4()}${ch4()}`;
};
