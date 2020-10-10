// https://www.youtube.com/watch?v=6TgRAKxtam0&ab_channel=MarceloLewin
// https://github.com/matthew1809

require("dotenv").config()
;(async () => {
  const algoliasearch = require("algoliasearch")
  const { createClient } = require("contentful")
  const removeMd = require("remove-markdown")

  const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX } = process.env

  const space = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
  const algoliaIndex = algoliaClient.initIndex(ALGOLIA_INDEX)

  const ctfClient = createClient({
    space,
    accessToken,
  })

  try {
    const { items } = await ctfClient.getEntries({
      content_type: "review",
      limit: 1000,
    })
    const reviews = items.map((review) => ({
      slug: review.fields.slug,
      albumTitle: review.fields.albumTitle,
      artist: review.fields.artist,
      author: review.fields.author,
      albumCover: review.fields.albumCover,
      objectID: review.sys.id,
    }))

    const indexedContent = await algoliaIndex.saveObjects(reviews, true)

    console.log("Indexed Content:", indexedContent)
  } catch (err) {
    console.error(err)
  }
})()
