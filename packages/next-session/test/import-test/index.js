import assert from "assert";
import session from "@opensourceframework/next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";

assert(session);
assert(expressSession);
assert(promisifyStore);

session();
