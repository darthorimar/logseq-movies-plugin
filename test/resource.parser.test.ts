import {ResourceParser} from '../src/ResourceParser'
import {
    imdbParserDefinition,
    myAnimeListParserDefinition,
    ResourceParserDefinition
} from '../src/ResourceParserDefinition'
import {expect} from 'chai'

describe('imdb parser test', function() {
    this.timeout(10_000) // to avoid the `Timeout of 2000ms exceeded` error on network calls

    it('Should search for the movie by name', async () => {
         await withParser(imdbParserDefinition, async parser => {
             let result = await parser.parse('lord of the rings')
             expect(result?.map(i => i.title)).to.contain.members(
                 [
                     'The Lord of the Rings: The Fellowship of the Ring',
                     'The Lord of the Rings: The Two Towers',
                 ]
             )
         })
    })
})

describe('myAnimeList parser test', function() {
    this.timeout(10_000) // to avoid the `Timeout of 2000ms exceeded` error on network calls

    it('Should search for the anime by name', async () => {
        await withParser(myAnimeListParserDefinition, async parser => {
            let result = await parser.parse('naruto')
            expect(result?.map(i => i.title)).to.contain.members(
                [
                    'Naruto: Shippuuden',
                    'Naruto',
                ]
            )
        })
    })
})

async function withParser(
    parserDescription: ResourceParserDefinition,
    action: (parser: ResourceParser) => Promise<void>
) {
    let parser = new ResourceParser(parserDescription)
    try {
        await action(parser)

    } finally {
        parser.discard()
    }
}