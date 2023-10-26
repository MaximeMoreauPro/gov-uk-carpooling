export interface DateProvider {
  /** Return the current datetime in ISO format */
  getNow: () => string;
}
