import { text } from "node:stream/consumers";

export class AlertModel {
  readonly title: string;
  readonly text: string;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}
