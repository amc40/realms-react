import PriorityQueue from "./priority-queue";

export type ShortestPathResult<T> = {
  path: T[];
  minCost: number;
};

export class ShortestPath<T> {
  private readonly heuristic: (a: Node<T>, b: Node<T>) => number;

  public constructor(heuristic: (a: Node<T>, b: Node<T>) => number) {
    this.heuristic = heuristic;
  }

  public getResult(
    reachedGoalInterimResult: AStarInterimResult<T>
  ): ShortestPathResult<T> {
    if (reachedGoalInterimResult == null) {
      return {
        path: [],
        minCost: 0,
      };
    }
    const reversedPath = [];
    let currentNodeResult: AStarInterimResult<T> | null =
      reachedGoalInterimResult;
    while (currentNodeResult != null) {
      reversedPath.push(currentNodeResult.node.gamePoint);
      currentNodeResult = currentNodeResult.fromResult;
    }
    return {
      path: reversedPath.reverse(),
      minCost: reachedGoalInterimResult.costSoFar,
    };
  }

  private clearInterimResults(closedSet: Set<Node<T>>) {
    closedSet.forEach((node) => node.clearInterimResult());
  }

  public getShortestPath(
    startNode: Node<T>,
    goalNode: Node<T>,
    tempUnreachablePredicate?: (gameElement: T) => boolean
  ) {
    // if (
    //   tempUnreachablePredicate?.(goalNode.gamePoint) ||
    //   tempUnreachablePredicate?.(startNode.gamePoint)
    // ) {
    //   return null;
    // }
    const openQueue = new PriorityQueue<AStarInterimResult<T>>(
      (interimResult) => interimResult.estimatedTotalCost
    );
    openQueue.enqueue(
      new AStarInterimResult<T>(
        startNode,
        null,
        0,
        this.heuristic(startNode, goalNode)
      )
    );
    const closedSet = new Set<Node<T>>();
    while (!openQueue.isEmpty()) {
      const currentResult = openQueue.dequeue() as AStarInterimResult<T>;
      const currentNode = currentResult.node;
      closedSet.add(currentNode);
      if (currentNode === goalNode) {
        // clearing the interim results ensures they aren't reused on the next calculation
        this.clearInterimResults(closedSet);
        return this.getResult(currentResult);
      }

      currentNode.outEdges.forEach((outEdge) => {
        const outEdgeDest = outEdge.to;
        // ignore if closed
        if (
          !closedSet.has(outEdgeDest)
          // !tempUnreachablePredicate?.(outEdgeDest.gamePoint)
        ) {
          const cost = currentResult.costSoFar + outEdge.weight;
          if (outEdgeDest.bestResultSoFar != null) {
            // already present in open list
            // compare to see if smaller than existing cost
            const destInterimResult = outEdgeDest.bestResultSoFar;
            if (cost < destInterimResult.costSoFar) {
              const newDestInterimResult = new AStarInterimResult(
                outEdgeDest,
                currentResult,
                cost,
                this.heuristic(outEdgeDest, goalNode)
              );
              // remove old
              openQueue.removeItem(destInterimResult);
              // add new
              openQueue.enqueue(newDestInterimResult);
              outEdgeDest.bestResultSoFar = newDestInterimResult;
            }
          } else {
            // no result so far, add an initial one
            const interimResult = new AStarInterimResult(
              outEdgeDest,
              currentResult,
              cost,
              this.heuristic(outEdgeDest, goalNode)
            );
            openQueue.enqueue(interimResult);
          }
        }
      });
    }
    // no path found
    this.clearInterimResults(closedSet);
    return null;
  }
}

export class Node<T> {
  public readonly gamePoint: T;
  public outEdges: WeightedDirectedEdge<T>[] = [];
  public bestResultSoFar: AStarInterimResult<T> | null = null;

  public constructor(gamePoint: T) {
    this.gamePoint = gamePoint;
  }

  public addEdge(edge: WeightedDirectedEdge<T>) {
    this.outEdges.push(edge);
  }

  public clearInterimResult() {
    this.bestResultSoFar = null;
  }

  public removeEdgeTo(to: Node<T>) {
    this.outEdges = this.outEdges.filter((edge) => edge.to !== to);
  }

  public getNeighbours(): Node<T>[] {
    return this.outEdges.map((edge) => edge.to);
  }
}

export class WeightedDirectedEdge<T> {
  public readonly from: Node<T>;
  public readonly to: Node<T>;
  public readonly weight: number;

  public constructor(from: Node<T>, to: Node<T>, weight: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

class AStarInterimResult<T> {
  public readonly node: Node<T>;
  public readonly fromResult: AStarInterimResult<T> | null;
  public readonly costSoFar: number;
  public readonly estimatedTotalCost: number;

  public constructor(
    node: Node<T>,
    fromResult: AStarInterimResult<T> | null,
    costSoFar: number,
    estimatedRemainingCost: number
  ) {
    this.node = node;
    this.fromResult = fromResult;
    this.costSoFar = costSoFar;
    this.estimatedTotalCost = costSoFar + estimatedRemainingCost;
  }
}

export default ShortestPath;
