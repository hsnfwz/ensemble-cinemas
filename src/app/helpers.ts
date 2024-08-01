const debounce = (func: Function, timeout = 500) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(func, args);
    }, timeout);
  };
}

export {
  debounce,
}
