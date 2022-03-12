import axios from 'axios';
import { Transform, Writable } from 'stream';
const url = 'http://localhost:3000';

async function consume() {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  return response.data;
}

const stream = await consume();

stream
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        const item = JSON.parse(chunk);
        const myNumber = /\d+/.exec(item.name)[0];
        let name = item.name;

        if (myNumber % 2 === 0) name = name.concat(' é par');
        else name = name.concat(' é ímpar');
        item.name = name;

        cb(null, JSON.stringify(item));

        /**
         * If you need to use promises inside of the transform function, it's a bad practice put a async before the transform, but you can resolve this with
         * inside of transform function, you can build a promise and use .then(cb()) or
         * build a closure (async () => {}).then(cb())
         */
      },
    }),
  )
  .pipe(
    new Writable({
      write(chunk, enc, cb) {
        //when we receive a chunk, by default the chunk is a Buffer, because this allow to process a lot of data, to see the chunk content we can use chunk.toString() to see the content
        console.log('chegou!', chunk.toString());
        cb();
      },
    }),
  );
