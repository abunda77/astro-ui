import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const KPRCalculator2 = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(750000000);
  const [downPayment, setDownPayment] = useState<number>(18);
  const [downPaymentPercentage, setDownPaymentPercentage] =
    useState<number>(18);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(135000000);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [fixedTerm, setFixedTerm] = useState<number>(5);

  const calculateMonthlyPayment = (): number => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Math.round(monthlyPayment);
  };

  const handleDownPaymentPercentageChange = (value: number) => {
    setDownPaymentPercentage(value);
    setDownPaymentAmount(Math.round((propertyPrice * value) / 100));
  };

  const handleDownPaymentAmountChange = (value: number) => {
    setDownPaymentAmount(value);
    setDownPaymentPercentage(Math.round((value / propertyPrice) * 100));
  };

  return (
    <div className="max-w-md p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
        Simulasi KPR
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Harga Properti
        </label>
        <div className="relative mt-1">
          <span className="absolute left-0 pt-2 pl-3 text-gray-500 dark:text-gray-400">
            Rp.
          </span>
          <Input
            type="text"
            value={propertyPrice.toLocaleString("id-ID")}
            className="pl-10 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            onChange={(e) => {
              const value = e.target.value.replace(/\./g, "");
              setPropertyPrice(Number(value));
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Uang Muka
        </label>
        <div className="flex items-center mt-1 space-x-2">
          <div className="flex-1">
            <Slider
              value={[downPaymentPercentage]}
              onValueChange={(value) =>
                handleDownPaymentPercentageChange(value[0])
              }
              max={50}
              step={1}
              className="mt-1 text-blue-300 bg-green-200 dark:bg-yellow-700"
            />
          </div>
          <Input
            type="number"
            value={downPaymentPercentage}
            onChange={(e) =>
              handleDownPaymentPercentageChange(Number(e.target.value))
            }
            className="w-16 text-right bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
            readOnly
          />
          <span className="text-sm text-gray-500 dark:text-gray-100">%</span>
        </div>
        <div className="relative mt-2">
          <span className="absolute left-0 pt-2 pl-3 text-gray-500 dark:text-gray-400">
            Rp.
          </span>
          <Input
            type="text"
            value={downPaymentAmount.toLocaleString("id-ID")}
            onChange={(e) => {
              const value = e.target.value.replace(/\./g, "");
              handleDownPaymentAmountChange(Number(value));
            }}
            className="pl-10 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            readOnly
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Suku Bunga Fix (%)
        </label>
        <Slider
          value={[interestRate]}
          onValueChange={(value) => setInterestRate(value[0])}
          max={15}
          step={0.1}
          className="mt-1"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {interestRate}%
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Masa Kredit Fix (Tahun)
        </label>
        <Slider
          value={[fixedTerm]}
          onValueChange={(value) => setFixedTerm(value[0])}
          max={10}
          step={1}
          className="mt-1"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {fixedTerm} Tahun
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Jangka Waktu KPR (Tahun)
        </label>
        <Slider
          value={[loanTerm]}
          onValueChange={(value) => setLoanTerm(value[0])}
          max={30}
          step={1}
          className="mt-1"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {loanTerm} Tahun
        </span>
      </div>

      <Button
        onClick={() =>
          alert(
            `Angsuran per bulan: Rp ${calculateMonthlyPayment().toLocaleString()}`
          )
        }
        className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Simulasikan
      </Button>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Angsuran/bulan Fix
        </h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Rp {calculateMonthlyPayment().toLocaleString()}
        </p>
        <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
          *Mohon diperhatikan bahwa perhitungan ini hanya merupakan estimasi
          kasar dan tidak menjamin akurasi cicilan yang sebenarnya. Kami sangat
          menyarankan anda untuk berkonsultasi dengan penasihat keuangan
          profesional guna mendapatkan informasi yang lebih akurat dan sesuai
          dengan situasi keuangan anda.
        </p>
      </div>
    </div>
  );
};

export default KPRCalculator2;
