let { join } = require('node:path')
let http = require('node:http')
let test = require('tape')
let { defaults } = require('../../lib')
let cwd = process.cwd()
let sut = join(cwd, 'src', 'index.js')
let client = require(sut)

let { config, service, port } = defaults

let retryServer, serverError
let requests = []
let responses = []
let basicError = { statusCode: 500 }
let throttleError = { statusCode: 429 }
let basicResponse = { statusCode: 200 }

function reset () {
  requests = []
  responses = []
  serverError = undefined
}

test('Set up env', async t => {
  t.plan(2)
  t.ok(client, 'aws-lite client is present')
  retryServer = http.createServer((req, res) => {
    req.on('data', () => {})
    req.on('end', () => {
      let auth = req.headers['X-Amz-Date'] || req.headers['x-amz-date']
      requests.push(auth)

      if (serverError) {
        res.destroy(new Error(serverError))
        return
      }

      // Return responses from the queue
      let { statusCode, headers = {}, payload = '' } = responses.pop()
      res.writeHead(statusCode, headers)
      res.end(payload)
    })
  })
  retryServer.listen(port)
  t.ok(retryServer, 'Started server')
})

test('Retries', async t => {
  t.plan(7)
  let aws, retries, result

  /**
   * 500 errors
   */
  // Do not retry
  retries = 0
  aws = await client({ ...config, retries })
  try {
    reset()
    responses.push(basicError)
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.equal(requests.length, 1, 'Client did not retry')
  }

  // maxAttempts alias
  aws = await client({ ...config, maxAttempts: retries })
  try {
    reset()
    responses.push(basicError)
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.equal(requests.length, 1, 'Client did not retry')
  }

  // Try, then retry (total of 2x attempts)
  retries = 1
  aws = await client({ ...config, retries })
  try {
    reset()
    responses.push(basicError, basicError)
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.equal(requests.length, retries + 1, 'Client retried, passed through error')
  }

  // Try, then recover on successful retry
  retries = 10
  aws = await client({ ...config, retries })
  try {
    reset()
    responses.push(basicResponse, basicError)
    result = await aws({ service })
    t.equal(requests.length, 2, 'Client retried, passed through error')
    t.equal(result.statusCode, 200, 'Client returned successful response')
  }
  catch (err) {
    t.fail('Did not expect an error')
  }

  /**
   * 429 throttling errors
   */
  // Try, then retry (total of 2x attempts)
  retries = 1
  aws = await client({ ...config, retries })
  try {
    reset()
    responses.push(throttleError, throttleError)
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.equal(requests.length, retries + 1, 'Client retried, passed through error')
  }

  /**
   * Connection errors
   */
  retries = 2
  aws = await client({ ...config, retries })
  try {
    reset()
    serverError = 'ECONNRESET'
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.equal(requests.length, retries + 1, 'Client retried, passed through error')
  }
})


test('Retries - validation', async t => {
  t.plan(1)
  let aws

  aws = await client({ ...config, retries: 'nah' })
  try {
    await aws({ service })
    t.fail('Expected an error')
  }
  catch (err) {
    t.match(err.message, /must a number/, 'Errored on retries string value')
  }
})

test('Tear down env', t => {
  t.plan(1)
  retryServer.close(err => {
    if (err) t.fail(err)
    else t.pass('Server ended')
  })
})
