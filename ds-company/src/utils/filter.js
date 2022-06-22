export const cardNumber = value => {
  const str = value.toString()
  const prefix = str.substring(0,4)
  const suffix = str.substring(str.length - 4, str.length)
  return `${prefix}****  ****${suffix}`
}

export const moneyFormat = value => {
  return `¥ ${Number(value).toFixed(2)}`
}

export const phoneFormat = value => {
  if (/^1[0-9]{10}$/.test(value)) {
    const str = value.toString()
    const prefix = str.substring(0,3)
    const suffix = str.substring(str.length - 4, str.length)
    return `${prefix} **** ${suffix}`
  } else {
    return value
  }
}
