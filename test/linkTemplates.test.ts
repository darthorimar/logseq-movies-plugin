import assert from 'assert'
import {applyLinkTemplate} from '../src/linkTemplates'
import {movies} from './testData'

describe('applyTemplate test', () => {
    it('Should replace a ${title} and ${year} to an actual value', () => {
        const actual = applyLinkTemplate(
            'Movie ${title}, year: ${year}, and again: ${title}, ${year}',
            movies.pulpFiction
        )
        assert.equal(actual, 'Movie Pulp Fiction, year: 1994, and again: Pulp Fiction, 1994')
    })
})
