import  CrawledDataProcessor from "../DataProcessor";
import { EventEmitter } from "stream";


interface ListenerData
{
	listenerId: number // unique id that corresponds to this particular listener
	eventName: string // name of the event
	expectedCallCount: () => number // expected number of calls
	numberOfCalls: number // how many times event has been raised so far
	isFinished: boolean
}

/**
 * Allows the user to track which events have already been raised a specified number of times.
 * This amount can be specified using arrow function returning number, and the value can 
 * be variable until allChunksProcessed event on dataProcessor is raised. (TODO: this could be also abstracted out)
 * This tracking is very important so the worker thread can e.g. terminate itself only if all the processing is done.
 * Once all the events are done, it raises event called allExecutionsDone, signalling that all executions of all events 
 * were succesfully processed.(And so thread can be e.g. terminated) 
 * 
 * This class only covers synchronous events(+ that are raised after the allChunksProcessed event was raised), 
 * so protection against other possible still running jobs has to be eventually
 * handled separatelly by the user...
 * 
 * Dev note: TODO: ctr approach works... but maybe smth like poison pill in event message wrapper like
 * would be better since we dont always know the call count in advance...
 * 
 */
export default class EventSynchronizer
{
	lastListenerId: number
	dataProcessor: CrawledDataProcessor
	processingDone: boolean
	allListeners: ListenerData[]
	finishedExecutions: number
	eventEmitter: EventEmitter

	constructor(dataProcessor: CrawledDataProcessor)  {		
		this.dataProcessor = dataProcessor;
		this.processingDone = false;
		this.dataProcessor.eventEmitter.on("allChunksProcessed", this.AllChunksProcessed);
		this.allListeners = [];
		this.lastListenerId = 0;
		this.finishedExecutions = 0;
		this.eventEmitter = new EventEmitter();
	}

    // We call this once we recieve all the data from crawler
    // this is the last possible moment, that value returned by expectedCallCount can be changed
	AllChunksProcessed = () =>
	{
		this.processingDone = true;

		this.allListeners.forEach((listener: ListenerData) => {
			console.log(`accepted event name: ${listener.eventName}`);
			this.TryFinishListener(listener);
		})
	}

	private OnAllExecutionsDone() {
		console.log("all executions in the synchronisation coordinator DONE!!!");
		this.eventEmitter.emit("allExecutionsDone");
	}

	TryFinishListener(listener: ListenerData) {
		console.log(listener.expectedCallCount());
		console.log(listener.numberOfCalls);
		if (listener.numberOfCalls == listener.expectedCallCount() && this.processingDone) {
			this.UpdateFinishedExecutions();
		}
	}

	UpdateFinishedExecutions() {

		this.finishedExecutions++;

		// if all executions were finished => announce it
		if (this.finishedExecutions == this.allListeners.length) {
			this.OnAllExecutionsDone();
		}
	}
	
	synchronisationWrapper(listenerData: ListenerData, computationToWaitFor: (...args: any[]) => void)
	{
		
        // this is the actuall "wrapper" that will be called before the real event 
		const computeToWaitFor = (...args: any[]) => {

			listenerData.numberOfCalls++; // for each call we increment correnct counter

            // we execute the real event
			computationToWaitFor(...args);

            // we check whether the number of calls match to the value set
			this.TryFinishListener(listenerData);

		}

		return computeToWaitFor;
	}

	/**
	 * 
	 * @param eventName Name of the event 
	 * @param expectedCount Exact number of calls expected, value returned has to be known
     * before allChunksProcessed event is raised
     * @param listenerCallback original event listener callback to be called
	 * before all data are recieved in dataProcessor.
	 */
	addEvent(eventEmitter: EventEmitter, eventName: string, expectedCount: () => number, listenerCallback: (...args: any[]) => void) {

		const newListenerData: ListenerData = {
			listenerId: this.lastListenerId, 
			eventName: eventName,
			expectedCallCount: expectedCount,
			numberOfCalls: 0,
			isFinished: false,
		}

		this.allListeners.push(newListenerData);
		
		eventEmitter.on(eventName, this.synchronisationWrapper(newListenerData, listenerCallback))
		
		this.lastListenerId++;
	}
}