/**
 * Agnostic router class
 * Adapted from lukeed/trouter library:
 * https://github.com/lukeed/trouter/blob/master/index.mjs
 */
import { parse } from "regexparam";
import type {
  FindResult,
  FunctionLike,
  HttpMethod,
  Nextable,
  RouteMatch,
} from "./types.js";

export type Route<H> = {
  method: HttpMethod | "";
  fns: (H | Router<H extends FunctionLike ? H : never>)[];
  isMiddle: boolean;
} & (
  | {
      keys: string[] | false;
      pattern: RegExp;
    }
  | { matchAll: true }
);

export class Router<H extends FunctionLike> {
  constructor(
    public base: string = "/",
    public routes: Route<Nextable<H>>[] = []
  ) {}
  public add(
    method: HttpMethod | "",
    route: RouteMatch | Nextable<H>,
    ...fns: Nextable<H>[]
  ): this {
    if (typeof route === "function") {
      fns.unshift(route);
      route = "";
    }
    if (route === "")
      this.routes.push({ matchAll: true, method, fns, isMiddle: false });
    else {
      const { keys, pattern } = parse(route);
      this.routes.push({ keys, pattern, method, fns, isMiddle: false });
    }
    return this;
  }

  public use(
    base: RouteMatch | Nextable<H> | Router<H>,
    ...fns: (Nextable<H> | Router<H>)[]
  ) {
    if (typeof base === "function" || base instanceof Router) {
      fns.unshift(base);
      base = "/";
    }
    // mount subrouter
    fns = fns.map((fn) => {
      if (fn instanceof Router) {
        if (typeof base === "string") return fn.clone(base);
        throw new Error("Mounting a router to RegExp base is not supported");
      }
      return fn;
    });
    const { keys, pattern } = parse(base, true);
    this.routes.push({ keys, pattern, method: "", fns, isMiddle: true });
    return this;
  }

  public clone(base?: string) {
    return new Router<H>(base, Array.from(this.routes));
  }

  static async exec<H extends FunctionLike>(
    fns: Nextable<H>[],
    ...args: Parameters<H>
  ): Promise<unknown> {
    let index = -1;
    const dispatch = async (position: number): Promise<unknown> => {
      if (position <= index) {
        throw new Error("next() called multiple times");
      }
      index = position;

      const fn = fns[position];
      if (!fn) {
        throw new Error("next() called with no middleware remaining");
      }
      let nextResult: Promise<unknown> | undefined;
      const next = () => {
        if (nextResult) {
          throw new Error("next() called multiple times");
        }
        nextResult = dispatch(position + 1);
        return nextResult;
      };

      const result = fn(...args, next);
      const isPromiseLike =
        result !== null &&
        result !== undefined &&
        typeof (result as PromiseLike<unknown>).then === "function";

      if (!isPromiseLike) {
        if (result === undefined && nextResult) {
          return nextResult;
        }
        if (nextResult) {
          await nextResult;
        }
        return result;
      }

      const resolved = await result;
      if (nextResult && result !== nextResult && resolved === undefined) {
        return nextResult;
      }
      return resolved;
    };

    if (fns.length === 0) {
      return Promise.resolve();
    }

    return dispatch(0);
  }

  find(method: HttpMethod, pathname: string): FindResult<H> {
    let middleOnly = true;
    const fns: Nextable<H>[] = [];
    const params: Record<string, string> = {};
    const isHead = method === "HEAD";
    for (const route of this.routes) {
      if (
        route.method !== method &&
        // matches any method
        route.method !== "" &&
        // The HEAD method requests that the target resource transfer a representation of its state, as for a GET request...
        !(isHead && route.method === "GET")
      ) {
        continue;
      }
      let matched = false;
      if ("matchAll" in route) {
        matched = true;
      } else {
        if (route.keys === false) {
          // routes.key is RegExp: https://github.com/lukeed/regexparam/blob/master/src/index.js#L2
          const matches = route.pattern.exec(pathname);
          if (matches === null) continue;
          if (matches.groups !== void 0)
            for (const k in matches.groups) params[k] = matches.groups[k] as string;
          matched = true;
        } else if (route.keys && route.keys.length > 0) {
          const matches = route.pattern.exec(pathname);
          if (matches === null) continue;
          for (let j = 0; j < route.keys.length; ) {
            const key = route.keys[j];
            if (key) params[key] = matches[++j] as string;
            else j++;
          }
          matched = true;
        } else if (route.pattern.test(pathname)) {
          matched = true;
        } // else not a match
      }
      if (matched) {
        fns.push(
          ...route.fns
            .map((fn) => {
              if (fn instanceof Router) {
                const base = fn.base as string;
                let stripPathname = pathname.substring(base.length);
                // fix stripped pathname, not sure why this happens
                if (stripPathname[0] != "/")
                  stripPathname = `/${stripPathname}`;
                const result = fn.find(method, stripPathname);
                if (!result.middleOnly) middleOnly = false;
                // merge params
                Object.assign(params, result.params);
                return result.fns;
              }
              return fn;
            })
            .flat()
        );
        if (!route.isMiddle) middleOnly = false;
      }
    }
    return { fns, params, middleOnly };
  }
}
