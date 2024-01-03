export interface PubSub {
  /**
   * Publish a value for a given topic.
   */
  publish(routingKey: string, ...args: unknown[]): void;
  /**
   * Subscribe to a topic.
   */
  subscribe(routingKey: string, dynamicId?: unknown): AsyncIterable<unknown>;
}
