import React from 'react'

const CurrencyRow = (props) => {
    const {
        currencyOptions,
        selectedCurrency,
        onChangeCurrency,
        onChangeAmount,
        amount
    } = props
  return (
    <div>
        <input className="input" type='number' value={amount ? parseFloat(amount) : ''} onChange={onChangeAmount}></input>
        <select value={selectedCurrency} onChange={onChangeCurrency}>
            {currencyOptions.map((option,index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
  )
}

export default CurrencyRow