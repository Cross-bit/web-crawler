


class LinkNode<T> {

    priorityId: number
    Data: T
    Next: LinkNode<T> | undefined

    constructor (priorityId: number, data: T) {
        this.priorityId = priorityId;
        this.Data = data;
    }
}

export default class CacheDataLinkList<T> {
    
    head: LinkNode<T> | undefined;
    tail: LinkNode<T> | undefined
    length: number = 0

    constructor() { }
    
    pushValue(priorityId: number, newData: T) {
        const newItem = new LinkNode<T>(priorityId, newData);

        if (this.head == undefined){
            this.head = newItem;
            this.tail = newItem;
        }
        else 
        {
            let prevItem: LinkNode<T> | undefined;
            let currentItem: LinkNode<T> | undefined = this.head;

            while (currentItem && currentItem.priorityId > priorityId) {
                // we scroll to the insertion point
                prevItem = currentItem;
                currentItem = currentItem.Next;
            }

            if (prevItem == undefined) { // prepending
                newItem.Next = this.head
                this.head = newItem;
            }
            else if (currentItem == undefined) { // appending
                prevItem.Next = newItem;
                this.tail = newItem;
            }
            else { // inserting
                newItem.Next = currentItem;
                prevItem.Next = newItem;
            }
            
        }

        this.length++;
    }

    readAll() : T[]
    {
        if (this.tail)
            return this.readAllGreaterThan(this.tail?.priorityId - 1);

        // else list is empty
        return [];
    }

    /**
     * Returns copy of all data, that has greater priority id than given
     * @param priorityId
     */
    readAllGreaterThan(priorityId: number) : T[]
    {
        let result = [];
        let currentItem = this.head

        while (currentItem && currentItem.priorityId > priorityId) {
            result.push({...currentItem.Data});
            currentItem = currentItem.Next;
        }

        return result;
    }

    printList()
    {
        let currentItem = this.head;
        console.log("list:")
        while(currentItem) {
            //process.stdout.write('->');
            console.log(currentItem.priorityId.toString());
            //process.stdout.write(currentItem.priorityId.toString());
            
            currentItem = currentItem.Next;
        }
    
        
    }
}