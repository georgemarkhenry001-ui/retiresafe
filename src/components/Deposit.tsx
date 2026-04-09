import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "../lib/firebase";
import TopNav from "./TopNav";

const paymentMethods = {
  BTC: {
    network: "Bitcoin Network",
    walletAddress: "bc1qr9mxx5gma7gg54x3qtpk5ktnjj5f3pg7u83rgp",
  },
  ETH: {
    network: "Ethereum Network",
    walletAddress: "0x2412db2c0AaD514d5e971c2cd97F92D5495594F6",
  },
  USDT: {
    network: "ERC20",
    walletAddress: "0x2412db2c0AaD514d5e971c2cd97F92D5495594F6",
  },
};

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [cryptoType, setCryptoType] = useState<"" | "BTC" | "ETH" | "USDT">("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedMethod = cryptoType ? paymentMethods[cryptoType] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const user = auth.currentUser;
    const value = Number(amount);

    if (!user) {
      toast.error("Please login again");
      return;
    }

    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!cryptoType) {
      toast.error("Select a payment method");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "depositRequests"), {
        userId: user.uid,
        email: user.email || "",
        amount: value,
        cryptoType,
        walletAddressShown: selectedMethod?.walletAddress || "",
        network: selectedMethod?.network || "",
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast.success("Deposit request submitted");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit deposit request");
    } finally {
      setLoading(false);
    }
  }

  function copyAddress() {
    if (!selectedMethod?.walletAddress) return;
    navigator.clipboard.writeText(selectedMethod.walletAddress);
    toast.success("Wallet address copied");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-bold text-slate-900">Deposit</h1>
              <p className="text-slate-600 mt-2 mb-6">
                Choose a crypto payment method and submit your deposit request.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter deposit amount"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={cryptoType}
                    onChange={(e) =>
                      setCryptoType(
                        e.target.value as "BTC" | "ETH" | "USDT" | "",
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 bg-white"
                    required
                  >
                    <option value="">Select crypto</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>

                {selectedMethod && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                    <p className="text-sm font-semibold text-indigo-700">
                      Wallet Address
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedMethod.network}
                    </p>
                    <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4 break-all text-sm text-slate-800">
                      {selectedMethod.walletAddress}
                    </div>

                    <button
                      type="button"
                      onClick={copyAddress}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Deposit Request"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Request Submitted
              </h2>
              <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                Your deposit request has been submitted successfully. Please
                complete the transfer to the displayed wallet address. Your
                balance will be updated after confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
