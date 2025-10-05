let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const runLogoutCallback = () => {
  if (logoutCallback) {
    logoutCallback();
  } else {
    console.warn("⚠️ No hay logoutCallback definido");
  }
};
