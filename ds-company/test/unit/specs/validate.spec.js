import { isEmail, validatenull } from '@/utils/validate'

test('validate - isEmail', () => {
  expect(isEmail('123')).toBe(false)
  expect(isEmail('123@qq.com')).toBe(true)
  expect(isEmail('123@qq.')).toBe(false)
  expect(isEmail('123qq.com')).toBe(false)
})

test('validate - validatenull', () => {
  expect(validatenull('')).toBe(true)
  expect(validatenull(undefined)).toBe(true)
  expect(validatenull(null)).toBe(true)
  expect(validatenull(0)).toBe(false)
  expect(validatenull(false)).toBe(false)
})

