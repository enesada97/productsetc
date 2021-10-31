import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Product } from '../models/products.model';
import { Comment } from '../models/comment.model';
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // array in local storage for registered users

    // wrap in delayed observable to simulate server api call
    return (
      of(null)
        .pipe(
          mergeMap(() => {
            return this.modelFinder(request, next);
          })
        )

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
    );
  }
  modelFinder(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/users')) {
      let users: User[] = JSON.parse(localStorage.getItem('users')!) || [];
      if (users.length == 0) {
        users.push(
          new User({
            id: 1,
            username: 'user',
            password: 'user123',
            firstName: 'user',
            lastName: 'user',
          })
        );
        localStorage.setItem('users', JSON.stringify(users));
        users = JSON.parse(localStorage.getItem('users')!) || [];
      }
      console.log(users);

      // authenticate
      if (
        request.url.endsWith('/users/authenticate') &&
        request.method === 'POST'
      ) {
        console.log(localStorage.getItem('users'));

        // find if any user matches login credentials
        let filteredUsers = users.filter((user) => {
          return (
            user.username === request.body.username &&
            user.password === request.body.password
          );
        });

        if (filteredUsers.length) {
          // if login details are valid return 200 OK with user details and fake jwt token
          let user = filteredUsers[0];
          let body = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token',
          };

          return of(new HttpResponse({ status: 200, body: body }));
        } else {
          // else return 400 bad request
          return throwError({
            error: { message: 'Username or password is incorrect' },
          });
        }
      }

      // get users
      if (request.url.endsWith('/users') && request.method === 'GET') {
        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: users }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }

      // get user by id
      if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedUsers = users.filter((user) => {
            return user.id === id;
          });
          let user = matchedUsers.length ? matchedUsers[0] : null;

          return of(new HttpResponse({ status: 200, body: user }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }

      // register user
      if (
        request.url.endsWith('/users/register') &&
        request.method === 'POST'
      ) {
        // get new user object from post body
        let newUser = request.body;

        // validation
        let duplicateUser = users.filter((user) => {
          return user.username === newUser.username;
        }).length;
        if (duplicateUser) {
          return throwError({
            error: {
              message: 'Username "' + newUser.username + '" is already taken',
            },
          });
        }

        // save new user
        newUser.id = users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));
      }
      // delete user
      if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.id === id) {
              // delete user
              users.splice(i, 1);
              localStorage.setItem('users', JSON.stringify(users));
              break;
            }
          }

          // respond 200 OK
          return of(new HttpResponse({ status: 200 }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
    } else if (request.url.includes('/products')) {
      let products: Product[] =
        JSON.parse(localStorage.getItem('products')!) || [];
      if (products.length == 0) {
        const fakeProducts: Product[] = [
          {
            id: 1,
            name: 'Laptop',
            price: 3000,
            score: 5,
            image:
              'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_80374015/mobile_786_587_png/ASUS-X515JF-EJ039T--i5-1035G1U--4GB-RAM--256GB-SSD--MX130-2GB--15.6%22-Full-HD-Laptop-Gri',
          },
          {
            id: 2,
            name: 'Mouse',
            price: 30,
            score: 3,
            image:
              'data:image/jpeg;base64,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',
          },
          {
            id: 3,
            name: 'Microphone',
            price: 600,
            score: 4,
            image:
              'data:image/jpeg;base64,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',
          },
          {
            id: 4,
            name: 'Phone',
            price: 2000,
            score: 2,
            image:
              'data:image/jpeg;base64,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',
          },
        ];
        console.log(fakeProducts);
        products = products.concat(fakeProducts);
        localStorage.setItem('products', JSON.stringify(products));
        products = JSON.parse(localStorage.getItem('products')!) || [];
      }
      if (request.url.endsWith('/products') && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: products }));
        } else {
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
      if (request.url.match(/\/products\/\d+$/) && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedProducts = products.filter((product) => {
            return product.id === id;
          });
          let product = matchedProducts.length ? matchedProducts[0] : null;

          return of(new HttpResponse({ status: 200, body: product }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
      // add campaing
      if (request.url.endsWith('/products') && request.method === 'POST') {
        // get new user object from post body
        let newProduct = request.body;

        // validation
        let duplicateProduct = products.filter((product) => {
          return product.name === newProduct.name;
        }).length;
        if (duplicateProduct) {
          return throwError({
            error: {
              message:
                'Username "' + newProduct.username + '" is already created',
            },
          });
        }

        // save new campaing
        newProduct.id = products.length + 1;
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));

        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));
      }
      // update campaing
      if (request.url.match(/\/users\/\d+$/) && request.method === 'PUT') {
        // get new user object from post body
        let updateCampaing = request.body;
        // find user by id in users array
        let urlParts = request.url.split('/');
        let id = parseInt(urlParts[urlParts.length - 1]);
        let matchedproduct = products.findIndex((product) => {
          return product.id === id;
        });
        // validation
        let duplicateCampaing = products.filter((product) => {
          return product.name === updateCampaing.name;
        }).length;
        if (duplicateCampaing) {
          return throwError({
            error: {
              message:
                'Campaing "' + updateCampaing.name + '" is already taken',
            },
          });
        }
        // update campaing
        Object.assign(matchedproduct, updateCampaing);
        localStorage.setItem('products', JSON.stringify(products));
        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));
      }
      if (
        request.url.match(/\/products\/\d+$/) &&
        request.method === 'DELETE'
      ) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < products.length; i++) {
            let product = products[i];
            if (product.id === id) {
              // delete user
              products.splice(i, 1);
              localStorage.setItem('products', JSON.stringify(products));
              break;
            }
          }

          // respond 200 OK
          return of(new HttpResponse({ status: 200 }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
    } else if (request.url.includes('/comments')) {
      let comments: Comment[] =
        JSON.parse(localStorage.getItem('comments')!) || [];
      if (comments.length == 0) {
        const fakeComments: Comment[] = [
          {
            id: 1,
            date:new Date(),
            description:"Nice product",
            rate:5,
            userId:1,
            productId:1,
            username:'user'
          },
          {
            id: 2,
            date:new Date(),
            description:"Nice product",
            rate:5,
            userId:1,
            productId:2,
            username:'user'
          },
          {
            id: 3,
            date:new Date(),
            description:"Nice product",
            rate:5,
            userId:1,
            productId:3,
            username:'user'
          },
          {
            id: 4,
            date:new Date(),
            description:"Nice product",
            rate:5,
            userId:1,
            productId:4,
            username:'user'
          },
        ];
        console.log(fakeComments);
        comments = comments.concat(fakeComments);
        localStorage.setItem('comments', JSON.stringify(comments));
        comments = JSON.parse(localStorage.getItem('comments')!) || [];
      }
      if (request.url.endsWith('/comments') && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: comments }));
        } else {
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
      if (request.url.match(/\/comments\/\d+$/) && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedComments = comments.filter((comment) => {
            return comment.productId === id;
          });

          return of(new HttpResponse({ status: 200, body: matchedComments }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }
      // add campaing
      if (request.url.endsWith('/comments/add') && request.method === 'POST') {
        console.log(request.body);

        // get new user object from post body
        let newComment = request.body;

        // save new campaing
        newComment.id = comments.length + 1;
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));

        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));
      }
    }
    return next.handle(request);
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
