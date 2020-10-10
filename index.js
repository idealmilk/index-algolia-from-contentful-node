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

  algoliaIndex.clearObjects()

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
      publishedDate: review.fields.publishedDate,
      objectID: review.sys.id,
    }))

    const indexedContent = await algoliaIndex.saveObjects(reviews, true)

    console.log("Indexed Content:", indexedContent)
  } catch (err) {
    console.error(err)
  }

  // try {
  //   const { items } = await ctfClient.getEntries({
  //     content_type: "news",
  //     limit: 1000,
  //   })
  //   const news = items.map((n) => ({
  //     slug: n.fields.slug,
  //     title: n.fields.title,
  //     artist: n.fields.artist,
  //     author: n.fields.author,
  //     coverImage: n.fields.albumCover,
  //     publishedDate: n.fields.publishedDate,
  //     objectID: n.sys.id,
  //   }))

  //   const indexedContent = await algoliaIndex.saveObjects(news, true)

  //   console.log("Indexed Content:", indexedContent)
  // } catch (err) {
  //   console.error(err)
  // }

  // try {
  //   const { items } = await ctfClient.getEntries({
  //     content_type: "feature",
  //     limit: 1000,
  //   })
  //   const features = items.map((feature) => ({
  //     slug: feature.fields.slug,
  //     title: feature.fields.title,
  //     subtitle: feature.fields.subtitle,
  //     artist: feature.fields.artist,
  //     author: feature.fields.author,
  //     coverImage: feature.fields.coverImage,
  //     publishedDate: feature.fields.publishedDate,
  //     objectID: feature.sys.id,
  //   }))

  //   const indexedContent = await algoliaIndex.saveObjects(features, true)

  //   console.log("Indexed Content:", indexedContent)
  // } catch (err) {
  //   console.error(err)
  // }

  // try {
  //   const { items } = await ctfClient.getEntries({
  //     content_type: "artist",
  //     limit: 1000,
  //   })
  //   const artists = items.map((artist) => ({
  //     slug: artist.fields.slug,
  //     englishName: artist.fields.englishName,
  //     japaneseName: artist.fields.japaneseName,
  //     objectID: artist.sys.id,
  //   }))

  //   const indexedContent = await algoliaIndex.saveObjects(artists, true)

  //   console.log("Indexed Content:", indexedContent)
  // } catch (err) {
  //   console.error(err)
  // }


})()
