import { Subject, Observable } from 'rxjs';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Handler } from 'express';

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log(username, password);
    return done(null, false, { message: 'Incorrect username.' });
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));

const authHandler = passport.authenticate('local');

const authFilter = (e: RequestEvent) => {
  return Observable.fromPromise(new Promise((resolve, reject) => {
    authHandler(e.req, e.res, ({ req, res }: RequestEvent) => {

    });
  }));
}

type RequestEvent = {
  req: IncomingMessage,
  res: ServerResponse
};

const route = (name: string, fixedBegin: boolean = true, fixedEnd: boolean = true) => ({ req: { url } }: RequestEvent) => {
  const nameStep1 = fixedBegin ? `^${name}` : name;
  const preparedName = fixedEnd ? `${nameStep1}$` : nameStep1;
  const routeRexex = new RegExp(preparedName, 'i');
  if (url !== undefined) {
    return url.match(routeRexex) !== null;
  }
  else {
    return false;
  }
};

const requests_ = new Subject<RequestEvent>();

const routeSinks = [
  requests_
    .filter(route('/foo'))
    .do(e => {
      e.res.writeHead(200, { 'Content-Type': 'text/plain' });
      e.res.end('FOOBAR\n');
    }),
  requests_
    .do(e => console.log('request to', e.req.url))
];

Observable
  .merge(...routeSinks)
  .subscribe(e => {
    if (!e.res.finished) {
      e.res.writeHead(404, { 'Content-Type': 'text/plain' });
      e.res.end('You found an unhandled route\n');
    }
  });

const hostname = '127.0.0.1';
const port = 1337;
http.createServer((req, res) => {
  requests_.next({ req: req, res: res });
})
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  });