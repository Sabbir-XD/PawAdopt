import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";

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
      toast.error("Enter a valid donation amount");
      return;
    }

    setLoading(true);

    try {
      // 1. Create PaymentIntent
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: parseFloat(amount),
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
          amount: parseFloat(amount),
          donatorEmail: user?.email,
          donatorName: user?.displayName,
          createdAt: new Date(),
        };

        await axiosSecure.post("/donations-payments", donationData);
        toast.success("Donation successful!");
        setAmount("");
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6">
          <Dialog.Title className="text-xl font-semibold mb-4 text-center">
            Donate to: {campaign.petName}
          </Dialog.Title>
          <form onSubmit={handleDonate} className="space-y-4">
            {/* Donation Amount */}
            <div>
              <label className="block text-sm font-medium">
                Donation Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 dark:bg-gray-800"
                min={1}
                step="0.01"
              />
            </div>

            {/* Stripe Card Element */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Details
              </label>
              <div className="border p-3 rounded bg-white dark:bg-gray-800">
                <CardElement
                  options={{ style: { base: { fontSize: "16px" } } }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!stripe || loading}
            >
              {loading ? "Processing..." : "Donate Now"}
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DonationModal;
