// First, make sure to install react-minimal-pie-chart using npm or yarn
// npm install react-minimal-pie-chart

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load PieChart component
// Dynamically load the PieChart component
const PieChart = dynamic(
  () => import('react-minimal-pie-chart').then((mod) => mod.PieChart),
  { ssr: false }
);


export default function Home() {
  const [principal, setPrincipal] = useState(50000000); // default value
  const [downPayment, setDownPayment] = useState(5000000); // default value
  const [loanTerm, setLoanTerm] = useState(20); // default value, in years
  const [interestRate, setInterestRate] = useState(8); // default value, percentage
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [error, setError] = useState('');

  const isValidInput = () => {
    const principalAmount = parseFloat(String(principal));
    const interestRateAmount = parseFloat(String(interestRate));
    const loanTermAmount = parseFloat(String(loanTerm));

    if (principalAmount <= 0 || interestRateAmount <= 0 || loanTermAmount <= 0) {
      setError('Please enter positive values for all fields.');
      return false;
    }
    setError('');
    return true;
  };

  const calculateLoan = () => {
    if (!isValidInput()) return;

    const principalAmount = parseFloat(String(principal));
    const downPaymentAmount = parseFloat(String(downPayment));
    const actualPrincipal = principalAmount - downPaymentAmount;
    const monthlyInterestRate = parseFloat(String(interestRate)) / 100 / 12;
    const totalPayments = parseFloat(String(loanTerm)) * 12;

    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, totalPayments) - 1;
    const monthlyRepayment = actualPrincipal * numerator / denominator;

    if (!isNaN(monthlyRepayment)) {
      const totalRepayment = monthlyRepayment * totalPayments;
      const totalInterestPaid = totalRepayment - actualPrincipal;

      setMonthlyPayment(monthlyRepayment.toFixed(2));
      setTotalInterest(totalInterestPaid.toFixed(2));
      setTotalPayment(totalRepayment.toFixed(2));
    } else {
      setError('Invalid calculation. Please check your inputs.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculateLoan();
  };

  const resetValues = () => {
    setPrincipal(0);
    setDownPayment(0);
    setLoanTerm(0);
    setInterestRate(0);
    setMonthlyPayment('');
    setTotalInterest('');
    setTotalPayment('');
    setError('');
  };

  const formatCurrencyUGX = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'UGX',
      // Remove these options if you don't want the currency symbol and code
      currencyDisplay: 'code', // 'code' will display the currency code 'UGX'
      minimumFractionDigits: 0, // Ugandan Shilling typically doesn't use minor units
      maximumFractionDigits: 0, // Adjust these as needed for your application
    });
  };


  return (
    <div className="min-h-screen bg-[#163020] flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-4xl bg-[#B6C4B6] shadow-md rounded-lg p-10">
        <h1 className="text-4xl font-bold text-[#163020] mb-6 text-center">Loan Calculator With NEXTJS!!</h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          <div>
            <label htmlFor="loanAmount" className="block text-lg font-medium text-gray-700">Loan Amount</label>
            <input
              type="range"
              id="loanAmount"
              name="loanAmount"
              min="1000000"
              max="100000000"
              value={principal}
              onChange={(e) => setPrincipal(parseInt(e.target.value, 10) || 0)}

              step="100000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p className="text-right">{formatCurrencyUGX(principal)}</p>

            <div>
              <label htmlFor="downPayment" className="block text-lg font-medium text-gray-700">Down Payment</label>
              <input
                type="range"
                id="downPayment"
                name="downPayment"
                min="0"
                max="100000000"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value, 10) || 0)}
                step="100000"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <p className="text-right">{formatCurrencyUGX(downPayment)}</p>

              <label htmlFor="loanTerm" className="block text-lg font-medium text-gray-700">Tenure (Years)</label>
              <input
                type="range"
                id="loanTerm"
                name="loanTerm"
                min="1"
                max="30"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value, 10) || 0)}
                step="1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <p className="text-right">{loanTerm} years</p>

              <label htmlFor="interestRate" className="block text-lg font-medium text-gray-700">Interest Rate (%)</label>
              <input
                type="range"
                id="interestRate"
                name="interestRate"
                min="1"
                max="25"
                value={interestRate}
                onChange={(e) => setInterestRate(parseInt(e.target.value, 10) || 0)}
                step="0.1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <p className="text-right">{interestRate}%</p>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-[#163020] text-white px-4 py-2 rounded hover:bg-[#304D30] transition-colors"
              >
                Calculate Monthly Payment
              </button>
            </div>
            <div className="mt-4">
              <button
                type="button" // This should be 'button', not 'submit'
                onClick={resetValues}
                className="w-full bg-[#163020] text-[#EEF0E5] px-4 py-2 rounded hover:bg-[#304D30] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {monthlyPayment && (
              <PieChart
                data={[
                  { title: 'Principal', value: principal - downPayment, color: '#163020' },
                  { title: 'Interest', value: Number(totalInterest), color: '#304D30' }
                ]}
                style={{ height: '200px' }}
                label={({ dataEntry }) => dataEntry.title}
                labelStyle={{
                  fontSize: '5px',
                  fontFamily: 'sans-serif',
                }}
                labelPosition={112}
              />
            )}
            <div className="text-[#163020] mt-4">
              {/* //if the values are not available, display nothing */}
              <p className="text-lg">Monthly Payment: {monthlyPayment ? formatCurrencyUGX(Number(monthlyPayment)) : '-'}</p>
              <p className="text-lg">Total Amount Payable: {totalPayment ? formatCurrencyUGX(Number(totalPayment)) : '-'}</p>
              <p className="text-lg">Total Interest: {totalInterest ? formatCurrencyUGX(Number(totalInterest)) : '-'}</p>
            </div>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
