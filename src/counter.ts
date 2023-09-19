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
