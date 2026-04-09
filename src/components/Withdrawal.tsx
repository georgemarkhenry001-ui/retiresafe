import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "../lib/firebase";
import TopNav from "./TopNav";

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    if (!walletAddress.trim()) {
      toast.error("Enter a wallet address");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "withdrawalRequests"), {
        userId: user.uid,
        email: user.email || "",
        amount: value,
        walletAddress: walletAddress.trim(),
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast.success("Withdrawal request submitted");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-bold text-slate-900">Withdrawal</h1>
              <p className="text-slate-600 mt-2">
                Enter the amount and destination wallet address to submit your
                withdrawal request.
              </p>

              <div className="mt-4 mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-800">
                  Withdrawal processing usually takes 3 to 5 days.
                </p>
              </div>

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
                    placeholder="Enter withdrawal amount"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Wallet Address
                  </label>
                  <textarea
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter destination wallet address"
                    rows={4}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Withdrawal Request"}
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
                Your withdrawal request has been submitted successfully and is
                awaiting review.
              </p>
              <p className="text-sm text-slate-500 mt-3">
                Withdrawal processing usually takes 3 to 5 days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
