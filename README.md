# Combine Streams [![Build Status](https://travis-ci.org/jonathanong/combine-streams.png)](https://travis-ci.org/jonathanong/combine-streams)

Basically a streams2 version of [combined-stream](https://github.com/felixge/node-combined-stream).
Allows you to combine streams as well as strings and buffers into a single stream.
Why? I don't know.
I just saw this repo and thought, "hey, this sucks because it's not streams2".

## Example

```js
combine()
.append(fs.createReadStream('file1.txt'))
.append(fs.createReadStream('file2.txt'))
.append(null)
.pipe(process.stdout)
```

## API

### Combine([options])

Creates a new `Combine` instance.
`options` are passed to `require('stream').PassThrough`.

```js
var combine = require('combine-streams')
```

### combine.append(obj)

You can append:

- A readable stream
- A buffer
- A string
- A thunk that returns one of the above

To signify that you are done appending items,
you must call `combine.append(null)` just like a readable stream's `.push(null)` implementation.

```js
combine()
.append(fs.createReadStream('file1.txt'))
.append('End of the first file.')
.append(function (done) {
  done(null, fs.createReadStream('file2.txt'))
})
.append('End of the second file.')
.append(null)
.pipe(process.stdout)
```

### combine.pipe(dest, src)

`combine` itself is a stream,
so you should probably use `combine.pipe(dest)`.

## License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
