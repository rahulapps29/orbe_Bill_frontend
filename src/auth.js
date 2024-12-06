// auth.js
let signout;

export const setSignout = (fn) => {
  signout = fn;
};

export const performSignout = (navigate) => {
  signout(navigate);
};
