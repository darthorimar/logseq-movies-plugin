/**
 * Executes given actions with limiting amount of executions per second. Executes only last added action.
 * All previews action which were not executed before the new action requested are discarded.
 */
export class RateLimiter {
    private action: Action | null = null
    private timer: ReturnType<typeof setInterval> | null = null

    /**
     * @param queriesPerSec maximum number of queries per second which can be executed
     */
    constructor(private readonly queriesPerSec: number) {
        this.refreshTimer()
    }

    /**
     * Queues given action for execution. all previously queued actions are discard and resolved to `null` value
     * @param action action to execute
     * @return return the `Promise` which will be resolved with non-null value if the action is executed or `with null` value if the action is discarded
     */
    public async runWithRateLimiting<T>(action: () => Promise<NonNullable<T>>): Promise<T | null> {
        return new Promise(resolve => {
            this.action?.discard()

            this.action = {
                execute: async () => resolve(await action()),
                discard: () => resolve(null)
            }
        })
    }

    /**
     * Discards current action if currently enqueued
     */
    public discard() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.action?.discard()
        this.action = null
    }

    private refreshTimer() {
        this.timer = setInterval(() => this.executeAction(), 1000 / this.queriesPerSec)
    }

    private executeAction() {
        if (this.action) {
            this.action.execute()
            this.action = null
        }
    }
}

interface Action {
    execute: () => Promise<void>
    discard: () => void
}