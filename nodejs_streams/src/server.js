import http from 'http';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

//the function that uses * <name> means that the application doesn't need to wait all function processing, so since function can return any data, it will be return, same the process doesn't be finished. So a generate function can be considered a stream
function* run() {
  for (let index = 0; index <= 99; index++) {
    const data = {
      id: randomUUID(),
      name: `Csevero-${index}`,
    };

    //with a generate function we can use yield to pass the data to readable stream, without need to wait all process, the yield just work if the function as *
    yield data;
  }
}

async function handler(request, response) {
  /* 
  req - the request often receive the client data, can be a JSON payload, a file, or anything else, so request is considered a readableStream
  response - the response often give a feedback to user with a response, so response is considered a writeableStream
  */

  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log(`sending ` + JSON.stringify(data));
        this.push(JSON.stringify(data) + '\n');
      }
      // to inform that data is over we use push(null), so our Readable is start null
      this.push(null);
    },
  });

  // pipe is used to manage data, we can use a pipe to transform data, other to create a csv, etc. When a data arrives to our readable stream, it will pass for ours pipes, so we don't store ALL data in memory, but we process the data slowly
  readable.pipe(response);
}

http
  .createServer(handler)
  .listen(3000)
  .on('listening', () => {
    console.log('server running at 3000');
  });
