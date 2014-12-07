var assert = require('assert')
var Stream = require('stream')
var cat = require('cat-stream')

var combine = require('..')

var fixtures = {
  string: 'string',
  buffer: new Buffer('buffer', 'utf8'),
  stream: function () {
    var stream = new Stream.PassThrough()

    stream.write('str')

    setTimeout(function () {
      stream.write('eam')
      stream.end()
    }, 3)

    return stream
  },
  fn: function () {
    return function (done) {
      setTimeout(function () {
        done(null, 'fn')
      }, 1)
    }
  }
}

describe('Combine', function () {
  it('should work when just pushing nothing', function (done) {
    combine()
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.length, 0)
      done()
    }))
  })
  it('should work with just a stream', function (done) {
    combine()
    .append(fixtures.stream())
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'stream')
      done()
    }))
  })

  it('should work with just a string', function (done) {
    combine()
    .append(fixtures.string)
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'string')
      done()
    }))
  })

  it('should work with just a buffer', function (done) {
    combine()
    .append(fixtures.buffer)
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'buffer')
      done()
    }))
  })

  it('should work with just a function', function (done) {
    combine()
    .append(fixtures.fn())
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'fn')
      done()
    }))
  })

  it('should work with two streams', function (done) {
    combine()
    .append(fixtures.stream())
    .append(fixtures.stream())
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'streamstream')
      done()
    }))
  })

  it('should work with a stream after a function', function (done) {
    combine()
    .append(fixtures.fn())
    .append(fixtures.stream())
    .append(null)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'fnstream')
      done()
    }))
  })

  it('should ignore any objects after null', function (done) {
    combine()
    .append(fixtures.stream())
    .append(null)
    .append(fixtures.stream())
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'stream')
      done()
    }))
  })

  it('should work with delays between appends', function (done) {
    var cmb = combine()
    .append(fixtures.string)

    cmb.pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), 'stringstring')
      done()
    }))

    setTimeout(function () {
      cmb
      .append(fixtures.string)
      .append(null)
    }, 5)
  })
})
