const Airtable = require('airtable')
const mockdata = require('./mockdata.json')

exports.handler = function(event, context, callback) {
  // Return mock
  if (!process.env.AIRTABLE_API_KEY) {
    // eslint-disable-next-line no-console
    console.log('No key: MOCK RESPONSE')
    const response = {
      statusCode: 200,
      body: JSON.stringify(mockdata),
      headers: {
        'content-type': 'application/json',
        'cache-control': 'Cache-Control: max-age=60, public'
      }
    }
    return callback(null, response)
  }

  Airtable.configure({
    endpointUrl: process.env.AIRTABLE_API_URL,
    apiKey: process.env.AIRTABLE_API_KEY,
    baseKey: process.env.AIRTABLE_API_BASE
  })

  const base = Airtable.base(Airtable.baseKey)
  const allRecords = []
  base('Strings')
    .select({
      maxRecords: 100,
      view: 'all'
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          allRecords.push(record)
        })
        fetchNextPage()
      },
      function done(err) {
        if (err) {
          callback(err)
        } else {
          const body = JSON.stringify({ records: allRecords })
          const response = {
            statusCode: 200,
            body: body,
            headers: {
              'content-type': 'application/json',
              'cache-control': 'Cache-Control: max-age=60, public'
            }
          }
          callback(null, response)
        }
      }
    )
}
