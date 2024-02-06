import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = "https://v6.toExchangeRate-api.com/v6/0abd8d8dbfa7f5119ced357b/latest/USD"
const ACCESS_KEY = "0abd8d8dbfa7f5119ced357b"

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [toExchangeRate, settoExchangeRate] = useState()
  const [fromExchangeRate, setfromExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [baseCurrency, setBaseCurrency] = useState()


  let toAmount, fromAmount, crossRate
  if (amountInFromCurrency) {
    fromAmount = amount
    if (fromCurrency !== baseCurrency) {
      crossRate = toExchangeRate / fromExchangeRate
      toAmount = crossRate * amount
    }
    else {
      toAmount = amount * toExchangeRate
    }
  }
  else {
    toAmount = amount
    if (toCurrency !== baseCurrency) {
      crossRate = fromExchangeRate / toExchangeRate
      fromAmount = crossRate * amount
    }
    else {
      fromAmount = amount / fromExchangeRate
    }
  }

  
  useEffect(() => {
    fetch(BASE_URL, {
      headers: {
        "x-rapidapi-key": ACCESS_KEY
      }
    })
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.conversion_rates)[0]
        setCurrencyOptions([...Object.keys(data.conversion_rates)])
        setFromCurrency(data.base_code)
        setToCurrency(firstCurrency)
        settoExchangeRate(data.conversion_rates[firstCurrency])
        setBaseCurrency(data.base_code)
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          settoExchangeRate(data.conversion_rates[toCurrency])
          setfromExchangeRate(data.conversion_rates[fromCurrency])
        })
    }
  }, [fromCurrency, toCurrency])

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
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
