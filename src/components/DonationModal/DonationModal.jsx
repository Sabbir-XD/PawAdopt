import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { FaHeart, FaTimes } from "react-icons/fa";

const DonationModal = ({ isOpen, setIsOpen, campaign }) => {
  const [amount, setAmount] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setLoading(true);

    try {
      // 1. Create PaymentIntent
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: parseFloat(amount) * 100, // Convert to cents
      });

      const clientSecret = res.data.clientSecret;

      // 2. Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3. Save donation in DB
        const donationData = {
          campaignId: campaign._id,
          campaignTitle: campaign.petName,
          campaignImageUrl: campaign.imageUrl,
          amount: parseFloat(amount),
          donatorEmail: user?.email,
          donatorName: user?.displayName,
          createdAt: new Date(),
        };

        await axiosSecure.post("/donations-payments", donationData);
        toast.success(
          `Thank you for your $${amount} donation to ${campaign.petName}!`
        );
        setAmount("");
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => !loading && setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-teal-100 dark:border-teal-900/50">
          <div className="relative p-6">
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <FaHeart className="mx-auto h-12 w-12 text-teal-500 mb-3" />
              <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-teal-100">
                Support {campaign.petName}
              </Dialog.Title>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Every donation makes a difference!
              </p>
            </div>

            <form onSubmit={handleDonate} className="space-y-5">
              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Donation Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 pl-8 dark:bg-gray-700/50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    min="1"
                    step="0.01"
                    placeholder="50.00"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Stripe Card Element */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Details
                </label>
                <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700/50">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1a202c",
                          "::placeholder": {
                            color: "#a0aec0",
                          },
                        },
                      },
                      hidePostalCode: true,
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 text-lg shadow-md hover:shadow-teal-500/20 transition-all"
                disabled={!stripe || loading}
                isLoading={loading}
              >
                {loading ? "Processing..." : `Donate $${amount || "0"}`}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Secure payment processing by Stripe
              </p>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DonationModal;