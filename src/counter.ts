export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}


type Status = "active" | "pending" | "inactive";

export interface User {
  name: string;
  status: Status;
  uuid?: string;
  other?: {[key: string]: string};
}

export interface ThisThingIsCallable {
  (arg1: string, arg2: number): void
}

const thing: ThisThingIsCallable = (thing: string, thing2: number) => {
  console.log('hi' + thing + thing2);
}



class UserThing {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const memStatus: Status = "active"

let a: User = {
  name: 'hi',
  status: memStatus
}

let b = new UserThing('hi');
b;
a;

console.log('hello');

/*

// these are "literal" types
type Status = "active" | "pending" | "inactive";

// Use ? in variable names to indicate optionality. Note that some built in functions handle optionality by default.

function expectNonNull(a: string) {}

function testOptional(str?: string) {
  console.log(str) // no error
  expectNonNull(str) // Argument of 'string | undefined' not assignable to parameter of type 'string'
}


// null has the 'object' type, beware.

console.log(typeof null); // 'object'

declare const c: string;
console.log(typeof c); // 'undefined'


type mystring = string;
export interface IndexSignature {
  // These two are known as 'index signatures'. They support indexing using string and number(and symbol, or any union of the above)
  // Note: In javascript/ myInterface[0] is converted into myInterface["0"]. Therefore, the string index signature must be compatible
  // with the number index signature.
  // 
  // Note 2: If the string index signature is defined, all properties must return strings, since properties in javascript can be accessed like so:
  // let obj: IndexSignature = { x: 0 } complains that x is 'not assignable to string'.
  [index: number]: string; // myInterface[0] returns a string array
  [key: string]: mystring; // myInterface["hi"] returns a string array
}

export interface OtherInterface {
  (arg1: string, arg2: number): void; // myInterface() takes string, number and returns void
  new (s: string): OtherInterface
  fun1(): number; // myInterface.fun1() returns number
}


// Narrowing
//

// this check misses the check for str = "", since empty string is falsy
function thing1(str?: string) {
  if (str) {
    str.toUpperCase()
  }
}

// better null handling. in typescript, str == null checks for both null or undefined
function thing2(str?: string) {
   if (str == null) { return }
  str.toUpperCase()
}

// Typescript uses as much as possible to narrow types.

// For example

interface Duck { quack(): void; }
interface Dog { bark(): void; }
function inOperatorNarrowing(a: Duck | Dog) {
  if ("quack" in a) {
  } else {
    a.bark(); // a is inferred to be Dog because dog does not have 'quack'
  }
}

function instanceOfNarrowing(a: Date | string) {
  if (a instanceof Date) {
    // note that instanceof is a javascript construct, and only works with classes,
    // i.e: a instanceof MyInterface throws an error
  }
}

// This function is called a type predicate, it signals to the compiler that if this function returns true
// then the argument is the type asserted in the function return signature.
function IsString(a: unknown): a is string {
  return typeof a === 'string';
}

// Using never to represent state that is impossible to reach
//
//

function stringify(a: string | number) {
  if (typeof a === 'string') {
    return a.toUpperCase();
  } else if (typeof a === 'number') {
    return a.toString();
  } else {
    // return ""; // but this is impossible
    // so this is a little bit more self-documenting
    let _never: never = a;
    return _never;
  }
}

// Generics

function first<T>(arr: T[], n: number) {
  return arr.slice(0, n)
}


// with constraints
function honkAll<T extends { honk(): void }>(arr: T[]) {
  arr.forEach(x => x.honk())
}

// syntax for callable is <T extends (): boolean>
function honkAllCallable<A, T extends { (arg: A): boolean }>(a: A, arr: T[]) {
  arr.forEach(x => x(a))
}
*/



