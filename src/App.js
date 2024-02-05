import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = "https://v6.exchangerate-api.com/v6/aa6834ee44d55a8e55e68433/latest/USD"
const ACCESS_KEY = "aa6834ee44d55a8e55e68433"

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if(amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL, {
      headers: {
        "x-rapidapi-key": ACCESS_KEY
      }
    })
    .then(res => res.json())
    .then(data => {
      const baseCurrency = data.base_code; // Veriden base_code anahtarını alıyoruz
      setCurrencyOptions([baseCurrency, ...Object.keys(data.conversion_rates)]);
      setFromCurrency(baseCurrency); // İlk para birimini ayarlıyoruz
      setToCurrency(Object.keys(data.conversion_rates)[0]); // İkinci para birimini ayarlıyoruz
      setExchangeRate(data.conversion_rates[Object.keys(data.conversion_rates)[0]]); // Dönüşüm oranını ayarlıyoruz
    })
  },[])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.conversion_rates[toCurrency]))
    }
  })

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Para Birimi Dönüştürücü</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency = {fromCurrency}
        onChangeCurrency = {e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount = {fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency = {toCurrency}
        onChangeCurrency = {e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount = {toAmount}
      />
    </>
  );
}

export default App;
