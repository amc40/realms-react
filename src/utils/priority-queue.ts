// Priority Queue implementation adapted from
// Ghosh, S., 2021. Implementation of Priority Queue in Javascript - GeeksforGeeks. [online]
// GeeksforGeeks. Available at: <https://www.geeksforgeeks.org/implementation-priority-queue-javascript/>
// [Accessed 6 April 2022].

class QElement<T> {
  public readonly element: T;
  private _priority: number;
  constructor(element: T, priority: number) {
    this.element = element;
    this._priority = priority;
  }

  get priority() {
    return this._priority;
  }

  set priority(newPriority: number) {
    this._priority = newPriority;
  }
}

// PriorityQueue class
class PriorityQueue<T> {
  items: QElement<T>[];
  getPriority: (item: T) => number;

  // An array is used to implement priority
  constructor(getPriority: (item: T) => number) {
    this.items = [];
    this.getPriority = getPriority;
  }

  // enqueue function to add element
  // to the queue as per priority
  enqueue(element: T) {
    // creating object from queue element
    var qElement = new QElement(element, this.getPriority(element));
    var contain = false;

    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
    }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  // dequeue method to remove
  // element from the queue
  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty()) return null;
    return (this.items.shift() as QElement<T>).element;
  }

  getLength() {
    return this.items.length;
  }

  // front function
  front() {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty()) return null;
    return this.items[0] as QElement<T>;
  }

  removeItem(item: T) {
    this.items = this.items.filter((i) => i.element !== item);
  }

  // recalculatePriority(item: T) {
  //   this.removeItem(item);
  //   this.enqueue(item);
  // }

  // printQueue function
  // prints all the element of the queue
  printPQueue() {
    console.log(this.items.map((i) => i.element));
  }
}

// end adapted code
export default PriorityQueue;
