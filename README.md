<h1 align="center">@appnest/web-router</h1>

<p align="center">
		<a href="https://npmcharts.com/compare/@appnest/web-router?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@appnest/web-router.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@appnest/web-router"><img alt="NPM Version" src="https://img.shields.io/npm/v/@appnest/web-router.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/web-router"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/web-router.svg" height="20"/></a>
<a href="https://github.com/andreasbm/web-router/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/web-router.svg" height="20"/></a>
<a href="https://www.webcomponents.org/element/@appnest/web-router"><img alt="Published on webcomponents.org" src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" height="20"/></a>
	</p>


<p align="center">
  <b>A powerful web component router</b></br>
  <sub>A router interprets the browser URL and navigates to a specific views based on the configuration. This router is optimized for routing between web components. Go here to see a demo <a href="https://appnest-demo.firebaseapp.com/web-router">https://appnest-demo.firebaseapp.com/web-router</a>.<sub>
</p>

<br />


* 😴 Lazy loading of routes
* 🎁 Web component friendly
* 📡 Easy to use API
* 🛣 Specify params in the path
* 👌 Zero dependencies
* 📚 Uses the [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
* 🎉 Support routes for dialogs


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)

## ➤ Table of Contents

* [➤ Installation](#-installation)
* [➤ The Basics](#-the-basics)
	* [`<base href>`](#base-href)
	* [Router import](#router-import)
	* [`web-router`](#web-router)
	* [Configuration](#configuration)
	* [Navigation](#navigation)
		* [History API](#history-api)
		* [`router-link`](#router-link)
* [➤ Advanced](#-advanced)
	* [Guards](#guards)
	* [Dialog routes](#dialog-routes)
	* [Params](#params)
	* [Deep dive into the different route kinds](#deep-dive-into-the-different-route-kinds)
		* [Component routes](#component-routes)
		* [Redirection routes](#redirection-routes)
		* [Resolver routes](#resolver-routes)
	* [Helper functions](#helper-functions)
	* [Global navigation events](#global-navigation-events)
		* [Scroll to the top](#scroll-to-the-top)
* [➤ Be careful when navigating to the root!](#-be-careful-when-navigating-to-the-root)
* [➤ Contributors](#-contributors)
* [➤ License](#-license)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#installation)

## ➤ Installation

```node
npm i @appnest/web-router
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#the-basics)

## ➤ The Basics

This section will introduce the basics of the router.

### `<base href>`

Your application should add a `<base>` element to the `index.html` in the `<head>` tag. If your file is located in the root, the `href` value should be the following:

```html
<base href="/">
```

### Router import

To import the `router` you'll need to import the dependency in your application.

```javascript
import "@appnest/web-router";
```

### `web-router`

The `web-router` component acts as a placeholder that marks the spot in the template where the router should display the components for that route part.

```html
<router-slot>
	<!-- Routed components will go here -->
</router-slot>
```

### Configuration

Routes are added to the router through the `add` function on a `web-router` component. Specify the parts of the path you want it to math with or use the `**` wildcard to catch all paths. The router has no routes until you configure it. The example below creates three routes. The first route path matches urls starting with `login` and will lazy load the login component. The second route matches all urls starting with `home` and will stamp the `HomeComponent` in the `web-router`. The third route matches all paths that the two routes before didn't catch and redirects to home. This can also be useful for displaying "404 - Not Found" pages.

```typescript
const routerSlot = <IWebRouter>document.querySelector("router-slot");
await routerSlot.add([
  {
    path: "login",
    component: () => import("./pages/login") // Lazy loaded
  },
  {
    path: "home",
    component: HomeComponent // Not lazy loaded
  },
  {
    path: "**",
    redirectTo: "home"
  }
]);
```

You may want to wrap the above in a `whenDefined` callback to ensure the `web-router` exists before using its logic.

```javascript
customElements.whenDefined("router-slot").then(async () => {
  ...
});
```

### Navigation

In order to change a route you can either use the [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History) API directly or the `router-link` component.

#### History API

Here's an example on how to navigate.

```javascript
history.pushState(null, "", "/login");
```

Or (if you want to replace the state and not keep the current one in the history)

```javascript
history.replaceState(null, "", "/login");
```

You can also go back and forth between the states!

```javascript
history.back();
history.forward();
```

#### `router-link`

With the `router-link` component you add `<router-link>` to your markup and specify a path. Whenever the component is clicked it will navigate to the specified path. Whenever the path of the router link is active the active attribute is set.

```html
<router-link path="/home/secret">
  <button>Go to the secret page!</button>
</router-link>
```

Paths can be specified either in relative or absolute terms. To specify an absolute path you simply pass `/home/secret`. To specify a relative path you first have to be aware of the router context  you are navigating within. The `router-link` component will for navigate based on the nearest `web-router` component. If you give the component a path (without the slash) as path, the navigation will be done in relation to the parent router. You can also specify `../login` to traverse up the router tree.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#advanced)

## ➤ Advanced

You can customize a lot in this library. Continue reading to learn how to handle your new superpowers.

### Guards

A guard is a function that determines whether the route can be activated or not. The example below checks whether the user has a session saved in the local storage and redirects the user to the login page if the access is not provided. If a guard returns false the routing is cancelled.

```typescript
funtion sessionGuard () {

  if (localStorage.getItem("session") == null) {
    history.replaceState(null, "", "/login");
    return false;
  }

  return true;
}
```

Add this guard to the add function in the `guards` array.

```typescript
...
await routerSlot.add([
  ...
  {
    path: "home",
    component: HomeComponent,
    guards: [sessionGuard]
  },
  ...
]);
```

### Dialog routes

Sometimes you wish to change the url without triggering the route change. This could for example be when you want an url for your dialog. To change the route without triggering the route change you can use the functions prefixed with `_` on the history object. Below is an example on how to show a dialog without triggering the route change.

```javascript
history._pushState(null, "", "dialog");
alert("This is a dialog");
history._back();
```

This allows dialogs to have a route which is especially awesome on mobile.

### Params

If you want params in your URL you can do it by using the `:name` syntax. Below is an example on how to specify a path that matches params as well. This route would match urls such as `user/123`, `user/@andreas`, `user/abc` and so on.

```typescript
...
await routerSlot.add([
  {
    path: "user/:userId",
    component: UserComponent
  }
]);
```

To grab the params in the `UserComponent` you can use the `routeMatch` from the parent router as shown in the example below.

```typescript
export default class UserComponent extends LitElement {

  get params (): Params {
    return queryParentRouterSlot(this)!.match!.params;
  }

  render (): TemplateResult {
    const {userId} = this.params;
    return html`
      <p>:userId = <b>${userId}</b></p>
    `;
  }
}

window.customElements.define("user-component", UserComponent);
```

Alternatively the params can be passed through the setup function.

```javascript
await routerSlot.add([
  {
    path: "user/:userId",
    component: UserComponent,
    setup: (component: UserComponent, info: RoutingInfo) => {
      component.userId = info.match.params.userId;
    }
  }
]);
```

### Deep dive into the different route kinds

There exists three different kinds of routes. We are going to take a look at those different kinds in a bit, but first you should be familiar with what all routes have in common.

```typescript
export interface IRouteBase<T = any> {

  // The path for the route fragment
  path: PathFragment;

  // Optional metadata
  data?: T;

  // If guard returns false, the navigation is not allowed
  guards?: Guard[];

  // Whether the match is fuzzy (eg. "name" would not only match "name" or "name/" but also "nameasdpokasf")
  fuzzy?: boolean;
}
```

#### Component routes

Component routes resolves a specified component. You can provide the `component` property with either a class that instantiates a `web component` or a function that imports the component lazily.

```typescript
export interface IComponentRoute extends IRouteBase {

  // The component loader (should return a module with a default export)
  component: Class | ModuleResolver | (() => ModuleResolver);

  // A custom setup function for the instance of the component.
  setup?: Setup;
}
```

#### Redirection routes

A redirection route is good to use to catch all of the paths that the routes before did not catch. This could for example be used to handle "404 - Page not found" cases.

```typescript
export interface IRedirectRoute extends IRouteBase {

  // The paths the route should redirect to. Can either be relative or absolute.
  redirectTo: string;

  // Whether the query should be preserved when redirecting.
  preserveQuery?: boolean;
}
```

#### Resolver routes

Use the resolver routes when you want to customize what should happen when the path matches the route. This is good to use if you for example want to show a dialog instead of navigating to a new component.

```typescript
export interface IResolverRoute extends IRouteBase {

  // A custom resolver that handles the route change
  resolve: CustomResolver;
}
```

### Helper functions

The library comes with a set of helper functions. This includes:

* `path()` - The current path of the location.
* `query()` - The current query as an object.
* `queryString()` - The current query string
* `stripSlash(options)` - Strips the slash from the start and end of a path.
* `ensureSlash(options)` - Ensures the path starts and ends with a slash.
* `toQueryString(query)` - Turns a query object into a string query.
* `toQuery(queryString)` - Splits a query string and returns the query.

### Global navigation events

You are able to listen to the navigation related events that are dispatched each time something important happens. They are dispatched on the `window` object.

```typescript
export enum GlobalRouterEventKind {

  // An event triggered when a new state is added to the history.
  PushState = "pushstate",

  // An event triggered when the current state is replaced in the history.
  ReplaceState = "replacestate",

  // An event triggered when a state in the history is popped from the history.
  PopState = "popstate",

  // An event triggered when the state changes (eg. pop, push and replace)
  ChangeState = "changestate",

  // An event triggered when navigation starts.
  NavigationStart = "navigationstart",

  // An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.
  NavigationCancel = "navigationcancel",

  // An event triggered when navigation fails due to an unexpected error.
  NavigationError = "navigationerror",

  // An event triggered when navigation successfully completes.
  NavigationSuccess = "navigationsuccess",

  // An event triggered when navigation ends.
  NavigationEnd = "navigationend"
}
```

Here's an example of how you can listen to the events.

```typescript
window.addEventListener(GlobalRouterEventKind.PushState, (e: PushStateEvent) => {
  console.log("On push state", currentPath());
});

window.addEventListener(GlobalRouterEventKind.ReplaceState, (e: ReplaceStateEvent) => {
  console.log("On replace state", currentPath());
});

window.addEventListener(GlobalRouterEventKind.PopState, (e: PopStateEvent) => {
  console.log("On pop state", currentPath());
});

window.addEventListener(GlobalRouterEventKind.ChangeState, (e: ChangeStateEvent) => {
  console.log("On change state", currentPath());
});

window.addEventListener(GlobalRouterEventKind.NavigationStart, (e: NavigationStartEvent) => {
  console.log("Navigation start", e.detail);
});

window.addEventListener(GlobalRouterEventKind.NavigationEnd, (e: NavigationEndEvent) => {
  console.log("Navigation end", e.detail);
});

window.addEventListener(GlobalRouterEventKind.NavigationCancel, (e: NavigationCancelEvent) => {
  console.log("Navigation cancelled", e.detail);
});

window.addEventListener(GlobalRouterEventKind.NavigationError, (e: NavigationErrorEvent) => {
  console.log("Navigation failed", e.detail);
});

window.addEventListener(GlobalRouterEventKind.NavigationSuccess, (e: NavigationSuccessEvent) => {
  console.log("Navigation failed", e.detail);
});
```

#### Scroll to the top

If you want to scroll to the top on each page change to could consider doing the following.

```typescript
window.addEventListener(GlobalRouterEventKind.NavigationEnd, () => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
});
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#be-careful-when-navigating-to-the-root)

## ➤ Be careful when navigating to the root!

From my testing I found that Chrome and Safari treat an empty string as url when navigating differently. As an example `history.pushState(null, null, "")` will navigate to the root of the website in Chrome but in Safari the path won't change. The workaround I found was to simply pass "/" when navigating to the root of the website instead.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributors)

## ➤ Contributors
	
|[<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="You?" src="https://joeschmoe.io/api/v1/random" width="100">](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md)|
|:---: | :---:|
|[Andreas Mehlsen](https://twitter.com/andreasmehlsen) | [You?](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md)|

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).
