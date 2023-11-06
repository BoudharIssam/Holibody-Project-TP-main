import axios from "axios";
import { showAlert } from './alerts';

export const bookHoli = async (holiId) => {
  try {
    const stripe = await Stripe(
      'pk_test_51O4KrTAtmMDYbMVqDMPAakfFD0APybp4FT1OKqBYsNqgk1q9wANPRaqTNAf1xgDoC3uf7ZPNpatxXxBnkriWY31G00Y3Oit6Dl'
    );
  
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${holiId}`);
    console.log(session);
    // 2) Create checkout form plus charge credit card
    // const checkoutPageUrl = session.data.session.url;
    // window.location.assign(checkoutPageUrl);

    //works as expected
    window.location.replace(session.data.session.url);
    if (session.data.session.url === 'success') {
      showAlert('success', 'Booking successfully');
      window.setTimeout(() => {
        location.assign('/holis');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};