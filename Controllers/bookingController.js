const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Holi = require("../Models/holiModel");
const Booking = require("../Models/bookingModel");
const catchAsync = require("../Services/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) GET the currently booked holi
  const holi = await Holi.findById(req.params.holiId);
  // 2) Create checkout session

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/?holi=${
        req.params.holiId
      }&user=${req.user.id}&price=${holi.price}`,
      cancel_url: `${req.protocol}://${req.get("host")}/holi/${holi.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.holiId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${holi.name} Holi`,
              description: holi.summary,
              images: [
                `${req.protocol}://${req.get("host")}/img/holis/${
                  holi.imageCover
                }`,
              ],
            },
            unit_amount: holi.price * 100,
          },
          quantity: 1,
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
  // 3) Create session as reponse
  res.status(200).json({
    status: "success",
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only Temporary, because it's unsecure: everyone can make bookings without paying
//   const { holi, user, price } = req.query;

//   if (!holi && !user && !price) return next();
//   await Booking.create({ holi, user, price });

//   res.redirect(req.originalUrl.split("?")[0]);
// });

const createBookingCheckout = async session => {
  const holi = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;
  await Booking.create({ holi, user, price });
};
 
exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error ${err.message}`);
  }
 
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
 
  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
