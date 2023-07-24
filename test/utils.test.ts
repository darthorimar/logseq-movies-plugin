import assert from 'assert'
import {parseMyAnimeListYear, tokenize} from '../src/utils'

describe('parseMyAnimeListYear test', () => {
    it('Should return a single year on "from"', () => {
        const result = parseMyAnimeListYear({from: '2007-02-15T00:00:00+00:00'})
        assert.equal(result, '2007')
    })

    it('Should return a year range when "from" with a different "to"', () => {
        const result = parseMyAnimeListYear({from: '2007-02-15T00:00:00+00:00', to: '2008-02-15T00:00:00+00:00'})
        assert.equal(result, '2007 — 2008')
    })

    it('Should return a single year when "from" with the same "to"', () => {
        const result = parseMyAnimeListYear({from: '2007-02-15T00:00:00+00:00', to: '2007-02-15T00:00:00+00:00'})
        assert.equal(result, '2007')
    })

    it('Should return null on invalid "from"', () => {
        const result = parseMyAnimeListYear({from: 'non a date'})
        assert.equal(result, null)
    })

    it('Should return null on "null" as input', () => {
        const result = parseMyAnimeListYear(null)
        assert.equal(result, null)
    })
})

describe('tokenize test', () => {
    it('Should tokenize a non-empty string', () => {
        const result = tokenize(' the, list of tokens      to , , ,  tokenize   ')
        assert.equal(result, 'the list of tokens to tokenize')
    })

    it('Should tokenize an empty string', () => {
        const result = tokenize('')
        assert.equal(result, '')
    })

    it('Should tokenize a blank string with spaces', () => {
        const result = tokenize('   ')
        assert.equal(result, '')
    })


    it('Should not fail on a string with non-latin characters', () => {
        const result = tokenize('строка, запроса')
        assert.equal(result, 'строка запроса')
    })
})