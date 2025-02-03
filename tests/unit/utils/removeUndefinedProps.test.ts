import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

describe('RemoveUndefinedProps', () => {
  it('should remove properties with undefined values', () => {
    const input = { a: 1, b: undefined, c: 'teste', d: null }

    const expected = { a: 1, c: 'teste', d: null }

    expect(removeUndefinedProps(input)).toEqual(expected)
  })

  it('should return an empty object when input is empty', () => {
    const input = {}
    const expected = {}

    expect(removeUndefinedProps(input)).toEqual(expected)
  })

  it('should not remove props with false valid values (0, false, empty string, null)', () => {
    const input = { a: 0, b: false, c: '', d: null }
    const expected = { a: 0, b: false, c: '', d: null }

    expect(removeUndefinedProps(input)).toEqual(expected)
  })

  it('should not modify the original object', () => {
    const input = { a: 1, b: undefined, c: 3 }

    const copy = { ...input }

    const output = removeUndefinedProps(input)

    expect(input).toEqual(copy)

    expect(output).not.toBe(input)
  })
})
