import axios from "axios";
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm)
  try {
    console.log(signup)
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created and logged in successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
