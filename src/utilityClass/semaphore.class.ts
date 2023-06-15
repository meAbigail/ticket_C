// Created a semaphore with the given count..
export class Semaphore {
    private count: number;
    private waiting: Array<() => void>;
  
    constructor(count: number) {
      this.count = count;
      this.waiting = [];
    }
    
    public async acquire(): Promise<void> {
      if (this.count > 0) {
        this.count--;
      } else {
        await new Promise<void>((resolve) => {
          this.waiting.push(resolve);
        });
      }
    }
  
    release(): void {
      this.count++;
  
      if (this.waiting.length > 0) {
        const resolve = this.waiting.shift();
        resolve && resolve();
      }
    }
  }
  